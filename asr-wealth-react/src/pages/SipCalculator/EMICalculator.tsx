import React, { useState, useMemo } from 'react';
import './EMICalculator.css';

// Indian Number Formatter helper (e.g. 19,300)
export const formatNumberIndian = (amount: number): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

// Indian Currency Formatter helper with ₹ symbol
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface EMICalculatorProps {
  onRecalculate?: () => void;
}

export const EMICalculator: React.FC<EMICalculatorProps> = () => {
  // Input 1: Loan Amount (Rs.) - Default: 20,00,000 (reference test case)
  const [loanAmount, setLoanAmount] = useState<number>(2000000);

  // Input 2: Interest Rate (%) - Default: 10% (reference test case)
  const [interestRate, setInterestRate] = useState<number>(10);

  // Input 3: Tenure (Years) - Default: 20 Years (reference test case)
  const [tenureYears, setTenureYears] = useState<number>(20);

  // Screen View State: false = Input Screen only, true = Result Screen only
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Tooltip for Sliders
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // Input Slider Ranges
  const minLoan = 10000;
  const maxLoan = 20000000; // ₹2 Crore
  const stepLoan = 10000;

  const minRate = 0; // 0% interest handled safely
  const maxRate = 30;
  const stepRate = 0.1;

  const minTenure = 1;
  const maxTenure = 35;
  const stepTenure = 1;

  // Percentage helper for slider tracks
  const getPercentage = (val: number, min: number, max: number): number => {
    if (max <= min) return 0;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const loanPct = getPercentage(loanAmount, minLoan, maxLoan);
  const ratePct = getPercentage(interestRate, minRate, maxRate);
  const tenurePct = getPercentage(tenureYears, minTenure, maxTenure);

  // ══════════════════════════════════════════════════════════════
  // CALCULATION LOGIC: Standard EMI Formula
  // ══════════════════════════════════════════════════════════════
  const calculatedEmi = useMemo(() => {
    const P = Math.max(0, Number(loanAmount) || 0);
    const R = Math.max(0, Number(interestRate) || 0);
    const T = Math.max(0, Number(tenureYears) || 0);

    const r = R / (12 * 100);
    const n = T * 12;

    if (n <= 0 || P <= 0) return 0;

    let emi = 0;
    if (r > 0) {
      // EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      // 0% Interest case
      emi = P / n;
    }

    return Math.round(emi);
  }, [loanAmount, interestRate, tenureYears]);

  // Handle Calculate Click
  const handleCalculate = () => {
    if (loanAmount <= 0) {
      setErrorMessage('Loan Amount must be greater than 0.');
      return;
    }
    if (interestRate < 0) {
      setErrorMessage('Interest Rate cannot be negative.');
      return;
    }
    if (tenureYears <= 0) {
      setErrorMessage('Tenure must be greater than 0 years.');
      return;
    }

    setErrorMessage(null);
    setHasCalculated(true);
  };

  // Handle Re-Calculate: Return to input screen, preserve inputs, hide result until Calculate is clicked again
  const handleRecalculate = () => {
    setHasCalculated(false);
    setErrorMessage(null);
  };

  return (
    <main className="sip-card emi-card" aria-label="EMI Calculator">
      {!hasCalculated ? (
        /* ══════════════════════════════════════════════════════════════
           STATE 1: INPUT SCREEN ONLY (Results Hidden)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-starting-view">
          
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="emi-error-banner" role="alert">
              <span className="emi-error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="sip-inputs-wrapper">

            {/* Input 1: Loan Amount (Rs.) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="emi-loan-amount-input" className="sip-row-label">
                  Loan Amount (Rs.)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('loan')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'loan' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${loanPct}% + ${(0.5 - loanPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(loanAmount)}
                  </div>

                  <input 
                    type="range"
                    id="emi-loan-amount-slider"
                    min={minLoan}
                    max={maxLoan}
                    step={stepLoan}
                    value={loanAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLoanAmount(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${loanPct}%, #E2E8F0 ${loanPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Loan Amount Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹10,000</span>
                    <span>₹1,00,00,000</span>
                    <span>₹2,00,00,000</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <span className="sip-input-prefix">₹</span>
                  <input 
                    type="number"
                    id="emi-loan-amount-input"
                    min={minLoan}
                    max={maxLoan}
                    step={stepLoan}
                    value={loanAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxLoan) {
                        setLoanAmount(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (loanAmount < minLoan) setLoanAmount(minLoan);
                      if (loanAmount > maxLoan) setLoanAmount(maxLoan);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 2: Interest Rate (%) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="emi-interest-rate-input" className="sip-row-label">
                  Interest Rate (%)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('rate')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'rate' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${ratePct}% + ${(0.5 - ratePct / 100) * 18}px)` }}
                  >
                    {interestRate}% p.a.
                  </div>

                  <input 
                    type="range"
                    id="emi-interest-rate-slider"
                    min={minRate}
                    max={maxRate}
                    step={stepRate}
                    value={interestRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setInterestRate(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${ratePct}%, #E2E8F0 ${ratePct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Interest Rate Slider"
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
                    id="emi-interest-rate-input"
                    min={minRate}
                    max={maxRate}
                    step={stepRate}
                    value={interestRate}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxRate) {
                        setInterestRate(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (interestRate < minRate) setInterestRate(minRate);
                      if (interestRate > maxRate) setInterestRate(maxRate);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Input 3: Tenure (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="emi-tenure-input" className="sip-row-label">
                  Tenure (Years)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('tenure')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'tenure' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${tenurePct}% + ${(0.5 - tenurePct / 100) * 18}px)` }}
                  >
                    {tenureYears} {tenureYears === 1 ? 'Year' : 'Years'}
                  </div>

                  <input 
                    type="range"
                    id="emi-tenure-slider"
                    min={minTenure}
                    max={maxTenure}
                    step={stepTenure}
                    value={tenureYears}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTenureYears(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${tenurePct}%, #E2E8F0 ${tenurePct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Tenure in Years Slider"
                  />
                  <div className="sip-slider-markers">
                    <span>1 Yr</span>
                    <span>18 Yrs</span>
                    <span>35 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="emi-tenure-input"
                    min={minTenure}
                    max={maxTenure}
                    step={stepTenure}
                    value={tenureYears}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxTenure) {
                        setTenureYears(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (tenureYears < minTenure) setTenureYears(minTenure);
                      if (tenureYears > maxTenure) setTenureYears(maxTenure);
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
              aria-label="Calculate EMI"
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
        <div className="emi-result-screen">
          <div className="emi-result-box">
            <h3 className="emi-result-heading">
              <span className="emi-result-heading-dot"></span>
              Result
            </h3>

            <p className="emi-result-statement">
              Your Monthly EMI will be{' '}
              <span className="emi-amount-highlight">
                Rs. {formatNumberIndian(calculatedEmi)}/-
              </span>
            </p>
          </div>

          {/* Re-Calculate Action Button */}
          <div className="emi-recalc-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="emi-recalc-btn"
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

export default EMICalculator;
