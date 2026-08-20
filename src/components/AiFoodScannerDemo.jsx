import React, { useState } from 'react';
import { Camera, Sparkles, Check, RefreshCw, Flame, Utensils, Award, ShieldCheck } from 'lucide-react';

export default function AiFoodScannerDemo() {
  const sampleFoods = [
    {
      id: 'food-1',
      name: 'Grilled Salmon & Quinoa Bowl',
      calories: 520,
      protein: '44g',
      carbs: '38g',
      fats: '18g',
      fiber: '6g',
      matchScore: '99.4%',
      verdict: 'High-Protein Muscle Recovery Meal — Ideal for post-workout anabolic window.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'food-[#2]',
      name: 'Avocado Toast & Egg Whites',
      calories: 380,
      protein: '24g',
      carbs: '32g',
      fats: '16g',
      fiber: '7g',
      matchScore: '98.8%',
      verdict: 'Balanced Healthy Fats & Slow Digesting Carbs — Perfect energizing breakfast.',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'food-[#3]',
      name: 'Ribeye Steak & Roasted Sweet Potato',
      calories: 680,
      protein: '56g',
      carbs: '42g',
      fats: '28g',
      fiber: '5g',
      matchScore: '99.1%',
      verdict: 'Dense Protein & Micronutrient Powerhouse — Rich in iron, zinc, and B-vitamins.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'food-[#4]',
      name: 'Greek Yogurt Protein Berry Bowl',
      calories: 290,
      protein: '32g',
      carbs: '28g',
      fats: '4g',
      fiber: '4g',
      matchScore: '99.7%',
      verdict: 'Low Fat High Casein Snack — Sustained amino acid release for muscle protection.',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const [selectedFood, setSelectedFood] = useState(sampleFoods[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanFood = (food) => {
    setIsScanning(true);
    setSelectedFood(food);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  return (
    <section id="scanner-demo" className="py-24 relative bg-[#0A0E17] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-[#00FF75]">
            <Camera className="w-3.5 h-3.5" />
            AI FOOD PHOTO RECOGNITION SIMULATOR
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            TRY THE LIVE <span className="text-gradient">AI MACRO SCANNER</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Click on any sample meal below to see how FitKobra’s computer vision AI analyzes meal photos in real-time.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Meal Selector */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Select Sample Meal Dish:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => handleScanFood(food)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    selectedFood.id === food.id
                      ? 'bg-gradient-to-r from-[#00FF75]/20 to-emerald-950/40 border-[#00FF75] text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/80 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold truncate">{food.name}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">{food.calories} kcal • {food.protein} P</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Over 1.2M Food Items In Database
              </div>
              <p className="text-[11px] text-slate-400">
                FitKobra supports custom home-cooked meals, restaurant plates, fast food, and barcode nutrition scanning.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Scanner Preview Window */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden">
              
              {/* Scan Reticle Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00FF75] animate-ping"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">FITKOBRA VISION AI v3.8</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Confidence: {selectedFood.matchScore}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Photo with Animated Scanning Laser Overlay */}
                <div className="sm:col-span-5 relative rounded-2xl overflow-hidden aspect-square border border-white/20">
                  <img
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Laser Scan Bar Animation */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500/20 animate-pulse">
                      <div className="w-full h-1 bg-[#00FF75] shadow-[0_0_15px_#00FF75] absolute top-0 animate-[bounce_1.2s_infinite]"></div>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-200 text-center font-semibold">
                    {isScanning ? 'Analyzing Macro Breakdown...' : 'Meal Verified'}
                  </div>
                </div>

                {/* Macro Data Card Output */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Scanned Dish</span>
                    <h4 className="text-xl font-bold font-heading text-white">{selectedFood.name}</h4>
                  </div>

                  {/* Macros Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400">Calories</div>
                      <div className="text-base font-extrabold text-white">{selectedFood.calories}</div>
                    </div>
                    <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-500/40 text-center">
                      <div className="text-[10px] text-emerald-300">Protein</div>
                      <div className="text-base font-extrabold text-[#00FF75]">{selectedFood.protein}</div>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400">Carbs</div>
                      <div className="text-base font-extrabold text-cyan-300">{selectedFood.carbs}</div>
                    </div>
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400">Fats</div>
                      <div className="text-base font-extrabold text-amber-300">{selectedFood.fats}</div>
                    </div>
                  </div>

                  {/* AI Dietitian Verdict */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <Award className="w-4 h-4 text-[#00FF75]" /> AI Dietitian Analysis
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedFood.verdict}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
