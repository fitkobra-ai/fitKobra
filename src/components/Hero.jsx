import React, { useState } from 'react';
import { appMockupUrl, videoLibrary } from '../data/videoLibrary';
import HeroMascotBanner from './HeroMascotBanner';
import { Smartphone, Apple, Flame, Footprints, Camera, Sparkles, CheckCircle2, Play, Activity } from 'lucide-react';

export default function Hero({ onOpenAndroidModal, onOpenIosModal }) {
  const featuredVideo = videoLibrary[0] || {};
  const [isPlayingPreview, setIsPlayingPreview] = useState(true);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic Glowing Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-[#00FF75]/10 dark:bg-[#00FF75]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Fitness Cobra Pill Banner */}
            <div className="flex justify-center lg:justify-start">
              <HeroMascotBanner />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-heading text-slate-900 dark:text-white leading-[1.1]">
              SCAN MEALS. <br />
              <span className="text-gradient">TRACK STEPS.</span> <br />
              MASTER FORM.
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              FitKobra combines instant <strong className="text-slate-900 dark:text-white">AI Food &amp; Macro Scanning</strong>, daily step counting, a 24/7 <strong className="text-emerald-600 dark:text-emerald-400">AI Coach</strong>, and <strong className="text-cyan-600 dark:text-cyan-400">50+ HD Video Form Guides</strong> into one sleek, 100% free app.
            </p>

            {/* Core Feature Bullet Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75] shrink-0" />
                <span>Instant AI Macro Photo Scan</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75] shrink-0" />
                <span>50+ HD Muscle Guide Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75] shrink-0" />
                <span>Live AI Fitness &amp; Diet Coach</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#00FF75] shrink-0" />
                <span>Daily Steps &amp; Calorie Burn</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenAndroidModal}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300"
              >
                <Smartphone className="w-5 h-5 fill-black" />
                <span>Download Free on Android</span>
              </button>

              <button
                onClick={onOpenIosModal}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 font-bold text-base flex items-center justify-center gap-2 transition-all hover:border-cyan-400/50 hover:text-slate-900 dark:hover:text-white shadow-sm"
              >
                <Apple className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span>Coming Soon to iOS</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-[10px] uppercase tracking-wider font-extrabold border border-cyan-400/30">
                  Notify Me
                </span>
              </button>
            </div>

            {/* Launch Badges */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-black font-bold text-[10px]">AI</div>
                  <div className="w-7 h-7 rounded-full bg-cyan-500 border border-black flex items-center justify-center text-black font-bold text-[10px]">★</div>
                  <div className="w-7 h-7 rounded-full bg-emerald-400 border border-black flex items-center justify-center text-black font-bold text-[10px]">PRO</div>
                </div>
                <span><strong className="text-slate-900 dark:text-white">Early Access</strong> 2026 Edition</span>
              </div>
              <div className="h-4 w-px bg-slate-300 dark:bg-white/15"></div>
              <div><strong className="text-slate-900 dark:text-white">100% Free</strong> • No Subscription Paywalls</div>
            </div>

          </div>

          {/* Right Column: Interactive Device Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Phone Frame Glass Wrapper */}
            <div className="relative w-full max-w-[360px] aspect-[9/18] bg-slate-900 dark:bg-slate-950/80 rounded-[45px] p-3 border-4 border-slate-700 dark:border-slate-800/80 shadow-2xl shadow-emerald-500/20 glass-card">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800 mr-2"></div>
                <div className="w-2 h-2 rounded-full bg-[#00FF75]/80"></div>
              </div>

              {/* Phone Display Content */}
              <div className="w-full h-full rounded-[36px] bg-[#0A0E17] overflow-hidden flex flex-col pt-8 pb-4 px-4 relative">
                
                {/* App Header Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  <div className="flex items-center gap-2">
                    <img src={appMockupUrl} alt="App" className="w-6 h-6 rounded-lg object-cover" />
                    <span className="font-heading font-bold text-xs text-white">FITKOBRA PRO</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Activity className="w-3 h-3 animate-pulse" /> LIVE
                  </span>
                </div>

                {/* Card 1: Steps & Calorie Metric */}
                <div className="bg-gradient-to-r from-emerald-950/50 to-slate-900/60 p-3 rounded-2xl border border-emerald-500/20 mb-3">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 text-[#00FF75]" /> Today's Steps
                    </span>
                    <span className="text-emerald-400 font-bold">8,450 / 10,000</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                    <div className="bg-gradient-to-r from-[#00FF75] to-[#00E5FF] h-full w-[84.5%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> 620 kcal burned</span>
                    <span>4.8 km walked</span>
                  </div>
                </div>

                {/* Card 2: AI Macro Scanner Live Preview */}
                <div className="bg-slate-900/80 p-3 rounded-2xl border border-white/10 mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" /> AI Food Scan: Grilled Salmon
                    </span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-1.5 py-0.5 rounded">99% Match</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="bg-slate-800/80 p-1.5 rounded-lg border border-white/5">
                      <div className="text-[9px] text-slate-400">Calories</div>
                      <div className="text-xs font-bold text-white">480</div>
                    </div>
                    <div className="bg-emerald-950/60 p-1.5 rounded-lg border border-emerald-500/30">
                      <div className="text-[9px] text-emerald-300">Protein</div>
                      <div className="text-xs font-bold text-emerald-400">42g</div>
                    </div>
                    <div className="bg-slate-800/80 p-1.5 rounded-lg border border-white/5">
                      <div className="text-[9px] text-slate-400">Carbs</div>
                      <div className="text-xs font-bold text-white">28g</div>
                    </div>
                    <div className="bg-slate-800/80 p-1.5 rounded-lg border border-white/5">
                      <div className="text-[9px] text-slate-400">Fats</div>
                      <div className="text-xs font-bold text-white">18g</div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Embedded Muscle Form Video Snippet */}
                <div className="relative flex-1 bg-black rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-end">
                  {featuredVideo.videoUrl && (
                    <video
                      src={featuredVideo.videoUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      onCanPlay={(e) => e.target.play().catch(() => {})}
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  <div className="relative z-10 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#00FF75] text-black px-2 py-0.5 rounded-md">
                        {featuredVideo.category || 'Form Guide'}
                      </span>
                      <span className="text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                        HD Form Video
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{featuredVideo.title || 'Barbell Form Guide'}</h4>
                    <p className="text-[10px] text-emerald-400">{featuredVideo.targetMuscle}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Floating Glass Pill Badges */}
            <div className="absolute -bottom-4 -left-4 glass-panel p-3 rounded-2xl border border-emerald-500/30 flex items-center gap-3 shadow-xl z-30 hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-[#00FF75]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">AI Meal Recognition</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Instant Photo Macros</div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 glass-panel p-3 rounded-2xl border border-cyan-500/30 flex items-center gap-3 shadow-xl z-30 hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">50+ Form Videos</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Perfect Technique</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
