import React from 'react';
import { motion } from 'framer-motion';
import { IoPlayOutline } from 'react-icons/io5';
import { brandData } from '../../data/content';
import { heroTextReveal, staggerContainer } from '../../utils/animations';
import './Hero.css';

const Hero = () => {
  const scrollToTeam = () => {
    const el = document.getElementById('leadership');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section hero" id="home" aria-label="hero">
      <div className="container">
        
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={heroTextReveal} className="h1 hero-title">
            Where Wealth Finds <span className="has-before">Purpose</span>
          </motion.h1>
          
          <motion.p variants={heroTextReveal} className="hero-text">
            {brandData.philosophy}
          </motion.p>
          
          <motion.div variants={heroTextReveal} className="wrapper">
            <a href="#offerings" className="btn btn-primary has-before has-after">
              Explore Offerings
            </a>
            
            <button className="hero-btn" onClick={scrollToTeam} aria-label="Meet the Team">
              <IoPlayOutline aria-hidden="true" />
              <span className="span">Meet the Team</span>
            </button>
          </motion.div>
        </motion.div>
        
        <motion.figure 
          className="hero-banner"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.33, 0.85, 0.4, 0.96], delay: 0.2 }}
        >
          <img 
            src="/assets/images/hero-banner.png" 
            width="794" 
            height="637" 
            alt="ASR Wealth Hero Banner" 
            className="w-100" 
          />
        </motion.figure>

      </div>
    </section>
  );
};

export default Hero;
