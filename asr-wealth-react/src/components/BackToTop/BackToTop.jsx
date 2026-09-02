import React, { useState, useEffect } from 'react';
import { IoArrowUpOutline } from 'react-icons/io5';
import './BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'active' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <IoArrowUpOutline />
    </button>
  );
};

export default BackToTop;
