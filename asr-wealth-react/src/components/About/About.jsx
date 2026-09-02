import React from 'react';
import { motion } from 'framer-motion';
import { 
  IoArrowForward,
  IoRocketSharp,
  IoTrendingUpSharp,
  IoShieldCheckmarkSharp,
  IoBusinessSharp,
  IoBriefcaseSharp,
  IoPeopleSharp
} from 'react-icons/io5';
import { promiseData, visionMission, clientTypes } from '../../data/content';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './About.css';

const servicesList = [
  { id: 1, title: 'Mutual Funds & SIPs', icon: '/assets/images/service-icon-1.png', color: '174, 77%, 50%' },
  { id: 2, title: 'Equity & Demat Solutions', icon: '/assets/images/service-icon-2.png', color: '267, 76%, 57%' },
  { id: 3, title: 'Risk & Wealth Security', icon: '/assets/images/service-icon-3.png', color: '17, 100%, 68%' },
  { id: 4, title: 'Intergenerational Legacy', icon: '/assets/images/service-icon-4.png', color: '343, 98%, 60%' },
  { id: 5, title: 'Portfolio Management (PMS)', icon: '/assets/images/service-icon-5.png', color: '210, 100%, 53%' },
  { id: 6, title: 'Alternative Funds (AIF)', icon: '/assets/images/service-icon-6.png', color: '157, 89%, 44%' },
  { id: 7, title: 'Fixed Income & NCD/MLD', icon: '/assets/images/service-icon-7.png', color: '52, 98%, 50%' }
];

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

const About = () => {
  return (
    <section className="section service" id="service" aria-label="service">
      <div className="container">
        
        {/* Section Header */}
        <motion.div 
          className="service-header text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <p className="section-subtitle has-before text-center">Our Services</p>
          <h2 className="h2 section-title text-center">
            Managing your wealth with our <span className="has-before">best service</span>
          </h2>
        </motion.div>

        {/* Pixology 8-card Service Grid with Service Icons */}
        <motion.ul 
          className="grid-list service-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {servicesList.map((service) => (
            <motion.li key={service.id} variants={fadeInUp}>
              <div className="service-card" style={{ '--color': service.color }}>
                <div className="card-icon">
                  <img 
                    src={service.icon} 
                    width="30" 
                    height="30" 
                    loading="lazy" 
                    alt={service.title} 
                  />
                </div>
                <h3 className="h3">
                  <a href="#offerings" className="card-title">{service.title}</a>
                </h3>
              </div>
            </motion.li>
          ))}

          {/* 8th Card: Pixology Link Card with Rotated Arrow */}
          <motion.li variants={fadeInUp}>
            <a href="#offerings" className="link-card" style={{ '--color': '93, 92, 231' }}>
              <span className="span">Explore All Offerings</span>
              <IoArrowForward aria-hidden="true" />
            </a>
          </motion.li>
        </motion.ul>

        {/* ── ASR Promise Subsection ── */}
        <div id="about" className="promise-section">
          <motion.div 
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <p className="section-subtitle has-before text-center">The ASR Promise</p>
            <h2 className="h2 section-title text-center">
              Aspire. Secure. <span className="has-before">Rise</span>.
            </h2>
          </motion.div>

          <motion.div 
            className="promise-grid grid-list"
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

        {/* ── Vision & Mission Subsection ── */}
        <motion.div 
          className="vision-mission-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div className="vm-box" variants={fadeInUp}>
            <div className="vm-icon"><IoRocketSharp /></div>
            <h3 className="h3 vm-title">Our Vision</h3>
            <p className="vm-text">{visionMission.vision}</p>
          </motion.div>
          <motion.div className="vm-box" variants={fadeInUp}>
            <div className="vm-icon"><IoTrendingUpSharp /></div>
            <h3 className="h3 vm-title">Our Mission</h3>
            <p className="vm-text">{visionMission.mission}</p>
          </motion.div>
        </motion.div>

        {/* ── Who We Serve Subsection ── */}
        <motion.div 
          className="who-we-serve"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
        >
          <h3 className="h3 text-center section-title">Who We Serve</h3>
          <motion.div 
            className="client-grid grid-list"
            variants={staggerContainer}
          >
            {clientTypes.map((client, index) => (
              <motion.div 
                key={index} 
                className="client-card"
                variants={fadeInUp}
              >
                <div className="client-icon">
                  {getClientIcon(client.icon)}
                </div>
                <h4 className="h4 client-title">{client.title}</h4>
                <p className="client-desc">{client.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
