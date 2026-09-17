import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IoCheckmarkCircleSharp, 
  IoShieldCheckmarkOutline, 
  IoArrowForward, 
  IoCalendarOutline
} from 'react-icons/io5';
import { pmsPageData } from '../../data/content';
import './Pms.css';

const Pms = () => {
  const { 
    titlePrefix, 
    titleHighlight, 
    titleSuffix, 
    badge,
    minCapNotice, 
    overview, 
    howWeHelp, 
    advantages, 
    image, 
    imageAlt 
  } = pmsPageData;

  return (
    <article className="pms-page">
      <div className="pms-container">
        
        {/* Creative Headline with "Management" accented in yellow & curved arch line */}
        <header className="pms-header">
          {badge && <span className="pms-badge">{badge}</span>}
          <h1 className="pms-title">
            {titlePrefix}{' '}
            <span className="pms-word-yellow">
              {titleHighlight}
            </span>{' '}
            {titleSuffix}
          </h1>
          <div className="pms-curve-wrap" aria-hidden="true">
            <svg 
              className="pms-curved-line" 
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
        <div className="pms-grid">
          
          {/* Left Column: All Core Content & Insights */}
          <div className="pms-text-column">
            
            {/* Minimum Investment Notice Pill */}
            <div className="pms-cap-badge">
              <IoShieldCheckmarkOutline className="pms-cap-icon" aria-hidden="true" />
              <div className="pms-cap-info">
                <span className="pms-cap-text">{minCapNotice}</span>
              </div>
            </div>

            {/* Overview Paragraphs */}
            <div className="pms-overview-wrap">
              {overview.map((para, index) => (
                <p key={index} className="pms-overview-text">
                  {para}
                </p>
              ))}
            </div>

            {/* "How do we help?" Section */}
            <section className="pms-section pms-how-section">
              <div className="pms-section-header">
                <h2 className="pms-section-title">{howWeHelp.title}</h2>
                <div className="pms-accent-bar" aria-hidden="true"></div>
                <p className="pms-section-lead">{howWeHelp.lead}</p>
              </div>

              <div className="pms-how-list">
                {howWeHelp.points.map((pt) => (
                  <div key={pt.number} className="pms-how-item">
                    <div className="pms-how-num-col">
                      <span className="pms-how-num">{pt.number}</span>
                    </div>
                    <div className="pms-how-content">
                      <h3 className="pms-how-item-title">{pt.title}</h3>
                      <p className="pms-how-desc">{pt.desc}</p>
                      {pt.ctaText && (
                        <div className="pms-item-cta-wrap">
                          <Link to={pt.ctaLink} className="pms-item-cta-btn">
                            <IoCalendarOutline className="pms-btn-icon" />
                            <span>{pt.ctaText}</span>
                            <IoArrowForward className="pms-cta-arrow" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* "The PMS Advantage for you!" Section */}
            <section className="pms-section pms-advantages-section">
              <div className="pms-section-header">
                <h2 className="pms-section-title">{advantages.title}</h2>
                <div className="pms-accent-bar" aria-hidden="true"></div>
                {advantages.subtitle && (
                  <p className="pms-section-sub">{advantages.subtitle}</p>
                )}
              </div>

              <div className="pms-advantages-list">
                {advantages.items.map((advText, index) => (
                  <div key={index} className="pms-advantage-item">
                    <div className="pms-advantage-icon-col">
                      <IoCheckmarkCircleSharp className="pms-advantage-check" aria-hidden="true" />
                    </div>
                    <div className="pms-advantage-text-col">
                      <p className="pms-advantage-text">{advText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ============================================================
              RIGHT COLUMN: Reserved empty space for future picture / infographic.
              To add your image in the future, simply provide an image file or
              update `image` in `src/data/content.js`.
              ============================================================ */}
          <div className="pms-media-column">
            <div className="pms-media-sticky">
              <figure className="pms-figure">
                <div className="pms-img-frame">
                  <img 
                    src={image} 
                    alt={imageAlt}
                    className="pms-img"
                    loading="eager"
                  />
                </div>
                <figcaption className="pms-slot-note">
                  <span className="pms-slot-dot"></span>
                  <span>Right space reserved for your custom PMS picture</span>
                </figcaption>
              </figure>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};

export default Pms;
