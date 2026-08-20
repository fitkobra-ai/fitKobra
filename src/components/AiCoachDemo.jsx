import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, User, Dumbbell, Zap, Play, Pause, Smartphone, ArrowRight, Activity, Flame, ShieldAlert, Cpu } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'shoulders',
    category: 'Hypertrophy & Form',
    title: '3D Shoulder Cap Routine',
    userMsg: 'What is the absolute best exercise setup for wide, capped 3D lateral delts?',
    aiReply: 'For maximum lateral delt width, prioritize **Cable Lateral Raises** set at wrist height. Cables maintain constant mechanical tension at the lengthened position where dumbbells drop to zero load.\n\n💡 **Form Cue:** Tilt your torso 15° forward and sweep outward in a "Y" pattern rather than straight sideways to align with the scapular plane.'
  },
  {
    id: 'protein',
    category: 'Nutrition & Macros',
    title: 'Optimal Protein & Macro Intake',
    userMsg: 'How much daily protein do I need to build lean muscle without gaining fat?',
    aiReply: 'Target **1.8 to 2.2 grams of protein per kilogram of body weight** (approx. 1.0g/lb).\n\n🍗 **Optimization Protocol:** Spread your intake across 4-5 meal pulses spaced 3-4 hours apart. Each meal should contain at least 3g of Leucine to trigger Muscle Protein Synthesis (MPS) peak.'
  },
  {
    id: 'rdl-form',
    category: 'Injury Prevention',
    title: 'Lower Back Pain & RDL Cues',
    userMsg: 'My lower back aches during Romanian Deadlifts. How do I fix my form?',
    aiReply: 'Lower back fatigue occurs when spinal extension compensates for limited hip hinge range.\n\n🛡️ **3-Step Fix:**\n1. Keep the barbell in constant contact with your shins.\n2. Push your hips straight back toward the wall as if closing a door with your glutes.\n3. Stop descent the instant your hamstrings reach maximum stretch—do NOT reach down with your arms.'
  },
  {
    id: 'preworkout',
    category: 'Performance Timing',
    title: 'Pre-Workout Nutrient Timing',
    userMsg: 'What should I eat 60 minutes before a heavy leg or chest session?',
    aiReply: 'Consume **30-40g of fast-digesting carbohydrates** paired with **20g of lean protein**.\n\n⚡ **Ideal Pre-Workout:** Oatmeal with whey protein & honey, or rice cakes with sliced banana. Keep dietary fat under 5g so digestion does not draw blood away from working muscles.'
  }
];

export default function AiCoachDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typedReply, setTypedReply] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scenario = SCENARIOS[activeTab];

  // Auto-play / Scenario Typewriter Effect
  useEffect(() => {
    setTypedReply('');
    setIsTyping(true);
    let i = 0;
    const fullText = scenario.aiReply;

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedReply(fullText.substring(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 14);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Auto-switch scenarios every 12 seconds if playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % SCENARIOS.length);
    }, 11000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const scrollToDownload = () => {
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="ai-coach" className="py-24 relative bg-[#080B11] overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00FF75]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-extrabold text-purple-400">
            <Cpu className="w-3.5 h-3.5 animate-pulse text-purple-400" />
            24/7 AI TRAINER & NUTRITION ENGINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            SEE THE <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-[#00FF75] bg-clip-text text-transparent">FITKOBRA AI COACH</span> IN ACTION
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Experience real-time form corrections, hyper-customized meal timing, and biomechanical feedback delivered instantly inside the app.
          </p>
        </div>

        {/* Motion Showcase Phone Frame */}
        <div className="max-w-4xl mx-auto">
          
          {/* Top Scenario Selector Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
            {SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => { setActiveTab(idx); setIsPlaying(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === idx
                    ? 'bg-gradient-to-r from-purple-600 to-[#00FF75] text-black font-extrabold shadow-lg shadow-purple-500/20 scale-105'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{sc.title}</span>
              </button>
            ))}

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 ml-2"
              title={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-purple-400" /> : <Play className="w-3.5 h-3.5 text-[#00FF75]" />}
              <span className="text-[11px] font-semibold">{isPlaying ? 'Autoplay ON' : 'Paused'}</span>
            </button>
          </div>

          {/* Simulated App Screen Showcase Container */}
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-purple-500/40 via-purple-900/20 to-[#00FF75]/30 shadow-2xl shadow-purple-950/50">
            <div className="bg-[#0D1117] rounded-[23px] overflow-hidden">
              
              {/* App Phone Header Bar */}
              <div className="px-6 py-4 bg-slate-950/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src="/media/cute-cobra-mascot-transparent.png" 
                      alt="FitKobra AI" 
                      className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-purple-500/40 p-1" 
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#00FF75] border-2 border-slate-950 animate-pulse"></span>
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      FitKobra AI Companion
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-2">
                      <span>● Active Voice & Form Logic</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-purple-300">{scenario.category}</span>
                    </div>
                  </div>
                </div>

                {/* Animated Waveform / Live Status Indicator */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-bold">
                  <Activity className="w-3.5 h-3.5 text-[#00FF75] animate-spin" />
                  <span>APP MOTION PREVIEW</span>
                </div>
              </div>

              {/* Chat Motion Screen Body */}
              <div className="p-6 sm:p-8 space-y-6 bg-slate-950/50 min-h-[380px] flex flex-col justify-between">
                
                <div className="space-y-6">
                  {/* User Question Bubble */}
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-xs sm:text-sm leading-relaxed rounded-tr-none shadow-md">
                      {scenario.userMsg}
                    </div>
                  </div>

                  {/* AI Response Bubble with Real-time Typing Effect */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 shadow-lg shadow-purple-500/10">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="max-w-[88%] sm:max-w-[82%] p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-slate-200 text-xs sm:text-sm leading-relaxed rounded-tl-none whitespace-pre-line shadow-xl">
                      {typedReply}
                      {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-[#00FF75] animate-pulse"></span>}
                    </div>
                  </div>
                </div>

                {/* Bottom App Footer Banner */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 -mx-6 -mb-6 p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Zap className="w-4 h-4 text-[#00FF75]" />
                    <span>Get personalized AI coaching tailored to your body data inside the mobile app.</span>
                  </div>

                  <button
                    onClick={scrollToDownload}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Download Free Mobile App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
