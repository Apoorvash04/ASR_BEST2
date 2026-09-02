import React from 'react';
import { motion } from 'framer-motion';
import { IoTimeOutline } from 'react-icons/io5';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './Blog.css';

const blogPosts = [
  {
    id: 1,
    title: 'Strategic Asset Allocation: Navigating Market Cycles with Institutional Discipline',
    category: 'Wealth Strategy',
    date: 'August 28, 2026',
    image: '/assets/images/blog-1.jpg',
    width: 644,
    height: 363,
    isLarge: true,
    description: 'At ASR Wealth, we combine 15+ years of institutional treasury experience with calibrated risk models to build resilient multi-asset portfolios that protect capital and compound across generations.'
  },
  {
    id: 2,
    title: 'Why Direct PMS Outperforms Conventional Investment Vehicles in Volatile Markets',
    category: 'Portfolio Management',
    date: 'August 14, 2026',
    image: '/assets/images/blog-2.jpg',
    width: 202,
    height: 162,
    isLarge: false
  },
  {
    id: 3,
    title: 'Understanding Alternative Investment Funds (AIF): Category I, II & III Explained',
    category: 'Alternative Assets',
    date: 'July 30, 2026',
    image: '/assets/images/blog-3.png',
    width: 202,
    height: 162,
    isLarge: false
  },
  {
    id: 4,
    title: 'Succession & Intergenerational Wealth: How Modern Families Secure Their Legacy',
    category: 'Family Office',
    date: 'July 18, 2026',
    image: '/assets/images/blog-4.png',
    width: 202,
    height: 162,
    isLarge: false
  }
];

const Blog = () => {
  const largePost = blogPosts.find(p => p.isLarge);
  const smallPosts = blogPosts.filter(p => !p.isLarge);

  return (
    <section className="section blog" id="blog" aria-label="blog">
      <div className="container">

        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <p className="section-subtitle text-center has-before">Market Insights & Blog</p>

          <h2 className="h2 section-title text-center">
            Popular <span className="has-before">wealth insights</span>
          </h2>
        </motion.div>

        <motion.ul 
          className="blog-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Large Featured Blog Post */}
          {largePost && (
            <motion.li key={largePost.id} variants={fadeInUp}>
              <div className="blog-card large">
                <figure className="card-banner">
                  <img 
                    src={largePost.image} 
                    width={largePost.width} 
                    height={largePost.height} 
                    loading="lazy" 
                    alt={largePost.title} 
                    className="img-cover" 
                  />
                </figure>

                <div className="card-content">
                  <div className="wrapper">
                    <span className="tag">{largePost.category}</span>

                    <span className="publish-date">
                      <IoTimeOutline aria-hidden="true" />
                      <span className="span">{largePost.date}</span>
                    </span>
                  </div>

                  <h3 className="card-title">
                    <a href="#contact">{largePost.title}</a>
                  </h3>

                  <p className="card-text">
                    {largePost.description}
                  </p>
                </div>
              </div>
            </motion.li>
          )}

          {/* Small Blog Posts Stack */}
          {smallPosts.map((post) => (
            <motion.li key={post.id} variants={fadeInUp}>
              <div className="blog-card">
                <figure className="card-banner">
                  <img 
                    src={post.image} 
                    width={post.width} 
                    height={post.height} 
                    loading="lazy" 
                    alt={post.title} 
                    className="img-cover" 
                  />
                </figure>

                <div className="card-content">
                  <div className="wrapper">
                    <span className="tag">{post.category}</span>

                    <span className="publish-date">
                      <IoTimeOutline aria-hidden="true" />
                      <span className="span">{post.date}</span>
                    </span>
                  </div>

                  <h3 className="h3 card-title">
                    <a href="#contact">{post.title}</a>
                  </h3>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

      </div>
    </section>
  );
};

export default Blog;
