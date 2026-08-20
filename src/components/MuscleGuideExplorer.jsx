import React, { useState, useRef } from 'react';
import { videoLibrary, categories } from '../data/videoLibrary';
import { Play, Search, Dumbbell, Sparkles, X, CheckCircle, Flame, Filter, Zap, Volume2, VolumeX, Smartphone, ArrowRight } from 'lucide-react';

// Subcomponent for Video Card with Smooth Lazy Video Preview
function ExerciseVideoCard({ video, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between hover:border-[#00FF75]/50 transition-all duration-300"
    >
      <div className="relative aspect-video bg-slate-950 overflow-hidden">
        {isHovered ? (
          <video
            src={video.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={(e) => e.target.play().catch(() => {})}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
          />
        ) : (
          <img
            src={video.posterUrl || video.videoUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-black flex items-center justify-center shadow-lg group-hover:scale-115 transition-transform">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/80 border border-white/10 text-[#00FF75] backdrop-blur-md">
            {video.category}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-white text-sm group-hover:text-[#00FF75] transition-colors line-clamp-1">
          {video.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Target: <strong className="text-slate-200">{video.targetMuscle}</strong></span>
          <span className="text-cyan-400 font-semibold">{video.setsReps}</span>
        </div>
      </div>
    </div>
  );
}

export default function MuscleGuideExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [isModalMuted, setIsModalMuted] = useState(false);

  const modalVideoRef = useRef(null);

  // Filter video library based on category and search query
  const filteredVideos = videoLibrary.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleModalMute = () => {
    if (modalVideoRef.current) {
      const nextMuted = !isModalMuted;
      modalVideoRef.current.muted = nextMuted;
      setIsModalMuted(nextMuted);
      modalVideoRef.current.play().catch(() => {});
    }
  };

  const scrollToDownload = () => {
    setActiveVideoModal(null);
    const el = document.getElementById('download');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="muscle-guide" className="py-24 relative bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-400">
              <Dumbbell className="w-3.5 h-3.5" />
              INTERACTIVE MUSCLE GUIDE & FORM VAULT
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              MASTER YOUR FORM WITH <span className="text-gradient-cyan">50+ HD EXERCISE VIDEOS</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Say goodbye to bad form and injury risks. Explore 51 real exercise videos embedded directly into FitKobra with targeted muscle highlights and rep guidelines.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercise or muscle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/15 focus:border-[#00FF75] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00FF75] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <ExerciseVideoCard
                key={video.id}
                video={video}
                onClick={() => { setIsModalMuted(false); setActiveVideoModal(video); }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3 bg-slate-900/40 rounded-3xl border border-white/10">
            <Filter className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-slate-300 font-semibold text-sm">No exercises found matching "{searchQuery}"</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-[#00FF75] underline hover:text-white font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* HD Video Modal Popup with Audio Controls */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-4xl glass-panel bg-slate-950 rounded-3xl border border-emerald-500/30 overflow-hidden shadow-2xl space-y-0">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/80">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeVideoModal.category}
                </span>
                <h3 className="text-lg font-bold text-white">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Video + Cues */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Video Player Box with Audio Toggle */}
              <div className="lg:col-span-7 bg-black relative flex items-center justify-center min-h-[300px]">
                
                {/* Audio Unmute Toggle Button Overlay */}
                <button
                  onClick={toggleModalMute}
                  className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/20 backdrop-blur-xl text-white text-xs font-extrabold flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
                >
                  {isModalMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      <span>Click to Unmute Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#00FF75]" />
                      <span>Audio ON</span>
                    </>
                  )}
                </button>

                <video
                  ref={modalVideoRef}
                  src={activeVideoModal.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  muted={isModalMuted}
                  preload="auto"
                  onCanPlay={(e) => e.target.play().catch(() => {})}
                  className="w-full max-h-[480px] object-contain"
                />
              </div>

              {/* Form Guidance & Rep Recommendations */}
              <div className="lg:col-span-5 p-6 space-y-6 bg-slate-900/60 overflow-y-auto max-h-[480px] flex flex-col justify-between">
                
                <div className="space-y-6">
                  {/* Target Muscle Box */}
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                    <div className="text-xs text-slate-400 font-semibold uppercase">Target Muscle Group</div>
                    <div className="text-sm font-bold text-[#00FF75]">{activeVideoModal.targetMuscle}</div>
                    <div className="text-xs text-slate-300 pt-1">
                      Recommended Volume: <strong className="text-white">{activeVideoModal.setsReps}</strong>
                    </div>
                  </div>

                  {/* Form Execution Tips */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> Form Execution Cues
                    </h4>
                    <ul className="space-y-2.5">
                      {activeVideoModal.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle className="w-4 h-4 text-[#00FF75] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* App CTA */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={scrollToDownload}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00FF75] to-[#00E5FF] text-black font-extrabold text-xs flex items-center justify-center gap-2 hover:scale-102 transition-transform shadow-lg shadow-emerald-500/20"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Unlock AI Form Corrections in App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
