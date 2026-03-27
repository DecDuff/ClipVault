'use client';

import { useState, useEffect } from 'react';

export default function VideoGrid({ clips }: { clips: any[] }) {
  const [isMounted, setIsMounted] = useState(false);

  // Guard against hydration mismatch (Error #418/#423)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[9/16] bg-white/5 rounded-[2rem] animate-pulse" />
        ))}
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="aspect-video rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex items-center justify-center">
        <p className="text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px] italic">Archive Empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {clips.map((clip) => (
        <div 
          key={clip.id} 
          className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:scale-[1.02] shadow-2xl"
        >
          <div className="aspect-[9/16] bg-black relative">
            <video 
              src={clip.videoUrl} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              muted 
              loop 
              playsInline
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
              <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.25em] mb-1">
                {clip.description || 'Raw Sequence'}
              </p>
              <h3 className="text-lg font-black italic uppercase tracking-tighter truncate leading-tight">
                {clip.title}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}