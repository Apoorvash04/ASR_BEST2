import React, { useState, useMemo, useRef } from 'react';
import './EducationCalculator.css';

// Indian Currency Formatter helper
export const formatIndianCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

export interface EducationCalculatorProps {
  onRecalculate?: () => void;
}

export const EducationCalculator: React.FC<EducationCalculatorProps> = () => {
  // Input 1: Child's age today (Years) - Default: 8
  const [childAge, setChildAge] = useState<number>(8);

  // Input 2: Join College at age (Years) - Default: 18
  const [joinCollegeAge, setJoinCollegeAge] = useState<number>(18);

  // Input 3: Duration of education (Years) - Default: 5
  const [educationDuration, setEducationDuration] = useState<number>(5);

  // Input 4: Approx Current Cost per year (₹) - Default: 2,00,000
  const [currentAnnualCost, setCurrentAnnualCost] = useState<number>(200000);

  // Input 5: Any savings for Education already done? (₹) - Default: 0
  const [existingSavings, setExistingSavings] = useState<number>(0);

  // Input 6: Expected rate of return (%) - Default: 12%
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  // Input 7: Expected Inflation rate (%) - Default: 6%
  const [expectedInflation, setExpectedInflation] = useState<number>(6);

  // Result display state: false initially, true after clicking Calculate
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Validation Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Slider Tooltip State
  const [activeSlider, setActiveSlider] = useState<string | null>(null);

  // DOM Refs
  const resultRef = useRef<HTMLDivElement | null>(null);
  const inputsTopRef = useRef<HTMLDivElement | null>(null);

  // Input Ranges
  const minChildAge = 0;
  const maxChildAge = 25;
  const stepChildAge = 1;

  const minCollegeAge = 1;
  const maxCollegeAge = 30;
  const stepCollegeAge = 1;

  const minDuration = 1;
  const maxDuration = 10;
  const stepDuration = 1;

  const minCost = 10000;
  const maxCost = 5000000;
  const stepCost = 10000;

  const minSavings = 0;
  const maxSavings = 5000000;
  const stepSavings = 10000;

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
  const collegeAgePct = getPercentage(joinCollegeAge, minCollegeAge, maxCollegeAge);
  const durationPct = getPercentage(educationDuration, minDuration, maxDuration);
  const costPct = getPercentage(currentAnnualCost, minCost, maxCost);
  const savingsPct = getPercentage(existingSavings, minSavings, maxSavings);
  const returnPct = getPercentage(expectedReturn, minReturn, maxReturn);
  const inflationPct = getPercentage(expectedInflation, minInflation, maxInflation);

  // ══════════════════════════════════════════════════════════════
  // EDUCATION CALCULATOR FORMULAS
  // ══════════════════════════════════════════════════════════════
  const calculationData = useMemo(() => {
    const collegeYears = Math.max(0, joinCollegeAge - childAge);
    const inflationRate = Math.max(0, expectedInflation) / 100;
    const returnRate = Math.max(0, expectedReturn) / 100;
    const cost = Math.max(0, currentAnnualCost);
    const savings = Math.max(0, existingSavings);
    const duration = Math.max(1, educationDuration);

    // 1. Corpus Required at start of College
    let corpusRequired = 0;
    if (inflationRate === 0) {
      corpusRequired = cost * duration;
    } else {
      corpusRequired =
        cost *
        Math.pow(1 + inflationRate, collegeYears) *
        ((Math.pow(1 + inflationRate, duration) - 1) / inflationRate);
    }

    // 2. Existing Savings will grow to:
    const existingSavingsAtCollege = savings * Math.pow(1 + returnRate, collegeYears);

    // 3. Shortfall:
    const shortfall = Math.max(0, corpusRequired - existingSavingsAtCollege);

    // 4. Lumpsum Required Today:
    let lumpsumRequired = 0;
    if (returnRate === 0 || collegeYears === 0) {
      lumpsumRequired = shortfall;
    } else {
      lumpsumRequired = shortfall / Math.pow(1 + returnRate, collegeYears);
    }

    // 5. Monthly SIP Required:
    const monthlyRate = Math.pow(1 + returnRate, 1 / 12) - 1;
    const months = collegeYears * 12;

    let monthlySip = 0;
    if (shortfall === 0 || months <= 0) {
      monthlySip = 0;
    } else if (returnRate === 0) {
      monthlySip = shortfall / months;
    } else {
      // Annuity due formula:
      // monthlySip = (shortfall * monthlyRate) / (((1 + monthlyRate)^months - 1) * (1 + monthlyRate))
      monthlySip =
        (shortfall * monthlyRate) /
        ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
    }

    return {
      collegeYears,
      corpusRequired: Math.round(corpusRequired),
      existingSavingsAtCollege: Math.round(existingSavingsAtCollege),
      shortfall: Math.round(shortfall),
      lumpsumRequired: Math.round(lumpsumRequired),
      monthlySip: Math.round(monthlySip),
    };
  }, [
    childAge,
    joinCollegeAge,
    educationDuration,
    currentAnnualCost,
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
    if (joinCollegeAge <= childAge) {
      setErrorMessage("College admission age must be greater than child's current age.");
      return;
    }
    if (educationDuration <= 0) {
      setErrorMessage("Education duration must be at least 1 year.");
      return;
    }
    if (currentAnnualCost < 0) {
      setErrorMessage("Current annual education cost cannot be negative.");
      return;
    }
    if (existingSavings < 0) {
      setErrorMessage("Existing savings cannot be negative.");
      return;
    }
    if (expectedReturn < 0) {
      setErrorMessage("Expected rate of return cannot be negative.");
      return;
    }
    if (expectedInflation < 0) {
      setErrorMessage("Expected inflation rate cannot be negative.");
      return;
    }

    setErrorMessage(null);
    setHasCalculated(true);

    // Smooth scroll down to result section after rendering
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  // Handle Re-Calculate Click: Keeps existing values, focuses back on inputs
  const handleRecalculate = () => {
    // Keep values, scroll up smoothly to the inputs to adjust parameters
    inputsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="sip-card education-card" aria-label="Education Calculator">
      
      {/* ══════════════════════════════════════════════════════════════
         INPUT SECTION (Always Remains Visible)
         ══════════════════════════════════════════════════════════════ */}
      <div className="sip-starting-view" ref={inputsTopRef}>
        
        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="education-error-banner" role="alert">
            <span className="education-error-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="sip-inputs-wrapper">

          {/* Input 1: Child's age today (Years) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="edu-child-age-input" className="sip-row-label">
                Child's age today (Years)
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
                  id="edu-child-age-slider"
                  min={minChildAge}
                  max={maxChildAge}
                  step={stepChildAge}
                  value={childAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setChildAge(val);
                    if (errorMessage) setErrorMessage(null);
                    if (val >= joinCollegeAge) {
                      setJoinCollegeAge(val + 1);
                    }
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${childAgePct}%, #E2E8F0 ${childAgePct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Child's age today slider"
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
                  id="edu-child-age-input"
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

          {/* Input 2: Join College at age (Years) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="edu-college-age-input" className="sip-row-label">
                Join College at age (Years)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('collegeAge')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'collegeAge' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${collegeAgePct}% + ${(0.5 - collegeAgePct / 100) * 18}px)` }}
                >
                  {joinCollegeAge} Yrs
                </div>

                <input 
                  type="range"
                  id="edu-college-age-slider"
                  min={minCollegeAge}
                  max={maxCollegeAge}
                  step={stepCollegeAge}
                  value={joinCollegeAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setJoinCollegeAge(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${collegeAgePct}%, #E2E8F0 ${collegeAgePct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Join College at age slider"
                />
                <div className="sip-slider-markers">
                  <span>1 Yr</span>
                  <span>18 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>
            </div>

            <div className="sip-input-col">
              <div className="sip-input-box-wrapper">
                <input 
                  type="number"
                  id="edu-college-age-input"
                  min={minCollegeAge}
                  max={maxCollegeAge}
                  step={stepCollegeAge}
                  value={joinCollegeAge}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setJoinCollegeAge(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => {
                    if (joinCollegeAge < minCollegeAge) setJoinCollegeAge(minCollegeAge);
                    if (joinCollegeAge > maxCollegeAge) setJoinCollegeAge(maxCollegeAge);
                  }}
                  className="sip-number-input sip-number-input-unit"
                />
                <span className="sip-input-suffix">Yr</span>
              </div>
            </div>
          </div>

          {/* Input 3: Duration of education (Years) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="edu-duration-input" className="sip-row-label">
                Duration of education (Years)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('duration')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'duration' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${durationPct}% + ${(0.5 - durationPct / 100) * 18}px)` }}
                >
                  {educationDuration} {educationDuration === 1 ? 'Year' : 'Years'}
                </div>

                <input 
                  type="range"
                  id="edu-duration-slider"
                  min={minDuration}
                  max={maxDuration}
                  step={stepDuration}
                  value={educationDuration}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEducationDuration(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${durationPct}%, #E2E8F0 ${durationPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Duration of education slider"
                />
                <div className="sip-slider-markers">
                  <span>1 Yr</span>
                  <span>5 Yrs</span>
                  <span>10 Yrs</span>
                </div>
              </div>
            </div>

            <div className="sip-input-col">
              <div className="sip-input-box-wrapper">
                <input 
                  type="number"
                  id="edu-duration-input"
                  min={minDuration}
                  max={maxDuration}
                  step={stepDuration}
                  value={educationDuration}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEducationDuration(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => {
                    if (educationDuration < minDuration) setEducationDuration(minDuration);
                    if (educationDuration > maxDuration) setEducationDuration(maxDuration);
                  }}
                  className="sip-number-input sip-number-input-unit"
                />
                <span className="sip-input-suffix">Yr</span>
              </div>
            </div>
          </div>

          {/* Input 4: Approx Current Cost per year (₹) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="edu-cost-input" className="sip-row-label">
                Approx Current Cost per year (₹)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('cost')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'cost' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${costPct}% + ${(0.5 - costPct / 100) * 18}px)` }}
                >
                  {formatIndianCurrency(currentAnnualCost)}
                </div>

                <input 
                  type="range"
                  id="edu-cost-slider"
                  min={minCost}
                  max={maxCost}
                  step={stepCost}
                  value={currentAnnualCost}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCurrentAnnualCost(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${costPct}%, #E2E8F0 ${costPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Current cost per year slider"
                />
                <div className="sip-slider-markers">
                  <span>₹10,000</span>
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
                  id="edu-cost-input"
                  min={minCost}
                  max={maxCost}
                  step={stepCost}
                  value={currentAnnualCost}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxCost) {
                      setCurrentAnnualCost(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  onBlur={() => {
                    if (currentAnnualCost < minCost) setCurrentAnnualCost(minCost);
                    if (currentAnnualCost > maxCost) setCurrentAnnualCost(maxCost);
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

          {/* Input 5: Any savings for Education already done? (₹) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="edu-savings-input" className="sip-row-label">
                Any savings for Education already done? (₹)
              </label>
            </div>

            <div className="sip-slider-col">
              <div 
                className="sip-slider-container"
                onMouseEnter={() => setActiveSlider('savings')}
                onMouseLeave={() => setActiveSlider(null)}
              >
                <div 
                  className={`sip-slider-tooltip ${activeSlider === 'savings' ? 'is-visible' : ''}`}
                  style={{ left: `calc(${savingsPct}% + ${(0.5 - savingsPct / 100) * 18}px)` }}
                >
                  {formatIndianCurrency(existingSavings)}
                </div>

                <input 
                  type="range"
                  id="edu-savings-slider"
                  min={minSavings}
                  max={maxSavings}
                  step={stepSavings}
                  value={existingSavings}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setExistingSavings(val);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="sip-range-slider"
                  style={{
                    background: `linear-gradient(to right, #F4B400 0%, #F4B400 ${savingsPct}%, #E2E8F0 ${savingsPct}%, #E2E8F0 100%)`
                  }}
                  aria-label="Existing savings slider"
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
                  id="edu-savings-input"
                  min={minSavings}
                  max={maxSavings}
                  step={stepSavings}
                  value={existingSavings}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= maxSavings) {
                      setExistingSavings(val);
                      if (errorMessage) setErrorMessage(null);
                    }
                  }}
                  onBlur={() => {
                    if (existingSavings < minSavings) setExistingSavings(minSavings);
                    if (existingSavings > maxSavings) setExistingSavings(maxSavings);
                  }}
                  className="sip-number-input"
                />
              </div>
            </div>
          </div>

          {/* Input 6: Expected rate of return (%) */}
          <div className="sip-input-row">
            <div className="sip-label-col">
              <label htmlFor="edu-return-input" className="sip-row-label">
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
                  id="edu-return-slider"
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
                  id="edu-return-input"
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
              <label htmlFor="edu-inflation-input" className="sip-row-label">
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
                  id="edu-inflation-slider"
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
                  id="edu-inflation-input"
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
            aria-label="Calculate Education Corpus"
          >
            Calculate
          </button>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
         RESULT SECTION (Rendered BELOW the Inputs after Calculate)
         Strictly text/paragraph presentation, no cards, no tables.
         ══════════════════════════════════════════════════════════════ */}
      {hasCalculated && (
        <section 
          className="education-result-section" 
          ref={resultRef}
          aria-label="Education Financial Plan Results"
        >
          <h3 className="education-result-heading">
            <span className="education-result-heading-dot"></span>
            Result
          </h3>

          <div className="education-result-box">
            <p className="education-result-p">
              Corpus Required at start of College:{' '}
              <span className="education-highlight-val">{formatIndianCurrency(calculationData.corpusRequired)}</span>.
            </p>

            <p className="education-result-p">
              Your existing savings will grow to{' '}
              <span className="education-highlight-val">{formatIndianCurrency(calculationData.existingSavingsAtCollege)}</span> by the time your child starts college.
            </p>

            <p className="education-result-p">
              Shortfall to be covered:{' '}
              <span className="education-highlight-gold">{formatIndianCurrency(calculationData.shortfall)}</span>.
            </p>

            <p className="education-result-p">
              To meet this goal, you need to invest approximately{' '}
              <span className="education-highlight-lumpsum">{formatIndianCurrency(calculationData.lumpsumRequired)}</span> as a lumpsum amount today or{' '}
              <span className="education-highlight-sip">{formatIndianCurrency(calculationData.monthlySip)}</span> every month through a SIP.
            </p>
          </div>

          {/* Re-Calculate Action Button */}
          <div className="education-recalc-action">
            <button
              type="button"
              onClick={handleRecalculate}
              className="education-recalc-btn"
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

export default EducationCalculator;
