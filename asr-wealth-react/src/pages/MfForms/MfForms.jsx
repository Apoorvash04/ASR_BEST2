import React, { useState } from 'react';
import { mfFormsData } from '../../data/content';
import { 
  IoDocumentTextOutline, 
  IoDownloadOutline, 
  IoSwapHorizontalOutline, 
  IoTrendingUpOutline, 
  IoShieldCheckmarkOutline,
  IoOpenOutline,
  IoSearchOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import './MfForms.css';

const getCategoryIcon = (icon) => {
  switch (icon) {
    case 'swap-horizontal':
      return <IoSwapHorizontalOutline />;
    case 'document-text':
      return <IoDocumentTextOutline />;
    case 'trending-up':
      return <IoTrendingUpOutline />;
    case 'shield-checkmark':
      return <IoShieldCheckmarkOutline />;
    default:
      return <IoDocumentTextOutline />;
  }
};

const MfForms = () => {
  const { description, categories, rtaPortals, subtitle } = mfFormsData;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredCategories = categories.map((cat) => {
    const matchingForms = cat.forms.filter((form) => 
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, forms: matchingForms };
  }).filter((cat) => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) {
      return false;
    }
    return cat.forms.length > 0;
  });

  return (
    <article className="mf-forms-page">
      {/* ── Hero Section ── */}
      <section className="mf-forms-hero">
        <div className="mf-forms-container">
          <header className="mf-forms-header text-center">
            <span className="mf-forms-badge">{subtitle}</span>
            <h1 className="mf-forms-title">
              Mutual Fund <span className="highlight">Forms & Downloads</span>
            </h1>
            <div className="mf-forms-accent-bar" aria-hidden="true"></div>
            <p className="mf-forms-desc">
              {description}
            </p>
          </header>

          {/* Search & Filter Bar */}
          <div className="mf-forms-search-wrap">
            <div className="mf-forms-search-box">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                placeholder="Search forms by name or service (e.g. Bank change, SIP, Redemption)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Search mutual fund forms"
              />
              {searchTerm && (
                <button 
                  className="search-clear-btn" 
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="mf-forms-filter-pills" role="tablist">
              <button
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Forms
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Forms List Section ── */}
      <section className="mf-forms-main-section">
        <div className="mf-forms-container">
          {filteredCategories.length === 0 ? (
            <div className="mf-forms-empty text-center">
              <p>No forms match your search criteria "{searchTerm}".</p>
              <button 
                className="btn btn-primary"
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="mf-forms-categories-stack">
              {filteredCategories.map((category) => (
                <div key={category.id} className="mf-forms-category-card">
                  <div className="category-header">
                    <div className="category-icon-wrap">
                      {getCategoryIcon(category.icon)}
                    </div>
                    <div>
                      <h2 className="category-title">{category.title}</h2>
                      <p className="category-subtitle">{category.description}</p>
                    </div>
                  </div>

                  <div className="forms-table-wrap">
                    <table className="forms-table">
                      <thead>
                        <tr>
                          <th>Form Name & Description</th>
                          <th>Format</th>
                          <th className="text-right">Download</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.forms.map((form, idx) => (
                          <tr key={idx}>
                            <td className="form-info-cell">
                              <span className="form-name">{form.name}</span>
                              <span className="form-desc">{form.desc}</span>
                            </td>
                            <td className="form-format-cell">
                              <span className="pdf-tag">{form.format}</span>
                            </td>
                            <td className="form-action-cell text-right">
                              <a 
                                href={form.downloadUrl} 
                                className="download-btn"
                                aria-label={`Download ${form.name}`}
                              >
                                <IoDownloadOutline />
                                <span>Download</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── RTA Quick Portals Bar ── */}
          <div className="rta-portals-section">
            <div className="rta-portals-card">
              <div className="rta-text">
                <h3 className="rta-heading">Looking for Official Registrar Portals?</h3>
                <p className="rta-sub">
                  Submit paperless transaction requests, statements, and mandate registrations directly on CAMS and KFintech.
                </p>
              </div>
              <div className="rta-links-group">
                {rtaPortals.map((rta, idx) => (
                  <a 
                    key={idx}
                    href={rta.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="rta-portal-btn"
                  >
                    <span>{rta.name}</span>
                    <IoOpenOutline />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Guidelines Note ── */}
          <div className="forms-notice-box">
            <div className="notice-icon">
              <IoCheckmarkCircle />
            </div>
            <div className="notice-content">
              <h4>Submission Instructions</h4>
              <p>
                Downloaded physical forms must be signed by all folio holders as per operating instructions. 
                Completed forms along with self-attested documents (PAN, Address Proof, Cancelled Cheque) can be submitted 
                at our office or sent directly to our advisory desk for expedited processing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};

export default MfForms;
