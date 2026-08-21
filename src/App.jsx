import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import MuscleGuideExplorer from './components/MuscleGuideExplorer';
import AiFoodScannerDemo from './components/AiFoodScannerDemo';
import AiCoachDemo from './components/AiCoachDemo';
import MacroStepCalculator from './components/MacroStepCalculator';
import Testimonials from './components/Testimonials';
import DownloadCTA from './components/DownloadCTA';
import Footer from './components/Footer';
import AdSlot from './components/AdSlot';
import AndroidDownloadModal from './components/AndroidDownloadModal';
import IosModal from './components/IosModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import DataDeletionModal from './components/DataDeletionModal';
import ScrollingCobraMascot from './components/ScrollingCobraMascot';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('fitkobra_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDataDeletionModalOpen, setIsDataDeletionModalOpen] = useState(false);

  // Sync theme to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('fitkobra_theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('fitkobra_theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check URL hash on load & hashchange for direct linking (e.g. website.com/#privacy)
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#privacy' || hash === '#privacy-policy') {
        setIsPrivacyModalOpen(true);
      } else if (hash === '#terms' || hash === '#disclaimer') {
        setIsTermsModalOpen(true);
      } else if (hash === '#data-deletion' || hash === '#delete-account') {
        setIsDataDeletionModalOpen(true);
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  const handleSelectFeature = (featureId) => {
    setActiveSection(featureId);
    const element = document.getElementById(featureId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] font-['Inter',sans-serif] selection:bg-[#00FF75] selection:text-black transition-colors duration-300">
      
      {/* Navigation Header */}
      <Header 
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenIosModal={() => setIsIosModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Hero Section */}
      <Hero 
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenIosModal={() => setIsIosModalOpen(true)} 
      />

      {/* Top Leaderboard Google AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSlot 
          slotId="header-leaderboard" 
          type="leaderboard"
          className="my-4"
        />
      </div>

      {/* Feature Grid */}
      <FeatureGrid onSelectFeature={handleSelectFeature} />

      {/* Muscle Video Guide Explorer */}
      <MuscleGuideExplorer />

      {/* AI Food & Macro Scanner Simulator */}
      <AiFoodScannerDemo />

      {/* In-Feed Google AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4">
        <AdSlot 
          slotId="mid-content-feed" 
          type="in-feed"
          className="my-6"
        />
      </div>

      {/* AI Coach Chat Simulator */}
      <AiCoachDemo />

      {/* Interactive Calorie & Step Calculator */}
      <MacroStepCalculator />

      {/* Social Proof & Testimonials */}
      <Testimonials />

      {/* Download CTA Banner */}
      <DownloadCTA 
        onOpenAndroidModal={() => setIsAndroidModalOpen(true)}
        onOpenIosModal={() => setIsIosModalOpen(true)} 
      />

      {/* Footer */}
      <Footer 
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenTerms={() => setIsTermsModalOpen(true)}
        onOpenDataDeletion={() => setIsDataDeletionModalOpen(true)}
      />

      {/* Modals */}
      <AndroidDownloadModal 
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
      />

      <IosModal 
        isOpen={isIosModalOpen} 
        onClose={() => setIsIosModalOpen(false)} 
      />

      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => {
          setIsPrivacyModalOpen(false);
          if (window.location.hash.includes('privacy')) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
          }
        }} 
      />

      <TermsOfServiceModal 
        isOpen={isTermsModalOpen} 
        onClose={() => {
          setIsTermsModalOpen(false);
          if (window.location.hash.includes('terms') || window.location.hash.includes('disclaimer')) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
          }
        }} 
      />

      <DataDeletionModal 
        isOpen={isDataDeletionModalOpen} 
        onClose={() => {
          setIsDataDeletionModalOpen(false);
          if (window.location.hash.includes('deletion') || window.location.hash.includes('delete')) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
          }
        }} 
      />

      {/* Scroll-Interactive Floating Cute Fitness Cobra Mascot */}
      <ScrollingCobraMascot />

    </div>
  );
}
