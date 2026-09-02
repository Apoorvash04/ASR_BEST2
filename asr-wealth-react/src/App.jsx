import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import Offerings from './components/Offerings/Offerings';
import Leadership from './components/Leadership/Leadership';
import Blog from './components/Blog/Blog';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';

function App() {
  return (
    <>
      <Header />

      <main>
        <article>
          <Hero />
          <About />
          <WhyChooseUs />
          <Offerings />
          <Leadership />
          <Blog />
          <Contact />
        </article>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
