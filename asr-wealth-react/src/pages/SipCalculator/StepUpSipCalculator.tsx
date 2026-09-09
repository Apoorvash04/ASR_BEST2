import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './StepUpSipCalculator.css';

// Indian Currency Formatter helper
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Compact Indian Currency Formatter (e.g. ₹ 1.25 L, ₹ 2.50 Cr)
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

// Indian Number Formatter without currency symbol (matches exact reference table format)
export const formatNumberIndian = (amount: number): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface YearlyStepUpMilestone {
  year: number;
  yearLabel: string;
  monthlySip: number;
  investedAmount: number;
  estimatedReturns: number;
  stepUpValue: number;
  regularValue: number;
  gainRatio: string;
  wealthMultiplier: string;
  extraGain: number;
}

export interface StepUpSipCalculatorProps {
  onRecalculate?: () => void;
}

// Custom Tooltip for Interactive Area Growth Chart
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: YearlyStepUpMilestone;
    [key: string]: unknown;
  }>;
}

const CustomGrowthTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="stepup-growth-tooltip">
        <div className="growth-tooltip-header">
          <span className="growth-tooltip-year-badge">Year {data.year} Milestone</span>
          <span className="growth-tooltip-multiplier">{data.wealthMultiplier}x Growth</span>
        </div>
        <div className="growth-tooltip-items">
          <div className="growth-tooltip-row">
            <span className="tooltip-color-dot bg-gold"></span>
            <span className="tooltip-label">SIP Value With Top-Up:</span>
            <span className="tooltip-amt text-bold">{formatIndianCurrency(data.stepUpValue)}</span>
          </div>
          <div className="growth-tooltip-row">
            <span className="tooltip-color-dot bg-indigo"></span>
            <span className="tooltip-label">SIP Value Without Top-Up:</span>
            <span className="tooltip-amt">{formatIndianCurrency(data.regularValue)}</span>
          </div>
          <div className="growth-tooltip-row">
            <span className="tooltip-color-dot bg-navy"></span>
            <span className="tooltip-label">Total Invested:</span>
            <span className="tooltip-amt">{formatIndianCurrency(data.investedAmount)}</span>
          </div>
          <div className="growth-tooltip-row">
            <span className="tooltip-color-dot bg-green"></span>
            <span className="tooltip-label">Estimated Returns:</span>
            <span className="tooltip-amt text-green">+{formatIndianCurrency(data.estimatedReturns)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const StepUpSipCalculator: React.FC<StepUpSipCalculatorProps> = () => {
  // Input 1: Monthly Investment (₹) - Default: 15,000
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(15000);

  // Input 2: Increment Type - 'percentage' or 'rupee'
  const [incrementType, setIncrementType] = useState<'percentage' | 'rupee'>('percentage');

  // Input 3: Yearly Increment (Percentage default: 10%, Rupees default: 1,000)
  const [yearlyIncrementPercent, setYearlyIncrementPercent] = useState<number>(10);
  const [yearlyIncrementRupees, setYearlyIncrementRupees] = useState<number>(1000);

  // Input 4: Investment Period (Years) - Default: 10
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(10);

  // Input 5: Expected Rate of Return (% p.a.) - Default: 12%
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // Calculation View Toggle: false = Inputs Screen, true = Results Screen
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Interactive Hover Point on Growth Chart
  const [hoveredPoint, setHoveredPoint] = useState<YearlyStepUpMilestone | null>(null);

  // Tooltip hover states for sliders
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // Ranges
  const minInvestment = 500;
  const maxInvestment = 1000000;
  const stepInvestment = 500;

  const minPercentInc = 1;
  const maxPercentInc = 50;
  const stepPercentInc = 1;

  const minRupeeInc = 500;
  const maxRupeeInc = 100000;
  const stepRupeeInc = 500;

  const minYears = 1;
  const maxYears = 60;
  const stepYears = 1;

  const minReturn = 1;
  const maxReturn = 30;
  const stepReturn = 0.5;

  // Helper for range input background gradient percentage
  const getPercentage = (val: number, min: number, max: number): number => {
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const investmentPct = getPercentage(monthlyInvestment, minInvestment, maxInvestment);
  const incrementPct = incrementType === 'percentage'
    ? getPercentage(yearlyIncrementPercent, minPercentInc, maxPercentInc)
    : getPercentage(yearlyIncrementRupees, minRupeeInc, maxRupeeInc);
  const periodPct = getPercentage(investmentPeriod, minYears, maxYears);
  const returnPct = getPercentage(expectedReturn, minReturn, maxReturn);

  // Step-Up SIP Financial Calculation
  const calculationData = useMemo(() => {
    const P_initial = Math.max(0, Number(monthlyInvestment) || 0);
    const years = Math.max(1, Number(investmentPeriod) || 1);
    const annualRate = Math.max(0, Number(expectedReturn) || 0);
    // Effective monthly compounding rate matching Indian financial standards: (1 + r)^(1/12) - 1
    const monthlyRate = annualRate > 0 ? Math.pow(1 + annualRate / 100, 1 / 12) - 1 : 0;

    let currentSip = P_initial;
    let stepUpFV = 0;
    let totalInvested = 0;

    let regularFV = 0;
    let regularInvested = 0;

    const milestones: YearlyStepUpMilestone[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        // Step-Up Compounding:
        // futureValue = (futureValue + currentSip) * (1 + monthlyRate)
        stepUpFV = (stepUpFV + currentSip) * (1 + monthlyRate);
        totalInvested += currentSip;

        // Standard SIP Compounding (without top-up):
        regularFV = (regularFV + P_initial) * (1 + monthlyRate);
        regularInvested += P_initial;
      }

      const totalMaturity = Math.round(stepUpFV);
      const returns = Math.max(0, totalMaturity - totalInvested);
      const regMaturity = Math.round(regularFV);
      const extraGain = Math.max(0, totalMaturity - regMaturity);
      const mult = totalInvested > 0 ? (totalMaturity / totalInvested).toFixed(1) : '1.0';
      const ratio = totalInvested > 0 ? ((returns / totalInvested) * 100).toFixed(1) : '0';

      milestones.push({
        year: y,
        yearLabel: `Yr ${y}`,
        monthlySip: Math.round(currentSip),
        investedAmount: Math.round(totalInvested),
        estimatedReturns: returns,
        stepUpValue: totalMaturity,
        regularValue: regMaturity,
        gainRatio: ratio,
        wealthMultiplier: mult,
        extraGain,
      });

      // Annual Step-Up Increment
      if (incrementType === 'percentage') {
        currentSip = currentSip * (1 + yearlyIncrementPercent / 100);
      } else {
        currentSip = currentSip + yearlyIncrementRupees;
      }
    }

    const finalMilestone = milestones[milestones.length - 1];

    return {
      totalInvested: finalMilestone?.investedAmount || 0,
      totalStepUpValue: finalMilestone?.stepUpValue || 0,
      estimatedReturns: finalMilestone?.estimatedReturns || 0,
      regularSipValue: finalMilestone?.regularValue || 0,
      extraWealthGained: finalMilestone?.extraGain || 0,
      wealthMultiplier: finalMilestone?.wealthMultiplier || '1.0',
      gainRatio: finalMilestone?.gainRatio || '0',
      milestones,
    };
  }, [
    monthlyInvestment,
    investmentPeriod,
    expectedReturn,
    incrementType,
    yearlyIncrementPercent,
    yearlyIncrementRupees,
  ]);

  // Handle Calculate Click
  const handleCalculate = () => {
    // Validate fields
    if (monthlyInvestment < minInvestment) setMonthlyInvestment(minInvestment);
    if (investmentPeriod < minYears) setInvestmentPeriod(minYears);
    if (expectedReturn < minReturn) setExpectedReturn(minReturn);

    setHasCalculated(true);
    setHoveredPoint(null);
  };

  // Handle Recalculate Click (Hide result, show inputs, keep previously entered values)
  const handleRecalculate = () => {
    setHasCalculated(false);
    setHoveredPoint(null);
  };

  const activeDisplay = hoveredPoint || {
    year: investmentPeriod,
    yearLabel: `Yr ${investmentPeriod}`,
    monthlySip: Math.round(monthlyInvestment),
    investedAmount: calculationData.totalInvested,
    estimatedReturns: calculationData.estimatedReturns,
    stepUpValue: calculationData.totalStepUpValue,
    regularValue: calculationData.regularSipValue,
    gainRatio: calculationData.gainRatio,
    wealthMultiplier: calculationData.wealthMultiplier,
    extraGain: calculationData.extraWealthGained,
  };

  return (
    <main className="sip-card stepup-card" aria-label="SIP Step-Up Calculator">
      {!hasCalculated ? (
        /* ══════════════════════════════════════════════════════════════
           1. INPUT SCREEN (Only Inputs Shown, No Results)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-starting-view animate-fade-in">
          <div className="sip-inputs-wrapper">
            
            {/* Row 1 — Monthly Investment */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="stepup-monthly-input" className="sip-row-label">
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
                    id="stepup-monthly-slider"
                    min={minInvestment}
                    max={maxInvestment}
                    step={stepInvestment}
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
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
                    id="stepup-monthly-input"
                    min={minInvestment}
                    max={maxInvestment}
                    step={stepInvestment}
                    value={monthlyInvestment}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxInvestment) {
                        setMonthlyInvestment(val);
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

            {/* Row 2 — Increment Type (Radio Buttons) */}
            <div className="sip-input-row stepup-type-row">
              <div className="sip-label-col">
                <span className="sip-row-label">
                  Increment Type
                </span>
              </div>

              <div className="stepup-radio-group-col" role="radiogroup" aria-label="Increment Type">
                <label className={`stepup-radio-pill ${incrementType === 'percentage' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="incrementType" 
                    value="percentage" 
                    checked={incrementType === 'percentage'}
                    onChange={() => setIncrementType('percentage')}
                    className="stepup-radio-input"
                  />
                  <span className="radio-custom-indicator"></span>
                  <span className="radio-text">Increment by Percentage (%)</span>
                </label>

                <label className={`stepup-radio-pill ${incrementType === 'rupee' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="incrementType" 
                    value="rupee" 
                    checked={incrementType === 'rupee'}
                    onChange={() => setIncrementType('rupee')}
                    className="stepup-radio-input"
                  />
                  <span className="radio-custom-indicator"></span>
                  <span className="radio-text">Increment by Rupees (₹)</span>
                </label>
              </div>
            </div>

            {/* Row 3 — Yearly Increment (Slider + Input) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="stepup-yearly-input" className="sip-row-label">
                  Yearly Increment {incrementType === 'percentage' ? '(%)' : '(₹)'}
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('increment')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'increment' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${incrementPct}% + ${(0.5 - incrementPct / 100) * 18}px)` }}
                  >
                    {incrementType === 'percentage'
                      ? `${yearlyIncrementPercent}% p.a.`
                      : formatIndianCurrency(yearlyIncrementRupees)}
                  </div>

                  {incrementType === 'percentage' ? (
                    <input 
                      type="range"
                      id="stepup-yearly-slider"
                      min={minPercentInc}
                      max={maxPercentInc}
                      step={stepPercentInc}
                      value={yearlyIncrementPercent}
                      onChange={(e) => setYearlyIncrementPercent(Number(e.target.value))}
                      className="sip-range-slider"
                      style={{
                        background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${incrementPct}%, #E2E8F0 ${incrementPct}%, #E2E8F0 100%)`
                      }}
                      aria-label="Yearly Percentage Increment Slider"
                    />
                  ) : (
                    <input 
                      type="range"
                      id="stepup-yearly-slider"
                      min={minRupeeInc}
                      max={maxRupeeInc}
                      step={stepRupeeInc}
                      value={yearlyIncrementRupees}
                      onChange={(e) => setYearlyIncrementRupees(Number(e.target.value))}
                      className="sip-range-slider"
                      style={{
                        background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${incrementPct}%, #E2E8F0 ${incrementPct}%, #E2E8F0 100%)`
                      }}
                      aria-label="Yearly Rupees Increment Slider"
                    />
                  )}

                  <div className="sip-slider-markers">
                    {incrementType === 'percentage' ? (
                      <>
                        <span>1%</span>
                        <span>25%</span>
                        <span>50%</span>
                      </>
                    ) : (
                      <>
                        <span>₹500</span>
                        <span>₹50,000</span>
                        <span>₹1,00,000</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  {incrementType === 'rupee' && <span className="sip-input-prefix">₹</span>}
                  <input 
                    type="number"
                    id="stepup-yearly-input"
                    min={incrementType === 'percentage' ? minPercentInc : minRupeeInc}
                    max={incrementType === 'percentage' ? maxPercentInc : maxRupeeInc}
                    step={incrementType === 'percentage' ? stepPercentInc : stepRupeeInc}
                    value={incrementType === 'percentage' ? yearlyIncrementPercent : yearlyIncrementRupees}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (incrementType === 'percentage') {
                        if (val <= maxPercentInc) setYearlyIncrementPercent(val);
                      } else {
                        if (val <= maxRupeeInc) setYearlyIncrementRupees(val);
                      }
                    }}
                    onBlur={() => {
                      if (incrementType === 'percentage') {
                        if (yearlyIncrementPercent < minPercentInc) setYearlyIncrementPercent(minPercentInc);
                        if (yearlyIncrementPercent > maxPercentInc) setYearlyIncrementPercent(maxPercentInc);
                      } else {
                        if (yearlyIncrementRupees < minRupeeInc) setYearlyIncrementRupees(minRupeeInc);
                        if (yearlyIncrementRupees > maxRupeeInc) setYearlyIncrementRupees(maxRupeeInc);
                      }
                    }}
                    className={`sip-number-input ${incrementType === 'percentage' ? 'sip-number-input-unit' : ''}`}
                  />
                  {incrementType === 'percentage' && <span className="sip-input-suffix">%</span>}
                </div>
              </div>
            </div>

            {/* Row 4 — Investment Period (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="stepup-period-input" className="sip-row-label">
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
                    id="stepup-period-slider"
                    min={minYears}
                    max={maxYears}
                    step={stepYears}
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${periodPct}%, #E2E8F0 ${periodPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Investment Period Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>1 Yr</span>
                    <span>30 Yrs</span>
                    <span>60 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="stepup-period-input"
                    min={minYears}
                    max={maxYears}
                    step={stepYears}
                    value={investmentPeriod}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxYears) {
                        setInvestmentPeriod(val);
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

            {/* Row 5 — Expected Rate of Return (% p.a.) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="stepup-return-input" className="sip-row-label">
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
                    id="stepup-return-slider"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${returnPct}%, #E2E8F0 ${returnPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Expected Rate of Return Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>1%</span>
                    <span>15%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="stepup-return-input"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={expectedReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxReturn) {
                        setExpectedReturn(val);
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

          </div>

          {/* Calculate Button */}
          <div className="sip-calculate-action">
            <button 
              type="button" 
              onClick={handleCalculate}
              className="sip-calculate-btn"
              aria-label="Calculate Step-Up SIP Projection"
            >
              Calculate
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           2. RESULT SCREEN (Inputs Hidden, Only Results Displayed)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-results-screen animate-fade-in">
          
          {/* Top Bar: Recalculate Button & Parameter Summary */}
          <div className="stepup-results-header-bar">
            <button 
              type="button"
              onClick={handleRecalculate}
              className="sip-back-btn stepup-recalc-btn"
              aria-label="Recalculate or Edit Inputs"
            >
              ← Recalculate
            </button>

            {/* Input Parameter Chips */}
            <div className="stepup-param-chips">
              <span className="param-chip">
                <strong>SIP:</strong> {formatIndianCurrency(monthlyInvestment)}/mo
              </span>
              <span className="param-chip">
                <strong>Step-Up:</strong> {incrementType === 'percentage' ? `${yearlyIncrementPercent}%/yr` : `${formatIndianCurrency(yearlyIncrementRupees)}/yr`}
              </span>
              <span className="param-chip">
                <strong>Period:</strong> {investmentPeriod} Yrs
              </span>
              <span className="param-chip">
                <strong>Return:</strong> {expectedReturn}% p.a.
              </span>
            </div>
          </div>

          {/* ── Growth Chart Section ── */}
          <section className="sip-graph-view-top" aria-label="Step-Up Growth Graph">
            <div className="sip-growth-header-row">
              <div className="sip-growth-titles">
                <h3 className="sip-growth-heading">Wealth Growth: Step-Up vs. Regular SIP</h3>
                <p className="sip-growth-sub">
                  Move your cursor across the graph to inspect year-by-year compounding comparison.
                </p>
              </div>

              {/* Chart Legend */}
              <div className="sip-growth-chart-legend">
                <div className="growth-legend-item">
                  <span className="growth-legend-swatch swatch-yellow"></span>
                  <span className="growth-legend-text">SIP With Top-Up</span>
                </div>
                <div className="growth-legend-item">
                  <span className="growth-legend-swatch swatch-indigo"></span>
                  <span className="growth-legend-text">SIP Without Top-Up</span>
                </div>
                <div className="growth-legend-item">
                  <span className="growth-legend-swatch swatch-navy"></span>
                  <span className="growth-legend-text">Total Invested</span>
                </div>
              </div>
            </div>

            {/* Area Chart Container */}
            <div className="sip-area-chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={calculationData.milestones}
                  margin={{ top: 20, right: 20, left: 10, bottom: 8 }}
                  onMouseMove={(state) => {
                    if (state && state.activePayload && state.activePayload.length) {
                      const pt = state.activePayload[0].payload as YearlyStepUpMilestone;
                      setHoveredPoint(pt);
                    }
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  <defs>
                    <linearGradient id="stepUpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4B400" stopOpacity={0.48} />
                      <stop offset="95%" stopColor="#F4B400" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="regularSipGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4341CD" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4341CD" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E293B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1E293B" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e9eef5" vertical={false} />

                  <XAxis 
                    dataKey="year" 
                    tickFormatter={(yr) => `Yr ${yr}`}
                    stroke="#94a3b8" 
                    tick={{ fontSize: 13, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />

                  <YAxis 
                    tickFormatter={(val) => formatCompactCurrency(val)} 
                    stroke="#94a3b8" 
                    tick={{ fontSize: 13, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    width={78}
                  />

                  <Tooltip 
                    content={<CustomGrowthTooltip />} 
                    cursor={{ stroke: '#F4B400', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  />

                  {/* Step-Up Value Area (Topmost) */}
                  <Area
                    type="monotone"
                    dataKey="stepUpValue"
                    name="SIP Value With Top-Up"
                    stroke="#F4B400"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#stepUpGradient)"
                    activeDot={{ r: 6.5, fill: '#F4B400', stroke: '#ffffff', strokeWidth: 2.5 }}
                  />

                  {/* Regular SIP Value Area */}
                  <Area
                    type="monotone"
                    dataKey="regularValue"
                    name="SIP Value Without Top-Up"
                    stroke="#4341CD"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#regularSipGradient)"
                    activeDot={{ r: 5.5, fill: '#4341CD', stroke: '#ffffff', strokeWidth: 2 }}
                  />

                  {/* Total Invested Area */}
                  <Area
                    type="monotone"
                    dataKey="investedAmount"
                    name="Invested Amount"
                    stroke="#1E293B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#investedGradient)"
                    activeDot={{ r: 5, fill: '#1E293B', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ── Exact Entities Result Table Matching User Reference Image ── */}
          <section className="sip-results-bottom-section" aria-label="Step-Up Output Summary">
            <div className="stepup-table-container">
              <table className="stepup-result-table">
                <tbody>
                  <tr>
                    <td className="stepup-cell-label">Monthly Investment (Rs.)</td>
                    <td className="stepup-cell-value">{formatNumberIndian(monthlyInvestment)}</td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">Investment Period (Years)</td>
                    <td className="stepup-cell-value">{activeDisplay.year}</td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">
                      {incrementType === 'percentage' ? 'Step-Up Investment(%)' : 'Step-Up Investment(Rs)'}
                    </td>
                    <td className="stepup-cell-value">
                      {incrementType === 'percentage' ? yearlyIncrementPercent : formatNumberIndian(yearlyIncrementRupees)}
                    </td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">Rate of Return (%)</td>
                    <td className="stepup-cell-value">{expectedReturn}</td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">Total Invested Amount (Rs)</td>
                    <td className="stepup-cell-value">{formatNumberIndian(activeDisplay.investedAmount)}</td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">SIP Value without Top-Up (Rs)</td>
                    <td className="stepup-cell-value">{formatNumberIndian(activeDisplay.regularValue)}</td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">SIP Value with Top-Up</td>
                    <td className="stepup-cell-value">{formatNumberIndian(activeDisplay.stepUpValue)}</td>
                  </tr>
                  <tr>
                    <td className="stepup-cell-label">Estimated Return</td>
                    <td className="stepup-cell-value">{formatNumberIndian(activeDisplay.estimatedReturns)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </div>
      )}
    </main>
  );
};

export default StepUpSipCalculator;
