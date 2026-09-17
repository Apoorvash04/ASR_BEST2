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

          {/* Column 1: About Us / Brand Info */}
          <div className="footer-col footer-col-about">
            <Link to="/" className="footer-brand-logo" aria-label="ASR Wealth Home">
              <img 
                src="/logo.png" 
                alt="ASR Wealth Logo" 
                className="footer-logo-img" 
              />
            </Link>

            <p className="footer-tagline">
              Where Wealth Finds <span className="footer-tagline-accent">Purpose.</span>
            </p>

            <p className="footer-text">
              {aboutUs}
            </p>

            <Link to="/company-profile" className="footer-about-link">
              <span>Know More About Us</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
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
