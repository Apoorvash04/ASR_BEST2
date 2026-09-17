import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IoPhonePortraitOutline,
  IoPricetagOutline,
  IoAnalyticsOutline,
  IoRocketOutline,
  IoShieldCheckmarkOutline,
  IoLockClosedOutline,
  IoCashOutline,
  IoArrowForward,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { equitiesPageData } from '../../data/content';
import './Equities.css';

const iconMap = {
  'online-trading': IoPhonePortraitOutline,
  'lower-costs': IoPricetagOutline,
  'market-research': IoAnalyticsOutline,
  'ipo-applications': IoRocketOutline,
  'pledging': IoShieldCheckmarkOutline,
  'electronic-holding': IoLockClosedOutline,
  'corporate-actions': IoCashOutline,
};

const Equities = () => {
  const { 
    titlePrefix, 
    titleHighlight, 
    titleSuffix, 
    badge,
    intro, 
    features, 
    image, 
    imageAlt 
  } = equitiesPageData;

  return (
    <article className="equities-page">
      <div className="equities-container">
        
        {/* Creative Headline with "Equities" accented in yellow & curved arch line */}
        <header className="equities-header">
          {badge && <span className="equities-badge">{badge}</span>}
          <h1 className="equities-title">
            {titlePrefix}{' '}
            <span className="equities-word-yellow">
              {titleHighlight}
            </span>{' '}
            {titleSuffix}
          </h1>
          <div className="equities-curve-wrap" aria-hidden="true">
            <svg 
              className="equities-curved-line" 
              viewBox="0 0 460 55" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M 15 48 C 120 8, 340 8, 445 44" 
                stroke="#1e1e1e" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </header>

        {/* 2-Column Responsive Layout: Clutter-Free Content on Left, Image Slot on Right */}
        <div className="equities-grid">
          
          {/* Left Column: All Core Content & Features */}
          <div className="equities-text-column">
            
            {/* Overview / Introduction */}
            <div className="equities-intro-wrap">
              <p className="equities-intro-text">
                {intro}
              </p>
            </div>

            {/* Features Section */}
            <section className="equities-features-section" aria-label="Equities Features">
              <div className="equities-section-header">
                <h2 className="equities-section-title">Platform Capabilities & Investor Benefits</h2>
                <div className="equities-accent-bar" aria-hidden="true"></div>
                <p className="equities-section-lead">
                  Designed for serious capital market participants seeking precision, safety, and digital efficiency.
                </p>
              </div>

              <div className="equities-features-list">
                {features.map((item) => {
                  const IconComponent = iconMap[item.id] || IoCheckmarkCircle;
                  return (
                    <div 
                      key={item.id} 
                      className="equities-card" 
                      style={{ '--card-color': item.color }}
                    >
                      <div className="equities-card-icon-col">
                        <div className="equities-icon-badge">
                          <IconComponent className="equities-icon" aria-hidden="true" />
                        </div>
                      </div>
                      
                      <div className="equities-card-content">
                        <div className="equities-card-title-row">
                          <h3 className="equities-card-title">{item.title}</h3>
                          {item.tag && (
                            <span className="equities-card-tag">{item.tag}</span>
                          )}
                        </div>
                        <p className="equities-card-desc">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick Action Consultation Banner */}
            <div className="equities-action-bar">
              <div className="equities-action-text">
                <h4>Open Your Demat & Equity Trading Account</h4>
                <p>Begin investing in direct equities with institutional research and tailored portfolio guidance.</p>
              </div>
              <Link to="/#contact" className="btn btn-primary has-before has-after">
                <span>Get Started</span>
                <IoArrowForward className="equities-action-arrow" />
              </Link>
            </div>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Reserved empty space for future picture / infographic.
              To replace with your custom image, update `image` in
              `src/data/content.js` or place an image here.
              ============================================================ */}
          <div className="equities-media-column">
            <div className="equities-media-sticky">
              <figure className="equities-figure">
                <div className="equities-img-frame">
                  <img 
                    src={image} 
                    alt={imageAlt}
                    className="equities-img"
                    loading="eager"
                  />
                </div>
                <figcaption className="equities-slot-note">
                  <span className="equities-slot-dot"></span>
                  <span>Right space reserved for trading platform graphic / photo</span>
                </figcaption>
              </figure>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};

export default Equities;
