'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Zap } from 'lucide-react';

export default function VideoGrid({ clips }: { clips: any[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const copyToClipboard = async (e: React.MouseEvent, url: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-[9/16] bg-white/5 rounded-[2rem] animate-pulse" />
        ))}
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="aspect-[21/9] rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center gap-4">
        <Zap className="text-gray-800" size={40} />
        <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-[10px] italic">Archive Empty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {clips.map((clip) => (
        <div 
          key={clip.id} 
          className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:scale-[1.02] hover:shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)]"
        >
          <div className="aspect-[9/16] bg-black relative">
            {/* The Video Layer */}
            <video 
              src={clip.videoUrl} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
              muted 
              loop 
              playsInline
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />

            {/* Top Info Badge */}
            <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/90">
                  4K RAW
                </span>
              </div>
            </div>

            {/* Bottom Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
            
            <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-1">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.25em] translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                {clip.description || 'Raw Sequence'}
              </p>
              
              <h3 className="text-xl font-black italic uppercase tracking-tighter truncate leading-tight mb-4 transform group-hover:text-purple-50 transition-colors duration-300">
                {clip.title}
              </h3>

              {/* Action Bar */}
              <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 pointer-events-auto">
                <button 
                  onClick={(e) => copyToClipboard(e, clip.videoUrl, clip.id)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-purple-500/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl transition-all group/btn"
                >
                  {copiedId === clip.id ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} className="group-hover/btn:text-purple-400 transition-colors" />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {copiedId === clip.id ? 'Copied' : 'Source'}
                  </span>
                </button>

                {/* Tag Pills */}
                <div className="flex gap-1.5">
                  {clip.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[7px] font-black border border-white/5 bg-white/5 px-2.5 py-1 rounded-lg uppercase tracking-widest text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}