import React, { useState, useMemo } from 'react';
import {
  amcList,
  categoryList,
  schemeList,
  currentNFOsData,
  mfActivityData,
  recentDividendsData,
} from './mfToolsData';
import './MfTools.css';

// Indian currency formatter
const formatIndianCurrency = (amount) => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

const mfToolsNav = [
  { id: 'past-sip', label: 'Past SIP Performance' },
  { id: 'latest-nav', label: 'Latest NAV' },
  { id: 'nfos', label: 'Current NFOs' },
  { id: 'factsheets', label: 'Fund Factsheets' },
  { id: 'mf-perf', label: 'MF Performance' },
  { id: 'scheme-comparison', label: 'Scheme Comparison' },
  { id: 'mf-activity', label: 'MF Activity' },
  { id: 'dividends', label: 'Recent Announced Dividends' },
  { id: 'swp-perf', label: 'SWP Performance' },
];

const MfTools = () => {
  // Selected Tool from Left Sidebar (default: 'past-sip' matching screenshot)
  const [activeTool, setActiveTool] = useState('past-sip');

  // ── 1. Past SIP Performance State ──
  const [selectedAmc, setSelectedAmc] = useState('HDFC Mutual Fund');
  const [selectedCategory, setSelectedCategory] = useState('Large Cap Fund');
  const [selectedSchemeId, setSelectedSchemeId] = useState('hdfc-top-100');
  const [installmentAmount, setInstallmentAmount] = useState(5000);
  const [sipDate, setSipDate] = useState('01');
  const [fromDate, setFromDate] = useState('2021-09-01');
  const [toDate, setToDate] = useState('2026-09-01');
  const [sipCalculated, setSipCalculated] = useState(false);
  const [sipError, setSipError] = useState(null);

  // ── 2. Latest NAV State ──
  const [navSearch, setNavSearch] = useState('');
  const [navCategoryFilter, setNavCategoryFilter] = useState('All');

  // ── 4. Fund Factsheets State ──
  const [factsheetSchemeId, setFactsheetSchemeId] = useState('hdfc-top-100');

  // ── 5. MF Performance State ──
  const [perfCategory, setPerfCategory] = useState('Large Cap Fund');
  const [perfPeriod, setPerfPeriod] = useState('3Y');

  // ── 6. Scheme Comparison State ──
  const [compareScheme1Id, setCompareScheme1Id] = useState('hdfc-top-100');
  const [compareScheme2Id, setCompareScheme2Id] = useState('sbi-bluechip');

  // ── 9. SWP Performance State ──
  const [swpInitialAmount, setSwpInitialAmount] = useState(1000000);
  const [swpMonthlyWithdrawal, setSwpMonthlyWithdrawal] = useState(8000);
  const [swpReturnRate, setSwpReturnRate] = useState(9.5);
  const [swpTenureYears, setSwpTenureYears] = useState(5);
  const [swpCalculated, setSwpCalculated] = useState(false);

  // Dynamic filtered schemes for Past SIP
  const filteredSchemes = useMemo(() => {
    return schemeList.filter((s) => {
      const matchAmc = !selectedAmc || selectedAmc === 'Select' || s.amc === selectedAmc;
      const matchCat = !selectedCategory || selectedCategory === '--' || s.category === selectedCategory;
      return matchAmc && matchCat;
    });
  }, [selectedAmc, selectedCategory]);

  // Selected scheme detail for Past SIP
  const currentScheme = useMemo(() => {
    return (
      schemeList.find((s) => s.id === selectedSchemeId) ||
      filteredSchemes[0] ||
      schemeList[0]
    );
  }, [selectedSchemeId, filteredSchemes]);

  // Calculate Past SIP Returns
  const sipResults = useMemo(() => {
    if (!sipCalculated) return null;

    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffYears = Math.max(0.5, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    const totalMonths = Math.max(1, Math.round(diffYears * 12));

    const pmt = Number(installmentAmount) || 0;
    const totalInvested = pmt * totalMonths;

    // Use scheme's 3Y or 5Y historical CAGR as base rate
    const cagr = diffYears >= 4 ? currentScheme.cagr5Y : currentScheme.cagr3Y;
    const r = cagr / (12 * 100);
    const n = totalMonths;

    const futureValue = r > 0 ? pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : totalInvested;
    const profit = Math.max(0, futureValue - totalInvested);
    const absoluteReturn = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    // Milestones
    const milestones = [];
    const step = Math.max(1, Math.floor(diffYears));
    for (let y = 1; y <= step; y++) {
      const mn = y * 12;
      const inv = pmt * mn;
      const val = r > 0 ? pmt * ((Math.pow(1 + r, mn) - 1) / r) * (1 + r) : inv;
      milestones.push({
        year: `Year ${y}`,
        invested: Math.round(inv),
        currentValue: Math.round(val),
        gain: Math.round(Math.max(0, val - inv)),
      });
    }

    return {
      totalMonths,
      totalInvested: Math.round(totalInvested),
      currentValue: Math.round(futureValue),
      profit: Math.round(profit),
      absoluteReturn: absoluteReturn.toFixed(1),
      cagr: cagr.toFixed(1),
      milestones,
    };
  }, [sipCalculated, fromDate, toDate, installmentAmount, currentScheme]);

  const handleCalculateSip = () => {
    if (installmentAmount <= 0) {
      setSipError('Please enter an installment amount greater than 0.');
      return;
    }
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (start >= end) {
      setSipError('From Date must be before To Date.');
      return;
    }

    setSipError(null);
    setSipCalculated(true);
  };

  // SWP Calculation
  const swpResults = useMemo(() => {
    const P = Number(swpInitialAmount) || 0;
    const W = Number(swpMonthlyWithdrawal) || 0;
    const annualRate = Number(swpReturnRate) || 0;
    const r = annualRate / (12 * 100);
    const totalMonths = (Number(swpTenureYears) || 1) * 12;

    let balance = P;
    let totalWithdrawn = 0;

    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + r) - W;
      totalWithdrawn += W;
      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    return {
      totalInvested: P,
      totalWithdrawn,
      remainingCorpus: Math.round(balance),
      totalValue: Math.round(totalWithdrawn + balance),
      netGain: Math.round(totalWithdrawn + balance - P),
    };
  }, [swpInitialAmount, swpMonthlyWithdrawal, swpReturnRate, swpTenureYears]);

  // Active Tool Title
  const activeToolObj = mfToolsNav.find((t) => t.id === activeTool) || mfToolsNav[0];

  return (
    <article className="mf-tools-page">
      <div className="mf-tools-container">
        {/* ── Top Header Section Matching Screenshot ── */}
        <header className="mf-header-centered">
          <h1 className="mf-header-title">{activeToolObj.label}</h1>
          <div className="mf-accent-bar" aria-hidden="true"></div>
        </header>

        {/* ── 2-Column Layout: Sidebar Left + Content Right ── */}
        <div className="mf-portal-layout">
          {/* ── Left Sidebar Navigation (Dark buttons matching screenshot) ── */}
          <aside className="mf-sidebar-nav" aria-label="MF Tools Navigation">
            <h2 className="mf-sidebar-title">MF Tools</h2>
            <nav className="mf-sidebar-list">
              {mfToolsNav.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    className={`mf-sidebar-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTool(tool.id);
                      setSipCalculated(false);
                      setSipError(null);
                    }}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ── Right Content Area ── */}
          <main className="mf-content-col" aria-label={activeToolObj.label}>
            {/* ══════════════════════════════════════════════════════════════
               TOOL 1: PAST SIP PERFORMANCE (Matches User Screenshot)
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'past-sip' && (
              <div className="mf-tool-card">
                {!sipCalculated ? (
                  <form
                    className="mf-form-grid"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCalculateSip();
                    }}
                  >
                    {sipError && (
                      <div className="mf-error-banner" role="alert">
                        <span className="mf-error-icon">⚠️</span>
                        <span>{sipError}</span>
                      </div>
                    )}

                    {/* Row 1: AMC */}
                    <div className="mf-form-row">
                      <label htmlFor="mf-amc-select" className="mf-form-label">
                        AMC
                      </label>
                      <div className="mf-form-control-wrap">
                        <select
                          id="mf-amc-select"
                          value={selectedAmc}
                          onChange={(e) => setSelectedAmc(e.target.value)}
                          className="mf-form-select"
                        >
                          <option value="Select">Select</option>
                          {amcList.map((amc) => (
                            <option key={amc} value={amc}>
                              {amc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Category */}
                    <div className="mf-form-row">
                      <label htmlFor="mf-cat-select" className="mf-form-label">
                        Category
                      </label>
                      <div className="mf-form-control-wrap">
                        <select
                          id="mf-cat-select"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="mf-form-select"
                        >
                          <option value="--">--</option>
                          {categoryList.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Scheme */}
                    <div className="mf-form-row">
                      <label htmlFor="mf-scheme-select" className="mf-form-label">
                        Scheme
                      </label>
                      <div className="mf-form-control-wrap">
                        <select
                          id="mf-scheme-select"
                          value={selectedSchemeId}
                          onChange={(e) => setSelectedSchemeId(e.target.value)}
                          className="mf-form-select"
                        >
                          <option value="Select">Select</option>
                          {filteredSchemes.map((scheme) => (
                            <option key={scheme.id} value={scheme.id}>
                              {scheme.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 4: Installment Amount (Rs.) & SIP Date */}
                    <div className="mf-form-row-split">
                      <div className="mf-split-cell">
                        <label htmlFor="mf-installment-input" className="mf-form-label">
                          Installment<br />Amount (Rs.)
                        </label>
                        <input
                          type="number"
                          id="mf-installment-input"
                          min="500"
                          step="500"
                          value={installmentAmount}
                          onChange={(e) => setInstallmentAmount(Number(e.target.value))}
                          placeholder="e.g. 5000"
                          className="mf-form-input"
                        />
                      </div>

                      <div className="mf-split-cell">
                        <label htmlFor="mf-sip-date-select" className="mf-form-label">
                          SIP Date
                        </label>
                        <select
                          id="mf-sip-date-select"
                          value={sipDate}
                          onChange={(e) => setSipDate(e.target.value)}
                          className="mf-form-select"
                        >
                          {['01', '02', '03', '05', '07', '10', '15', '20', '25', '28'].map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 5: From Date & To Date */}
                    <div className="mf-form-row-split">
                      <div className="mf-split-cell">
                        <label htmlFor="mf-from-date" className="mf-form-label">
                          From Date
                        </label>
                        <input
                          type="date"
                          id="mf-from-date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="mf-form-input"
                        />
                      </div>

                      <div className="mf-split-cell">
                        <label htmlFor="mf-to-date" className="mf-form-label">
                          To Date
                        </label>
                        <input
                          type="date"
                          id="mf-to-date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="mf-form-input"
                        />
                      </div>
                    </div>

                    {/* Row 6: Calculate Action Button */}
                    <div className="mf-form-action-row">
                      <button type="submit" className="mf-calculate-btn">
                        Calculate
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ── Past SIP Results View ── */
                  <div className="mf-result-container">
                    <div className="mf-result-header">
                      <div>
                        <span className="mf-result-badge">SIP BACKTEST REPORT</span>
                        <h3 className="mf-result-scheme-name">{currentScheme.name}</h3>
                        <p className="mf-result-dates-sub">
                          From {fromDate} to {toDate} • SIP Date: {sipDate} of every month
                        </p>
                      </div>
                    </div>

                    {/* Summary KPI Cards */}
                    <div className="mf-kpi-grid">
                      <div className="mf-kpi-card">
                        <span className="mf-kpi-label">Total Amount Invested</span>
                        <span className="mf-kpi-value">{formatIndianCurrency(sipResults.totalInvested)}</span>
                        <span className="mf-kpi-meta">{sipResults.totalMonths} Installments</span>
                      </div>

                      <div className="mf-kpi-card highlight-gold">
                        <span className="mf-kpi-label">Current Market Valuation</span>
                        <span className="mf-kpi-value text-bold">{formatIndianCurrency(sipResults.currentValue)}</span>
                        <span className="mf-kpi-meta text-green">+{formatIndianCurrency(sipResults.profit)} Profit</span>
                      </div>

                      <div className="mf-kpi-card">
                        <span className="mf-kpi-label">Annualized Return (XIRR)</span>
                        <span className="mf-kpi-value text-amber">{sipResults.cagr}% p.a.</span>
                        <span className="mf-kpi-meta">Absolute: +{sipResults.absoluteReturn}%</span>
                      </div>
                    </div>

                    {/* Milestone Growth Table */}
                    <div className="mf-milestone-table-wrap">
                      <h4 className="mf-table-title">Yearly Investment Accumulation</h4>
                      <table className="mf-data-table">
                        <thead>
                          <tr>
                            <th>Milestone</th>
                            <th>Total Invested</th>
                            <th>Current Value</th>
                            <th>Wealth Gain</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sipResults.milestones.map((m, idx) => (
                            <tr key={idx}>
                              <td><strong>{m.year}</strong></td>
                              <td>{formatIndianCurrency(m.invested)}</td>
                              <td className="text-bold">{formatIndianCurrency(m.currentValue)}</td>
                              <td className="text-green">+{formatIndianCurrency(m.gain)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mf-recalc-action">
                      <button
                        type="button"
                        onClick={() => setSipCalculated(false)}
                        className="mf-recalc-btn"
                      >
                        Modify Parameters / Re-Calculate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 2: LATEST NAV
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'latest-nav' && (
              <div className="mf-tool-card">
                <div className="mf-tool-toolbar">
                  <input
                    type="text"
                    placeholder="Search by Scheme or AMC name..."
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    className="mf-search-input"
                  />
                  <select
                    value={navCategoryFilter}
                    onChange={(e) => setNavCategoryFilter(e.target.value)}
                    className="mf-filter-select"
                  >
                    <option value="All">All Categories</option>
                    {categoryList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="mf-table-responsive">
                  <table className="mf-data-table">
                    <thead>
                      <tr>
                        <th>Scheme Name</th>
                        <th>Category</th>
                        <th>Latest NAV</th>
                        <th>1D Change</th>
                        <th>52W High / Low</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemeList
                        .filter((s) => {
                          const matchSearch =
                            s.name.toLowerCase().includes(navSearch.toLowerCase()) ||
                            s.amc.toLowerCase().includes(navSearch.toLowerCase());
                          const matchCat = navCategoryFilter === 'All' || s.category === navCategoryFilter;
                          return matchSearch && matchCat;
                        })
                        .map((s) => (
                          <tr key={s.id}>
                            <td>
                              <strong>{s.name}</strong>
                              <span className="table-sub-text">{s.amc}</span>
                            </td>
                            <td><span className="table-tag">{s.category}</span></td>
                            <td className="text-bold">₹{s.nav.toFixed(2)}</td>
                            <td className={s.navChange >= 0 ? 'text-green' : 'text-red'}>
                              {s.navChange >= 0 ? '+' : ''}{s.navChange.toFixed(2)} ({s.navChangePct}%)
                            </td>
                            <td>₹{s.high52} / ₹{s.low52}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 3: CURRENT NFOS
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'nfos' && (
              <div className="mf-tool-card">
                <div className="mf-table-responsive">
                  <table className="mf-data-table">
                    <thead>
                      <tr>
                        <th>NFO Scheme Name</th>
                        <th>Fund House</th>
                        <th>Type</th>
                        <th>Open Date</th>
                        <th>Close Date</th>
                        <th>Min Inv.</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentNFOsData.map((nfo, idx) => (
                        <tr key={idx}>
                          <td><strong>{nfo.name}</strong></td>
                          <td>{nfo.amc}</td>
                          <td>{nfo.type}</td>
                          <td>{nfo.openDate}</td>
                          <td>{nfo.closeDate}</td>
                          <td>{nfo.minInvestment}</td>
                          <td>
                            <span className={`nfo-status-badge ${nfo.status === 'Open Now' ? 'open' : 'forthcoming'}`}>
                              {nfo.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 4: FUND FACTSHEETS
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'factsheets' && (
              <div className="mf-tool-card">
                <div className="mf-form-row">
                  <label htmlFor="mf-factsheet-select" className="mf-form-label">
                    Select Fund
                  </label>
                  <div className="mf-form-control-wrap">
                    <select
                      id="mf-factsheet-select"
                      value={factsheetSchemeId}
                      onChange={(e) => setFactsheetSchemeId(e.target.value)}
                      className="mf-form-select"
                    >
                      {schemeList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(() => {
                  const s = schemeList.find((x) => x.id === factsheetSchemeId) || schemeList[0];
                  return (
                    <div className="factsheet-details">
                      <div className="factsheet-header-box">
                        <h3>{s.name}</h3>
                        <p>{s.amc} • Inception: {s.inceptionDate} • Risk: {s.riskRating}</p>
                      </div>

                      <div className="factsheet-kpi-grid">
                        <div className="factsheet-kpi">
                          <span>AUM</span>
                          <strong>{s.aum}</strong>
                        </div>
                        <div className="factsheet-kpi">
                          <span>Fund Manager</span>
                          <strong>{s.fundManager}</strong>
                        </div>
                        <div className="factsheet-kpi">
                          <span>Expense Ratio</span>
                          <strong>{s.expenseRatio}%</strong>
                        </div>
                        <div className="factsheet-kpi">
                          <span>3Y Return CAGR</span>
                          <strong>{s.cagr3Y}%</strong>
                        </div>
                      </div>

                      <div className="factsheet-two-col">
                        <div className="factsheet-col">
                          <h4>Top Portfolio Holdings</h4>
                          <ul className="holdings-list">
                            {s.topHoldings.map((h, i) => (
                              <li key={i}>
                                <span className="holding-rank">{i + 1}</span>
                                <span className="holding-name">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="factsheet-col">
                          <h4>Top Sector Allocation</h4>
                          <div className="sector-bars">
                            {s.sectorAllocation.map((sec, i) => (
                              <div key={i} className="sector-bar-item">
                                <div className="sector-bar-label">
                                  <span>{sec.sector}</span>
                                  <span>{sec.pct}%</span>
                                </div>
                                <div className="sector-progress">
                                  <div className="sector-fill" style={{ width: `${sec.pct * 2.5}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 5: MF PERFORMANCE
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'mf-perf' && (
              <div className="mf-tool-card">
                <div className="mf-tool-toolbar">
                  <select
                    value={perfCategory}
                    onChange={(e) => setPerfCategory(e.target.value)}
                    className="mf-filter-select"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <div className="mf-period-tabs">
                    {['3Y', '5Y'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`mf-period-btn ${perfPeriod === p ? 'active' : ''}`}
                        onClick={() => setPerfPeriod(p)}
                      >
                        {p} Returns
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mf-table-responsive">
                  <table className="mf-data-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Fund Name</th>
                        <th>AUM</th>
                        <th>Expense Ratio</th>
                        <th>{perfPeriod} CAGR</th>
                        <th>Risk Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemeList
                        .filter((s) => s.category === perfCategory || perfCategory === 'All')
                        .sort((a, b) => (perfPeriod === '3Y' ? b.cagr3Y - a.cagr3Y : b.cagr5Y - a.cagr5Y))
                        .map((s, idx) => (
                          <tr key={s.id}>
                            <td><strong>#{idx + 1}</strong></td>
                            <td>
                              <strong>{s.name}</strong>
                              <span className="table-sub-text">{s.amc}</span>
                            </td>
                            <td>{s.aum}</td>
                            <td>{s.expenseRatio}%</td>
                            <td className="text-bold text-amber">
                              {perfPeriod === '3Y' ? `${s.cagr3Y}%` : `${s.cagr5Y}%`}
                            </td>
                            <td><span className="table-tag">{s.riskRating}</span></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 6: SCHEME COMPARISON
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'scheme-comparison' && (
              <div className="mf-tool-card">
                <div className="compare-selectors">
                  <div className="compare-select-col">
                    <label className="mf-form-label">Scheme 1</label>
                    <select
                      value={compareScheme1Id}
                      onChange={(e) => setCompareScheme1Id(e.target.value)}
                      className="mf-form-select"
                    >
                      {schemeList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="compare-select-col">
                    <label className="mf-form-label">Scheme 2</label>
                    <select
                      value={compareScheme2Id}
                      onChange={(e) => setCompareScheme2Id(e.target.value)}
                      className="mf-form-select"
                    >
                      {schemeList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(() => {
                  const s1 = schemeList.find((x) => x.id === compareScheme1Id) || schemeList[0];
                  const s2 = schemeList.find((x) => x.id === compareScheme2Id) || schemeList[1];
                  return (
                    <table className="mf-compare-table">
                      <thead>
                        <tr>
                          <th>Metric</th>
                          <th>{s1.name}</th>
                          <th>{s2.name}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Fund House (AMC)</strong></td>
                          <td>{s1.amc}</td>
                          <td>{s2.amc}</td>
                        </tr>
                        <tr>
                          <td><strong>Category</strong></td>
                          <td><span className="table-tag">{s1.category}</span></td>
                          <td><span className="table-tag">{s2.category}</span></td>
                        </tr>
                        <tr>
                          <td><strong>Latest NAV</strong></td>
                          <td><strong>₹{s1.nav.toFixed(2)}</strong></td>
                          <td><strong>₹{s2.nav.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                          <td><strong>AUM Size</strong></td>
                          <td>{s1.aum}</td>
                          <td>{s2.aum}</td>
                        </tr>
                        <tr>
                          <td><strong>3-Year CAGR</strong></td>
                          <td className="text-bold text-amber">{s1.cagr3Y}%</td>
                          <td className="text-bold text-amber">{s2.cagr3Y}%</td>
                        </tr>
                        <tr>
                          <td><strong>5-Year CAGR</strong></td>
                          <td className="text-bold text-amber">{s1.cagr5Y}%</td>
                          <td className="text-bold text-amber">{s2.cagr5Y}%</td>
                        </tr>
                        <tr>
                          <td><strong>Expense Ratio</strong></td>
                          <td>{s1.expenseRatio}%</td>
                          <td>{s2.expenseRatio}%</td>
                        </tr>
                        <tr>
                          <td><strong>Fund Manager</strong></td>
                          <td>{s1.fundManager}</td>
                          <td>{s2.fundManager}</td>
                        </tr>
                        <tr>
                          <td><strong>Risk Profile</strong></td>
                          <td>{s1.riskRating}</td>
                          <td>{s2.riskRating}</td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 7: MF ACTIVITY
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'mf-activity' && (
              <div className="mf-tool-card">
                <div className="mf-table-responsive">
                  <table className="mf-data-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Equity Net Inflow</th>
                        <th>Debt Net Inflow</th>
                        <th>Hybrid Inflow</th>
                        <th>Total Net Inflow</th>
                        <th>Market Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mfActivityData.map((act, idx) => (
                        <tr key={idx}>
                          <td><strong>{act.month}</strong></td>
                          <td className="text-green text-bold">{act.equityInflow}</td>
                          <td>{act.debtInflow}</td>
                          <td>{act.hybridInflow}</td>
                          <td className="text-bold">{act.netTotal}</td>
                          <td><span className="table-tag">{act.trend}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 8: RECENT ANNOUNCED DIVIDENDS
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'dividends' && (
              <div className="mf-tool-card">
                <div className="mf-table-responsive">
                  <table className="mf-data-table">
                    <thead>
                      <tr>
                        <th>Scheme Name</th>
                        <th>Record Date</th>
                        <th>Dividend (₹ / Unit)</th>
                        <th>NAV on Record Date</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentDividendsData.map((div, idx) => (
                        <tr key={idx}>
                          <td><strong>{div.schemeName}</strong></td>
                          <td>{div.recordDate}</td>
                          <td className="text-bold text-amber">{div.dividendPerUnit}</td>
                          <td>{div.navOnRecord}</td>
                          <td><span className="table-tag">{div.type}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
               TOOL 9: SWP PERFORMANCE
               ══════════════════════════════════════════════════════════════ */}
            {activeTool === 'swp-perf' && (
              <div className="mf-tool-card">
                <div className="mf-swp-grid">
                  <div className="mf-form-row">
                    <label className="mf-form-label">Initial Lumpsum (₹)</label>
                    <input
                      type="number"
                      step="10000"
                      value={swpInitialAmount}
                      onChange={(e) => setSwpInitialAmount(Number(e.target.value))}
                      className="mf-form-input"
                    />
                  </div>

                  <div className="mf-form-row">
                    <label className="mf-form-label">Monthly Withdrawal (₹)</label>
                    <input
                      type="number"
                      step="500"
                      value={swpMonthlyWithdrawal}
                      onChange={(e) => setSwpMonthlyWithdrawal(Number(e.target.value))}
                      className="mf-form-input"
                    />
                  </div>

                  <div className="mf-form-row">
                    <label className="mf-form-label">Expected Return (% p.a.)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={swpReturnRate}
                      onChange={(e) => setSwpReturnRate(Number(e.target.value))}
                      className="mf-form-input"
                    />
                  </div>

                  <div className="mf-form-row">
                    <label className="mf-form-label">Tenure (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={swpTenureYears}
                      onChange={(e) => setSwpTenureYears(Number(e.target.value))}
                      className="mf-form-input"
                    />
                  </div>
                </div>

                <div className="mf-kpi-grid" style={{ marginTop: '24px' }}>
                  <div className="mf-kpi-card">
                    <span className="mf-kpi-label">Initial Investment</span>
                    <span className="mf-kpi-value">{formatIndianCurrency(swpResults.totalInvested)}</span>
                  </div>
                  <div className="mf-kpi-card highlight-gold">
                    <span className="mf-kpi-label">Total Withdrawn</span>
                    <span className="mf-kpi-value text-bold text-green">{formatIndianCurrency(swpResults.totalWithdrawn)}</span>
                  </div>
                  <div className="mf-kpi-card">
                    <span className="mf-kpi-label">Remaining Balance</span>
                    <span className="mf-kpi-value">{formatIndianCurrency(swpResults.remainingCorpus)}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </article>
  );
};

export default MfTools;
