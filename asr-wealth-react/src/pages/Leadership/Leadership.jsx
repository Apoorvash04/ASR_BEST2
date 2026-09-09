import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import LeadershipSection from '../../components/Leadership/Leadership';
import './Leadership.css';

const Leadership = () => {
  return (
    <div className="leadership-page">
      <div className="container">
        <motion.div 
          className="page-header text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className="section-subtitle has-before text-center">Governance & Strategy</p>
          <h1 className="h1 section-title text-center">
            Leadership & <span className="has-before">Governance</span>
          </h1>
          <p className="section-text text-center" style={{ maxWidth: '700px', marginInline: 'auto' }}>
            Our leadership brings together decades of capital markets mastery, fiduciary governance, and entrepreneurial vision.
          </p>
        </motion.div>

        {/* Leadership Content Section */}
        <LeadershipSection />
      </div>
    </div>
  );
};

export default Leadership;
