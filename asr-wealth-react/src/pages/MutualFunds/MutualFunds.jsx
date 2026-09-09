import React from 'react';
import { Link } from 'react-router-dom';
import { mutualFundsPageData } from '../../data/content';
import './MutualFunds.css';

const MutualFunds = () => {
  const { title, intro, image, imageAlt, definitionHeading, definitionLead, ways, advantagesSection, classificationSection } = mutualFundsPageData;

  return (
    <article className="mutual-funds-page">
      {/* ── Top Section: Mutual Funds Overview & Definition (White Background) ── */}
      <section className="mutual-funds-hero-section">
        <div className="mutual-funds-container">

          {/* Page Title & Accent Line (Matching Image 2) */}
          <header className="mutual-funds-header">
            <h1 className="mutual-funds-title">{title}</h1>
            <div className="mutual-funds-accent-bar" aria-hidden="true"></div>
          </header>

          {/* Intro Paragraph */}
          <div className="mutual-funds-intro-wrap">
            <p className="mutual-funds-intro-text">
              {intro}
            </p>
          </div>

          {/* Featured Image (Sharp Square Corners matching Image 2) */}
          <figure className="mutual-funds-figure">
            <div className="mutual-funds-img-frame">
              <img 
                src={image} 
                alt={imageAlt}
                className="mutual-funds-img"
                loading="eager"
              />
            </div>
          </figure>

          {/* Definition Section (Matching Image 2) */}
          <div className="mutual-funds-definition-block">
            <h2 className="definition-heading">{definitionHeading}</h2>
            
            <p className="definition-lead">
              {definitionLead}
            </p>

            <ul className="definition-ways-list">
              {ways.map((item, index) => (
                <li key={index} className="definition-way-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── Middle Section: Discover Mutual Fund Tools (Separate Full-Width Gray Section) ── */}
      <section className="mutual-funds-tools-section" aria-label="Mutual Fund Tools">
        <div className="mutual-funds-container">
          <div className="tools-section-grid">
            {/* Left Column: Heading & Subtitle */}
            <div className="tools-text-column">
              <h2 className="tools-main-title">
                Discover the best <br />
                Mutual Fund tools
              </h2>

              <p className="tools-desc">
                Your go-to resource for mutual fund research and analysis to optimize your financial growth.
              </p>
            </div>

            {/* Right Column: 3 Columns of Buttons (Matching Screenshot) */}
            <div className="tools-buttons-column">
              <div className="tools-btn-col">
                <Link to="/sip-calculator" className="tool-theme-btn">
                  SIP Calculator
                </Link>
                <a href="#" className="tool-theme-btn">
                  Scheme Comparison
                </a>
                <a href="#" className="tool-theme-btn">
                  Scheme Comparison
                </a>
              </div>

              <div className="tools-btn-col">
                <a href="#" className="tool-theme-btn">
                  Past SIP Performance
                </a>
                <a href="#" className="tool-theme-btn">
                  Fund Factsheets
                </a>
                <a href="#" className="tool-theme-btn">
                  MF Performance
                </a>
              </div>

              <div className="tools-btn-col">
                <a href="#" className="tool-theme-btn">
                  Current NFOs
                </a>
                <a href="#" className="tool-theme-btn">
                  Latest NAV
                </a>
                <a href="#" className="tool-theme-btn">
                  SIP Step Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom Section: Advantages of Mutual Fund (Warm Beige Background, Unique Text on Left, Reserved Image Slot on Right) ── */}
      <section className="mutual-funds-advantages-section" aria-label="Advantages of Mutual Fund">
        <div className="mutual-funds-container">
          
          {/* Section Heading (Centered at top) */}
          <header className="advantages-header">
            <h2 className="advantages-heading">
              {advantagesSection.heading}
            </h2>
            <div className="advantages-accent-bar" aria-hidden="true"></div>
          </header>

          {/* 2-Column Layout: Unique Text Left & Image Slot Right */}
          <div className="advantages-grid">
            {/* Left Column: 5 Unique Advantage Items */}
            <div className="advantages-text-column">
              {advantagesSection.advantages.map((item) => (
                <div key={item.id} className="advantage-simple-item">
                  <h3 className="advantage-simple-title">{item.title}</h3>
                  <p className="advantage-simple-desc">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Right Column: Reserved Image Slot for future image */}
            <div className="advantages-media-column">
              {advantagesSection.image ? (
                <figure className="advantages-figure">
                  <div className="advantages-img-frame">
                    <img 
                      src={advantagesSection.image} 
                      alt={advantagesSection.imageAlt || 'Advantages of Mutual Fund'}
                      className="advantages-img"
                      loading="lazy"
                    />
                  </div>
                </figure>
              ) : (
                <div className="advantages-placeholder-frame">
                  <div className="placeholder-inner">
                    <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="placeholder-text">Image space reserved for your image</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Classification of Funds Subsection (Open Table with No Side Lining) ── */}
          <div className="classification-block">
            <header className="classification-header">
              <h2 className="classification-heading">
                {classificationSection.heading}
              </h2>
            </header>

            <div className="classification-table-wrapper">
              <table className="classification-open-table">
                <thead>
                  <tr>
                    {classificationSection.headers.map((header, idx) => (
                      <th key={idx} className="classification-th">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classificationSection.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="classification-tr">
                      <td className={`classification-td ${row.debt.isCategory ? 'is-category-header' : ''}`}>
                        {row.debt.name}
                      </td>
                      <td className={`classification-td ${row.hybrid.isCategory ? 'is-category-header' : ''}`}>
                        {row.hybrid.name}
                      </td>
                      <td className={`classification-td ${row.equity.isCategory ? 'is-category-header' : ''}`}>
                        {row.equity.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </article>
  );
};

export default MutualFunds;
