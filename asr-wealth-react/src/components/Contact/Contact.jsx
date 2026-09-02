import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IoLocationOutline, 
  IoCallOutline, 
  IoMailOutline, 
  IoArrowForward 
} from 'react-icons/io5';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! Your consultation request has been received.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <>
      {/* ── Pixology Newsletter Section ── */}
      <section 
        className="section newsletter has-bg-image" 
        aria-label="newsletter"
        style={{ backgroundImage: "url('/assets/images/newsletter-bg.jpg')" }}
      >
        <div className="container">

          <motion.figure 
            className="newsletter-banner"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="/assets/images/newsletter-banner.png" 
              width="355" 
              height="356" 
              loading="lazy"
              alt="ASR Wealth Newsletter" 
              className="w-100" 
            />
          </motion.figure>

          <motion.div 
            className="newsletter-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.p variants={fadeInUp} className="section-subtitle has-before">
              Get Every Market Update
            </motion.p>

            <motion.h2 variants={fadeInUp} className="h2 section-title">
              Subscribe to our newsletter for exclusive market insights & wealth reports
            </motion.h2>

            <motion.form 
              variants={fadeInUp} 
              className="newsletter-form" 
              onSubmit={handleNewsletterSubmit}
            >
              <input 
                type="email" 
                name="email_address" 
                placeholder="Enter your email address" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required 
                className="email-field" 
              />

              <button type="submit" className="btn btn-secondary has-before has-after">
                <span className="span">{subscribed ? 'Subscribed! ✓' : 'Subscribe'}</span>
                <IoArrowForward aria-hidden="true" />
              </button>
            </motion.form>
          </motion.div>

        </div>
      </section>

      {/* ── Contact Consultation Section ── */}
      <section id="contact" className="section contact">
        <div className="container">
          <motion.div 
            className="contact-header text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
          >
            <p className="section-subtitle has-before text-center">Get In Touch</p>
            <h2 className="h2 section-title text-center">
              Let's Start a <span className="has-before">Conversation</span>
            </h2>
          </motion.div>

          <div className="contact-content">
            <motion.div 
              className="contact-form-container"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Full Name" 
                    required 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email Address" 
                    required 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="Phone Number" 
                    required 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell us about your wealth goals..." 
                    rows="5" 
                    required 
                    className="form-input"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary has-before has-after w-100">
                  Schedule Consultation
                </button>
              </form>
            </motion.div>

            <motion.div 
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
            >
              <motion.div className="info-card" variants={fadeInUp}>
                <div className="info-icon">
                  <IoLocationOutline />
                </div>
                <div className="info-text">
                  <h3 className="h4">Visit Us</h3>
                  <p>Mumbai & Regional Client Hubs, India</p>
                </div>
              </motion.div>

              <motion.div className="info-card" variants={fadeInUp}>
                <div className="info-icon">
                  <IoCallOutline />
                </div>
                <div className="info-text">
                  <h3 className="h4">Call Us</h3>
                  <p>+91 98200 12345 / +91 22 6789 0000</p>
                </div>
              </motion.div>

              <motion.div className="info-card" variants={fadeInUp}>
                <div className="info-icon">
                  <IoMailOutline />
                </div>
                <div className="info-text">
                  <h3 className="h4">Email Us</h3>
                  <p>advisory@asrwealth.com</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
