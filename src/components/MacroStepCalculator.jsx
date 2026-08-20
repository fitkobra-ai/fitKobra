import React, { useState } from 'react';
import { Calculator, Flame, Footprints, Dumbbell, Zap, Sparkles, RefreshCw } from 'lucide-react';

export default function MacroStepCalculator() {
  const [goal, setGoal] = useState('fatloss'); // 'fatloss', 'muscle', 'recomp'
  const [weightKg, setWeightKg] = useState(75);
  const [heightCm, setHeightCm] = useState(178);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('1.55'); // Moderate activity

  // BMR (Mifflin-St Jeor)
  const bmr = gender === 'male' 
    ? (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5
    : (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;

  const tdee = Math.round(bmr * parseFloat(activity));

  let targetCalories = tdee;
  let recommendedSteps = 10000;

  if (goal === 'fatloss') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
    recommendedSteps = 12000;
  } else if (goal === 'muscle') {
    targetCalories = Math.round(tdee * 1.12); // 12% surplus
    recommendedSteps = 8500;
  } else {
    targetCalories = tdee;
    recommendedSteps = 10000;
  }

  // Macro split (High protein for fitness enthusiasts)
  const proteinGrams = Math.round(weightKg * 2.2); // 2.2g per kg
  const proteinCalories = proteinGrams * 4;
  const fatCalories = Math.round(targetCalories * 0.25); // 25% fats
  const fatGrams = Math.round(fatCalories / 9);
  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / 4);

  return (
    <section id="calculator" className="py-24 relative bg-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-400">
            <Calculator className="w-3.5 h-3.5" />
            FITKOBRA NUTRITION & ACTIVITY ENGINE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            CALCULATE YOUR <span className="bg-gradient-to-r from-amber-400 to-[#00FF75] bg-clip-text text-transparent">TARGET MACROS & STEPS</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Input your biological stats below to calculate your personalized daily calorie budget, macronutrient targets, and daily step goal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Input Form */}
          <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            
            {/* Goal Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-300">Select Primary Fitness Goal</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGoal('fatloss')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                    goal === 'fatloss'
                      ? 'bg-[#00FF75] text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  Fat Loss (-20%)
                </button>
                <button
                  onClick={() => setGoal('recomp')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                    goal === 'recomp'
                      ? 'bg-[#00FF75] text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  Recomp (Maintain)
                </button>
                <button
                  onClick={() => setGoal('muscle')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                    goal === 'muscle'
                      ? 'bg-[#00FF75] text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  Lean Bulk (+12%)
                </button>
              </div>
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Weekly Workout Activity</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="1.2">Sedentary (Desk Job, No Exercise)</option>
                <option value="1.375">Lightly Active (1-3 days gym / week)</option>
                <option value="1.55">Moderately Active (3-5 days heavy gym)</option>
                <option value="1.725">Very Active (6-7 days intense training)</option>
              </select>
            </div>

          </div>

          {/* Results Cards Output */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00FF75]/30 space-y-6 relative overflow-hidden">
              
              {/* Top Banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Calculated Target</span>
                  <h3 className="text-2xl font-bold font-heading text-white">Daily Target Breakdown</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-[#00FF75] text-xs font-extrabold rounded-full border border-emerald-500/30">
                  FitKobra Calculated
                </span>
              </div>

              {/* Main Calories Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/10">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" /> Maintenance TDEE
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1">{tdee} kcal</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900/90 p-4 rounded-2xl border border-emerald-500/40">
                  <div className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                    <Zap className="w-4 h-4 text-[#00FF75]" /> Target Daily Intake
                  </div>
                  <div className="text-2xl font-extrabold text-[#00FF75] mt-1">{targetCalories} kcal</div>
                </div>
              </div>

              {/* Macronutrient Ratios */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300">Target Macros (High Protein split)</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-center">
                    <div className="text-[10px] text-emerald-300 font-bold">PROTEIN</div>
                    <div className="text-lg font-extrabold text-white">{proteinGrams}g</div>
                    <div className="text-[10px] text-slate-400">{proteinCalories} kcal</div>
                  </div>

                  <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30 text-center">
                    <div className="text-[10px] text-cyan-300 font-bold">CARBS</div>
                    <div className="text-lg font-extrabold text-white">{carbGrams}g</div>
                    <div className="text-[10px] text-slate-400">{carbCalories} kcal</div>
                  </div>

                  <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 text-center">
                    <div className="text-[10px] text-amber-300 font-bold">FATS</div>
                    <div className="text-lg font-extrabold text-white">{fatGrams}g</div>
                    <div className="text-[10px] text-slate-400">{fatCalories} kcal</div>
                  </div>
                </div>
              </div>

              {/* Daily Step Target */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Footprints className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Recommended Daily Steps</div>
                    <div className="text-[11px] text-slate-400">Tracked automatically in FitKobra</div>
                  </div>
                </div>
                <div className="text-lg font-extrabold text-cyan-400">
                  {recommendedSteps.toLocaleString()} steps
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
