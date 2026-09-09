import React, { useState, useMemo } from 'react';
import './GoalPlanner.css';

// Indian Number Formatter helper (e.g. 2,44,889)
export const formatNumberIndian = (amount: number): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

// Indian Currency Formatter helper with ₹ symbol (e.g. ₹2,00,00,000)
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface GoalPlannerProps {
  onRecalculate?: () => void;
}

export const GoalPlanner: React.FC<GoalPlannerProps> = ({ onRecalculate }) => {
  // Input 1: Future amount required (₹) - Default: 20,000,000 (reference test case)
  const [futureAmount, setFutureAmount] = useState<number>(20000000);

  // Input 2: Investment horizon (Years) - Default: 5 Years (reference test case)
  const [investmentYears, setInvestmentYears] = useState<number>(5);

  // Input 3: Annual return you expect to earn on investment (%) - Default: 12% (reference test case)
  const [annualReturn, setAnnualReturn] = useState<number>(12);

  // Screen View State: false = Input Screen only, true = Result Screen only
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Tooltip for Sliders
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // Input Slider Ranges
  const minFutureAmount = 10000;
  const maxFutureAmount = 100000000; // ₹10 Crore
  const stepFutureAmount = 10000;

  const minYears = 1;
  const maxYears = 60;
  const stepYears = 1;

  const minReturn = 0; // 0% return handled safely
  const maxReturn = 30;
  const stepReturn = 0.1;

  // Percentage helper for slider track background fill
  const getPercentage = (val: number, min: number, max: number): number => {
    if (max <= min) return 0;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const amountPct = getPercentage(futureAmount, minFutureAmount, maxFutureAmount);
  const yearsPct = getPercentage(investmentYears, minYears, maxYears);
  const returnPct = getPercentage(annualReturn, minReturn, maxReturn);

  // ══════════════════════════════════════════════════════════════
  // CALCULATION LOGIC: Standard Ordinary Monthly SIP Formula
  // Investment assumed at the END of every month
  // FV * r / ((1 + r)^n - 1) for R > 0; FV / n for R === 0
  // Do NOT multiply by (1 + r). Do NOT round intermediate values.
  // ══════════════════════════════════════════════════════════════
  const calculatedInvestment = useMemo(() => {
    const FV = Math.max(0, Number(futureAmount) || 0);
    const R = Math.max(0, Number(annualReturn) || 0);
    const T = Math.max(0, Number(investmentYears) || 0);

    const n = T * 12;
    if (n <= 0 || FV <= 0) return 0;

    const r = R / (12 * 100);

    let res = 0;
    if (R > 0) {
      res = (FV * r) / (Math.pow(1 + r, n) - 1);
    } else {
      res = FV / n;
    }

    return res;
  }, [futureAmount, investmentYears, annualReturn]);

  // Handle Calculate Click
  const handleCalculate = () => {
    if (futureAmount <= 0) {
      setErrorMessage('Future amount required must be greater than 0.');
      return;
    }
    if (investmentYears <= 0) {
      setErrorMessage('Investment horizon must be greater than 0 years.');
      return;
    }
    if (annualReturn < 0) {
      setErrorMessage('Annual return cannot be negative.');
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
    <main className="sip-card goal-card" aria-label="Goal Planner">
      {!hasCalculated ? (
        /* ══════════════════════════════════════════════════════════════
           STATE 1: INPUT SCREEN ONLY (Results Hidden)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-starting-view">
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="goal-error-banner" role="alert">
              <span className="goal-error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="sip-inputs-wrapper">
            {/* Input 1: Future amount required (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="goal-future-amount-input" className="sip-row-label">
                  Future amount required (₹)
                </label>
              </div>

              <div className="sip-slider-col">
                <div
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('amount')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div
                    className={`sip-slider-tooltip ${activeSlider === 'amount' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${amountPct}% + ${(0.5 - amountPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(futureAmount)}
                  </div>

                  <input
                    type="range"
                    id="goal-future-amount-slider"
                    min={minFutureAmount}
                    max={maxFutureAmount}
                    step={stepFutureAmount}
                    value={futureAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFutureAmount(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${amountPct}%, #E2E8F0 ${amountPct}%, #E2E8F0 100%)`,
                    }}
                    aria-label="Future amount required Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹10,000</span>
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
                    id="goal-future-amount-input"
                    min={minFutureAmount}
                    max={maxFutureAmount}
                    step={stepFutureAmount}
                    value={futureAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxFutureAmount) {
                        setFutureAmount(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (futureAmount < minFutureAmount) setFutureAmount(minFutureAmount);
                      if (futureAmount > maxFutureAmount) setFutureAmount(maxFutureAmount);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 2: Investment horizon (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="goal-years-input" className="sip-row-label">
                  Investment horizon (Years)
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
                    id="goal-years-slider"
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
                    aria-label="Investment horizon in Years Slider"
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
                    id="goal-years-input"
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

            {/* Input 3: Annual return you expect to earn on investment (%) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="goal-return-input" className="sip-row-label">
                  Annual return you expect to earn on investment (%)
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
                    {annualReturn}% p.a.
                  </div>

                  <input
                    type="range"
                    id="goal-return-slider"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={annualReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setAnnualReturn(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${returnPct}%, #E2E8F0 ${returnPct}%, #E2E8F0 100%)`,
                    }}
                    aria-label="Annual return Slider"
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
                    id="goal-return-input"
                    min={minReturn}
                    max={maxReturn}
                    step={stepReturn}
                    value={annualReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxReturn) {
                        setAnnualReturn(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (annualReturn < minReturn) setAnnualReturn(minReturn);
                      if (annualReturn > maxReturn) setAnnualReturn(maxReturn);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">%</span>
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
              aria-label="Calculate Goal Planner"
            >
              Calculate
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           STATE 2: RESULT SCREEN (Input Screen Hidden Completely)
           Extremely simple Result box per exact specification
           ══════════════════════════════════════════════════════════════ */
        <div className="goal-result-screen">
          <div className="goal-result-box">
            <h3 className="goal-result-heading">
              <span className="goal-result-heading-dot"></span>
              Result
            </h3>

            <p className="goal-result-statement">
              You need to invest{' '}
              <span className="goal-amount-highlight">
                Rs. ₹{formatNumberIndian(calculatedInvestment)}/-
              </span>{' '}
              per month to achieve your investment goal.
            </p>
          </div>

          {/* Re-Calculate Action Button */}
          <div className="goal-recalc-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="goal-recalc-btn"
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

export default GoalPlanner;
