import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/content';
import { useScrollPosition } from '../../utils/scrollUtils';
import { IoMenuOutline, IoCloseOutline, IoChevronDown } from 'react-icons/io5';
import './Header.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const isScrolled = useScrollPosition(80);
  const navRef = useRef(null);
  const location = useLocation();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubItemClick = (subItem) => {
    setOpenDropdown(null);
    closeNav();
    if (subItem.category) {
      window.dispatchEvent(new CustomEvent('asr-select-offering', { detail: subItem.category }));
    }
  };

  const handleLogoClick = () => {
    closeNav();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLinkActive = (href, label) => {
    if (label === 'About Us') {
      return location.pathname === '/company-profile' || location.pathname === '/our-team';
    }
    if (label === 'Offerings') {
      return location.pathname === '/mutual-funds' || location.pathname === '/alternate-investment-funds' || location.pathname === '/pms' || location.pathname === '/equities';
    }
    if (label === 'Investor Zone') {
      return location.pathname === '/mf-forms' || location.pathname === '/mf-tools' || location.pathname === '/sip-calculator';
    }
    if (label === 'KYC') {
      return location.pathname === '/kyc';
    }
    return location.pathname === href;
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo" onClick={handleLogoClick} aria-label="ASR Wealth Home">
          <img 
            src="/logo.png" 
            alt="ASR Wealth Logo" 
            className="logo-img" 
          />
        </Link>

        <div className={`nav-overlay ${isNavOpen ? 'active' : ''}`} onClick={closeNav}></div>
        
        <nav className={`navbar ${isNavOpen ? 'active' : ''}`} ref={navRef}>
          <div className="navbar-top">
            <Link to="/" className="logo-mobile" onClick={handleLogoClick} aria-label="ASR Wealth Home">
              <img 
                src="/logo.png" 
                alt="ASR Wealth Logo" 
                className="logo-img" 
              />
            </Link>
            <button className="nav-close-btn" onClick={closeNav} aria-label="Close menu">
              <IoCloseOutline />
            </button>
          </div>

          <ul className="navbar-list">
            {navLinks.map((link, index) => {
              const isOpen = openDropdown === link.label;
              const active = isLinkActive(link.href, link.label);

              if (link.dropdown) {
                return (
                  <li 
                    key={index} 
                    className={`navbar-item dropdown-item ${isOpen ? 'open' : ''}`}
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link 
                      to={link.href} 
                      className={`navbar-link dropdown-toggle ${active || isOpen ? 'active' : ''}`}
                      onClick={(e) => {
                        if (link.href === '#' || !link.href) {
                          e.preventDefault();
                        }
                        setOpenDropdown(prev => (prev === link.label ? null : link.label));
                      }}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                    >
                      <span>{link.label}</span>
                      <IoChevronDown className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} />
                    </Link>

                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                      {link.dropdown.map((subItem, subIdx) => {
                        const isSubActive = location.pathname === subItem.href;
                        return (
                          <li key={subIdx} className="dropdown-subitem">
                            <Link 
                              to={subItem.href} 
                              className={`dropdown-link ${isSubActive ? 'active' : ''}`} 
                              onClick={() => handleSubItemClick(subItem)}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={index} className="navbar-item">
                  <Link 
                    to={link.href} 
                    className={`navbar-link ${active ? 'active' : ''}`} 
                    onClick={closeNav}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/#contact" className="btn btn-primary has-before has-after">
            Schedule a Consultation
          </Link>
          
          <button className="nav-open-btn" onClick={toggleNav} aria-label="Open menu">
            <IoMenuOutline />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
