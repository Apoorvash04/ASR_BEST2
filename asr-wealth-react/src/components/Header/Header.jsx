import React, { useState } from 'react';
import { navLinks } from '../../data/content';
import { useScrollPosition } from '../../utils/scrollUtils';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import './Header.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const isScrolled = useScrollPosition(80);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <a href="#home" className="logo" aria-label="ASR Wealth Home">
          <img 
            src="/logo.png" 
            alt="ASR Wealth Logo" 
            className="logo-img" 
          />
        </a>

        <div className={`nav-overlay ${isNavOpen ? 'active' : ''}`} onClick={closeNav}></div>
        
        <nav className={`navbar ${isNavOpen ? 'active' : ''}`}>
          <div className="navbar-top">
            <a href="#home" className="logo-mobile" onClick={closeNav} aria-label="ASR Wealth Home">
              <img 
                src="/logo.png" 
                alt="ASR Wealth Logo" 
                className="logo-img" 
              />
            </a>
            <button className="nav-close-btn" onClick={closeNav} aria-label="Close menu">
              <IoCloseOutline />
            </button>
          </div>

          <ul className="navbar-list">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} className="navbar-link" onClick={closeNav}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <a href="#contact" className="btn btn-primary has-before has-after">
            Schedule a Consultation
          </a>
          
          <button className="nav-open-btn" onClick={toggleNav} aria-label="Open menu">
            <IoMenuOutline />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
