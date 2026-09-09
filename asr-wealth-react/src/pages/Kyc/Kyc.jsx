import React from 'react';
import './Kyc.css';

const Kyc = () => {
  return (
    <article className="kyc-page">
      <div className="kyc-container">
        {/* ── Top Header ── */}
        <header className="kyc-header-centered">
          <h1 className="kyc-title">KYC</h1>
          <div className="kyc-accent-bar" aria-hidden="true"></div>
          <p className="kyc-regulatory-notice">
            In order to comply with regulatory provisions under the Prevention of Money Laundering Act 2002,
            issued by SEBI/ Govt. of India, KYC/ AADHAAR / FATCA formalities are required to be completed for
            all Unit Holders, including Guardians and Power of Attorney holders, for any investment in mutual funds.
          </p>
        </header>

        {/* ── 2-Column Section: Check KYC Status + Validate KYC ── */}
        <div className="kyc-columns-grid">
          {/* Column 1: Check your KYC status */}
          <div className="kyc-column">
            <h2 className="kyc-column-heading">Check your KYC status</h2>
            <ul className="kyc-items-list">
              <li className="kyc-item">
                <a
                  href="https://www.cvlkra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="CVLKRA Status Check"
                >
                  <img
                    src="/assets/images/kra/cdsl.png"
                    alt="CDSL Logo"
                    className="kyc-company-logo logo-cdsl"
                  />
                </a>
                <a
                  href="https://www.cvlkra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  CVLKRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://kra.ndml.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="NSDL KRA Status Check"
                >
                  <img
                    src="/assets/images/kra/nsdl.png"
                    alt="NSDL Logo"
                    className="kyc-company-logo logo-nsdl"
                  />
                </a>
                <a
                  href="https://kra.ndml.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  NSDL KRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://www.camskra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="CAMS KRA Status Check"
                >
                  <img
                    src="/assets/images/kra/camskra.png"
                    alt="CAMS KRA Logo"
                    className="kyc-company-logo logo-camskra"
                  />
                </a>
                <a
                  href="https://www.camskra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  CAMS KRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://www.nsekra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="NSE KRA Status Check"
                >
                  <img
                    src="/assets/images/kra/nse.png"
                    alt="NSE Logo"
                    className="kyc-company-logo logo-nse"
                  />
                </a>
                <a
                  href="https://www.nsekra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  NSE KRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://www.karvykra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="KARVY KRA Status Check"
                >
                  <img
                    src="/assets/images/kra/karvy.png"
                    alt="KARVY Logo"
                    className="kyc-company-logo logo-karvy"
                  />
                </a>
                <a
                  href="https://www.karvykra.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  KARVY KRA
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Validate your KYC */}
          <div className="kyc-column">
            <h2 className="kyc-column-heading">Validate your KYC</h2>
            <ul className="kyc-items-list">
              <li className="kyc-item">
                <a
                  href="https://validate.cvlindia.com/CVLKRAVerification_V1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="CVLKRA Validation"
                >
                  <img
                    src="/assets/images/kra/cdsl.png"
                    alt="CDSL Logo"
                    className="kyc-company-logo logo-cdsl"
                  />
                </a>
                <a
                  href="https://validate.cvlindia.com/CVLKRAVerification_V1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  CVLKRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://kra.ndml.in/kra/web/v3/#/kyc/initiate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="NSDL KRA Validation"
                >
                  <img
                    src="/assets/images/kra/nsdl.png"
                    alt="NSDL Logo"
                    className="kyc-company-logo logo-nsdl"
                  />
                </a>
                <a
                  href="https://kra.ndml.in/kra/web/v3/#/kyc/initiate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  NSDL KRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://www.camskra.com/PanDetailsUpdate.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="CAMS KRA Validation"
                >
                  <img
                    src="/assets/images/kra/camskra.png"
                    alt="CAMS KRA Logo"
                    className="kyc-company-logo logo-camskra"
                  />
                </a>
                <a
                  href="https://www.camskra.com/PanDetailsUpdate.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  CAMS KRA
                </a>
              </li>

              <li className="kyc-item">
                <a
                  href="https://www.karvykra.com/KYC_Validation/Default.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-logo-anchor"
                  aria-label="KARVY KRA Validation"
                >
                  <img
                    src="/assets/images/kra/karvy.png"
                    alt="KARVY Logo"
                    className="kyc-company-logo logo-karvy"
                  />
                </a>
                <a
                  href="https://www.karvykra.com/KYC_Validation/Default.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kyc-link"
                >
                  KARVY KRA
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Download Forms Section ── */}
        <div className="kyc-downloads-section">
          <div className="kyc-download-badge-wrap">
            <span className="kyc-download-badge">Download Forms</span>
          </div>

          <ul className="kyc-downloads-list">
            <li className="kyc-download-item">
              <a
                href="/assets/forms/cams-kra-kyc-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="CAMS KRA KYC Non-Individual PDF"
              >
                <img
                  src="/assets/images/kra/camskra.png"
                  alt="CAMS KRA Logo"
                  className="kyc-company-logo logo-camskra"
                />
              </a>
              <a
                href="/assets/forms/cams-kra-kyc-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                KYC Non-Individual
              </a>
            </li>

            <li className="kyc-download-item">
              <a
                href="/assets/forms/cams-kra-kyc-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="CAMS KRA KYC Individual PDF"
              >
                <img
                  src="/assets/images/kra/camskra.png"
                  alt="CAMS KRA Logo"
                  className="kyc-company-logo logo-camskra"
                />
              </a>
              <a
                href="/assets/forms/cams-kra-kyc-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                KYC Individual
              </a>
            </li>

            <li className="kyc-download-item indent-cams">
              <a
                href="/assets/forms/cams-fatca-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="CAMS FATCA Non Individual PDF"
              >
                <img
                  src="/assets/images/kra/cams.png"
                  alt="CAMS Logo"
                  className="kyc-company-logo logo-cams"
                />
              </a>
              <a
                href="/assets/forms/cams-fatca-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                FATCA Non Individual
              </a>
            </li>

            <li className="kyc-download-item indent-cams">
              <a
                href="/assets/forms/cams-fatca-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="CAMS FATCA Individual PDF"
              >
                <img
                  src="/assets/images/kra/cams.png"
                  alt="CAMS Logo"
                  className="kyc-company-logo logo-cams"
                />
              </a>
              <a
                href="/assets/forms/cams-fatca-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                FATCA Individual
              </a>
            </li>

            <li className="kyc-download-item indent-cams">
              <a
                href="/assets/forms/cams-ubo-declaration-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="CAMS UBO Declaration Non-Individual PDF"
              >
                <img
                  src="/assets/images/kra/cams.png"
                  alt="CAMS Logo"
                  className="kyc-company-logo logo-cams"
                />
              </a>
              <a
                href="/assets/forms/cams-ubo-declaration-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                UBO Declaration Non-Indvidual
              </a>
            </li>

            <li className="kyc-download-item">
              <a
                href="/assets/forms/kfintech-fatca-crs-declaration-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="KFintech FATCA CRS Declaration Form Individual PDF"
              >
                <img
                  src="/assets/images/kra/kfintech.png"
                  alt="KFintech Logo"
                  className="kyc-company-logo logo-kfintech"
                />
              </a>
              <a
                href="/assets/forms/kfintech-fatca-crs-declaration-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                FATCA CRS Declaration Form Individual
              </a>
            </li>

            <li className="kyc-download-item">
              <a
                href="/assets/forms/kfintech-fatca-ubo-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-logo-anchor"
                aria-label="KFintech FATCA UBO Non Individual PDF"
              >
                <img
                  src="/assets/images/kra/kfintech.png"
                  alt="KFintech Logo"
                  className="kyc-company-logo logo-kfintech"
                />
              </a>
              <a
                href="/assets/forms/kfintech-fatca-ubo-non-individual.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="kyc-link"
              >
                FATCA UBO Non Individual
              </a>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default Kyc;
