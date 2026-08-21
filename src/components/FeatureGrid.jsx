import React from 'react';
import { Camera, Footprints, Utensils, Bot, PlayCircle, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';

export default function FeatureGrid({ onSelectFeature }) {
  const features = [
    {
      id: 'scanner-demo',
      icon: Camera,
      title: 'AI Food & Macro Scanner',
      subtitle: 'Scan any meal in seconds',
      description: 'Point your phone camera at any dish, meal, or packaged food item. FitKobra’s AI instantly identifies ingredients and calculates exact Calories, Protein, Carbs, Fats, and Fiber breakdown.',
      gradient: 'from-emerald-500/15 dark:from-[#00FF75]/20 to-emerald-950/20 dark:to-emerald-950/40',
      borderColor: 'border-emerald-500/30 dark:border-[#00FF75]/30',
      iconColor: 'text-emerald-600 dark:text-[#00FF75]',
      badge: 'AI Instant Scan'
    },
    {
      id: 'muscle-guide',
      icon: PlayCircle,
      title: '50+ HD Muscle Guide Videos',
      subtitle: 'Zero guess work exercise form',
      description: 'Access an extensive video library organized by targeted muscle groups (Chest, Back, Delts, Biceps, Triceps, Legs, Traps, Abs). Complete with step-by-step form cues and rep tempos.',
      gradient: 'from-cyan-500/15 dark:from-cyan-500/20 to-slate-200/40 dark:to-slate-900/40',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      badge: '51 HD Videos'
    },
    {
      id: 'ai-coach',
      icon: Bot,
      title: '24/7 FitKobra AI Coach',
      subtitle: 'Your personal AI trainer & nutritionist',
      description: 'Ask any question about workout splits, form tweaks, plateau breaking, or meal prep. Get immediate, science-backed guidance customized to your fitness goal.',
      gradient: 'from-purple-500/15 dark:from-purple-500/20 to-slate-200/40 dark:to-slate-900/40',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      badge: '24/7 Smart Companion'
    },
    {
      id: 'calculator',
      icon: Utensils,
      title: 'Custom Meal & Macro Plan Builder',
      subtitle: 'Tailored nutrition targets',
      description: 'Calculate maintenance calories, weight loss deficit, or muscle bulking targets. Build daily meal plans that match your exact macro ratios effortless.',
      gradient: 'from-amber-500/15 dark:from-amber-500/20 to-slate-200/40 dark:to-slate-900/40',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badge: 'Nutrition Engine'
    },
    {
      id: 'steps',
      icon: Footprints,
      title: 'Precision Step & Activity Tracker',
      subtitle: 'Daily movement & calorie burn',
      description: 'Automatic step counter with distance, active minutes, and calorie burn tracking. Set custom daily step goals and track your weekly consistency streak.',
      gradient: 'from-blue-500/15 dark:from-blue-500/20 to-slate-200/40 dark:to-slate-900/40',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      badge: 'Live Step Engine'
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#0A0E17] transition-colors duration-300">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-bold text-emerald-600 dark:text-[#00FF75]">
            <Zap className="w-3.5 h-3.5" />
            ENGINEERED FOR FITNESS ENTHUSIASTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
            EVERYTHING YOU NEED TO <span className="text-gradient">DOMINATE YOUR GOALS</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            No more switching between separate calorie apps, step counters, and YouTube tutorials. FitKobra brings it all together in one powerful, free application.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isLarge = idx === 0 || idx === 1;
            return (
              <div
                key={feature.id}
                onClick={() => onSelectFeature(feature.id)}
                className={`group relative glass-card rounded-3xl p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-sm dark:shadow-none ${
                  isLarge ? 'lg:col-span-1 border-t-2 border-emerald-500/40' : ''
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-40 group-hover:opacity-80 transition-opacity`}></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-900/90 border ${feature.borderColor} flex items-center justify-center shadow-md dark:shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border ${feature.borderColor} text-slate-700 dark:text-slate-200`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF75] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {feature.subtitle}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Trigger */}
                <div className="relative z-10 pt-6 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-[#00FF75] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
