import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function AdSlot({ 
  slotId = "default", 
  format = "auto", 
  type = "in-feed",
  className = "" 
}) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ignore adsbygoogle push errors in dev/unapproved environments
    }
  }, []);

  // Dimensions based on ad type
  const getContainerStyle = () => {
    switch (type) {
      case 'leaderboard':
        return 'w-full max-w-[728px] min-h-[90px] mx-auto';
      case 'medium-rectangle':
        return 'w-full max-w-[300px] min-h-[250px] mx-auto';
      case 'in-feed':
      default:
        return 'w-full max-w-5xl min-h-[100px] mx-auto';
    }
  };

  return (
    <div className={`my-8 px-4 flex flex-col items-center justify-center ${className}`}>
      {/* Policy-Required Ad Attribution Label */}
      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
        Advertisement
      </span>

      {/* AdSense Container */}
      <div className={`glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 p-2 flex items-center justify-center relative ${getContainerStyle()}`}>
        {/* Live Google AdSense Tag */}
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', textAlign: 'center' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Development / Preview Placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-[#00FF75]" />
            <span>Google AdSense Space</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-600 mt-0.5">
            {type === 'leaderboard' ? '728x90 Top Banner / 320x50 Mobile' : type === 'medium-rectangle' ? '300x250 Companion Display' : 'Responsive In-Feed Banner'}
          </span>
        </div>
      </div>
    </div>
  );
}
