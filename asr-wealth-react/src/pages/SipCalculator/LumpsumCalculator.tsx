import React, { useState, useMemo } from 'react';
import './LumpsumCalculator.css';

// Indian Currency Formatter helper with ₹ symbol (e.g. ₹6,21,170)
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface LumpsumCalculatorProps {
  onRecalculate?: () => void;
}

export const LumpsumCalculator: React.FC<LumpsumCalculatorProps> = ({ onRecalculate }) => {
  // Input 1: One Time Investment Amount (₹) - Default: 2,00,000 (reference test case)
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(200000);

  // Input 2: Monthly Investment (₹) - Default: 2,000 (reference test case)
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(2000);

  // Input 3: Expected rate of return (% p.a.) - Default: 12% (reference test case)
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // Input 4: Period of Investment (years) - Default: 10 Years (reference test case)
  const [investmentYears, setInvestmentYears] = useState<number>(10);

  // Screen View State: false = Input Screen only, true = Result Screen only
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Tooltip for Sliders
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // Input Slider Ranges
  const minLumpsum = 0;
  const maxLumpsum = 100000000; // ₹10 Crore
  const stepLumpsum = 10000;

  const minMonthly = 0;
  const maxMonthly = 1000000; // ₹10 Lakh
  const stepMonthly = 500;

  const minReturn = 0;
  const maxReturn = 30;
  const stepReturn = 0.1;

  const minYears = 1;
  const maxYears = 60;
  const stepYears = 1;

  // Percentage helper for slider track background fill
  const getPercentage = (val: number, min: number, max: number): number => {
    if (max <= min) return 0;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const lumpsumPct = getPercentage(oneTimeInvestment, minLumpsum, maxLumpsum);
  const monthlyPct = getPercentage(monthlyInvestment, minMonthly, maxMonthly);
  const returnPct = getPercentage(expectedReturn, minReturn, maxReturn);
  const yearsPct = getPercentage(investmentYears, minYears, maxYears);

  // ══════════════════════════════════════════════════════════════
  // CALCULATION LOGIC
  // 1. LUMPSUM FUTURE VALUE: Annual compounding P * (1 + R / 100)^T
  // 2. TOTAL MONTHLY AMOUNT INVESTED: PMT * T * 12
  // 3. MONTHLY SIP FUTURE VALUE: Annuity-due (beginning of month)
  //    PMT * (( (1 + r)^n - 1 ) / r) * (1 + r)
  // ══════════════════════════════════════════════════════════════
  const calculations = useMemo(() => {
    const P = Math.max(0, Number(oneTimeInvestment) || 0);
    const PMT = Math.max(0, Number(monthlyInvestment) || 0);
    const R = Math.max(0, Number(expectedReturn) || 0);
    const T = Math.max(0, Number(investmentYears) || 0);

    // 1. LUMPSUM FUTURE VALUE (Annual Compounding)
    const fvLumpsum = P * Math.pow(1 + R / 100, T);

    // 2. TOTAL MONTHLY AMOUNT INVESTED
    const totalMonthlyInvestment = PMT * T * 12;

    // 3. MONTHLY SIP FUTURE VALUE (Annuity-due beginning-of-month contribution)
    const r = R / (12 * 100);
    const n = T * 12;

    let fvMonthly = 0;
    if (n > 0) {
      if (r > 0) {
        fvMonthly = PMT * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      } else {
        fvMonthly = PMT * n;
      }
    }

    return {
      fvLumpsum: Math.round(fvLumpsum),
      totalMonthlyInvestment: Math.round(totalMonthlyInvestment),
      fvMonthly: Math.round(fvMonthly),
    };
  }, [oneTimeInvestment, monthlyInvestment, expectedReturn, investmentYears]);

  // Handle Calculate Click
  const handleCalculate = () => {
    if (oneTimeInvestment < 0) {
      setErrorMessage('One Time Investment Amount cannot be negative.');
      return;
    }
    if (monthlyInvestment < 0) {
      setErrorMessage('Monthly Investment cannot be negative.');
      return;
    }
    if (oneTimeInvestment <= 0 && monthlyInvestment <= 0) {
      setErrorMessage('At least one investment amount (One Time or Monthly) must be greater than 0.');
      return;
    }
    if (investmentYears <= 0) {
      setErrorMessage('Period of Investment must be greater than 0 years.');
      return;
    }
    if (expectedReturn < 0) {
      setErrorMessage('Expected rate of return cannot be negative.');
      return;
    }

    setErrorMessage(null);
    setHasCalculated(true);
  };

  // Handle Re-Calculate: Return to input screen, preserve inputs, hide result until Calculate clicked again
  const handleRecalculate = () => {
    setHasCalculated(false);
    setErrorMessage(null);
    if (onRecalculate) {
      onRecalculate();
    }
  };

  return (
    <main className="sip-card lumpsum-card" aria-label="Lumpsum Calculator">
      {!hasCalculated ? (
        /* ══════════════════════════════════════════════════════════════
           STATE 1: INPUT SCREEN ONLY (Results Hidden)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-starting-view">
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="lumpsum-error-banner" role="alert">
              <span className="lumpsum-error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="sip-inputs-wrapper">
            {/* Input 1: One Time Investment Amount (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="lumpsum-onetime-input" className="sip-row-label">
                  One Time Investment Amount (₹)
                </label>
              </div>

              <div className="sip-slider-col">
                <div
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('onetime')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div
                    className={`sip-slider-tooltip ${activeSlider === 'onetime' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${lumpsumPct}% + ${(0.5 - lumpsumPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(oneTimeInvestment)}
                  </div>

                  <input
                    type="range"
                    id="lumpsum-onetime-slider"
                    min={minLumpsum}
                    max={maxLumpsum}
                    step={stepLumpsum}
                    value={oneTimeInvestment}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setOneTimeInvestment(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${lumpsumPct}%, #E2E8F0 ${lumpsumPct}%, #E2E8F0 100%)`,
                    }}
                    aria-label="One Time Investment Amount Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹0</span>
                    <span>₹5,00,00,000</span>
                    <span>₹10,00,00,000</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <span className="sip-input-prefix">₹</span>
                  <input
                    type="number"
                    id="lumpsum-onetime-input"
                    min={minLumpsum}
                    max={maxLumpsum}
                    step={stepLumpsum}
                    value={oneTimeInvestment}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxLumpsum) {
                        setOneTimeInvestment(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (oneTimeInvestment < minLumpsum) setOneTimeInvestment(minLumpsum);
                      if (oneTimeInvestment > maxLumpsum) setOneTimeInvestment(maxLumpsum);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 2: Monthly Investment (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="lumpsum-monthly-input" className="sip-row-label">
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
                    style={{ left: `calc(${monthlyPct}% + ${(0.5 - monthlyPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(monthlyInvestment)}
                  </div>

                  <input
                    type="range"
                    id="lumpsum-monthly-slider"
                    min={minMonthly}
                    max={maxMonthly}
                    step={stepMonthly}
                    value={monthlyInvestment}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMonthlyInvestment(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${monthlyPct}%, #E2E8F0 ${monthlyPct}%, #E2E8F0 100%)`,
                    }}
                    aria-label="Monthly Investment Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹0</span>
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
                    id="lumpsum-monthly-input"
                    min={minMonthly}
                    max={maxMonthly}
                    step={stepMonthly}
                    value={monthlyInvestment}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxMonthly) {
                        setMonthlyInvestment(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (monthlyInvestment < minMonthly) setMonthlyInvestment(minMonthly);
                      if (monthlyInvestment > maxMonthly) setMonthlyInvestment(maxMonthly);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 3: Expected rate of return (% p.a.) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="lumpsum-return-input" className="sip-row-label">
                  Expected rate of return (% p.a.)
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
                    id="lumpsum-return-slider"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={expectedReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setExpectedReturn(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${returnPct}%, #E2E8F0 ${returnPct}%, #E2E8F0 100%)`,
                    }}
                    aria-label="Expected rate of return Slider"
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
                    id="lumpsum-return-input"
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

            {/* Input 4: Period of Investment (years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="lumpsum-years-input" className="sip-row-label">
                  Period of Investment (years)
                </label>
              </div>

              <div className="sip-slider-col">
                <div
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('years')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div
                    className={`sip-slider-tooltip ${activeSlider === 'years' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${yearsPct}% + ${(0.5 - yearsPct / 100) * 18}px)` }}
                  >
                    {investmentYears} {investmentYears === 1 ? 'Year' : 'Years'}
                  </div>

                  <input
                    type="range"
                    id="lumpsum-years-slider"
                    min={minYears}
                    max={maxYears}
                    step={stepYears}
                    value={investmentYears}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInvestmentYears(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${yearsPct}%, #E2E8F0 ${yearsPct}%, #E2E8F0 100%)`,
                    }}
                    aria-label="Period of Investment in Years Slider"
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
                    id="lumpsum-years-input"
                    min={minYears}
                    max={maxYears}
                    step={stepYears}
                    value={investmentYears}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxYears) {
                        setInvestmentYears(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (investmentYears < minYears) setInvestmentYears(minYears);
                      if (investmentYears > maxYears) setInvestmentYears(maxYears);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">Yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Action Button */}
          <div className="sip-calculate-action">
            <button
              type="button"
              onClick={handleCalculate}
              className="sip-calculate-btn"
              aria-label="Calculate Lumpsum"
            >
              Calculate
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           STATE 2: RESULT SCREEN (Input Screen Hidden Completely)
           Display exactly the three result lines
           ══════════════════════════════════════════════════════════════ */
        <div className="lumpsum-result-screen">
          <div className="lumpsum-result-box">
            <h3 className="lumpsum-result-heading">
              <span className="lumpsum-result-heading-dot"></span>
              Result
            </h3>

            <div className="lumpsum-result-list">
              <div className="lumpsum-result-row">
                <span className="lumpsum-result-label">Lumpsum investment grows to (Rs.)</span>
                <span className="lumpsum-result-value">
                  {formatIndianCurrency(calculations.fvLumpsum)}
                </span>
              </div>

              <div className="lumpsum-result-row">
                <span className="lumpsum-result-label">Amount invested by you monthly (Rs.)</span>
                <span className="lumpsum-result-value">
                  {formatIndianCurrency(calculations.totalMonthlyInvestment)}
                </span>
              </div>

              <div className="lumpsum-result-row">
                <span className="lumpsum-result-label">Monthly Investment Grows to (Rs.)</span>
                <span className="lumpsum-result-value">
                  {formatIndianCurrency(calculations.fvMonthly)}
                </span>
              </div>
            </div>
          </div>

          {/* Re-Calculate Action Button */}
          <div className="lumpsum-recalc-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="lumpsum-recalc-btn"
              aria-label="Re-Calculate with updated parameters"
            >
              Re-Calculate
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default LumpsumCalculator;
