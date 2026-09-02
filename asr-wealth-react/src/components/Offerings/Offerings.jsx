import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { offeringsData, offeringCategories } from '../../data/content';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './Offerings.css';

const projectShowcaseList = [
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & SIPs',
    category: 'Mutual Funds',
    tag: 'Equity, Debt & Hybrid Funds',
    image: '/assets/images/project-1.jpg',
    width: 835,
    height: 429,
    isLarge: true,
    description: 'SEBI regulated professional fund management for wealth creation with high liquidity and diversification.'
  },
  {
    id: 'equities',
    title: 'Direct Equities & Demat',
    category: 'Equities',
    tag: 'Trading, IPOs & Rights Issues',
    image: '/assets/images/project-2.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Online trading platform with real-time research, electronic holding, and automated corporate benefits.'
  },
  {
    id: 'ncd-mld',
    title: 'NCD / MLD Structured Notes',
    category: 'NCD/MLD',
    tag: 'Fixed Income & Market-Linked Debentures',
    image: '/assets/images/project-3.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'High-yield fixed income instruments and structured securities providing capital appreciation and steady cash flows.'
  },
  {
    id: 'pms',
    title: 'Portfolio Management Services (PMS)',
    category: 'PMS',
    tag: 'Custom Portfolios (Min ₹50L)',
    image: '/assets/images/project-4.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Tailor-made, research-oriented dynamic portfolios held directly in your name for superior alpha generation.'
  },
  {
    id: 'aif',
    title: 'Alternative Investment Funds (AIF)',
    category: 'AIF',
    tag: 'Private Equity & Real Assets (Min ₹1Cr)',
    image: '/assets/images/project-5.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Category I, II & III pooled vehicles for high-net-worth investors accessing private equity, real estate, and hedge funds.'
  }
];

const Offerings = () => {
  const [activeFilter, setActiveFilter] = useState('All');

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
            {filteredProjects.map((project, index) => (
              <motion.li 
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className={index === 0 && activeFilter === 'All' ? 'first-project' : ''}
              >
                <div className="project-card">
                  <figure 
                    className="card-banner img-holder" 
                    style={{ '--width': project.width, '--height': project.height }}
                  >
                    <img 
                      src={project.image} 
                      width={project.width} 
                      height={project.height} 
                      loading="lazy" 
                      alt={project.title} 
                      className="img-cover" 
                    />
                  </figure>

                  <div className="card-content">
                    <h3 className="h3">
                      <a href="#contact" className="card-title">{project.title}</a>
                    </h3>
                    <a href="#contact" className="card-tag">{project.tag}</a>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

      </div>
    </section>
  );
};

export default Offerings;
