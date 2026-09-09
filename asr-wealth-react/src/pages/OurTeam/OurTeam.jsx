import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import { teamMembersData } from '../../data/content';
import './OurTeam.css';

const OurTeam = () => {
  return (
    <div className="team-page">
      <div className="container">

        {/* Page Header */}
        <motion.div 
          className="page-header text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="h1 section-title text-center">
            The Minds Behind <span className="has-before">ASR Wealth</span>
          </h1>
        </motion.div>

        {/* Creative Timeline: Left Serpentine Wavy Dotted Line & Yellow Dots, Right Unboxed Info */}
        <div className="team-timeline-section">
          {/* Vertical Serpentine Wavy Dotted Navy Blue Line (Inspo Image 2) */}
          <div className="team-timeline-track" aria-hidden="true">
            <svg className="wavy-dotted-line-svg" viewBox="0 0 280 1200" preserveAspectRatio="none">
              <path
                d="M 120,0 
                   C 60,60 30,120 30,180 
                   C 30,320 250,450 250,600 
                   C 250,750 30,880 30,1020 
                   C 30,1110 80,1160 130,1200"
                fill="none"
                stroke="#212529"
                strokeWidth="4.5"
                strokeDasharray="10 12"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="team-timeline-rows">
            {teamMembersData.map((member) => (
              <motion.div 
                key={member.id}
                className="team-timeline-row"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeInUp}
              >
                {/* Left Side: Yellow Dot with Team Member Name (Single Black Circle) */}
                <div className="team-dot-cell">
                  <div className="team-yellow-dot">
                    <span className="dot-name">{member.name}</span>
                    <span className="dot-role">{member.dotRole}</span>
                  </div>
                </div>

                {/* Right Side: Unboxed Info (Removed Div Box Container) */}
                <div className="team-info-unboxed">
                  <div className="team-member-heading">
                    <h2 className="team-member-name">{member.name}</h2>
                    <span className="team-member-role-pill">{member.role}</span>
                  </div>

                  <div className="team-member-body">
                    {member.paragraphs.map((paragraph, pIdx) => (
                      <p key={pIdx} className="team-member-text">
                        {paragraph}
                      </p>
                    ))}

                    {member.philosophy && (
                      <div className="team-member-philosophy-box">
                        <span className="philosophy-label">His philosophy:</span>
                        <blockquote className="philosophy-quote">
                          “{member.philosophy}”
                        </blockquote>
                      </div>
                    )}

                    {member.brings && (
                      <div className="team-member-brings-box">
                        <span className="brings-label">{member.bringsLabel || `At ASR, ${member.name.split(' ')[0]} brings:`}</span>
                        <div className="brings-tags">
                          {member.brings.map((item, idx) => (
                            <span key={idx} className="brings-tag">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurTeam;
