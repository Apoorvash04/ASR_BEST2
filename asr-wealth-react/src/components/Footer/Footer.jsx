import React from 'react';
import { 
  IoLogoYoutube, 
  IoLogoTwitter, 
  IoLogoFacebook, 
  IoLogoLinkedin, 
  IoLogoInstagram 
} from 'react-icons/io5';
import { brandData, footerLinks } from '../../data/content';
import './Footer.css';

const instaPosts = [
  { id: 1, image: '/assets/images/insta-post-1.jpg', width: 77, height: 63 },
  { id: 2, image: '/assets/images/insta-post-2.jpg', width: 76, height: 63 },
  { id: 3, image: '/assets/images/insta-post-3.jpg', width: 77, height: 63 },
  { id: 4, image: '/assets/images/insta-post-4.jpg', width: 77, height: 63 },
  { id: 5, image: '/assets/images/insta-post-5.jpg', width: 76, height: 63 },
  { id: 6, image: '/assets/images/insta-post-6.jpg', width: 77, height: 63 }
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">

        <div className="footer-top section">

          {/* Column 1: Brand Info & Socials */}
          <div className="footer-brand">
            <p className="footer-list-title">About {brandData.name}</p>
            <p className="footer-text">
              {brandData.description}
            </p>

            <ul className="social-list">
              <li>
                <a href="#" className="social-link" aria-label="YouTube">
                  <IoLogoYoutube />
                </a>
              </li>
              <li>
                <a href="#" className="social-link" aria-label="Twitter">
                  <IoLogoTwitter />
                </a>
              </li>
              <li>
                <a href="#" className="social-link" aria-label="Facebook">
                  <IoLogoFacebook />
                </a>
              </li>
              <li>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <IoLogoLinkedin />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Useful Links</p>
            </li>
            {footerLinks.quickLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="footer-link">{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Column 3: Offerings */}
          <ul className="footer-list">
            <li>
              <p className="footer-list-title">Our Solutions</p>
            </li>
            {footerLinks.offerings.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="footer-link">{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Column 4: Pixology Instagram Post Gallery */}
          <div className="footer-list">
            <p className="footer-list-title">Instagram Post</p>

            <ul className="insta-post">
              {instaPosts.map((post) => (
                <li key={post.id}>
                  <div className="insta-card">
                    <figure className="card-banner">
                      <img 
                        src={post.image} 
                        width={post.width} 
                        height={post.height} 
                        loading="lazy" 
                        alt="instagram post" 
                        className="img-cover" 
                      />
                    </figure>

                    <a href="#" className="card-content" aria-label="View on Instagram">
                      <IoLogoInstagram aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            &copy; 2026 {brandData.name}. All rights reserved.
          </p>

          <ul className="footer-bottom-list">
            {footerLinks.legal.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="footer-bottom-link">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <p className="amfi-disclaimer">
          Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
