'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, Zap, Link as LinkIcon, PlusSquare } from 'lucide-react';

// --- SUB-COMPONENT FOR INDIVIDUAL CARDS ---
function VideoCard({ clip, index, handleDownload, copyMediaLink, downloadingId, copiedId }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log("Playback interaction required");
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:scale-[1.02]"
    >
      <div className="aspect-[9/16] bg-black relative overflow-hidden">
        {/* ✅ FEATURE 1: DYNAMIC CSS WATERMARK */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center opacity-10 group-hover:opacity-[0.05] transition-opacity duration-700">
          <span className="font-black text-[32px] tracking-[0.4em] uppercase italic rotate-[-45deg] select-none border-y border-white/20 py-2">
            ClipVault
          </span>
        </div>

        <video 
          ref={videoRef}
          src={clip.videoUrl} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
          muted 
          loop 
          playsInline
        />

        {/* Vault-X Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 overflow-hidden z-20">
          <motion.div 
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className="h-full bg-purple-500 shadow-[0_0_10px_#A855F7]"
          />
        </div>

        {/* 4K Badge */}
        <div className="absolute top-5 right-5 z-20 opacity-0 group-hover:opacity-100 transition-all">
          <div className="bg-purple-600 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-purple-500/20">
            <Zap size={10} fill="white" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">RAW 4K</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
        
        <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-1 z-30">
          <h3 className="text-xl font-black italic uppercase tracking-tighter truncate mb-4 group-hover:text-purple-400 transition-colors">
            {clip.title}
          </h3>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            {/* Download Button */}
            <button 
              onClick={(e) => handleDownload(e, clip.videoUrl, clip.title, clip.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black hover:bg-purple-500 hover:text-white px-4 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
            >
              {downloadingId === clip.id ? <Check size={14} /> : <Download size={14} />}
              {downloadingId === clip.id ? 'Saved' : 'Get Clip'}
            </button>

            {/* ✅ FEATURE 3: ADD TO SET (The Organizer) */}
            <button 
              className="bg-white/10 hover:bg-purple-500/20 backdrop-blur-md p-3 rounded-xl transition-all border border-white/10 group/plus"
              title="Add to Set"
            >
              <PlusSquare size={16} className="text-white group-hover:text-purple-400 transition-colors" />
            </button>

            {/* Direct Link Button */}
            <button 
              onClick={(e) => copyMediaLink(e, clip.videoUrl, clip.id)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl transition-all border border-white/10"
              title="Copy Direct Media URL"
            >
              {copiedId === clip.id ? <Check size={14} className="text-green-400" /> : <LinkIcon size={14} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN GRID COMPONENT ---
export default function VideoGrid({ clips }: { clips: any[] }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent, url: string, title: string, id: string) => {
    e.preventDefault(); e.stopPropagation();
    setDownloadingId(id);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '_')}_Vault.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } finally {
      setTimeout(() => setDownloadingId(null), 2000);
    }
  };

  const copyMediaLink = async (e: React.MouseEvent, url: string, id: string) => {
    e.preventDefault(); e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
    >
      {clips.map((clip, index) => (
        <VideoCard 
          key={clip.id}
          clip={clip}
          index={index}
          handleDownload={handleDownload}
          copyMediaLink={copyMediaLink}
          downloadingId={downloadingId}
          copiedId={copiedId}
        />
      ))}
    </motion.div>
  );
}