import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, X, Dumbbell, Gift, Copy, Check, Zap, Bot } from 'lucide-react';

export default function ScrollingCobraMascot() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const tips = [
    { text: "👋 Tap me to unlock a secret Promo Code for 10 FREE AI Credits!", emoji: "🎁" },
    { text: "📸 Scan any food photo for instant macros in the app!", emoji: "⚡" },
    { text: "💪 Master exercise form with 40+ HD video guides!", emoji: "🔥" },
    { text: "🎯 Tap a sample dish to test the AI scanner above!", emoji: "🥗" },
    { text: "🤖 Explore our 24/7 AI Trainer & Nutrition Companion!", emoji: "💡" },
    { text: "🚀 Join 50,000+ athletes — Download FitKobra 100% Free!", emoji: "⭐" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = currentScroll / pageHeight;

      if (progress < 0.20) setActiveTipIndex(0);
      else if (progress < 0.40) setActiveTipIndex(1);
      else if (progress < 0.60) setActiveTipIndex(2);
      else if (progress < 0.80) setActiveTipIndex(3);
      else if (progress < 0.92) setActiveTipIndex(4);
      else setActiveTipIndex(5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMascotClick = () => {
    setIsBouncing(true);

    // Multi-color celebratory confetti explosion
    confetti({
      particleCount: 90,
      spread: 90,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#00FF75', '#00E5FF', '#A855F7', '#FFD700', '#FF416C']
    });

    setShowReferralModal(true);
    setMinimized(false);

    setTimeout(() => {
      setIsBouncing(false);
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('FITKOBRA10');
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.85, y: 0.75 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  if (!visible) return null;

  const currentTip = tips[activeTipIndex];

  return (
    <>
      {/* Floating Mascot Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
        
        {/* Referral / Promo Banner Popup when Mascot is Clicked */}
        {showReferralModal ? (
          <div className="mb-3 max-w-[310px] sm:max-w-[340px] bg-slate-900/95 border-2 border-[#00FF75] p-5 rounded-3xl shadow-2xl backdrop-blur-xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowReferralModal(false)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-800 border border-white/20 text-slate-400 hover:text-white flex items-center justify-center text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#00FF75] uppercase tracking-wider">
                <Gift className="w-4 h-4 text-purple-400 animate-bounce" />
                <span>Secret Easter Egg Unlocked!</span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                Use this referral code when creating your account in the FitKobra app to claim <strong className="text-[#00FF75]">+10 FREE AI Coach Credits</strong>!
              </p>

              {/* Code Box with Copy Action */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-purple-500/40">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Promo Code</span>
                  <span className="text-base font-extrabold font-heading text-white tracking-widest">
                    FITKOBRA10
                  </span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-purple-500 to-[#00FF75] text-black hover:scale-105'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Speech Bubble Pointer */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r-2 border-b-2 border-[#00FF75] transform rotate-45"></div>
          </div>
        ) : (
          /* Standard Speech Tip Bubble */
          !minimized && (
            <div 
              onClick={handleMascotClick}
              className="mb-3 max-w-[260px] sm:max-w-[300px] bg-slate-900/95 border border-[#00FF75]/40 p-4 rounded-3xl shadow-2xl backdrop-blur-xl relative animate-in fade-in slide-in-from-bottom-4 duration-300 cursor-pointer hover:border-[#00FF75] transition-colors group"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized(true); }}
                className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 border border-white/20 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0">{currentTip.emoji}</span>
                <p className="text-xs font-semibold text-slate-100 leading-relaxed group-hover:text-[#00FF75] transition-colors">
                  {currentTip.text}
                </p>
              </div>

              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-900 border-r border-b border-[#00FF75]/40 transform rotate-45"></div>
            </div>
          )
        )}

        {/* Floating Mascot Character Button */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#00FF75] via-purple-500 to-[#00E5FF] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

          <div
            onClick={handleMascotClick}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${
              isBouncing ? 'animate-bounce' : 'animate-[bounce_4s_infinite]'
            }`}
            title="Click me for a free Promo Code!"
          >
            <img
              src="/media/cute-cobra-mascot-transparent.png"
              alt="FitKobra Mascot"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,255,117,0.4)]"
            />

            {/* Dumbbell / Promo Badge */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-[#00FF75] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-lg border border-black flex items-center gap-1">
              <Gift className="w-3 h-3 fill-black animate-pulse" /> FREE 10 CREDITS
            </div>
          </div>

          {minimized && (
            <button
              onClick={handleMascotClick}
              className="absolute -top-2 -left-2 bg-[#00FF75] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 hover:scale-105"
            >
              <Gift className="w-3.5 h-3.5" /> Get Code
            </button>
          )}
        </div>

      </div>
    </>
  );
}
