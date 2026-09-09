import React from 'react';
import { motion } from 'framer-motion';
import { IoArrowForward } from 'react-icons/io5';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './About.css';

const servicesList = [
  { id: 1, title: 'Alternate Investment Funds', icon: '/assets/images/service-icon-1.png', color: '174, 77%, 50%' },
  { id: 2, title: 'Bonds', icon: '/assets/images/service-icon-2.png', color: '267, 76%, 57%' },
  { id: 3, title: 'Child & Retirement Plan', icon: '/assets/images/service-icon-3.png', color: '17, 100%, 68%' },
  { id: 4, title: 'Equities', icon: '/assets/images/service-icon-4.png', color: '343, 98%, 60%' },
  { id: 5, title: 'Insurance', icon: '/assets/images/service-icon-5.png', color: '210, 100%, 53%' },
  { id: 6, title: 'Mutual Funds', icon: '/assets/images/service-icon-6.png', color: '157, 89%, 44%' },
  { id: 7, title: 'PMS', icon: '/assets/images/service-icon-7.png', color: '52, 98%, 50%' }
];

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

      </div>
    </section>
  );
};

export default About;
