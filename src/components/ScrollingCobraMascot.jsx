import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, X, ChevronUp, Dumbbell, Flame, Volume2 } from 'lucide-react';

export default function ScrollingCobraMascot() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const tips = [
    { section: 'hero', text: "👋 Hey Athlete! I'm Kobra — let's crush your fitness goals today!", emoji: "🏋️‍♂️" },
    { section: 'features', text: "📸 Scan any food photo for instant macros or track your daily steps!", emoji: "⚡" },
    { section: 'muscle-guide', text: "💪 Master exercise form with our 40+ HD video guides!", emoji: "🔥" },
    { section: 'scanner-demo', text: "🥗 Try clicking a sample dish on the left to test the AI scanner!", emoji: "🎯" },
    { section: 'ai-coach', text: "🤖 Ask me any question in the AI Coach chat box!", emoji: "💡" },
    { section: 'calculator', text: "📊 Calculate your maintenance calories and daily step targets!", emoji: "📈" },
    { section: 'download', text: "🚀 Join 50,000+ athletes — Download FitKobra 100% Free!", emoji: "⭐" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      // Pop up mascot once user scrolls past 80px
      if (currentScroll > 80) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Update speech bubble tip based on scroll depth
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = currentScroll / pageHeight;

      if (progress < 0.15) setActiveTipIndex(0);
      else if (progress < 0.32) setActiveTipIndex(1);
      else if (progress < 0.48) setActiveTipIndex(2);
      else if (progress < 0.64) setActiveTipIndex(3);
      else if (progress < 0.80) setActiveTipIndex(4);
      else if (progress < 0.92) setActiveTipIndex(5);
      else setActiveTipIndex(6);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMascotClick = () => {
    setIsBouncing(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.9, y: 0.85 }
    });

    // Cycle to next tip
    setActiveTipIndex((prev) => (prev + 1) % tips.length);

    setTimeout(() => {
      setIsBouncing(false);
    }, 600);
  };

  if (!visible) return null;

  const currentTip = tips[activeTipIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
      
      {/* Speech Bubble popup */}
      {!minimized && (
        <div className="mb-3 max-w-[260px] sm:max-w-[300px] bg-slate-900/95 border border-[#00FF75]/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl relative animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Close speech bubble */}
          <button
            onClick={() => setMinimized(true)}
            className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 border border-white/20 text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-2.5">
            <span className="text-xl shrink-0">{currentTip.emoji}</span>
            <p className="text-xs font-semibold text-slate-100 leading-relaxed">
              {currentTip.text}
            </p>
          </div>

          {/* Speech Bubble Arrow Indicator */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r border-b border-[#00FF75]/40 transform rotate-45"></div>
        </div>
      )}

      {/* Floating Mascot Character */}
      <div className="relative group">
        
        {/* Glowing Emerald Energy Aura behind mascot */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-[#00FF75] to-[#00E5FF] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

        {/* Cute Fitness Cobra Image */}
        <div
          onClick={handleMascotClick}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isBouncing ? 'animate-bounce' : 'animate-[bounce_4s_infinite]'
          }`}
        >
          <img
            src="/media/cute-cobra-mascot-transparent.png"
            alt="FitKobra Mascot"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,255,117,0.4)]"
          />

          {/* Dumbbell Badge Indicator */}
          <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-black flex items-center gap-1">
            <Dumbbell className="w-3 h-3 fill-black" /> PRO
          </div>
        </div>

        {/* Minimize / Expand Toggle Button */}
        {minimized && (
          <button
            onClick={() => setMinimized(false)}
            className="absolute -top-2 -left-2 bg-[#00FF75] text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Tips
          </button>
        )}

      </div>

    </div>
  );
}
