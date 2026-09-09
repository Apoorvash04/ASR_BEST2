import React from 'react';
import { motion } from 'framer-motion';
import { leadershipData } from '../../data/content';
import { staggerContainer, fadeInUp } from '../../utils/animations';
import './Leadership.css';

const Leadership = () => {
  return (
    <section id="leadership" className="section leadership">
      <div className="container">
        <div className="leadership-header text-center">
          <p className="section-subtitle has-before">Our Team</p>
          <h2 className="h2 section-title">
            Three Perspectives. One <span className="has-before">Vision</span>.
          </h2>
          <p className="leadership-intro">
            A boutique investment firm built on relationships, driven by expertise, and inspired by the future.
          </p>
        </div>

        <motion.div
          className="leadership-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {leadershipData.map((leader) => (
            <motion.div key={leader.id} className="leadership-card" variants={fadeInUp}>
              <div
                className="leader-banner"
                style={{ backgroundColor: `rgb(${leader.color})` }}
              >
                <span className="leader-archetype">{leader.archetype}</span>
              </div>
              <div className="leader-avatar">
                <span>{leader.initials}</span>
              </div>
              <div className="leader-body">
                <h3 className="h3 leader-name">{leader.name}</h3>
                <p className="leader-role">{leader.role}</p>
                <p className="leader-bio">
                  {leader.bio.split('. ').slice(0, 2).join('. ') + (leader.bio.split('. ').length > 2 ? '.' : '')}
                </p>
                <blockquote className="leader-philosophy">
                  {leader.philosophy}
                </blockquote>
                <div className="leader-attributes">
                  {leader.attributes.map((attr, index) => (
                    <span
                      key={index}
                      className="leader-attribute-pill"
                      style={{
                        backgroundColor: `rgba(${leader.color}, 0.1)`,
                        color: `rgb(${leader.color})`,
                      }}
                    >
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
