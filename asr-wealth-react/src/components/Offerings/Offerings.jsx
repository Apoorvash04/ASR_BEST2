import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './Offerings.css';

const projectShowcaseList = [
  {
    id: 'alternate-investment-funds',
    title: 'Alternate Investment Funds',
    category: 'Alternate Investment Funds',
    tag: 'Private Equity, Debt & Hedge Funds (Min ₹1Cr)',
    // Sleek upward financial growth chart & investment analytics
    image: '/assets/images/offering-aif.jpg',
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
    // Intriguing high-security bank vault door with precision gears — ultimate capital safety
    image: '/assets/images/offering-bonds.jpg',
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
    // 3 kids playing football together with joy in the sunny square
    image: '/assets/images/offering-child.jpg',
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
    // Live stock market candlestick chart
    image: '/assets/images/offering-equities.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Online trading platform with real-time research, electronic holding, and automated corporate benefits.',
    link: '/equities'
  },
  {
    id: 'insurance',
    title: 'Insurance',
    category: 'Insurance',
    tag: 'Life, Health & Comprehensive Protection',
    // Heartwarming protection & care: mother and child in golden sunset by the ocean
    image: '/assets/images/offering-insurance.jpg',
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
    // Coins stacked in a glass jar with growing sprout — compounding SIP
    image: '/assets/images/offering-mutual-funds.jpg',
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
    // Institutional wealth advisor reviewing portfolio research
    image: '/assets/images/offering-pms.jpg',
    width: 416,
    height: 429,
    isLarge: false,
    description: 'Tailor-made, research-oriented dynamic portfolios held directly in your name for superior alpha generation.',
    link: '/pms'
  }
];


const Offerings = () => {
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

        {/* Project Grid from Pixology */}
        <motion.ul 
          className="grid-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <AnimatePresence mode="popLayout">
            {projectShowcaseList.map((project, index) => {
              const isFirstInAll = index === 0;
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
