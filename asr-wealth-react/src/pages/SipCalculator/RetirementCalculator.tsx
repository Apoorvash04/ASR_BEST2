import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import './RetirementCalculator.css';

// Indian Currency Formatter helper
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

// Compact Indian Currency Formatter (e.g. ₹ 1.76 Cr, ₹ 30 L)
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

export interface RetirementCalculatorProps {
  onRecalculate?: () => void;
}

// Custom Tooltip for Retirement Lifecycle Curve
const CustomRetirementTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="retirement-chart-tooltip">
        <div className="retirement-tooltip-header">Age: {label} Yrs</div>
        {payload.map((item: any, idx: number) => (
          <div key={`item-${idx}`} className="retirement-tooltip-row">
            <span>
              <span 
                className="tooltip-color-indicator" 
                style={{ backgroundColor: item.stroke || item.color }}
              ></span>
              {item.name}:
            </span>
            <span className="retirement-tooltip-amt">
              {formatIndianCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RetirementCalculator: React.FC<RetirementCalculatorProps> = () => {
  // Input 1: Your Current Age (Years) - Default: 30
  const [currentAge, setCurrentAge] = useState<number>(30);

  // Input 2: Your Retirement Age (Years) - Default: 60
  const [retirementAge, setRetirementAge] = useState<number>(60);

  // Input 3: Monthly household expenses for current lifestyle (₹) - Default: 30,000
  const [currentMonthlyExpense, setCurrentMonthlyExpense] = useState<number>(30000);

  // Input 4: Estimated rate of Inflation (%) - Default: 6%
  const [estimatedInflation, setEstimatedInflation] = useState<number>(6);

  // Input 5: Current monthly savings (₹) - Default: 5,000
  const [currentMonthlySavings, setCurrentMonthlySavings] = useState<number>(5000);

  // Input 6: How much already saved for retirement (₹) - Default: 1,00,000
  const [existingRetirementSavings, setExistingRetirementSavings] = useState<number>(100000);

  // Input 7: Estimated Pre Retirement Return (%) - Default: 12%
  const [preRetirementReturn, setPreRetirementReturn] = useState<number>(12);

  // Input 8: Estimated Post Retirement Return (%) - Default: 7%
  const [postRetirementReturn, setPostRetirementReturn] = useState<number>(7);

  // Input 9: Life Expectancy (Years) - Default: 80
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(80);

  // View State: false = Input Screen only, true = Result Screen
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Tooltip for Sliders
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // Input Slider Ranges
  const minCurrentAge = 18;
  const maxCurrentAge = 75;
  const stepCurrentAge = 1;

  const minRetirementAge = 25;
  const maxRetirementAge = 80;
  const stepRetirementAge = 1;

  const minExpense = 5000;
  const maxExpense = 2000000;
  const stepExpense = 1000;

  const minInflation = 0;
  const maxInflation = 20;
  const stepInflation = 0.5;

  const minMonthlySavings = 0;
  const maxMonthlySavings = 1000000;
  const stepMonthlySavings = 500;

  const minExistingSavings = 0;
  const maxExistingSavings = 50000000;
  const stepExistingSavings = 10000;

  const minPreReturn = 0;
  const maxPreReturn = 30;
  const stepPreReturn = 0.5;

  const minPostReturn = 0;
  const maxPostReturn = 20;
  const stepPostReturn = 0.5;

  const minLifeExp = 50;
  const maxLifeExp = 100;
  const stepLifeExp = 1;

  // Percentage helper for slider tracks
  const getPercentage = (val: number, min: number, max: number): number => {
    if (max <= min) return 0;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const currentAgePct = getPercentage(currentAge, minCurrentAge, maxCurrentAge);
  const retirementAgePct = getPercentage(retirementAge, minRetirementAge, maxRetirementAge);
  const expensePct = getPercentage(currentMonthlyExpense, minExpense, maxExpense);
  const inflationPct = getPercentage(estimatedInflation, minInflation, maxInflation);
  const monthlySavingsPct = getPercentage(currentMonthlySavings, minMonthlySavings, maxMonthlySavings);
  const existingSavingsPct = getPercentage(existingRetirementSavings, minExistingSavings, maxExistingSavings);
  const preReturnPct = getPercentage(preRetirementReturn, minPreReturn, maxPreReturn);
  const postReturnPct = getPercentage(postRetirementReturn, minPostReturn, maxPostReturn);
  const lifeExpPct = getPercentage(lifeExpectancy, minLifeExp, maxLifeExp);

  // ══════════════════════════════════════════════════════════════
  // RETIREMENT FINANCIAL CALCULATION FORMULAS
  // ══════════════════════════════════════════════════════════════
  const calculationData = useMemo(() => {
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const retirementYears = Math.max(1, lifeExpectancy - retirementAge);
    const inflationRate = Math.max(0, estimatedInflation) / 100;
    const preReturn = Math.max(0, preRetirementReturn) / 100;
    const postReturn = Math.max(0, postRetirementReturn) / 100;
    const expense = Math.max(0, currentMonthlyExpense);
    const monthlySavings = Math.max(0, currentMonthlySavings);
    const existingSavings = Math.max(0, existingRetirementSavings);

    // 1. Monthly household expenses after retirement
    const monthlyExpenseAtRetirement =
      expense * Math.pow(1 + inflationRate, yearsToRetirement);

    // 2. Targeted savings at retirement age (growing annuity-due)
    const firstAnnualExpense = monthlyExpenseAtRetirement * 12;
    let targetCorpus = 0;
    if (postReturn !== inflationRate) {
      targetCorpus =
        (firstAnnualExpense * (1 + postReturn)) /
        (postReturn - inflationRate) *
        (1 - Math.pow((1 + inflationRate) / (1 + postReturn), retirementYears));
    } else {
      targetCorpus = firstAnnualExpense * retirementYears;
    }

    // 3. Amount accumulated with current monthly savings (beginning of month annuity)
    const monthlyPreReturn = preReturn / 12;
    const monthsToRetirement = yearsToRetirement * 12;
    let currentSavingsFV = 0;
    if (monthlyPreReturn > 0) {
      currentSavingsFV =
        (monthlySavings * (Math.pow(1 + monthlyPreReturn, monthsToRetirement) - 1)) /
        monthlyPreReturn *
        (1 + monthlyPreReturn);
    } else {
      currentSavingsFV = monthlySavings * monthsToRetirement;
    }

    // 4. Existing savings growth
    const existingSavingsFV =
      existingSavings * Math.pow(1 + preReturn, yearsToRetirement);

    // 5. Total savings at retirement
    const totalSavingsAtRetirement = currentSavingsFV + existingSavingsFV;

    // 6. Shortfall
    const shortfall = Math.max(0, targetCorpus - totalSavingsAtRetirement);

    // 7. Extra saving One time required (Lumpsum)
    let extraLumpsum = 0;
    if (shortfall > 0) {
      extraLumpsum = shortfall / Math.pow(1 + preReturn, yearsToRetirement);
    }

    // 8. Extra saving per month required (Standard Ordinary Monthly SIP)
    const monthlyExtraRate = preReturn / 12;
    let extraMonthlySaving = 0;
    if (shortfall > 0) {
      if (monthlyExtraRate > 0) {
        extraMonthlySaving =
          (shortfall * monthlyExtraRate) /
          (Math.pow(1 + monthlyExtraRate, monthsToRetirement) - 1);
      } else {
        extraMonthlySaving = shortfall / monthsToRetirement;
      }
    }

    // ══════════════════════════════════════════════════════════════
    // YEAR-BY-YEAR LIFECYCLE DATA FOR RETIREMENT CHART
    // ══════════════════════════════════════════════════════════════
    const chartData = [];
    let decumCorp1 = totalSavingsAtRetirement;
    let decumCorp2 = targetCorpus;
    let annualWithdrawal = firstAnnualExpense;

    for (let age = currentAge; age <= lifeExpectancy; age++) {
      let withYourInvestment = 0;
      let withAdditionalInvestment = 0;

      if (age <= retirementAge) {
        // Accumulation Phase
        const y = age - currentAge;
        const m = y * 12;

        let s1 = 0;
        let s_extra = 0;
        if (m > 0) {
          if (monthlyPreReturn > 0) {
            s1 =
              (monthlySavings * (Math.pow(1 + monthlyPreReturn, m) - 1)) /
              monthlyPreReturn *
              (1 + monthlyPreReturn);
            s_extra =
              (extraMonthlySaving * (Math.pow(1 + monthlyExtraRate, m) - 1)) /
              monthlyExtraRate;
          } else {
            s1 = monthlySavings * m;
            s_extra = extraMonthlySaving * m;
          }
        }
        const existingGrowth = existingSavings * Math.pow(1 + preReturn, y);
        withYourInvestment = Math.round(s1 + existingGrowth);
        withAdditionalInvestment = Math.round(withYourInvestment + s_extra);
      } else {
        // Decumulation Phase
        const yearIndex = age - retirementAge;
        if (yearIndex === 1) {
          decumCorp1 = totalSavingsAtRetirement;
          decumCorp2 = targetCorpus;
          annualWithdrawal = firstAnnualExpense;
        }

        decumCorp1 = Math.max(0, decumCorp1 - annualWithdrawal) * (1 + postReturn);
        decumCorp2 = Math.max(0, decumCorp2 - annualWithdrawal) * (1 + postReturn);
        annualWithdrawal = annualWithdrawal * (1 + inflationRate);

        withYourInvestment = Math.round(decumCorp1);
        withAdditionalInvestment = Math.round(decumCorp2);
      }

      chartData.push({
        age,
        withYourInvestment,
        withAdditionalInvestment,
      });
    }

    return {
      yearsToRetirement,
      monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
      targetCorpus: Math.round(targetCorpus),
      currentSavingsFV: Math.round(currentSavingsFV),
      existingSavingsFV: Math.round(existingSavingsFV),
      totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
      shortfall: Math.round(shortfall),
      extraLumpsum: Math.round(extraLumpsum),
      extraMonthlySaving: Math.round(extraMonthlySaving),
      chartData,
    };
  }, [
    currentAge,
    retirementAge,
    currentMonthlyExpense,
    estimatedInflation,
    currentMonthlySavings,
    existingRetirementSavings,
    preRetirementReturn,
    postRetirementReturn,
    lifeExpectancy,
  ]);

  // Handle Calculate Click with input validation
  const handleCalculate = () => {
    if (currentAge < 0) {
      setErrorMessage('Current age cannot be negative.');
      return;
    }
    if (retirementAge <= currentAge) {
      setErrorMessage('Retirement age must be greater than your current age.');
      return;
    }
    if (lifeExpectancy <= retirementAge) {
      setErrorMessage('Life expectancy must be greater than your retirement age.');
      return;
    }
    if (currentMonthlyExpense < 0) {
      setErrorMessage('Monthly household expenses cannot be negative.');
      return;
    }
    if (currentMonthlySavings < 0) {
      setErrorMessage('Current monthly savings cannot be negative.');
      return;
    }
    if (existingRetirementSavings < 0) {
      setErrorMessage('Existing retirement savings cannot be negative.');
      return;
    }
    if (estimatedInflation < 0) {
      setErrorMessage('Estimated inflation rate cannot be negative.');
      return;
    }
    if (preRetirementReturn < 0) {
      setErrorMessage('Pre-retirement return rate cannot be negative.');
      return;
    }
    if (postRetirementReturn < 0) {
      setErrorMessage('Post-retirement return rate cannot be negative.');
      return;
    }

    setErrorMessage(null);
    setHasCalculated(true);
  };

  // Handle Recalculate: Return to input screen, preserve inputs, hide results until Calculate is clicked again
  const handleRecalculate = () => {
    setHasCalculated(false);
    setErrorMessage(null);
  };

  return (
    <main className="sip-card retirement-card" aria-label="Retirement Calculator">
      {!hasCalculated ? (
        /* ══════════════════════════════════════════════════════════════
           STATE 1: INPUT SCREEN ONLY (Results Hidden)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-starting-view retirement-fade-in">
          
          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="retirement-error-banner" role="alert">
              <span className="retirement-error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="sip-inputs-wrapper">

            {/* Input 1: Your Current Age (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-current-age-input" className="sip-row-label">
                  Your Current Age
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('currentAge')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'currentAge' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${currentAgePct}% + ${(0.5 - currentAgePct / 100) * 18}px)` }}
                  >
                    {currentAge} Yrs
                  </div>

                  <input 
                    type="range"
                    id="ret-current-age-slider"
                    min={minCurrentAge}
                    max={maxCurrentAge}
                    step={stepCurrentAge}
                    value={currentAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentAge(val);
                      if (errorMessage) setErrorMessage(null);
                      if (val >= retirementAge) {
                        setRetirementAge(val + 5);
                      }
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${currentAgePct}%, #E2E8F0 ${currentAgePct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Your Current Age slider"
                  />
                  <div className="sip-slider-markers">
                    <span>18 Yrs</span>
                    <span>45 Yrs</span>
                    <span>75 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="ret-current-age-input"
                    min={minCurrentAge}
                    max={maxCurrentAge}
                    step={stepCurrentAge}
                    value={currentAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentAge(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    onBlur={() => {
                      if (currentAge < minCurrentAge) setCurrentAge(minCurrentAge);
                      if (currentAge > maxCurrentAge) setCurrentAge(maxCurrentAge);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">Yr</span>
                </div>
              </div>
            </div>

            {/* Input 2: Your Retirement Age (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-retirement-age-input" className="sip-row-label">
                  Your Retirement Age
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('retirementAge')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'retirementAge' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${retirementAgePct}% + ${(0.5 - retirementAgePct / 100) * 18}px)` }}
                  >
                    {retirementAge} Yrs
                  </div>

                  <input 
                    type="range"
                    id="ret-retirement-age-slider"
                    min={minRetirementAge}
                    max={maxRetirementAge}
                    step={stepRetirementAge}
                    value={retirementAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRetirementAge(val);
                      if (errorMessage) setErrorMessage(null);
                      if (val >= lifeExpectancy) {
                        setLifeExpectancy(val + 5);
                      }
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${retirementAgePct}%, #E2E8F0 ${retirementAgePct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Your Retirement Age slider"
                  />
                  <div className="sip-slider-markers">
                    <span>25 Yrs</span>
                    <span>55 Yrs</span>
                    <span>80 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="ret-retirement-age-input"
                    min={minRetirementAge}
                    max={maxRetirementAge}
                    step={stepRetirementAge}
                    value={retirementAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setRetirementAge(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    onBlur={() => {
                      if (retirementAge < minRetirementAge) setRetirementAge(minRetirementAge);
                      if (retirementAge > maxRetirementAge) setRetirementAge(maxRetirementAge);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">Yr</span>
                </div>
              </div>
            </div>

            {/* Input 3: Monthly household expenses for your current lifestyle (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-monthly-expense-input" className="sip-row-label">
                  Monthly household expenses for your current lifestyle (₹)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('expense')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'expense' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${expensePct}% + ${(0.5 - expensePct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(currentMonthlyExpense)}
                  </div>

                  <input 
                    type="range"
                    id="ret-monthly-expense-slider"
                    min={minExpense}
                    max={maxExpense}
                    step={stepExpense}
                    value={currentMonthlyExpense}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentMonthlyExpense(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${expensePct}%, #E2E8F0 ${expensePct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Monthly household expenses slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹5,000</span>
                    <span>₹10,00,000</span>
                    <span>₹20,00,000</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <span className="sip-input-prefix">₹</span>
                  <input 
                    type="number"
                    id="ret-monthly-expense-input"
                    min={minExpense}
                    max={maxExpense}
                    step={stepExpense}
                    value={currentMonthlyExpense}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxExpense) {
                        setCurrentMonthlyExpense(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (currentMonthlyExpense < minExpense) setCurrentMonthlyExpense(minExpense);
                      if (currentMonthlyExpense > maxExpense) setCurrentMonthlyExpense(maxExpense);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 4: Estimated rate of Inflation (%) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-inflation-input" className="sip-row-label">
                  Estimated rate of Inflation (%)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('inflation')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'inflation' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${inflationPct}% + ${(0.5 - inflationPct / 100) * 18}px)` }}
                  >
                    {estimatedInflation}% p.a.
                  </div>

                  <input 
                    type="range"
                    id="ret-inflation-slider"
                    min={minInflation}
                    max={maxInflation}
                    step={stepInflation}
                    value={estimatedInflation}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEstimatedInflation(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${inflationPct}%, #E2E8F0 ${inflationPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Estimated rate of Inflation slider"
                  />
                  <div className="sip-slider-markers">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="ret-inflation-input"
                    min={minInflation}
                    max={maxInflation}
                    step={stepInflation}
                    value={estimatedInflation}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxInflation) {
                        setEstimatedInflation(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (estimatedInflation < minInflation) setEstimatedInflation(minInflation);
                      if (estimatedInflation > maxInflation) setEstimatedInflation(maxInflation);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Input 5: Your current monthly savings (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-monthly-savings-input" className="sip-row-label">
                  Your current monthly savings (₹)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('monthlySavings')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'monthlySavings' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${monthlySavingsPct}% + ${(0.5 - monthlySavingsPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(currentMonthlySavings)}
                  </div>

                  <input 
                    type="range"
                    id="ret-monthly-savings-slider"
                    min={minMonthlySavings}
                    max={maxMonthlySavings}
                    step={stepMonthlySavings}
                    value={currentMonthlySavings}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentMonthlySavings(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${monthlySavingsPct}%, #E2E8F0 ${monthlySavingsPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Current monthly savings slider"
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
                    id="ret-monthly-savings-input"
                    min={minMonthlySavings}
                    max={maxMonthlySavings}
                    step={stepMonthlySavings}
                    value={currentMonthlySavings}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxMonthlySavings) {
                        setCurrentMonthlySavings(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (currentMonthlySavings < minMonthlySavings) setCurrentMonthlySavings(minMonthlySavings);
                      if (currentMonthlySavings > maxMonthlySavings) setCurrentMonthlySavings(maxMonthlySavings);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 6: How much you have already saved for your retirement (₹) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-existing-savings-input" className="sip-row-label">
                  How much you have already saved for your retirement (₹)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('existingSavings')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'existingSavings' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${existingSavingsPct}% + ${(0.5 - existingSavingsPct / 100) * 18}px)` }}
                  >
                    {formatIndianCurrency(existingRetirementSavings)}
                  </div>

                  <input 
                    type="range"
                    id="ret-existing-savings-slider"
                    min={minExistingSavings}
                    max={maxExistingSavings}
                    step={stepExistingSavings}
                    value={existingRetirementSavings}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setExistingRetirementSavings(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${existingSavingsPct}%, #E2E8F0 ${existingSavingsPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Already saved for retirement slider"
                  />
                  <div className="sip-slider-markers">
                    <span>₹0</span>
                    <span>₹2.5 Cr</span>
                    <span>₹5 Cr</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <span className="sip-input-prefix">₹</span>
                  <input 
                    type="number"
                    id="ret-existing-savings-input"
                    min={minExistingSavings}
                    max={maxExistingSavings}
                    step={stepExistingSavings}
                    value={existingRetirementSavings}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxExistingSavings) {
                        setExistingRetirementSavings(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (existingRetirementSavings < minExistingSavings) setExistingRetirementSavings(minExistingSavings);
                      if (existingRetirementSavings > maxExistingSavings) setExistingRetirementSavings(maxExistingSavings);
                    }}
                    className="sip-number-input"
                  />
                </div>
              </div>
            </div>

            {/* Input 7: Estimated Pre Retirement Return (%) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-pre-return-input" className="sip-row-label">
                  Estimated Pre Retirement Return (%)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('preReturn')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'preReturn' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${preReturnPct}% + ${(0.5 - preReturnPct / 100) * 18}px)` }}
                  >
                    {preRetirementReturn}% p.a.
                  </div>

                  <input 
                    type="range"
                    id="ret-pre-return-slider"
                    min={minPreReturn}
                    max={maxPreReturn}
                    step={stepPreReturn}
                    value={preRetirementReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPreRetirementReturn(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${preReturnPct}%, #E2E8F0 ${preReturnPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Pre-retirement return slider"
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
                    id="ret-pre-return-input"
                    min={minPreReturn}
                    max={maxPreReturn}
                    step={stepPreReturn}
                    value={preRetirementReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxPreReturn) {
                        setPreRetirementReturn(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (preRetirementReturn < minPreReturn) setPreRetirementReturn(minPreReturn);
                      if (preRetirementReturn > maxPreReturn) setPreRetirementReturn(maxPreReturn);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Input 8: Estimated Post Retirement Return (%) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-post-return-input" className="sip-row-label">
                  Estimated Post Retirement Return (%)
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('postReturn')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'postReturn' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${postReturnPct}% + ${(0.5 - postReturnPct / 100) * 18}px)` }}
                  >
                    {postRetirementReturn}% p.a.
                  </div>

                  <input 
                    type="range"
                    id="ret-post-return-slider"
                    min={minPostReturn}
                    max={maxPostReturn}
                    step={stepPostReturn}
                    value={postRetirementReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPostRetirementReturn(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${postReturnPct}%, #E2E8F0 ${postReturnPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Post-retirement return slider"
                  />
                  <div className="sip-slider-markers">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="ret-post-return-input"
                    min={minPostReturn}
                    max={maxPostReturn}
                    step={stepPostReturn}
                    value={postRetirementReturn}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxPostReturn) {
                        setPostRetirementReturn(val);
                        if (errorMessage) setErrorMessage(null);
                      }
                    }}
                    onBlur={() => {
                      if (postRetirementReturn < minPostReturn) setPostRetirementReturn(minPostReturn);
                      if (postRetirementReturn > maxPostReturn) setPostRetirementReturn(maxPostReturn);
                    }}
                    className="sip-number-input sip-number-input-unit"
                  />
                  <span className="sip-input-suffix">%</span>
                </div>
              </div>
            </div>

            {/* Input 9: Life Expectancy (Years) */}
            <div className="sip-input-row">
              <div className="sip-label-col">
                <label htmlFor="ret-life-exp-input" className="sip-row-label">
                  Life Expectancy
                </label>
              </div>

              <div className="sip-slider-col">
                <div 
                  className="sip-slider-container"
                  onMouseEnter={() => setActiveSlider('lifeExp')}
                  onMouseLeave={() => setActiveSlider(null)}
                >
                  <div 
                    className={`sip-slider-tooltip ${activeSlider === 'lifeExp' ? 'is-visible' : ''}`}
                    style={{ left: `calc(${lifeExpPct}% + ${(0.5 - lifeExpPct / 100) * 18}px)` }}
                  >
                    {lifeExpectancy} Yrs
                  </div>

                  <input 
                    type="range"
                    id="ret-life-exp-slider"
                    min={minLifeExp}
                    max={maxLifeExp}
                    step={stepLifeExp}
                    value={lifeExpectancy}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLifeExpectancy(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="sip-range-slider"
                    style={{
                      background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${lifeExpPct}%, #E2E8F0 ${lifeExpPct}%, #E2E8F0 100%)`
                    }}
                    aria-label="Life Expectancy slider"
                  />
                  <div className="sip-slider-markers">
                    <span>50 Yrs</span>
                    <span>75 Yrs</span>
                    <span>100 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="sip-input-col">
                <div className="sip-input-box-wrapper">
                  <input 
                    type="number"
                    id="ret-life-exp-input"
                    min={minLifeExp}
                    max={maxLifeExp}
                    step={stepLifeExp}
                    value={lifeExpectancy}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLifeExpectancy(val);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    onBlur={() => {
                      if (lifeExpectancy < minLifeExp) setLifeExpectancy(minLifeExp);
                      if (lifeExpectancy > maxLifeExp) setLifeExpectancy(maxLifeExp);
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
              aria-label="Calculate Retirement Projections"
            >
              Calculate
            </button>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
           STATE 2: RESULT SCREEN (Input Screen Hidden, Results Shown)
           ══════════════════════════════════════════════════════════════ */
        <div className="sip-results-screen retirement-fade-in">
          
          {/* Top Bar: Recalculate Button & Parameter Summary */}
          <div className="retirement-results-header-bar">
            <button 
              type="button"
              onClick={handleRecalculate}
              className="retirement-recalc-btn"
              aria-label="Recalculate or Edit Inputs"
            >
              ← Recalculate
            </button>

            <div className="retirement-param-chips">
              <span className="retirement-chip">
                <strong>Current Age:</strong> {currentAge} Yrs
              </span>
              <span className="retirement-chip">
                <strong>Retire At:</strong> {retirementAge} Yrs
              </span>
              <span className="retirement-chip">
                <strong>Expense:</strong> {formatIndianCurrency(currentMonthlyExpense)}/mo
              </span>
              <span className="retirement-chip">
                <strong>Pre Return:</strong> {preRetirementReturn}%
              </span>
              <span className="retirement-chip">
                <strong>Post Return:</strong> {postRetirementReturn}%
              </span>
            </div>
          </div>

          {/* ── 1. Result Table (Exact 9 rows per specification) ── */}
          <div className="retirement-table-container">
            <table className="retirement-result-table">
              <tbody>
                <tr>
                  <td className="retirement-cell-label">Years left for retirement</td>
                  <td className="retirement-cell-value">{calculationData.yearsToRetirement}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Your Monthly household expenses after retirement</td>
                  <td className="retirement-cell-value">{formatIndianCurrency(calculationData.monthlyExpenseAtRetirement)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Your targeted savings at retirement age</td>
                  <td className="retirement-cell-value cell-gold-bold">{formatIndianCurrency(calculationData.targetCorpus)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Amount you will accumulate with current monthly savings</td>
                  <td className="retirement-cell-value">{formatIndianCurrency(calculationData.currentSavingsFV)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Your existing savings will grow to</td>
                  <td className="retirement-cell-value">{formatIndianCurrency(calculationData.existingSavingsFV)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Total savings at the time of retirement</td>
                  <td className="retirement-cell-value cell-green-bold">{formatIndianCurrency(calculationData.totalSavingsAtRetirement)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Shortfall in savings</td>
                  <td className="retirement-cell-value cell-red-bold">{formatIndianCurrency(calculationData.shortfall)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Extra saving One time required to take care of shortfall</td>
                  <td className="retirement-cell-value">{formatIndianCurrency(calculationData.extraLumpsum)}</td>
                </tr>
                <tr>
                  <td className="retirement-cell-label">Extra saving per month required to take care of shortfall</td>
                  <td className="retirement-cell-value">{formatIndianCurrency(calculationData.extraMonthlySaving)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── 2. Retirement Growth Chart ── */}
          <section className="retirement-chart-section" aria-label="Retirement Lifecycle Chart">
            <div className="retirement-chart-header">
              <h3 className="retirement-chart-title">Retirement Chart</h3>

              <div className="retirement-chart-legend">
                <div className="retirement-legend-item">
                  <span className="retirement-legend-dot dot-your-inv"></span>
                  <span>With your Investment</span>
                </div>
                <div className="retirement-legend-item">
                  <span className="retirement-legend-dot dot-add-inv"></span>
                  <span>With Additional Investment</span>
                </div>
              </div>
            </div>

            <div className="retirement-linechart-wrapper">
              <ResponsiveContainer width="100%" height={340}>
                <LineChart
                  data={calculationData.chartData}
                  margin={{ top: 20, right: 28, left: 14, bottom: 12 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="age"
                    name="Age"
                    tick={{ fill: '#475569', fontSize: 13 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                    tickFormatter={(age) => `${age} Yrs`}
                  />
                  <YAxis
                    tickFormatter={(val) => formatCompactCurrency(val)}
                    tick={{ fill: '#64748B', fontSize: 12.5 }}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                    width={78}
                  />
                  <Tooltip content={<CustomRetirementTooltip />} />
                  
                  {/* Vertical Reference Line at Retirement Age */}
                  <ReferenceLine
                    x={retirementAge}
                    stroke="#DC2626"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Retire (${retirementAge}y)`,
                      position: 'top',
                      fill: '#DC2626',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />

                  {/* Line 1: With your Investment */}
                  <Line
                    type="monotone"
                    dataKey="withYourInvestment"
                    name="With your Investment"
                    stroke="#4341CD"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6, fill: '#4341CD', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />

                  {/* Line 2: With Additional Investment */}
                  <Line
                    type="monotone"
                    dataKey="withAdditionalInvestment"
                    name="With Additional Investment"
                    stroke="#F4B400"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#F4B400', stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* ── 3. Bottom Recalculate Button ── */}
          <div className="retirement-bottom-recalc">
            <button
              type="button"
              onClick={handleRecalculate}
              className="sip-calculate-btn retirement-action-recalc-btn"
              aria-label="Recalculate with updated inputs"
            >
              Recalculate
            </button>
          </div>

        </div>
      )}
    </main>
  );
};

export default RetirementCalculator;
