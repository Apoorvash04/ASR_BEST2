import React from 'react';
import { alternateInvestmentFundsData } from '../../data/content';
import './AlternateInvestmentFunds.css';

const AlternateInvestmentFunds = () => {
  const { titlePrefix, titleHighlight, titleSuffix, intro, categories, image, imageAlt } = alternateInvestmentFundsData;

  return (
    <article className="aif-page">
      <div className="aif-container">
        
        {/* Creative Headline with "Investment" in Yellow & Upper Curved Arch Underneath */}
        <header className="aif-header">
          <h1 className="aif-title">
            {titlePrefix}{' '}
            <span className="aif-word-yellow">
              {titleHighlight}
            </span>{' '}
            {titleSuffix}
          </h1>
          <div className="aif-curve-wrap" aria-hidden="true">
            <svg 
              className="aif-curved-line" 
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

        {/* 2-Column Grid: Whole Text on Left, Dummy Image Slot on Right */}
        <div className="aif-grid">
          
          {/* Left Column: Overview + Categories */}
          <div className="aif-text-column">
            {/* Introductory Overview */}
            <div className="aif-intro-wrap">
              <p className="aif-intro-text">
                {intro}
              </p>
            </div>

            {/* Categorization List (Clean typography without card divs) */}
            <div className="aif-categories-list">
              {categories.map((cat) => (
                <div key={cat.id} className="aif-category-item">
                  <h3 className="aif-category-title">{cat.title}</h3>
                  <p className="aif-category-desc">{cat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dummy Image Slot (Reserved for future user image) */}
          <div className="aif-media-column">
            <figure className="aif-figure">
              <div className="aif-img-frame">
                <img 
                  src={image} 
                  alt={imageAlt}
                  className="aif-img"
                  loading="eager"
                />
              </div>
            </figure>
          </div>

        </div>

      </div>
    </article>
  );
};

export default AlternateInvestmentFunds;
