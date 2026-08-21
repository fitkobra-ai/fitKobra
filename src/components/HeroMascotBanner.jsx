import React from 'react';
import { Sparkles, Dumbbell, Zap, Flame } from 'lucide-react';

export default function HeroMascotBanner() {
  return (
    <div className="relative inline-flex items-center gap-4 py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-[#00FF75]/50 transition-all cursor-pointer">
      
      {/* Floating Cute Mascot Avatar */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#00FF75] bg-slate-900 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
        <img
          src="/media/fitkobra-icon-emblem.png"
          alt="FitKobra App Icon"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-left space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <span>MEET KOBRA AI</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00FF75] text-[10px] font-extrabold uppercase border border-emerald-500/30">
            100% Free
          </span>
        </div>
        <div className="text-[11px] text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Scan Meals • Track Steps • Master Form</span>
        </div>
      </div>

    </div>
  );
}
