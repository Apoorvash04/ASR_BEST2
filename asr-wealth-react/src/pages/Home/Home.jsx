import React from 'react';
import Hero from '../../components/Hero/Hero';
import About from '../../components/About/About';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import Offerings from '../../components/Offerings/Offerings';
import Blog from '../../components/Blog/Blog';
import Contact from '../../components/Contact/Contact';

const Home = () => {
  return (
    <article>
      <Hero />
      <About />
      <WhyChooseUs />
      <Offerings />
      <Blog />
      <Contact />
    </article>
  );
};

export default Home;
