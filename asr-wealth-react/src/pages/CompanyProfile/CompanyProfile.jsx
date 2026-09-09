import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  IoRocketSharp, 
  IoShieldCheckmarkSharp, 
  IoTrendingUpSharp,
  IoBusinessSharp, 
  IoBriefcaseSharp, 
  IoPeopleSharp,
  IoArrowForward
} from 'react-icons/io5';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { promiseData, visionMission, clientTypes } from '../../data/content';
import './CompanyProfile.css';

const getPromiseIcon = (iconName) => {
  switch (iconName) {
    case 'rocket': return <IoRocketSharp />;
    case 'shield': return <IoShieldCheckmarkSharp />;
    case 'trending-up': return <IoTrendingUpSharp />;
    default: return <IoRocketSharp />;
  }
};

const getClientIcon = (iconName) => {
  switch (iconName) {
    case 'business': return <IoBusinessSharp />;
    case 'briefcase': return <IoBriefcaseSharp />;
    case 'people': return <IoPeopleSharp />;
    default: return <IoBusinessSharp />;
  }
};

const CompanyProfile = () => {
  const [activeClientIndex, setActiveClientIndex] = useState(0);

  // Parallax Scroll Targets for Vision & Mission entries
  const visionRef = useRef(null);
  const missionRef = useRef(null);

  const { scrollYProgress: visionScroll } = useScroll({
    target: visionRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: missionScroll } = useScroll({
    target: missionRef,
    offset: ["start end", "end start"]
  });

  // Silky-smooth responsive parallax scroll transforms (up/down on scroll)
  const rawVisionY = useTransform(visionScroll, [0, 1], [40, -40]);
  const rawVisionLetterY = useTransform(visionScroll, [0, 1], [25, -25]);
  const visionY = useSpring(rawVisionY, { stiffness: 85, damping: 26, mass: 0.6 });
  const visionLetterY = useSpring(rawVisionLetterY, { stiffness: 85, damping: 26, mass: 0.6 });

  const rawMissionY = useTransform(missionScroll, [0, 1], [40, -40]);
  const rawMissionLetterY = useTransform(missionScroll, [0, 1], [25, -25]);
  const missionY = useSpring(rawMissionY, { stiffness: 85, damping: 26, mass: 0.6 });
  const missionLetterY = useSpring(rawMissionLetterY, { stiffness: 85, damping: 26, mass: 0.6 });

  return (
    <article className="company-profile-page">
      {/* ── Section 1: Page Header & The ASR Promise ── */}
      <section className="section profile-hero-section">
        <div className="container">
          {/* Page Header — Luxury Headline */}
          <motion.div 
            className="company-hero-header text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {/* Stylized High-Fashion Title */}
            <h1 className="company-hero-title">
              <span className="title-lead">Where Wealth </span>
              <span className="title-accent-wrap">
                <span className="title-accent-finds">Finds </span>
                <span className="title-accent-purpose">Purpose</span>
                <svg className="title-brush-svg" viewBox="0 0 220 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 10C60 3 160 3 217 8" stroke="#FFDB4A" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </motion.div>

          {/* The ASR Promise Subsection (Directly below intro text) */}
          <div className="promise-section">
            <motion.div 
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <p className="section-subtitle has-before text-center">THE ASR PROMISE</p>
              <h2 className="h2 section-title text-center">
                Aspire. Secure. <span className="has-before">Rise</span>.
              </h2>
            </motion.div>

            <motion.div 
              className="promise-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {promiseData.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="promise-card"
                  variants={fadeInUp}
                  style={{ '--color': item.color }}
                >
                  <div className="promise-icon">
                    {getPromiseIcon(item.icon)}
                  </div>
                  <h3 className="h3 promise-title">{item.title}</h3>
                  <p className="promise-subtitle">{item.subtitle}</p>
                  <p className="promise-desc">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Vision & Mission (Editorial Unboxed Column Layout with Scroll Parallax) ── */}
      <section className="section profile-vision-mission-section">
        <div className="container">
          <motion.div 
            className="editorial-header" 
            style={{ marginBlockEnd: '55px' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <p className="section-subtitle has-before">Strategic Foundation</p>
            <h2 className="h2 section-title">
              Vision & <span className="has-before">Mission</span>
            </h2>
          </motion.div>

          <div className="editorial-main-grid">
            {/* Left Column: Vision & Mission Text Entries */}
            <div className="editorial-column-layout">
              {/* Entry 1: Our Vision */}
              <div ref={visionRef} className="editorial-entry-wrapper">
                <motion.div 
                  className="editorial-entry"
                  style={{ y: visionY }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="editorial-letter-wrap">
                    <motion.span 
                      className="editorial-watermark"
                      style={{ y: visionLetterY }}
                    >
                      v
                    </motion.span>
                    <div className="editorial-divider-line" aria-hidden="true"></div>
                  </div>
                  <div className="editorial-content">
                    <p className="editorial-tag">VISION . 01</p>
                    <h3 className="editorial-title">
                      <span className="title-bold">OUR</span>
                      <span className="title-serif">vision</span>
                    </h3>
                    <p className="editorial-text">
                      {visionMission.vision}
                    </p>
                    <p className="editorial-text sub">
                      {visionMission.visionExtended}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Separator between Vision and Mission */}
              <div className="editorial-section-separator" aria-hidden="true"></div>

              {/* Entry 2: Our Mission */}
              <div ref={missionRef} className="editorial-entry-wrapper">
                <motion.div 
                  className="editorial-entry"
                  style={{ y: missionY }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="editorial-letter-wrap">
                    <motion.span 
                      className="editorial-watermark"
                      style={{ y: missionLetterY }}
                    >
                      m
                    </motion.span>
                    <div className="editorial-divider-line" aria-hidden="true"></div>
                  </div>
                  <div className="editorial-content">
                    <p className="editorial-tag">MISSION . 02</p>
                    <h3 className="editorial-title">
                      <span className="title-bold">OUR</span>
                      <span className="title-serif">mission</span>
                    </h3>
                    <p className="editorial-text">
                      {visionMission.mission}
                    </p>
                    <p className="editorial-text sub">
                      {visionMission.missionExtended}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Visual Artwork / Teamwork Puzzle Image (Big Format, Static) */}
            <div className="editorial-image-column">
              <div className="editorial-image-card">
                <img 
                  src="/assets/images/vision-mission-puzzle.png" 
                  alt="ASR Wealth Strategic Foundation - Team Collaboration" 
                  className="editorial-image"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Who We Serve (Interactive Expandable Accordion) ── */}
      <section className="section profile-clients-section">
        <div className="container">
          <motion.div 
            className="who-we-serve"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <div className="who-we-serve-header text-center">
              <p className="section-subtitle has-before text-center">Tailored Advisory</p>
              <h3 className="h3 text-center section-title">Who We <span className="has-before">Serve</span></h3>
            </div>

            <div 
              className="client-expandable-container"
              role="region"
              aria-label="Client profiles"
            >
              {clientTypes.map((client, index) => {
                const isActive = activeClientIndex === index;
                return (
                  <div 
                    key={client.id || index}
                    className={`client-expandable-card ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setActiveClientIndex(index)}
                    onClick={() => setActiveClientIndex(index)}
                    onFocus={() => setActiveClientIndex(index)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={`${client.title} profile`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveClientIndex(index);
                      }
                    }}
                  >
                    <div className="client-card-inner">
                      <div className="client-icon-badge">
                        {getClientIcon(client.icon)}
                      </div>

                      <div className="client-card-body">
                        <h4 className="client-card-title">{client.title}</h4>
                        <p className="client-card-desc">
                          {isActive ? client.description : (client.shortDesc || client.description)}
                        </p>
                      </div>

                      <div className="client-card-action-wrap">
                        <a 
                          href="/#offerings" 
                          className="client-card-action"
                          tabIndex={isActive ? 0 : -1}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{client.ctaText || 'Learn More'}</span>
                          <IoArrowForward aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </article>
  );
};

export default CompanyProfile;
