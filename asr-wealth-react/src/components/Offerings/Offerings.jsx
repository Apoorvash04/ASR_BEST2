import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { offeringCategories } from '../../data/content';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './Offerings.css';

const projectShowcaseList = [
  {
    id: 'alternate-investment-funds',
    title: 'Alternate Investment Funds',
    category: 'Alternate Investment Funds',
    tag: 'Private Equity, Debt & Hedge Funds (Min ₹1Cr)',
    image: '/assets/images/project-1.jpg',
    width: 835,
    height: 429,
    isLarge: true,
    description: 'SEBI-regulated pooled vehicles for high-net-worth investors accessing private equity, real estate, and hedge funds.',
    link: '/alternate-investment-funds'
  },
  {
    id: 'bonds',
    title: 'Bonds',
    category: 'Bonds',
    tag: 'Government Securities, Corporate Bonds & NCDs',
    image: '/assets/images/project-2.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'High-yield fixed income instruments and sovereign bonds providing capital preservation and steady cash flows.'
  },
  {
    id: 'child-retirement-plan',
    title: 'Child & Retirement Plan',
    category: 'Child & Retirement Plan',
    tag: 'Goal-Based Education & Wealth Preservation',
    image: '/assets/images/project-3.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Bespoke milestone-driven planning designed to fund prestigious higher education and guarantee lifelong retirement freedom.'
  },
  {
    id: 'equities',
    title: 'Equities',
    category: 'Equities',
    tag: 'Trading, Research, IPOs & Demat',
    image: '/assets/images/project-4.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Online trading platform with real-time research, electronic holding, and automated corporate benefits.'
  },
  {
    id: 'insurance',
    title: 'Insurance',
    category: 'Insurance',
    tag: 'Life, Health & Comprehensive Protection',
    image: '/assets/images/project-5.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Strategic risk mitigation and estate protection safeguarding your loved ones and securing financial resilience.'
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds',
    category: 'Mutual Funds',
    tag: 'Equity, Debt, Hybrid Funds & Systematic SIPs',
    image: '/assets/images/project-6.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'SEBI-regulated professional fund management for long-term wealth creation with high liquidity and diversification.',
    link: '/mutual-funds'
  },
  {
    id: 'pms',
    title: 'PMS',
    category: 'PMS',
    tag: 'Portfolio Management Services (Min ₹50L)',
    image: '/assets/images/project-7.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Tailor-made, research-oriented dynamic portfolios held directly in your name for superior alpha generation.'
  }
];

const Offerings = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const handleSelectOffering = (e) => {
      if (e.detail) {
        setActiveFilter(e.detail);
        const el = document.getElementById('offerings');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('asr-select-offering', handleSelectOffering);
    return () => window.removeEventListener('asr-select-offering', handleSelectOffering);
  }, []);

  const filteredProjects = activeFilter === 'All'
    ? projectShowcaseList
    : projectShowcaseList.filter(item => item.category === activeFilter);

  return (
    <section className="section project" id="project" aria-label="project">
      <div className="container" id="offerings">

        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <p className="section-subtitle has-before text-center">Projects & Offerings</p>

          <h2 className="h2 section-title text-center">
            ASR Wealth complete <span className="has-before">solutions</span>
          </h2>
        </motion.div>

        {/* Filter Pills from Pixology */}
        <motion.ul 
          className="filter-list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {offeringCategories.map((category) => (
            <li key={category}>
              <button
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            </li>
          ))}
        </motion.ul>

        {/* Project Grid from Pixology */}
        <motion.ul 
          className="grid-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const isFirstInAll = index === 0 && activeFilter === 'All';
              return (
                <motion.li 
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                  className={isFirstInAll ? 'first-project' : ''}
                >
                  <div className="project-card">
                    <figure 
                      className="card-banner img-holder" 
                      style={{ '--width': isFirstInAll ? 835 : 416, '--height': 429 }}
                    >
                      {project.link ? (
                        <Link to={project.link} style={{ display: 'block', width: '100%', height: '100%' }}>
                          <img 
                            src={project.image} 
                            width={isFirstInAll ? 835 : 416} 
                            height={429} 
                            loading="lazy" 
                            alt={project.title} 
                            className="img-cover" 
                          />
                        </Link>
                      ) : (
                        <img 
                          src={project.image} 
                          width={isFirstInAll ? 835 : 416} 
                          height={429} 
                          loading="lazy" 
                          alt={project.title} 
                          className="img-cover" 
                        />
                      )}
                    </figure>

                  <div className="card-content">
                    <h3 className="h3">
                      {project.link ? (
                        <Link to={project.link} className="card-title">{project.title}</Link>
                      ) : (
                        <a href="#contact" className="card-title">{project.title}</a>
                      )}
                    </h3>
                    {project.link ? (
                      <Link to={project.link} className="card-tag">{project.tag}</Link>
                    ) : (
                      <a href="#contact" className="card-tag">{project.tag}</a>
                    )}
                    {project.link && (
                      <div className="card-action-wrap">
                        <Link to={project.link} className="card-action-link">
                          <span>Explore Overview</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
          </AnimatePresence>
        </motion.ul>

      </div>
    </section>
  );
};

export default Offerings;
