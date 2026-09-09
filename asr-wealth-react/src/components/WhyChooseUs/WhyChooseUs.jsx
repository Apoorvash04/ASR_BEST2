import React from 'react';
import { motion } from 'framer-motion';
import { 
  IoCompassOutline, 
  IoAnalyticsOutline, 
  IoHandLeftOutline, 
  IoFlashOutline 
} from 'react-icons/io5';
import { whyChooseUsData } from '../../data/content';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './WhyChooseUs.css';

const featureColorMap = [
  '174, 77%, 50%',  /* Teal */
  '93, 92, 231',    /* Electric Indigo */
  '343, 98%, 60%',   /* Rose */
  '52, 98%, 50%'     /* Gold */
];

const iconMap = {
  compass: IoCompassOutline,
  analytics: IoAnalyticsOutline,
  handshake: IoHandLeftOutline,
  flash: IoFlashOutline,
};

const WhyChooseUs = () => {
  return (
    <section className="section feature" id="feature" aria-label="feature">
      <div className="container">

        {/* Feature Banner Image from Pixology */}
        <motion.figure 
          className="feature-banner"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.33, 0.85, 0.4, 0.96] }}
        >
          <img 
            src="/assets/images/feature-banner.png" 
            width="582" 
            height="585" 
            loading="lazy" 
            alt="ASR Wealth Feature Banner" 
            className="w-100" 
          />
        </motion.figure>

        {/* Feature Content */}
        <motion.div 
          className="feature-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeInUp} className="section-subtitle has-before">
            Why Choose Us
          </motion.p>

          <motion.h2 variants={fadeInUp} className="h2 section-title">
            Specialist in guiding clients through financial <span className="has-before">challenges</span>
          </motion.h2>

          <ul className="feature-list">
            {whyChooseUsData.map((item, index) => {
              const Icon = iconMap[item.icon] || IoCompassOutline;
              const color = featureColorMap[index % featureColorMap.length];

              return (
                <motion.li key={index} variants={fadeInUp}>
                  <div className="feature-card">
                    <div className="card-icon" style={{ '--color': color }}>
                      <Icon aria-hidden="true" />
                    </div>

                    <div>
                      <h3 className="h3 card-title">{item.title}</h3>
                      <p className="card-text">{item.description}</p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
