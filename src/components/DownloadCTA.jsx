import React from 'react';
import { logoUrl } from '../data/videoLibrary';
import { Smartphone, Apple, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export default function DownloadCTA({ onOpenIosModal }) {
  return (
    <section id="download" className="py-24 relative bg-[#0A0E17] overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel p-8 sm:p-14 rounded-[40px] border border-[#00FF75]/40 text-center space-y-8 bg-gradient-to-b from-slate-900/90 to-slate-950/95 shadow-2xl relative overflow-hidden">
          
          {/* Logo Badge Header */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 mx-auto">
            <img src={logoUrl} alt="FitKobra" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-heading font-extrabold text-white text-lg tracking-wider">FITKOBRA MOBILE</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
              START YOUR TRANSFORMATION <br />
              <span className="text-gradient">DOWNLOAD 100% FREE</span>
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Get instant access to AI food scanning, daily step tracking, 24/7 AI coaching, and 50+ video form guides on your Android device today!
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <a
              href="/media/fitkobra-app-mockup.jpeg" 
              download="FitKobra_Android.apk"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all"
            >
              <Smartphone className="w-5 h-5 fill-black" />
              <span>Get Android App (Free)</span>
            </a>

            <button
              onClick={onOpenIosModal}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:border-cyan-400/50"
            >
              <Apple className="w-5 h-5" />
              <span>Coming Soon to iOS</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00FF75]" /> No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00FF75]" /> Instant AI Food Detection
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00FF75]" /> 50+ HD Exercise Videos Included
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
