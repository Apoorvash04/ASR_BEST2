import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IoLogoTwitter, 
  IoLogoFacebook, 
  IoLogoLinkedin, 
  IoLogoInstagram,
  IoCall,
  IoMail,
  IoLocation
} from 'react-icons/io5';
import { companyProfileData } from '../../data/content';
import './Footer.css';

const Footer = () => {
  const { 
    aboutUs, 
    quickLinks, 
    serviceLinks, 
    contact, 
    disclaimer, 
    disclaimerParagraphs, 
    corporate, 
    policyLinks 
  } = companyProfileData;

  const disclaimers = disclaimerParagraphs && disclaimerParagraphs.length > 0 
    ? disclaimerParagraphs 
    : [disclaimer];

  return (
    <footer className="footer">
      <div className="container">

        {/* ── 4-Column Main Footer Top ── */}
        <div className="footer-top">

          {/* Column 1: About Us */}
          <div className="footer-col footer-col-about">
            <h4 className="footer-list-title">About Us</h4>
            <p className="footer-text">
              {aboutUs}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-list-title">Quick Links</h4>
            <ul className="footer-links-list">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Service Link */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-list-title">Service Link</h4>
            <ul className="footer-links-list">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Get In Touch */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-list-title">Get In Touch</h4>

            <div className="footer-contact-item">
              <IoLocation className="contact-icon" aria-hidden="true" />
              <div className="contact-details">
                <strong className="contact-company">{contact.company}</strong>
                <p className="contact-address">{contact.address}</p>
              </div>
            </div>

            <div className="footer-contact-item">
              <IoCall className="contact-icon" aria-hidden="true" />
              <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="footer-link contact-link">
                {contact.phone}
              </a>
            </div>

            <div className="footer-contact-item">
              <IoMail className="contact-icon" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="footer-link contact-link">
                {contact.email}
              </a>
            </div>

            {/* Social Icons Row */}
            <ul className="footer-social-row" aria-label="Social media links">
              <li>
                <a href={contact.socials[0].url} target="_blank" rel="noopener noreferrer" className="social-icon-btn social-fb" aria-label="Facebook">
                  <IoLogoFacebook />
                </a>
              </li>
              <li>
                <a href={contact.socials[1].url} target="_blank" rel="noopener noreferrer" className="social-icon-btn social-twitter" aria-label="X / Twitter">
                  <IoLogoTwitter />
                </a>
              </li>
              <li>
                <a href={contact.socials[2].url} target="_blank" rel="noopener noreferrer" className="social-icon-btn social-insta" aria-label="Instagram">
                  <IoLogoInstagram />
                </a>
              </li>
              <li>
                <a href={contact.socials[3].url} target="_blank" rel="noopener noreferrer" className="social-icon-btn social-linkedin" aria-label="LinkedIn">
                  <IoLogoLinkedin />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Subtle Section Divider ── */}
        <div className="footer-divider-line" aria-hidden="true"></div>

        {/* ── Disclaimer Text ── */}
        <div className="footer-disclaimer-wrap">
          {disclaimers.map((para, idx) => (
            <p key={idx} className="footer-disclaimer-text">
              {idx === 0 ? <><strong>Disclaimer</strong> – {para}</> : para}
            </p>
          ))}
        </div>

        {/* ── Corporate & Compliance Centered Details ── */}
        <div className="footer-corporate-center">
          <h3 className="corporate-title">{corporate.name}</h3>
          <div className="corporate-identifiers">
            <div>CIN: {corporate.cin}</div>
            <div>GSTIN: {corporate.gstin}</div>
          </div>

          <div className="corporate-registrations">
            <p className="registration-line">
              AMFI Registered Mutual Fund Distributor | ARN-280109 | Initial Date of Registration: 07-Nov-2023 | Validity: 06-Nov-2029
            </p>
            <p className="registration-line">
              AMFI Registered SIF Distributor | ARN-280109 | Initial Date of Registration: 10-Oct-2025 | Validity: 09-Oct-2028
            </p>
            <p className="registration-line">
              APMI Registered PMS Distributor | APRN-05970 | Initial Date of Registration:11-Jul-2026 | Validity: 10-Jul-2029
            </p>
            <p className="registration-line">
              Authorised Person of Nuvama Wealth and Investment Limited (SEBI INZ000005231)
            </p>
            <p className="registration-line">
              AP Regn: BSE AP01326101159774 | NSE AP2258562283 | MCX/AP/166017 | NCDEX 126894
            </p>
          </div>

          <p className="corporate-grievance">
            Grievance Officer: {corporate.grievanceOfficer.name} | <a href={`mailto:${corporate.grievanceOfficer.email}`} className="corporate-grievance-link">{corporate.grievanceOfficer.email}</a> | <a href={`tel:${corporate.grievanceOfficer.phone}`} className="corporate-grievance-link">{corporate.grievanceOfficer.phone}</a>
          </p>
        </div>

        {/* ── Bottom Bar: Copyright & 14 Policy Links (Centered) ── */}
        <div className="footer-bottom-center">
          <p className="bottom-copyright">
            &copy; 2025 Credible.Live by Abhinav Mehta Capital Pvt. Ltd.
          </p>

          <p className="bottom-policy-links">
            {policyLinks.map((link, index) => (
              <React.Fragment key={index}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="bottom-policy-link">
                  {link.label}
                </a>
                {index < policyLinks.length - 1 && <span className="policy-sep"> | </span>}
              </React.Fragment>
            ))}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
