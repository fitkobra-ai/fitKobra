import React, { useState, useEffect } from 'react';
import { logoUrl } from '../data/videoLibrary';
import { Smartphone, Sparkles, Menu, X, Dumbbell, Utensils, Bot, Calculator, Sun, Moon } from 'lucide-react';

export default function Header({ 
  onOpenAndroidModal, 
  onOpenIosModal, 
  activeSection, 
  setActiveSection,
  theme = 'dark',
  onToggleTheme
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'muscle-guide', label: 'Muscle Guide', icon: Dumbbell },
    { id: 'scanner-demo', label: 'AI Macro Scanner', icon: Utensils },
    { id: 'ai-coach', label: 'AI Coach', icon: Bot },
    { id: 'calculator', label: 'Macro Calculator', icon: Calculator },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/90 dark:bg-[#080B11]/95 bg-white/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-3 shadow-lg dark:shadow-2xl' 
        : 'bg-transparent py-4 sm:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FF75] to-[#00E5FF] rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img 
                src="/media/fitkobra-icon-emblem.png" 
                alt="FitKobra App Icon" 
                className="relative w-10 h-10 rounded-xl object-cover border border-[#00FF75]/50 shadow-md shadow-emerald-500/20"
              />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-wider text-slate-900 dark:text-white flex items-center gap-1">
                FIT<span className="text-[#059669] dark:text-[#00FF75]">KOBRA</span>
              </span>
              <span className="block text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase">
                AI FITNESS &amp; FORM
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 backdrop-blur-xl shadow-md dark:shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeSection === link.id
                      ? 'bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold shadow-md shadow-emerald-500/20 scale-105'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Controls & Download CTAs */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            
            {/* Dark / Light Mode Sun/Moon Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-[#00FF75] transition-all hover:scale-105 shadow-sm"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-[spin_10s_linear_infinite]" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            <button
              onClick={onOpenIosModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-cyan-400/50 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
              <span>iOS Soon</span>
            </button>

            <button
              onClick={onOpenAndroidModal}
              className="relative group overflow-hidden rounded-xl p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#00FF75] to-[#00E5FF] rounded-xl"></span>
              <span className="relative block px-4 sm:px-5 py-2 rounded-[11px] bg-white dark:bg-[#080B11] group-hover:bg-transparent transition-all duration-300">
                <span className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-[#00FF75] group-hover:text-black transition-colors whitespace-nowrap">
                  <Smartphone className="w-4 h-4" />
                  Get Android App
                </span>
              </span>
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-200 dark:border-white/10 mt-3 px-4 py-6 space-y-3 animate-in fade-in slide-in-from-top-4 bg-white/95 dark:bg-[#080B11]/95 shadow-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeSection === link.id
                    ? 'bg-[#00FF75] text-black font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAndroidModal(); }}
              className="w-full text-center py-3 bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20"
            >
              Get Free Android App
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenIosModal(); }}
              className="w-full text-center py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-xl text-sm hover:text-slate-900 dark:hover:text-white"
            >
              Notify Me for iOS Launch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
