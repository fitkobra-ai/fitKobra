import React from 'react';
import { logoUrl } from '../data/videoLibrary';
import { Smartphone, Apple, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DownloadCTA({ onOpenAndroidModal, onOpenIosModal }) {
  return (
    <section id="download" className="py-24 relative bg-slate-50 dark:bg-[#0A0E17] overflow-hidden transition-colors duration-300">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel p-8 sm:p-14 rounded-[40px] border border-emerald-500/40 text-center space-y-8 bg-white/90 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/95 shadow-xl dark:shadow-2xl relative overflow-hidden">
          
          {/* Logo Badge Header */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mx-auto shadow-sm">
            <img src={logoUrl} alt="FitKobra" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-heading font-extrabold text-slate-900 dark:text-white text-lg tracking-wider">FITKOBRA MOBILE</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-6xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
              START YOUR TRANSFORMATION <br />
              <span className="text-gradient">DOWNLOAD 100% FREE</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Get instant access to AI food scanning, daily step tracking, 24/7 AI coaching, and 50+ video form guides on your Android device today!
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <button
              onClick={onOpenAndroidModal}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
            >
              <Smartphone className="w-5 h-5 fill-black" />
              <span>Get Android App (Free)</span>
            </button>

            <button
              onClick={onOpenIosModal}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:border-cyan-400/50 shadow-sm"
            >
              <Apple className="w-5 h-5 text-slate-800 dark:text-white" />
              <span>Coming Soon to iOS</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> Instant AI Food Detection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75]" /> 50+ HD Exercise Videos Included
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
