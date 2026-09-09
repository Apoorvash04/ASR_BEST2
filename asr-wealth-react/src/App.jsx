import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BackToTop from './components/BackToTop/BackToTop';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import CompanyProfile from './pages/CompanyProfile/CompanyProfile';
import OurTeam from './pages/OurTeam/OurTeam';
import Leadership from './pages/Leadership/Leadership';
import MutualFunds from './pages/MutualFunds/MutualFunds';
import AlternateInvestmentFunds from './pages/AlternateInvestmentFunds/AlternateInvestmentFunds';
import SipCalculator from './pages/SipCalculator/SipCalculator';
import MfForms from './pages/MfForms/MfForms';
import MfTools from './pages/MfTools/MfTools';
import Kyc from './pages/Kyc/Kyc';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company-profile" element={<CompanyProfile />} />
          <Route path="/our-team" element={<OurTeam />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/mutual-funds" element={<MutualFunds />} />
          <Route path="/alternate-investment-funds" element={<AlternateInvestmentFunds />} />
          <Route path="/sip-calculator" element={<SipCalculator />} />
          <Route path="/mf-forms" element={<MfForms />} />
          <Route path="/mf-tools" element={<MfTools />} />
          <Route path="/kyc" element={<Kyc />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
    </Router>
  );
}

export default App;
