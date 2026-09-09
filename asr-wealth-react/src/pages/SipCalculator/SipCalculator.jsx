import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './SipCalculator.css';
import StepUpSipCalculator from './StepUpSipCalculator';
import SipDelayCalculator from './SipDelayCalculator';
import EducationCalculator from './EducationCalculator';
import MarriageCalculator from './MarriageCalculator';
import RetirementCalculator from './RetirementCalculator';
import CostInflationCalculator from './CostInflationCalculator';
import EMICalculator from './EMICalculator';
import GoalPlanner from './GoalPlanner';
import LumpsumCalculator from './LumpsumCalculator';

// Indian Currency Formatter helper
const formatIndianCurrency = (amount) => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Compact Indian Currency Formatter (e.g. 1.25 L, 2.50 Cr)
const formatCompactCurrency = (amount) => {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(2)} L`;
  }
  return formatIndianCurrency(amount);
};

// Custom Chart Tooltip for Donut Breakdown
const CustomDonutTooltip = ({ active, payload, totalMaturity }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = totalMaturity || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
    return (
      <div className="sip-chart-tooltip">
        <div className="tooltip-header">
          <span className="tooltip-color-dot" style={{ backgroundColor: data.payload?.color }}></span>
          <span className="tooltip-title">{data.name}</span>
        </div>
        <p className="tooltip-value">{formatIndianCurrency(data.value)}</p>
        <p className="tooltip-sub">{percentage}% of Total Maturity</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Interactive Area Growth Chart
const CustomGrowthTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="sip-growth-tooltip">
        <div className="growth-tooltip-header">
          <span className="growth-tooltip-year-badge">Year {data.year} Milestone</span>
          <span className="growth-tooltip-multiplier">{data.wealthMultiplier}x Growth</span>
        </div>
        <div className="growth-tooltip-items">
          <div className="growth-tooltip-row">
            <span className="tooltip-color-dot bg-navy"></span>
            <span className="tooltip-label">Invested Amount:</span>
            <span className="tooltip-amt">{formatIndianCurrency(data.investedAmount)}</span>
          </div>
          <div className="growth-tooltip-row">
            <span className="tooltip-color-dot bg-yellow"></span>
            <span className="tooltip-label">Estimated Returns:</span>
            <span className="tooltip-amt text-yellow">+{formatIndianCurrency(data.estimatedReturns)}</span>
          </div>
          <div className="growth-tooltip-row row-total">
            <span className="tooltip-color-dot bg-gold"></span>
            <span className="tooltip-label">Total Maturity:</span>
            <span className="tooltip-amt text-bold">{formatIndianCurrency(data.totalMaturityValue)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const calculatorList = [
  { id: 'sip', name: 'SIP Calculator' },
  { id: 'step-up', name: 'SIP Step-Up Calculator' },
  { id: 'delay', name: 'SIP Delay Calculator' },
  { id: 'education', name: 'Education Calculator' },
  { id: 'marriage', name: 'Marriage Calculator' },
  { id: 'retirement', name: 'Retirement Calculator' },
  { id: 'inflation', name: 'Cost Inflation Calculator' },
  { id: 'emi', name: 'EMI Calculator' },
  { id: 'goal', name: 'Goal Planner' },
  { id: 'lumpsum', name: 'Lumpsum Calculator' },
];

const SipCalculator = () => {
  // Active selected calculator from sidebar
  const [activeCalculator, setActiveCalculator] = useState('sip');

  // State for the 3 input values
  const [monthlyInvestment, setMonthlyInvestment] = useState(25000);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Screen View State: false = Starting Input View (Image 2), true = Results View (Image 3 + Graph)
  const [hasCalculated, setHasCalculated] = useState(false);

  // Results View Tab: 'growth' (Graph on top, Results below) or 'breakdown' (Existing Breakdown div)
  const [chartView, setChartView] = useState('growth');

  // Hovered cursor state from the interactive growth chart
  const [hoveredPoint, setHoveredPoint] = useState(null);
  // Active inspected point from putting cursor on graph
  const [activeCursorPoint, setActiveCursorPoint] = useState(null);

  // Tooltip hover states for sliders
  const [activeSlider, setActiveSlider] = useState(null);

  // Slider Ranges
  const minInvestment = 500;
  const maxInvestment = 1000000;
  const stepInvestment = 500;

  const minYears = 1;
  const maxYears = 60;
  const stepYears = 1;

  const minReturn = 1;
  const maxReturn = 30;
  const stepReturn = 0.5;

  // SIP Future Value Formula:
  // FV = P × [((1 + r)^n - 1) / r] × (1 + r)
  const calculations = useMemo(() => {
    const P = Math.max(0, Number(monthlyInvestment) || 0);
    const years = Math.max(0, Number(investmentPeriod) || 0);
    const annualRate = Math.max(0, Number(expectedReturn) || 0);

    const n = years * 12;
    const r = annualRate / 12 / 100;

    let FV = 0;
    if (n === 0) {
      FV = 0;
    } else if (r === 0) {
      FV = P * n;
    } else {
      FV = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }

    const totalInvested = P * n;
    const totalMaturity = Math.round(FV);
    const wealthGained = Math.max(0, totalMaturity - totalInvested);
    const gainRatio = totalInvested > 0 ? ((wealthGained / totalInvested) * 100).toFixed(1) : 0;
    const wealthMultiplier = totalInvested > 0 ? (totalMaturity / totalInvested).toFixed(1) : '1.0';

    return {
      year: years,
      investedAmount: totalInvested,
      estimatedReturns: wealthGained,
      totalMaturityValue: totalMaturity,
      gainRatio,
      wealthMultiplier,
    };
  }, [monthlyInvestment, investmentPeriod, expectedReturn]);

  // Year-by-Year Compound Growth Data for Interactive Area Chart
  const yearlyGrowthData = useMemo(() => {
    const P = Math.max(0, Number(monthlyInvestment) || 0);
    const years = Math.max(1, Number(investmentPeriod) || 1);
    const annualRate = Math.max(0, Number(expectedReturn) || 0);
    const r = annualRate / 12 / 100;

    const points = [];
    for (let y = 1; y <= years; y++) {
      const n = y * 12;
      let fv = 0;
      if (r === 0) {
        fv = P * n;
      } else {
        fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      }
      const invested = P * n;
      const maturity = Math.round(fv);
      const returns = Math.max(0, maturity - invested);
      const mult = invested > 0 ? (maturity / invested).toFixed(1) : '1.0';
      const ratio = invested > 0 ? ((returns / invested) * 100).toFixed(1) : '0';

      points.push({
        year: y,
        yearLabel: `Yr ${y}`,
        investedAmount: invested,
        estimatedReturns: returns,
        totalMaturityValue: maturity,
        gainRatio: ratio,
        wealthMultiplier: mult,
      });
    }
    return points;
  }, [monthlyInvestment, investmentPeriod, expectedReturn]);

  // Donut Chart Data
  const donutChartData = useMemo(() => {
    return [
      { name: 'Invested Amount', value: calculations.investedAmount, color: '#1E293B' },
      { name: 'Wealth Gained', value: calculations.estimatedReturns, color: '#F4B400' },
    ];
  }, [calculations]);

  // Active display values: when cursor hovers on graph, show that milestone's values!
  const activeDisplay = hoveredPoint || activeCursorPoint || calculations;

  // Click calculate: switch from starting view (Image 2) to results view
  const handleCalculate = () => {
    setHasCalculated(true);
    setHoveredPoint(null);
    setActiveCursorPoint(null);
  };

  // Helper to compute percentage for range input progress background
  const getPercentage = (val, min, max) => {
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  const investmentPct = getPercentage(monthlyInvestment, minInvestment, maxInvestment);
  const periodPct = getPercentage(investmentPeriod, minYears, maxYears);
  const returnPct = getPercentage(expectedReturn, minReturn, maxReturn);

  return (
    <article className="sip-page">
      <div className="sip-page-container">

        {/* ── Header Section ── */}
        <header className="sip-header">
          <h1 className="sip-title">
            {activeCalculator === 'step-up'
              ? 'SIP Step-Up Calculator'
              : activeCalculator === 'delay'
              ? 'SIP Delay Calculator'
              : activeCalculator === 'education'
              ? 'Education Calculator'
              : activeCalculator === 'marriage'
              ? 'Marriage Calculator'
              : activeCalculator === 'retirement'
              ? 'Retirement Calculator'
              : activeCalculator === 'inflation'
              ? 'Cost Inflation Calculator'
              : activeCalculator === 'emi'
              ? 'EMI Calculator'
              : activeCalculator === 'goal'
              ? 'Goal Planner'
              : activeCalculator === 'lumpsum'
              ? 'Lumpsum Calculator'
              : 'SIP Calculator'}
          </h1>
          <div className="sip-accent-bar" aria-hidden="true"></div>
          <p className="sip-subtitle">
            {activeCalculator === 'step-up'
              ? 'Calculate how increasing your monthly investment every year supercharges your wealth creation.'
              : activeCalculator === 'delay'
              ? 'Calculate the financial impact and notional cost of delaying your monthly investments.'
              : activeCalculator === 'education'
              ? "Calculate the corpus, lumpsum, and monthly SIP required to fund your child's higher education."
              : activeCalculator === 'marriage'
              ? "Calculate the inflation-adjusted future cost and investment required for your child's marriage."
              : activeCalculator === 'retirement'
              ? 'Calculate the targeted corpus, savings accumulation, and shortfall for your dream retirement.'
              : activeCalculator === 'inflation'
              ? 'Calculate the indexed cost of acquisition and inflation-adjusted capital gain or loss using official CII data.'
              : activeCalculator === 'emi'
              ? 'Calculate your monthly loan EMI payments based on principal, interest rate, and tenure.'
              : activeCalculator === 'goal'
              ? 'Calculate the monthly investment required to reach your target financial goal.'
              : activeCalculator === 'lumpsum'
              ? 'Calculate the future value of your one-time lumpsum investment and monthly SIP.'
              : 'It tells you how much wealth you can create by making monthly investments.'}
          </p>
        </header>

        {/* ── 2-Column Section: Left Text Buttons List + Right Shifted SIP Card ── */}
        <div className="sip-calculator-layout">
          {/* Left Column: Pure Text Calculator Buttons (no bulky divs) */}
          <aside className="calc-sidebar-nav" aria-label="Financial Calculators">
            <nav className="calc-text-list">
              {calculatorList.map((calc) => (
                <button
                  key={calc.id}
                  type="button"
                  className={`calc-text-btn ${activeCalculator === calc.id ? 'active' : ''}`}
                  onClick={() => setActiveCalculator(calc.id)}
                >
                  {calc.name}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Column: Shifted SIP Calculator Card Container (Size decreased, shifted right) */}
          <div className="sip-calc-content-col">
            {activeCalculator === 'step-up' ? (
              <StepUpSipCalculator />
            ) : activeCalculator === 'delay' ? (
              <SipDelayCalculator />
            ) : activeCalculator === 'education' ? (
              <EducationCalculator />
            ) : activeCalculator === 'marriage' ? (
              <MarriageCalculator />
            ) : activeCalculator === 'retirement' ? (
              <RetirementCalculator />
            ) : activeCalculator === 'inflation' ? (
              <CostInflationCalculator />
            ) : activeCalculator === 'emi' ? (
              <EMICalculator />
            ) : activeCalculator === 'goal' ? (
              <GoalPlanner />
            ) : activeCalculator === 'lumpsum' ? (
              <LumpsumCalculator />
            ) : (
              <main className="sip-card" aria-label="SIP Calculator">

          {!hasCalculated ? (
            /* ══════════════════════════════════════════════════════════════
               1. STARTING VIEW (Matches 2nd Image)
               Only the 3 input rows and the Calculate button appear
               ══════════════════════════════════════════════════════════════ */
            <div className="sip-starting-view">
              
              <div className="sip-inputs-wrapper">

                {/* Row 1 — Monthly Investment */}
                <div className="sip-input-row">
                  <div className="sip-label-col">
                    <label htmlFor="sip-monthly-input" className="sip-row-label">
                      Monthly Investment (₹)
                    </label>
                  </div>

                  <div className="sip-slider-col">
                    <div 
                      className="sip-slider-container"
                      onMouseEnter={() => setActiveSlider('investment')}
                      onMouseLeave={() => setActiveSlider(null)}
                    >
                      <div 
                        className={`sip-slider-tooltip ${activeSlider === 'investment' ? 'is-visible' : ''}`}
                        style={{ left: `calc(${investmentPct}% + ${(0.5 - investmentPct / 100) * 18}px)` }}
                      >
                        {formatIndianCurrency(monthlyInvestment)}
                      </div>

                      <input 
                        type="range"
                        id="sip-monthly-slider"
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
                        id="sip-monthly-input"
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

                {/* Row 2 — Investment Period */}
                <div className="sip-input-row">
                  <div className="sip-label-col">
                    <label htmlFor="sip-period-input" className="sip-row-label">
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
                        {investmentPeriod} {investmentPeriod === 1 ? 'Year' : 'Years'}
                      </div>

                      <input 
                        type="range"
                        id="sip-period-slider"
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
                        id="sip-period-input"
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

                {/* Row 3 — Expected Return */}
                <div className="sip-input-row">
                  <div className="sip-label-col">
                    <label htmlFor="sip-return-input" className="sip-row-label">
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
                        id="sip-return-slider"
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
                        id="sip-return-input"
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
                  aria-label="Calculate SIP Projection"
                >
                  Calculate
                </button>
              </div>

            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════
               2. RESULTS VIEW (Starting div is NOT added here)
               Shows Graph at top, Results below, and Breakdown toggle
               ══════════════════════════════════════════════════════════════ */
            <div className="sip-results-screen">

              {/* Top Navigation Bar in Result Screen */}
              <div className="sip-results-top-nav">
                <button 
                  type="button"
                  onClick={() => { setHasCalculated(false); setHoveredPoint(null); }}
                  className="sip-back-btn"
                  aria-label="Back to Calculator Inputs"
                >
                  ← Edit Inputs
                </button>

                <div className="sip-chart-tabs" role="tablist" aria-label="View Modes">
                  <button 
                    type="button"
                    role="tab"
                    aria-selected={chartView === 'growth'}
                    className={`sip-tab-btn ${chartView === 'growth' ? 'tab-active' : ''}`}
                    onClick={() => setChartView('growth')}
                  >
                    Growth Graph
                  </button>
                  <button 
                    type="button"
                    role="tab"
                    aria-selected={chartView === 'breakdown'}
                    className={`sip-tab-btn ${chartView === 'breakdown' ? 'tab-active' : ''}`}
                    onClick={() => setChartView('breakdown')}
                  >
                    Breakdown
                  </button>
                </div>
              </div>

              {/* ── 1. GRAPH APPEARS FIRST AT TOP ── */}
              {chartView === 'growth' ? (
                <section className="sip-graph-view-top" aria-label="Growth Graph">
                  
                  <div className="sip-growth-header-row">
                    <div className="sip-growth-titles">
                      <h3 className="sip-growth-heading">Wealth Growth Trajectory</h3>
                      <p className="sip-growth-sub">
                        Move your cursor across the graph to update results dynamically.
                      </p>
                    </div>

                    <div className="sip-growth-chart-legend">
                      <div className="growth-legend-item">
                        <span className="growth-legend-swatch swatch-yellow"></span>
                        <span className="growth-legend-text">Total Wealth (Compounded)</span>
                      </div>
                      <div className="growth-legend-item">
                        <span className="growth-legend-swatch swatch-navy"></span>
                        <span className="growth-legend-text">Invested Capital</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Growth Area Chart */}
                  <div className="sip-area-chart-container">
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart
                        data={yearlyGrowthData}
                        margin={{ top: 20, right: 20, left: 10, bottom: 8 }}
                        onMouseMove={(state) => {
                          if (state && state.activePayload && state.activePayload.length) {
                            const pt = state.activePayload[0].payload;
                            setHoveredPoint(pt);
                            setActiveCursorPoint(pt);
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredPoint(null);
                        }}
                      >
                        <defs>
                          <linearGradient id="totalGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F4B400" stopOpacity={0.48} />
                            <stop offset="95%" stopColor="#F4B400" stopOpacity={0.03} />
                          </linearGradient>
                          <linearGradient id="investedGrowthGradient" x1="0" y1="0" x2="0" y2="1">
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
                        
                        <Area
                          type="monotone"
                          dataKey="totalMaturityValue"
                          name="Total Maturity Value"
                          stroke="#F4B400"
                          strokeWidth={3.5}
                          fillOpacity={1}
                          fill="url(#totalGrowthGradient)"
                          activeDot={{ r: 6.5, fill: '#F4B400', stroke: '#ffffff', strokeWidth: 2.5 }}
                        />

                        <Area
                          type="monotone"
                          dataKey="investedAmount"
                          name="Invested Amount"
                          stroke="#1E293B"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#investedGrowthGradient)"
                          activeDot={{ r: 5.5, fill: '#1E293B', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                </section>
              ) : (
                /* ── Existing Breakdown Div (when user clicks Breakdown) ── */
                <section className="sip-breakdown-view-top" aria-label="Asset Breakdown">
                  <div className="sip-breakdown-grid">
                    <div className="sip-donut-container">
                      <div className="sip-donut-wrapper">
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Pie
                              data={donutChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={72}
                              outerRadius={104}
                              paddingAngle={3}
                              dataKey="value"
                              stroke="none"
                              animationDuration={600}
                            >
                              {donutChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomDonutTooltip totalMaturity={calculations.totalMaturityValue} />} />
                          </PieChart>
                        </ResponsiveContainer>

                        <div className="sip-donut-center-metric">
                          <span className="center-metric-label">Multiplier</span>
                          <span className="center-metric-value">{calculations.wealthMultiplier}x</span>
                          <span className="center-metric-sub">Wealth Growth</span>
                        </div>
                      </div>
                    </div>

                    <div className="sip-chart-insights">
                      <h4 className="sip-insights-title">Wealth Distribution</h4>

                      <div className="sip-legend-item">
                        <div className="sip-legend-row">
                          <span className="sip-legend-dot bg-navy"></span>
                          <span className="sip-legend-name">Invested Amount</span>
                          <span className="sip-legend-val">{formatIndianCurrency(calculations.investedAmount)}</span>
                        </div>
                        <div className="sip-legend-bar-track">
                          <div 
                            className="sip-legend-bar-fill bg-navy"
                            style={{ 
                              width: `${calculations.totalMaturityValue > 0 ? (calculations.investedAmount / calculations.totalMaturityValue) * 100 : 50}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="sip-legend-item">
                        <div className="sip-legend-row">
                          <span className="sip-legend-dot bg-yellow"></span>
                          <span className="sip-legend-name">Wealth Gained (Returns)</span>
                          <span className="sip-legend-val">{formatIndianCurrency(calculations.estimatedReturns)}</span>
                        </div>
                        <div className="sip-legend-bar-track">
                          <div 
                            className="sip-legend-bar-fill bg-yellow"
                            style={{ 
                              width: `${calculations.totalMaturityValue > 0 ? (calculations.estimatedReturns / calculations.totalMaturityValue) * 100 : 50}%` 
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="sip-insights-callout">
                        <p>
                          Total Wealth Multiplier: <strong>{calculations.wealthMultiplier}x</strong> over <strong>{investmentPeriod} years</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ── 2. BELOW THAT: RESULTS SECTION ── */}
              <section className="sip-results-bottom-section" aria-label="Results">
                
                {/* ── 3 DIVS WHEN CURSOR IS PUT ON GRAPH (Matching User Screenshot) ── */}
                {activeCursorPoint && (
                  <div className="sip-cursor-kpis-container animate-fade-in">
                    <div className="sip-cursor-kpis-header">
                      <div className="kpis-header-left">
                        <span className={`kpis-pulse-dot ${hoveredPoint ? 'pulse-live' : 'pulse-paused'}`}></span>
                        <span className="kpis-header-title">
                          {hoveredPoint 
                            ? `Year ${hoveredPoint.year} Milestone Projection (Live Cursor)` 
                            : `Year ${activeCursorPoint.year} Milestone Projection (Inspected)`}
                        </span>
                      </div>
                      <div className="kpis-header-actions">
                        <span className="kpis-hint-text">
                          {hoveredPoint ? 'Scrub cursor along graph to update' : 'Move cursor on graph to inspect other years'}
                        </span>
                        {!hoveredPoint && (
                          <button 
                            type="button" 
                            onClick={() => setActiveCursorPoint(null)}
                            className="kpis-reset-btn"
                            title="Hide milestone cards"
                          >
                            Hide Cards ×
                          </button>
                        )}
                      </div>
                    </div>

                    {/* The 3 Divs from user screenshot */}
                    <div className="sip-kpi-cards-grid">
                      {/* Div 1: Invested Amount */}
                      <div className={`sip-kpi-card ${hoveredPoint ? 'kpi-card-hovered' : ''}`}>
                        <div className="sip-kpi-card-header">
                          <span className="sip-kpi-dot bg-navy"></span>
                          <span className="sip-kpi-label">Invested Amount</span>
                        </div>
                        <div className="sip-kpi-amount">{formatIndianCurrency(activeDisplay.investedAmount)}</div>
                        <div className="sip-kpi-subtext">{formatCompactCurrency(activeDisplay.investedAmount)}</div>
                      </div>

                      {/* Div 2: Estimated Returns */}
                      <div className={`sip-kpi-card ${hoveredPoint ? 'kpi-card-hovered' : ''}`}>
                        <div className="sip-kpi-card-header">
                          <span className="sip-kpi-dot bg-yellow"></span>
                          <span className="sip-kpi-label">Estimated Returns</span>
                        </div>
                        <div className="sip-kpi-amount text-yellow-amount">
                          {formatIndianCurrency(activeDisplay.estimatedReturns)}
                        </div>
                        <div className="sip-kpi-subtext">
                          {formatCompactCurrency(activeDisplay.estimatedReturns)} (+{activeDisplay.gainRatio}%)
                        </div>
                      </div>

                      {/* Div 3: Total Maturity Value */}
                      <div className={`sip-kpi-card card-total-value-border ${hoveredPoint ? 'kpi-card-hovered-gold' : ''}`}>
                        <div className="sip-kpi-card-header">
                          <span className="sip-kpi-badge">
                            {activeDisplay.year === investmentPeriod ? 'TOTAL VALUE' : `YEAR ${activeDisplay.year}`}
                          </span>
                          <span className="sip-kpi-label">Total Maturity Value</span>
                        </div>
                        <div className="sip-kpi-amount text-total-amount">
                          {formatIndianCurrency(activeDisplay.totalMaturityValue)}
                        </div>
                        <div className="sip-kpi-subtext">
                          {formatCompactCurrency(activeDisplay.totalMaturityValue)} ({activeDisplay.wealthMultiplier}x Growth)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enlarged, Comprehensive Text Results Block */}
                <div className="sip-results-text-card">
                  
                  {/* Primary Large Headline */}
                  <h3 className="sip-text-main-headline">
                    Total Estimated Value:{' '}
                    <span className="sip-text-highlight-yellow">
                      {formatIndianCurrency(activeDisplay.totalMaturityValue)}
                    </span>
                    <span className="sip-text-compact-pill">
                      ({formatCompactCurrency(activeDisplay.totalMaturityValue)})
                    </span>
                  </h3>

                  {/* Comprehensive Narrative Paragraph */}
                  <p className="sip-text-narrative">
                    By investing <strong className="text-dark">{formatIndianCurrency(monthlyInvestment)}</strong> per month for <strong className="text-dark">{activeDisplay.year} {activeDisplay.year === 1 ? 'year' : 'years'}</strong> at an expected return of <strong className="text-dark">{expectedReturn}% p.a.</strong>, your total capital invested is <strong className="text-dark">{formatIndianCurrency(activeDisplay.investedAmount)}</strong>. Your portfolio is projected to generate <strong className="text-yellow-bold">{formatIndianCurrency(activeDisplay.estimatedReturns)}</strong> in compound returns (+{activeDisplay.gainRatio}% return), multiplying your invested wealth by <strong className="text-dark">{activeDisplay.wealthMultiplier}x</strong>.
                  </p>

                  {/* Clear Clean Text Breakdown Line */}
                  <div className="sip-text-breakdown-row">
                    <div className="sip-text-metric-item">
                      <span className="metric-dot bg-navy"></span>
                      <span className="metric-label">Invested Capital:</span>
                      <span className="metric-val">{formatIndianCurrency(activeDisplay.investedAmount)}</span>
                    </div>

                    <span className="sip-text-metric-separator">•</span>

                    <div className="sip-text-metric-item">
                      <span className="metric-dot bg-yellow"></span>
                      <span className="metric-label">Wealth Gained:</span>
                      <span className="metric-val text-yellow-bold">+{formatIndianCurrency(activeDisplay.estimatedReturns)}</span>
                    </div>

                    <span className="sip-text-metric-separator">•</span>

                    <div className="sip-text-metric-item">
                      <span className="metric-dot bg-gold"></span>
                      <span className="metric-label">Total Maturity:</span>
                      <span className="metric-val text-dark-bold">{formatIndianCurrency(activeDisplay.totalMaturityValue)}</span>
                    </div>
                  </div>

                </div>

              </section>

            </div>
          )}

        </main>
            )}
          </div>
        </div>

      </div>
    </article>
  );
};

export default SipCalculator;
