import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';
import './SipDelayCalculator.css';

// Indian Currency Formatter helper
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Compact Indian Currency Formatter (e.g. ₹ 4.12 L, ₹ 1.25 Cr)
export const formatCompactCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`;
  }
  return formatIndianCurrency(amount);
};

// Number Formatter without currency symbol
export const formatNumberIndian = (amount: number): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface SipDelayCalculatorProps {
  onRecalculate?: () => void;
}

// Custom Tooltip for Cost of Delay Bar Chart
const CustomDelayBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="delay-chart-tooltip">
        <div className="delay-tooltip-title">{data.name}</div>
        <div className="delay-tooltip-val">{formatIndianCurrency(data.amount)}</div>
      </div>
    );
  }
  return null;
};

export const SipDelayCalculator: React.FC<SipDelayCalculatorProps> = () => {
  // Input 1: Monthly Investment (₹) - Default: 5,000
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);

  // Input 2: Investment Period (Years) - Default: 5
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(5);

  // Input 3: Expected Rate of Return (% p.a.) - Default: 12%
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // Input 4: Delay in Starting SIP (Months) - Default: 6
  const [delayMonths, setDelayMonths] = useState<number>(6);

  // Screen View State: false = Input Screen, true = Result Screen
  const [showResult, setShowResult] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tooltip hover states for sliders
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // Slider Input Ranges
  const minInvestment = 500;
  const maxInvestment = 1000000;
  const stepInvestment = 500;

  const minYears = 1;
  const maxYears = 50;
  const stepYears = 1;

  const minReturn = 0; // Mathematical zero-return allowed
  const maxReturn = 30;
  const stepReturn = 0.5;

  const minDelay = 1;
  const maxDelay = Math.max(1, investmentPeriod * 12 - 1);
  const stepDelay = 1;

  // Slider track percentage calculation helper
  const getPercentage = (val: number, min: number, max: number): number => {
    if (max <= min) return 0;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const investmentPct = getPercentage(monthlyInvestment, minInvestment, maxInvestment);
  const periodPct = getPercentage(investmentPeriod, minYears, maxYears);
  const returnPct = getPercentage(expectedReturn, minReturn, maxReturn);
  const delayPct = getPercentage(delayMonths, minDelay, maxDelay);

  // ══════════════════════════════════════════════════════════════
  // CALCULATION LOGIC: Monthly compounding, beginning of month
  // ══════════════════════════════════════════════════════════════
  const calculationData = useMemo(() => {
    const P = Math.max(0, Number(monthlyInvestment) || 0);
    const Y = Math.max(0, Number(investmentPeriod) || 0);
    const R = Math.max(0, Number(expectedReturn) || 0);
    const D = Math.max(0, Number(delayMonths) || 0);

    const n = Y * 12;
    const r = R / 12 / 100;
    const n_delayed = Math.max(0, n - D);

    let FV_today = 0;
    let FV_delayed = 0;

    // Zero-rate handling to avoid division by zero
    if (R === 0 || r === 0) {
      FV_today = P * n;
      FV_delayed = n_delayed > 0 ? P * n_delayed : 0;
    } else {
      // SIP Started Today (Annuity due, beginning of each month):
      // FV_today = P * (((1 + r)^n - 1) / r) * (1 + r)
      FV_today = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

      // Delayed SIP:
      // FV_delayed = P * (((1 + r)^n_delayed - 1) / r) * (1 + r)
      if (n_delayed <= 0) {
        FV_delayed = 0;
      } else {
        FV_delayed = P * ((Math.pow(1 + r, n_delayed) - 1) / r) * (1 + r);
      }
    }

    // Notional loss = FV_today - FV_delayed
    const notionalLoss = Math.max(0, FV_today - FV_delayed);

    return {
      FV_today: Math.round(FV_today),
      FV_delayed: Math.round(FV_delayed),
      notionalLoss: Math.round(notionalLoss),
      totalMonths: n,
      delayMonths: D,
      remainingMonths: n_delayed,
    };
  }, [monthlyInvestment, investmentPeriod, expectedReturn, delayMonths]);

  // Handle Calculate button click with comprehensive validations
  const handleCalculate = () => {
    if (monthlyInvestment <= 0) {
      setErrorMessage('Monthly investment must be greater than ₹0.');
      return;
    }
    if (investmentPeriod <= 0) {
      setErrorMessage('Investment period must be at least 1 year.');
      return;
    }
    if (expectedReturn < 0) {
      setErrorMessage('Expected rate of return cannot be negative.');
      return;
    }
    if (delayMonths < 0) {
      setErrorMessage('Delay in starting SIP cannot be negative.');
      return;
    }
    const totalMonths = investmentPeriod * 12;
    if (delayMonths >= totalMonths) {
      setErrorMessage(
        `Delay in starting SIP (${delayMonths} months) must be less than the total investment period (${totalMonths} months).`
      );
      return;
    }

    // Input is valid
    setErrorMessage(null);
    setShowResult(true);
  };

  // Handle Recalculate button click: preserves all values and returns to input screen
  const handleRecalculate = () => {
    setShowResult(false);
    setErrorMessage(null);
  };

  // Prepare Bar Chart Data
  const barChartData = [
    {
      name: 'Start Today',
      amount: calculationData.FV_today,
      formatted: formatIndianCurrency(calculationData.FV_today),
      fill: '#F4B400',
    },
    {
      name: 'Delayed Start',
      amount: calculationData.FV_delayed,
      formatted: formatIndianCurrency(calculationData.FV_delayed),
      fill: '#4341CD',
    },
    {
      name: 'Loss',
      amount: calculationData.notionalLoss,
      formatted: formatIndianCurrency(calculationData.notionalLoss),
      fill: '#EF4444',
    },
  ];

  return (
    <main className="sip-card delay-card" aria-label="SIP Delay Calculator">
      {!showResult ? (
        /* ══════════════════════════════════════════════════════════════
           STATE 1: INPUT SCREEN (Inputs Only, Results Hidden)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-starting-view delay-fade-in">
          
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="delay-error-banner" role="alert">
              <span className="delay-error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="sip-inputs-wrapper">
            
            {/* Input 1: Monthly Investment (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="delay-monthly-input" className="sip-row-label">
                  Monthly Investment (₹)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('monthly')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'monthly' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${investmentPct}% + ${(0.5 - investmentPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(monthlyInvestment)}
                  </div>

                  <input 
                    type="range"
                    id="delay-monthly-slider"
                    min={minInvestment}
                    max={maxInvestment}
                    step={stepInvestment}
                    value={monthlyInvestment}
                    onChange={(e) => {
                      setMonthlyInvestment(Number(e.target.value));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${investmentPct}%, #E2E8F0 ${investmentPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Monthly Investment Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹500</span>
                    <span>₹5,00,000</span>
                    <span>₹10,00,000</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <span className="sip-input-prefix">₹</span>
                  <input 
                    type="number"
                    id="delay-monthly-input"
                    min={minInvestment}
                    max={maxInvestment}
                    step={stepInvestment}
                    value={monthlyInvestment}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxInvestment) {
                        setMonthlyInvestment(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (monthlyInvestment < minInvestment) setMonthlyInvestment(minInvestment);
                      if (monthlyInvestment > maxInvestment) setMonthlyInvestment(maxInvestment);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 2: Investment Period (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="delay-period-input" className="sip-row-label">
                  Investment Period (Years)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('period')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'period' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${periodPct}% + ${(0.5 - periodPct / 100) * 18}px)` }}
                  >
                    {investmentPeriod} Yrs
                  </div>

                  <input 
                    type="range"
                    id="delay-period-slider"
                    min={minYears}
                    max={maxYears}
                    step={stepYears}
                    value={investmentPeriod}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInvestmentPeriod(val);
                      if (errorMessage) setErrorMessage(null);
                      // Clamp delay if it exceeds new period
                      const newMaxDelay = Math.max(1, val * 12 - 1);
                      if (delayMonths > newMaxDelay) {
                        setDelayMonths(newMaxDelay);
                      }
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${periodPct}%, #E2E8F0 ${periodPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Investment Period Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>1 Yr</span>
                    <span>25 Yrs</span>
                    <span>50 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="delay-period-input"
                    min={minYears}
                    max={maxYears}
                    step={stepYears}
                    value={investmentPeriod}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxYears) {
                        setInvestmentPeriod(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (investmentPeriod < minYears) setInvestmentPeriod(minYears);
                      if (investmentPeriod > maxYears) setInvestmentPeriod(maxYears);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">Yr</span>
                </div>
              </div>
            </div>

            {/* Input 3: Expected Rate of Return (% p.a.) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="delay-return-input" className="sip-row-label">
                  Expected Rate of Return (% p.a.)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('return')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'return' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${returnPct}% + ${(0.5 - returnPct / 100) * 18}px)` }}
                  >
                    {expectedReturn}% p.a.
                  </div>

                  <input 
                    type="range"
                    id="delay-return-slider"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={expectedReturn}
                    onChange={(e) => {
                      setExpectedReturn(Number(e.target.value));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${returnPct}%, #E2E8F0 ${returnPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Expected Rate of Return Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>0%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="delay-return-input"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={expectedReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxReturn) {
                        setExpectedReturn(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (expectedReturn < minReturn) setExpectedReturn(minReturn);
                      if (expectedReturn > maxReturn) setExpectedReturn(maxReturn);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Input 4: Delay in Starting SIP (Months) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="delay-months-input" className="sip-row-label">
                  Delay in Starting SIP (Months)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('delay')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'delay' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${delayPct}% + ${(0.5 - delayPct / 100) * 18}px)` }}
                  >
                    {delayMonths} {delayMonths === 1 ? 'Month' : 'Months'}
                  </div>

                  <input 
                    type="range"
                    id="delay-months-slider"
                    min={minDelay}
                    max={maxDelay}
                    step={stepDelay}
                    value={delayMonths}
                    onChange={(e) => {
                      setDelayMonths(Number(e.target.value));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${delayPct}%, #E2E8F0 ${delayPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Delay in Starting SIP Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>1 Mo</span>
                    <span>{Math.round(maxDelay / 2)} Mos</span>
                    <span>{maxDelay} Mos</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="delay-months-input"
                    min={minDelay}
                    max={maxDelay}
                    step={stepDelay}
                    value={delayMonths}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDelayMonths(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    onBlur={() => {
                      if (delayMonths < minDelay) setDelayMonths(minDelay);
                      if (delayMonths > maxDelay) setDelayMonths(maxDelay);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">Mo</span>
                </div>
              </div>
            </div>

          </div>

          {/* Calculate Button */}
          <div className="sip-calculate-action">
            <button 
              type="button" 
              onClick={handleCalculate}
              className="sip-calculate-btn"
              aria-label="Calculate Cost of Delay"
            >
              Calculate
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           STATE 2: RESULT SCREEN (Input Form Disappears, Results Shown)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-results-screen delay-fade-in">
          
          {/* Top Bar: Recalculate Button & Parameter Summary Chips */}
          <div className="delay-results-header-bar">
            <button 
              type="button"
              onClick={handleRecalculate}
              className="delay-recalc-back-btn"
              aria-label="Recalculate or Edit Inputs"
            >
              ← Recalculate
            </button>

            <div className="delay-param-chips">
              <span className="delay-chip">
                <strong>SIP:</strong> {formatIndianCurrency(monthlyInvestment)}/mo
              </span>
              <span className="delay-chip">
                <strong>Period:</strong> {investmentPeriod} Yrs
              </span>
              <span className="delay-chip">
                <strong>Return:</strong> {expectedReturn}% p.a.
              </span>
              <span className="delay-chip">
                <strong>Delay:</strong> {delayMonths} {delayMonths === 1 ? 'Month' : 'Months'}
              </span>
            </div>
          </div>

          {/* ── Cost of Delay Graph ── */}
          <section className="delay-chart-section" aria-label="SIP Cost of Delay Chart">
            <div className="delay-chart-header">
              <h3 className="delay-chart-title">SIP - Cost of Delay</h3>

              <div className="delay-chart-legend">
                <div className="delay-legend-item">
                  <span className="delay-legend-dot dot-gold"></span>
                  <span>Start Today</span>
                </div>
                <div className="delay-legend-item">
                  <span className="delay-legend-dot dot-indigo"></span>
                  <span>Delayed Start</span>
                </div>
                <div className="delay-legend-item">
                  <span className="delay-legend-dot dot-loss"></span>
                  <span>Loss</span>
                </div>
              </div>
            </div>

            <div className="delay-barchart-wrapper">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={barChartData}
                  margin={{ top: 28, right: 24, left: 16, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#334155', fontSize: 13.5, fontWeight: 600 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(val) => formatCompactCurrency(val)}
                    tick={{ fill: '#64748B', fontSize: 12.5 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                    width={76}
                  />
                  <Tooltip
                    content={<CustomDelayBarTooltip />}
                    cursor={{ fill: 'rgba(241, 245, 249, 0.45)' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={64}>
                    <LabelList
                      dataKey="formatted"
                      position="top"
                      style={{ fill: '#1E293B', fontSize: '12.5px', fontWeight: 600 }}
                    />
                    {barChartData.map((entry, index) => (
                      <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ── Result Section (No Separate Cards, Pure Stylized Statement) ── */}
          <section className="delay-statement-section" aria-label="Cost of Delay Result Summary">
            <p className="delay-statement-text">
              Delay of <span className="delay-val-highlight">{delayMonths} {delayMonths === 1 ? 'month' : 'months'}</span> in starting your SIP will cause a notional loss of{' '}
              <span className="delay-loss-highlight">{formatIndianCurrency(calculationData.notionalLoss)}</span> in the final value of your investment.
            </p>
            <p className="delay-compounding-note">
              Note: Based on monthly compounding
            </p>
          </section>

          {/* ── Recalculate Button Action Below Result ── */}
          <div className="delay-recalculate-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="sip-calculate-btn delay-recalculate-btn"
              aria-label="Recalculate with edited parameters"
            >
              Recalculate
            </button>
          </div>

        </div>
      )}
    </main>
  );
};

export default SipDelayCalculator;
