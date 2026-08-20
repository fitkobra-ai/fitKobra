import React from 'react';
import { Star, ShieldCheck, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Powerlifter & Physique Competitor",
      rating: 5,
      comment: "The AI food scanner is mind-blowing. I used to spend 15 minutes manually searching ingredients. Now I just snap a photo of my meal and FitKobra gets the exact macros right every time.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Elena Rostova",
      role: "CrossFit Athlete & Dietitian",
      rating: 5,
      comment: "Having 50+ real HD video demonstrations embedded with proper form cues is a game changer for my client recommendations. FitKobra is easily the best free fitness app of 2026.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "David Chen",
      role: "Bodybuilder & Marathon Runner",
      rating: 5,
      comment: "The AI Coach is surprisingly sharp! It answered my exact question on how to tweak Romanian Deadlifts to isolate hamstrings without lower back fatigue. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <section className="py-24 relative bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-[#00FF75]">
            <Star className="w-3.5 h-3.5 fill-[#00FF75]" />
            LOVED BY 50,000+ ATHLETES & ENTHUSIASTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            PROVEN RESULTS FROM <span className="text-gradient">REAL ATHLETES</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            See how FitKobra helps lifters, runners, and fitness enthusiasts transform their body composition.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div key={idx} className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* User Profile */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-11 h-11 rounded-full object-cover border border-[#00FF75]/40" />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1">
                    {rev.name}
                    <ShieldCheck className="w-4 h-4 text-[#00FF75]" />
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">{rev.role}</div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
