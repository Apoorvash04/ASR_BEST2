import React, { useState, useMemo, useRef } from 'react';
import { CII_DATA, getFinancialYearFromDate } from './ciiData';
import './CostInflationCalculator.css';

// Indian Currency Formatter helper
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface CostInflationCalculatorProps {
  onRecalculate?: () => void;
}

export const CostInflationCalculator: React.FC<CostInflationCalculatorProps> = () => {
  // Input 1: Purchase Financial Year - Default: '2001-02' (reference test case)
  const [purchaseFinancialYear, setPurchaseFinancialYear] = useState<string>('2001-02');

  // Input 2: Purchase Date - Default: '2001-06-15' (within FY 2001-02)
  const [purchaseDate, setPurchaseDate] = useState<string>('2001-06-15');

  // Input 3: Purchase Amount (₹) - Default: 440 (reference test case)
  const [purchaseAmount, setPurchaseAmount] = useState<number>(440);

  // Input 4: Sale Financial Year - Default: '2017-18' (reference test case)
  const [saleFinancialYear, setSaleFinancialYear] = useState<string>('2017-18');

  // Input 5: Sale Amount (₹) - Default: 20,000 (reference test case)
  const [saleAmount, setSaleAmount] = useState<number>(20000);

  // Toggle for Cost Inflation Index Chart / Table
  const [showCiiChart, setShowCiiChart] = useState<boolean>(false);

  // Result display state: false initially, true after clicking Calculate
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // DOM Refs
  const resultRef = useRef<HTMLDivElement | null>(null);
  const inputsTopRef = useRef<HTMLDivElement | null>(null);

  // ══════════════════════════════════════════════════════════════
  // CALCULATION LOGIC: Indexed Cost & Capital Gain/Loss
  // ══════════════════════════════════════════════════════════════
  const calculationData = useMemo(() => {
    const P = Math.max(0, Number(purchaseAmount) || 0);
    const S = Math.max(0, Number(saleAmount) || 0);

    const purchaseEntry = CII_DATA.find((item) => item.financialYear === purchaseFinancialYear);
    const saleEntry = CII_DATA.find((item) => item.financialYear === saleFinancialYear);

    const purchaseCii = purchaseEntry ? purchaseEntry.cii : 100;
    const saleCii = saleEntry ? saleEntry.cii : 100;

    // 1. Indexed Cost = Purchase Amount * (Sale CII / Purchase CII)
    // Full floating point precision, rounded only for final display
    const indexedCost = purchaseCii > 0 ? P * (saleCii / purchaseCii) : P;

    // 2. Capital Difference = Sale Amount - Indexed Cost
    const capitalDifference = S - indexedCost;

    let resultType: 'gain' | 'loss' | 'neutral' = 'neutral';
    let finalAmount = 0;

    if (capitalDifference > 0) {
      resultType = 'gain';
      finalAmount = Math.round(capitalDifference);
    } else if (capitalDifference < 0) {
      resultType = 'loss';
      finalAmount = Math.round(Math.abs(capitalDifference));
    } else {
      resultType = 'neutral';
      finalAmount = 0;
    }

    return {
      purchaseCii,
      saleCii,
      indexedCost: Math.round(indexedCost),
      capitalDifference,
      finalAmount,
      resultType,
    };
  }, [purchaseFinancialYear, purchaseAmount, saleFinancialYear, saleAmount]);

  // Handle Calculate Click with comprehensive validations
  const handleCalculate = () => {
    if (!purchaseFinancialYear) {
      setErrorMessage('Please select a Purchase Financial Year.');
      return;
    }
    if (!saleFinancialYear) {
      setErrorMessage('Please select a Sale Financial Year.');
      return;
    }
    if (purchaseAmount < 0) {
      setErrorMessage('Purchase amount must be greater than or equal to ₹0.');
      return;
    }
    if (saleAmount < 0) {
      setErrorMessage('Sale amount must be greater than or equal to ₹0.');
      return;
    }
    if (!purchaseDate) {
      setErrorMessage('Please enter a valid Purchase Date.');
      return;
    }

    // Validate that the Purchase Date belongs logically to the selected Purchase Financial Year
    const dateFY = getFinancialYearFromDate(purchaseDate);
    if (dateFY && dateFY !== purchaseFinancialYear) {
      setErrorMessage(
        `Selected Purchase Date (${purchaseDate}) belongs to FY ${dateFY}, which does not match the selected Purchase Financial Year (${purchaseFinancialYear}). Please select a date within FY ${purchaseFinancialYear}.`
      );
      return;
    }

    // Validate that Sale Financial Year is not earlier than Purchase Financial Year
    const purchaseIdx = CII_DATA.findIndex((item) => item.financialYear === purchaseFinancialYear);
    const saleIdx = CII_DATA.findIndex((item) => item.financialYear === saleFinancialYear);

    if (purchaseIdx === -1) {
      setErrorMessage('Selected Purchase Financial Year is not found in the CII dataset.');
      return;
    }
    if (saleIdx === -1) {
      setErrorMessage('Selected Sale Financial Year is not found in the CII dataset.');
      return;
    }
    if (saleIdx < purchaseIdx) {
      setErrorMessage(
        `Sale Financial Year (${saleFinancialYear}) cannot be earlier than Purchase Financial Year (${purchaseFinancialYear}).`
      );
      return;
    }

    setErrorMessage(null);
    setHasCalculated(true);

    // Scroll smoothly to the result box
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  // Handle Re-Calculate Click: keep previous values, hide current result, allow modifications
  const handleRecalculate = () => {
    setHasCalculated(false);
    setErrorMessage(null);
    inputsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="sip-card cii-card" aria-label="Cost Inflation Calculator">
      
      {/* ══════════════════════════════════════════════════════════════
         INPUT SECTION (Remains Visible After Calculate)
         ══════════════════════════════════════════════════════════════ */}
      <div className="sip-starting-view" ref={inputsTopRef}>
        
        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="cii-error-banner" role="alert">
            <span className="cii-error-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="sip-inputs-wrapper">

          {/* Input 1: Purchase Financial Year */}
          <div className="cii-input-row">
            <label htmlFor="cii-purchase-fy-select" className="cii-row-label">
              Purchase Financial Year
            </label>
            <div className="cii-field-col">
              <select
                id="cii-purchase-fy-select"
                value={purchaseFinancialYear}
                onChange={(e) => {
                  setPurchaseFinancialYear(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="cii-select-input"
              >
                {CII_DATA.map((item) => (
                  <option key={`p-fy-${item.financialYear}`} value={item.financialYear}>
                    {item.financialYear} (CII: {item.cii})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input 2: Purchase Date */}
          <div className="cii-input-row">
            <label htmlFor="cii-purchase-date-input" className="cii-row-label">
              Purchase Date
            </label>
            <div className="cii-field-col">
              <input
                type="date"
                id="cii-purchase-date-input"
                value={purchaseDate}
                onChange={(e) => {
                  setPurchaseDate(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="cii-date-input"
              />
              <p className="cii-date-hint">
                Must correspond to the selected Purchase Financial Year ({purchaseFinancialYear})
              </p>
            </div>
          </div>

          {/* Input 3: Purchase Amount (₹) */}
          <div className="cii-input-row">
            <label htmlFor="cii-purchase-amount-input" className="cii-row-label">
              Purchase Amount (₹)
            </label>
            <div className="cii-field-col">
              <div className="sip-input-box-wrapper">
                <span className="sip-input-prefix">₹</span>
                <input
                  type="number"
                  id="cii-purchase-amount-input"
                  min="0"
                  step="1"
                  value={purchaseAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) {
                      setPurchaseAmount(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

          {/* Input 4: Sale Financial Year */}
          <div className="cii-input-row">
            <label htmlFor="cii-sale-fy-select" className="cii-row-label">
              Sale Financial Year
            </label>
            <div className="cii-field-col">
              <select
                id="cii-sale-fy-select"
                value={saleFinancialYear}
                onChange={(e) => {
                  setSaleFinancialYear(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="cii-select-input"
              >
                {CII_DATA.map((item) => (
                  <option key={`s-fy-${item.financialYear}`} value={item.financialYear}>
                    {item.financialYear} (CII: {item.cii})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input 5: Sale Amount (₹) */}
          <div className="cii-input-row">
            <label htmlFor="cii-sale-amount-input" className="cii-row-label">
              Sale Amount (₹)
            </label>
            <div className="cii-field-col">
              <div className="sip-input-box-wrapper">
                <span className="sip-input-prefix">₹</span>
                <input
                  type="number"
                  id="cii-sale-amount-input"
                  min="0"
                  step="1"
                  value={saleAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0) {
                      setSaleAmount(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ── Cost Inflation Index Chart / Table Toggle ── */}
        <div className="cii-chart-toggle-action">
          <button
            type="button"
            onClick={() => setShowCiiChart(!showCiiChart)}
            className="cii-chart-toggle-btn"
            aria-expanded={showCiiChart}
            aria-controls="cii-table-section"
          >
            <span>Cost Inflation Index Chart</span>
            <span className={`cii-toggle-icon ${showCiiChart ? 'expanded' : ''}`}>▼</span>
          </button>
        </div>

        {/* ── Collapsible CII Table ── */}
        {showCiiChart && (
          <div id="cii-table-section" className="cii-table-wrapper" aria-label="Official Cost Inflation Index Table">
            <table className="cii-data-table">
              <thead>
                <tr>
                  <th>Sl. No.</th>
                  <th>Financial Year (FY)</th>
                  <th>Assessment Year (AY)</th>
                  <th>Cost Inflation Index</th>
                </tr>
              </thead>
              <tbody>
                {CII_DATA.map((entry) => {
                  const isPurchase = entry.financialYear === purchaseFinancialYear;
                  const isSale = entry.financialYear === saleFinancialYear;
                  return (
                    <tr
                      key={`cii-row-${entry.slNo}`}
                      className={isPurchase || isSale ? 'cii-highlight-row' : ''}
                    >
                      <td>{entry.slNo}</td>
                      <td>
                        {entry.financialYear}
                        {isPurchase && ' (Purchase FY)'}
                        {isSale && ' (Sale FY)'}
                      </td>
                      <td>{entry.assessmentYear}</td>
                      <td><strong>{entry.cii}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Calculate Action Button */}
        <div className="sip-calculate-action">
          <button
            type="button"
            onClick={handleCalculate}
            className="sip-calculate-btn"
            aria-label="Calculate Capital Gain or Loss"
          >
            Calculate
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
         RESULT SECTION: SMALL, SIMPLE RESULT DIV (Appears BELOW Inputs)
         ══════════════════════════════════════════════════════════════ */}
      {hasCalculated && (
        <section
          className="cii-result-section"
          ref={resultRef}
          aria-label="Cost Inflation Calculation Result"
        >
          <div className="cii-compact-result-box">
            <div className="cii-result-header-label">Result</div>

            {calculationData.resultType === 'gain' && (
              <>
                <h4 className="cii-result-status-title status-gain">Capital Gain</h4>
                <div className="cii-result-amount amount-gain">
                  {formatIndianCurrency(calculationData.finalAmount)}
                </div>
              </>
            )}

            {calculationData.resultType === 'loss' && (
              <>
                <h4 className="cii-result-status-title status-loss">Capital Loss</h4>
                <div className="cii-result-amount amount-loss">
                  {formatIndianCurrency(calculationData.finalAmount)}
                </div>
              </>
            )}

            {calculationData.resultType === 'neutral' && (
              <>
                <h4 className="cii-result-status-title status-neutral">No Capital Gain or Loss</h4>
                <div className="cii-result-amount">₹0</div>
              </>
            )}

            <div className="cii-indexed-cost-sub">
              <span>Indexed Cost of Acquisition:</span>
              <span className="cii-indexed-cost-val">
                {formatIndianCurrency(calculationData.indexedCost)}
              </span>
            </div>
          </div>

          {/* Re-Calculate Action Button */}
          <div className="cii-recalc-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="cii-recalc-btn"
              aria-label="Re-Calculate and edit inputs"
            >
              Re-Calculate
            </button>
          </div>
        </section>
      )}

    </main>
  );
};

export default CostInflationCalculator;
