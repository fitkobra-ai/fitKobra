import React from 'react';
import { logoUrl } from '../data/videoLibrary';
import { Dumbbell, ShieldCheck, Heart, Lock, FileText, Trash2, AlertTriangle } from 'lucide-react';

export default function Footer({ onOpenPrivacy, onOpenTerms, onOpenDataDeletion }) {
  return (
    <footer className="bg-[#05070D] border-t border-white/10 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="FitKobra" className="w-9 h-9 rounded-xl object-cover border border-white/10" />
            <div>
              <span className="font-heading font-extrabold text-white text-base tracking-wider">
                FIT<span className="text-[#00FF75]">KOBRA</span>
              </span>
              <p className="text-[10px] text-slate-500">
                AI Fitness, Hardware Pedometer, Macro Scanner & 3D Video Form Guide
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-5 text-slate-300 font-medium text-xs">
            <a href="#features" className="hover:text-[#00FF75] transition-colors">Features</a>
            <a href="#muscle-guide" className="hover:text-[#00FF75] transition-colors">Muscle Guide</a>
            <a href="#scanner-demo" className="hover:text-[#00FF75] transition-colors">AI Scanner</a>
            <a href="#ai-coach" className="hover:text-[#00FF75] transition-colors">AI Coach</a>
            <a href="#calculator" className="hover:text-[#00FF75] transition-colors">Macro Calculator</a>
          </div>

          {/* Copyright */}
          <div className="text-slate-500 text-center md:text-right space-y-1">
            <p>© {new Date().getFullYear()} FitKobra (<span className="font-mono text-emerald-400/80">com.fitkobra.app</span>). All rights reserved.</p>
            <p className="flex items-center justify-center md:justify-end gap-1 text-[10px]">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Fitness Enthusiasts Worldwide.
            </p>
          </div>

        </div>

        {/* Legal & Compliance Footer Row */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          
          <div className="flex items-center gap-2 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#00FF75]" />
            <span>Google Play & GDPR Compliant</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-4 font-semibold text-slate-300">
            <button 
              onClick={onOpenPrivacy}
              className="flex items-center gap-1.5 hover:text-[#00FF75] transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy Policy</span>
            </button>

            <span className="text-white/20">•</span>

            <button 
              onClick={onOpenTerms}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Terms & Medical Disclaimer</span>
            </button>

            <span className="text-white/20">•</span>

            <button 
              onClick={onOpenDataDeletion}
              className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Data Deletion Request</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
