import React, { useState, useMemo, useRef } from 'react';
import './MarriageCalculator.css';

// Indian Currency Formatter helper
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface MarriageCalculatorProps {
  onRecalculate?: () => void;
}

export const MarriageCalculator: React.FC<MarriageCalculatorProps> = () => {
  // Input 1: Age of child today (Years) - Default: 2
  const [childAge, setChildAge] = useState<number>(2);

  // Input 2: Marriage age of child (Years) - Default: 25
  const [marriageAge, setMarriageAge] = useState<number>(25);

  // Input 3: Expenditure required for wedding at today's cost (₹) - Default: 10,00,000
  const [currentWeddingCost, setCurrentWeddingCost] = useState<number>(1000000);

  // Input 4: Annual Savings presently (₹) - Default: 30,000
  const [annualSavings, setAnnualSavings] = useState<number>(30000);

  // Input 5: Already saved for child (₹) - Default: 1,00,000
  const [existingSavings, setExistingSavings] = useState<number>(100000);

  // Input 6: Expected rate of return (%) - Default: 12%
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // Input 7: Expected Inflation rate (%) - Default: 6%
  const [expectedInflation, setExpectedInflation] = useState<number>(6);

  // Screen View State: false initially, true after clicking Calculate
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Slider Tooltip State
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // DOM Refs
  const resultRef = useRef<HTMLDivElement | null>(null);
  const inputsTopRef = useRef<HTMLDivElement | null>(null);

  // Slider Input Ranges
  const minChildAge = 0;
  const maxChildAge = 25;
  const stepChildAge = 1;

  const minMarriageAge = 18;
  const maxMarriageAge = 50;
  const stepMarriageAge = 1;

  const minWeddingCost = 100000;
  const maxWeddingCost = 20000000;
  const stepWeddingCost = 50000;

  const minAnnualSavings = 0;
  const maxAnnualSavings = 5000000;
  const stepAnnualSavings = 5000;

  const minExistingSavings = 0;
  const maxExistingSavings = 10000000;
  const stepExistingSavings = 10000;

  const minReturn = 0;
  const maxReturn = 30;
  const stepReturn = 0.5;

  const minInflation = 0;
  const maxInflation = 20;
  const stepInflation = 0.5;

  // Percentage helper for slider tracks
  const getPercentage = (val: number, min: number, max: number): number => {
    if (max <= min) return 0;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const childAgePct = getPercentage(childAge, minChildAge, maxChildAge);
  const marriageAgePct = getPercentage(marriageAge, minMarriageAge, maxMarriageAge);
  const costPct = getPercentage(currentWeddingCost, minWeddingCost, maxWeddingCost);
  const annualSavingsPct = getPercentage(annualSavings, minAnnualSavings, maxAnnualSavings);
  const existingSavingsPct = getPercentage(existingSavings, minExistingSavings, maxExistingSavings);
  const returnPct = getPercentage(expectedReturn, minReturn, maxReturn);
  const inflationPct = getPercentage(expectedInflation, minInflation, maxInflation);

  // ══════════════════════════════════════════════════════════════
  // CALCULATION LOGIC: Marriage financial projection formulas
  // ══════════════════════════════════════════════════════════════
  const calculationData = useMemo(() => {
    const yearsToMarriage = Math.max(0, marriageAge - childAge);
    const annualReturn = Math.max(0, expectedReturn) / 100;
    const inflation = Math.max(0, expectedInflation) / 100;
    const cost = Math.max(0, currentWeddingCost);
    const annSavings = Math.max(0, annualSavings);
    const exSavings = Math.max(0, existingSavings);

    // 1. Inflation-adjusted future marriage cost
    const futureMarriageCost = cost * Math.pow(1 + inflation, yearsToMarriage);

    // 2. Future value of annual savings (ordinary annuity, contributions at end of year)
    let futureAnnualSavings = 0;
    if (annualReturn > 0) {
      futureAnnualSavings =
        annSavings * ((Math.pow(1 + annualReturn, yearsToMarriage) - 1) / annualReturn);
    } else {
      futureAnnualSavings = annSavings * yearsToMarriage;
    }

    // 3. Future value of existing savings
    const futureExistingSavings = exSavings * Math.pow(1 + annualReturn, yearsToMarriage);

    // 4. Total available funds
    const totalAvailable = futureAnnualSavings + futureExistingSavings;

    // 5. Additional funds required
    const additionalFunds = futureMarriageCost - totalAvailable;

    return {
      yearsToMarriage,
      futureMarriageCost: Math.round(futureMarriageCost),
      futureAnnualSavings: Math.round(futureAnnualSavings),
      futureExistingSavings: Math.round(futureExistingSavings),
      totalAvailable: Math.round(totalAvailable),
      additionalFunds: Math.round(additionalFunds),
      hasSurplus: additionalFunds <= 0,
    };
  }, [
    childAge,
    marriageAge,
    currentWeddingCost,
    annualSavings,
    existingSavings,
    expectedReturn,
    expectedInflation,
  ]);

  // Handle Calculate Click
  const handleCalculate = () => {
    if (childAge < 0) {
      setErrorMessage("Child's age cannot be negative.");
      return;
    }
    if (marriageAge <= childAge) {
      setErrorMessage("Child's marriage age must be greater than today's age.");
      return;
    }
    if (currentWeddingCost < 0) {
      setErrorMessage('Wedding cost cannot be negative.');
      return;
    }
    if (annualSavings < 0) {
      setErrorMessage('Annual savings cannot be negative.');
      return;
    }
    if (existingSavings < 0) {
      setErrorMessage('Existing savings cannot be negative.');
      return;
    }
    if (expectedReturn < 0) {
      setErrorMessage('Expected rate of return cannot be negative.');
      return;
    }
    if (expectedInflation < 0) {
      setErrorMessage('Expected inflation rate cannot be negative.');
      return;
    }

    setErrorMessage(null);
    setHasCalculated(true);

    // Smoothly scroll down to result section
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  // Handle Re-Calculate: Keep all previous values, hide current result until Calculate is pressed again
  const handleRecalculate = () => {
    setHasCalculated(false);
    setErrorMessage(null);
    inputsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="sip-card marriage-card" aria-label="Marriage Calculator">

      {/* ══════════════════════════════════════════════════════════════
         INPUT SECTION (Remains Visible on Calculate)
         ══════════════════════════════════════════════════════════════ */}
      <div className="sip-starting-view" ref={inputsTopRef}>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="marriage-error-banner" role="alert">
            <span className="marriage-error-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="sip-inputs-wrapper">

          {/* Input 1: Age of your child today (Years) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-child-age-input" className="sip-row-label">
                What is age of your child today (Years)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('childAge')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'childAge' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${childAgePct}% + ${(0.5 - childAgePct / 100) * 18}px)` }}
                >
                  {childAge} {childAge === 1 ? 'Year' : 'Years'}
                </div>

                <input 
                  type="range"
                  id="mrg-child-age-slider"
                  min={minChildAge}
                  max={maxChildAge}
                  step={stepChildAge}
                  value={childAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setChildAge(val);
                    if (errorMessage) setErrorMessage(null);
                    if (val >= marriageAge) {
                      setMarriageAge(val + 1);
                    }
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${childAgePct}%, #E2E8F0 ${childAgePct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Age of your child today slider"
                />
                <div className="sip-slider-markers">
                  <span>0 Yr</span>
                  <span>12 Yrs</span>
                  <span>25 Yrs</span>
                </div>
              </div>
            </div>

            <div className="sip-input-col">
              <div className="sip-input-box-wrapper">
                <input 
                  type="number"
                  id="mrg-child-age-input"
                  min={minChildAge}
                  max={maxChildAge}
                  step={stepChildAge}
                  value={childAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setChildAge(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => {
                    if (childAge < minChildAge) setChildAge(minChildAge);
                    if (childAge > maxChildAge) setChildAge(maxChildAge);
                  }}
                  className="sip-number-input sip-number-input-unit"
                />
                <span className="sip-input-suffix">Yr</span>
              </div>
            </div>
          </div>

          {/* Input 2: At what age your child will get married (Years) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-marriage-age-input" className="sip-row-label">
                At what age your child will get married (Years)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('marriageAge')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'marriageAge' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${marriageAgePct}% + ${(0.5 - marriageAgePct / 100) * 18}px)` }}
                >
                  {marriageAge} Yrs
                </div>

                <input 
                  type="range"
                  id="mrg-marriage-age-slider"
                  min={minMarriageAge}
                  max={maxMarriageAge}
                  step={stepMarriageAge}
                  value={marriageAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMarriageAge(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${marriageAgePct}%, #E2E8F0 ${marriageAgePct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Marriage age of child slider"
                />
                <div className="sip-slider-markers">
                  <span>18 Yrs</span>
                  <span>34 Yrs</span>
                  <span>50 Yrs</span>
                </div>
              </div>
            </div>

            <div className="sip-input-col">
              <div className="sip-input-box-wrapper">
                <input 
                  type="number"
                  id="mrg-marriage-age-input"
                  min={minMarriageAge}
                  max={maxMarriageAge}
                  step={stepMarriageAge}
                  value={marriageAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMarriageAge(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => {
                    if (marriageAge < minMarriageAge) setMarriageAge(minMarriageAge);
                    if (marriageAge > maxMarriageAge) setMarriageAge(maxMarriageAge);
                  }}
                  className="sip-number-input sip-number-input-unit"
                />
                <span className="sip-input-suffix">Yr</span>
              </div>
            </div>
          </div>

          {/* Input 3: How much expenditure is required for wedding at today's cost (₹) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-wedding-cost-input" className="sip-row-label">
                How much expenditure is required for wedding at today's cost (₹)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('weddingCost')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'weddingCost' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${costPct}% + ${(0.5 - costPct / 100) * 18}px)` }}
                >
                  {formatIndianCurrency(currentWeddingCost)}
                </div>

                <input 
                  type="range"
                  id="mrg-wedding-cost-slider"
                  min={minWeddingCost}
                  max={maxWeddingCost}
                  step={stepWeddingCost}
                  value={currentWeddingCost}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCurrentWeddingCost(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${costPct}%, #E2E8F0 ${costPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Wedding cost slider"
                />
                <div className="sip-slider-markers">
                  <span>₹1,00,000</span>
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
                  id="mrg-wedding-cost-input"
                  min={minWeddingCost}
                  max={maxWeddingCost}
                  step={stepWeddingCost}
                  value={currentWeddingCost}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxWeddingCost) {
                      setCurrentWeddingCost(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  onBlur={() => {
                    if (currentWeddingCost < minWeddingCost) setCurrentWeddingCost(minWeddingCost);
                    if (currentWeddingCost > maxWeddingCost) setCurrentWeddingCost(maxWeddingCost);
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

          {/* Input 4: How much is your Annual Savings presently (₹) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-annual-savings-input" className="sip-row-label">
                How much is your Annual Savings presently (₹)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('annualSavings')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'annualSavings' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${annualSavingsPct}% + ${(0.5 - annualSavingsPct / 100) * 18}px)` }}
                >
                  {formatIndianCurrency(annualSavings)}
                </div>

                <input 
                  type="range"
                  id="mrg-annual-savings-slider"
                  min={minAnnualSavings}
                  max={maxAnnualSavings}
                  step={stepAnnualSavings}
                  value={annualSavings}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAnnualSavings(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${annualSavingsPct}%, #E2E8F0 ${annualSavingsPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Annual savings slider"
                />
                <div className="sip-slider-markers">
                  <span>₹0</span>
                  <span>₹25,00,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>
            </div>

            <div className="sip-input-col">
              <div className="sip-input-box-wrapper">
                <span className="sip-input-prefix">₹</span>
                <input 
                  type="number"
                  id="mrg-annual-savings-input"
                  min={minAnnualSavings}
                  max={maxAnnualSavings}
                  step={stepAnnualSavings}
                  value={annualSavings}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxAnnualSavings) {
                      setAnnualSavings(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  onBlur={() => {
                    if (annualSavings < minAnnualSavings) setAnnualSavings(minAnnualSavings);
                    if (annualSavings > maxAnnualSavings) setAnnualSavings(maxAnnualSavings);
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

          {/* Input 5: How much you have already saved for child (₹) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-existing-savings-input" className="sip-row-label">
                How much you have already saved for child (₹)
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
                  {formatIndianCurrency(existingSavings)}
                </div>

                <input 
                  type="range"
                  id="mrg-existing-savings-slider"
                  min={minExistingSavings}
                  max={maxExistingSavings}
                  step={stepExistingSavings}
                  value={existingSavings}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExistingSavings(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${existingSavingsPct}%, #E2E8F0 ${existingSavingsPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Already saved for child slider"
                />
                <div className="sip-slider-markers">
                  <span>₹0</span>
                  <span>₹50,00,000</span>
                  <span>₹1,00,00,000</span>
                </div>
              </div>
            </div>

            <div className="sip-input-col">
              <div className="sip-input-box-wrapper">
                <span className="sip-input-prefix">₹</span>
                <input 
                  type="number"
                  id="mrg-existing-savings-input"
                  min={minExistingSavings}
                  max={maxExistingSavings}
                  step={stepExistingSavings}
                  value={existingSavings}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxExistingSavings) {
                      setExistingSavings(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  onBlur={() => {
                    if (existingSavings < minExistingSavings) setExistingSavings(minExistingSavings);
                    if (existingSavings > maxExistingSavings) setExistingSavings(maxExistingSavings);
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

          {/* Input 6: Expected rate of return (%) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-return-input" className="sip-row-label">
                Expected rate of return (%)
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
                  id="mrg-return-slider"
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
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${returnPct}%, #E2E8F0 ${returnPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Expected rate of return slider"
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
                  id="mrg-return-input"
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

          {/* Input 7: Expected Inflation rate (%) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="mrg-inflation-input" className="sip-row-label">
                Expected Inflation rate (%)
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
                  {expectedInflation}% p.a.
                </div>

                <input 
                  type="range"
                  id="mrg-inflation-slider"
                  min={minInflation}
                  max={maxInflation}
                  step={stepInflation}
                  value={expectedInflation}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExpectedInflation(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${inflationPct}%, #E2E8F0 ${inflationPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Expected Inflation rate slider"
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
                  id="mrg-inflation-input"
                  min={minInflation}
                  max={maxInflation}
                  step={stepInflation}
                  value={expectedInflation}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxInflation) {
                      setExpectedInflation(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  onBlur={() => {
                    if (expectedInflation < minInflation) setExpectedInflation(minInflation);
                    if (expectedInflation > maxInflation) setExpectedInflation(maxInflation);
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
            aria-label="Calculate Marriage Expense Projection"
          >
            Calculate
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
         RESULT SECTION (Rendered BELOW the Inputs on Calculate)
         Strictly 4 Clean Rows matching website design theme
         ══════════════════════════════════════════════════════════════ */}
      {hasCalculated && (
        <section 
          className="marriage-result-section" 
          ref={resultRef}
          aria-label="Marriage Financial Projection Result"
        >
          <h3 className="marriage-result-heading">
            <span className="marriage-result-heading-dot"></span>
            Result
          </h3>

          <div className="marriage-result-list">
            
            {/* Line 1 */}
            <div className="marriage-result-row">
              <span className="marriage-row-label">
                Inflation adjusted future cost of marriage of your child (Rs.)
              </span>
              <span className="marriage-row-value value-gold">
                {formatIndianCurrency(calculationData.futureMarriageCost)}
              </span>
            </div>

            {/* Line 2 */}
            <div className="marriage-result-row">
              <span className="marriage-row-label">
                Future value of your annual savings (Rs.)
              </span>
              <span className="marriage-row-value">
                {formatIndianCurrency(calculationData.futureAnnualSavings)}
              </span>
            </div>

            {/* Line 3 */}
            <div className="marriage-result-row">
              <span className="marriage-row-label">
                Your existing savings will grow to (Rs.)
              </span>
              <span className="marriage-row-value">
                {formatIndianCurrency(calculationData.futureExistingSavings)}
              </span>
            </div>

            {/* Line 4 */}
            <div className="marriage-result-row">
              <span className="marriage-row-label">
                Additional funds required to meet expenses (Rs.)
              </span>
              <span 
                className={`marriage-row-value ${
                  calculationData.hasSurplus ? 'value-surplus' : 'value-required'
                }`}
              >
                {calculationData.hasSurplus
                  ? 'Not Required. You have surplus savings.'
                  : formatIndianCurrency(calculationData.additionalFunds)}
              </span>
            </div>

          </div>

          {/* Re-Calculate Action Button */}
          <div className="marriage-recalc-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="marriage-recalc-btn"
              aria-label="Re-Calculate and adjust inputs"
            >
              Re-Calculate
            </button>
          </div>
        </section>
      )}

    </main>
  );
};

export default MarriageCalculator;
