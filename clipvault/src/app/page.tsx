'use client';

import { useSession } from "next-auth/react";
import { ClipCard } from '@/components/clips/ClipCard';
import { Zap, Shield, Download, Search, Loader2, ChevronDown, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: session, status } = useSession();

  const renderHeroButton = () => {
    if (status === "loading") {
      return <div className="px-12 py-5 bg-white/5 rounded-2xl animate-pulse"><Loader2 className="animate-spin" /></div>;
    }

    if (session?.user?.hasActiveSubscription) {
      return (
        <Link href="/dashboard" className="px-12 py-5 bg-purple-600 text-white font-black uppercase italic tracking-widest rounded-2xl transition-all hover:bg-purple-500 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
          Enter The Vault
        </Link>
      );
    }

    return (
      <Link href="/subscribe?plan=monthly" className="px-12 py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl transition-all hover:bg-purple-600 hover:text-white hover:scale-105 active:scale-95">
        Start Archiving
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      
      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Video Loop (Optional: use a high-end stock clip) */}
        <div className="absolute inset-0 z-0 opacity-30 grayscale">
            <video 
              src="https://vjs.zencdn.net/v/oceans.mp4" 
              autoPlay muted loop playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md"
          >
            <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Unlimited 4K Assets for Editors</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[120px] font-black tracking-[ -0.05em] mb-10 leading-[0.85] uppercase italic italic italic italic"
          >
            The Ultimate <br/> 
            <span className="text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] text-stroke-white">Vault.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-12 font-bold uppercase tracking-widest"
          >
            Moods. Scenes. Sequences. <br/>
            One subscription. Zero limits. Built for the next generation of storytelling.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.4 }}
             className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {renderHeroButton()}
            <button 
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} 
              className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white/10 transition-all text-[11px]"
            >
              View Pricing
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 animate-bounce opacity-20">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-4 gap-1">
        {[
          { icon: <Zap size={20} className="text-purple-500" />, title: "Unlimited", desc: "No per-clip fees." },
          { icon: <Search size={20} className="text-purple-500" />, title: "Mood Search", desc: "Sad, Energy, Noir." },
          { icon: <Download size={20} className="text-purple-500" />, title: "Clean RAWs", desc: "High-bitrate exports." },
          { icon: <Shield size={20} className="text-purple-500" />, title: "Moderated", desc: "Safety first archive." }
        ].map((feat, i) => (
          <div key={i} className="p-12 bg-[#0A0A0A] border border-white/5 hover:border-purple-500/30 transition-all group">
            <div className="mb-6 group-hover:scale-110 transition-transform">{feat.icon}</div>
            <h3 className="font-black italic uppercase text-xl mb-3 tracking-tighter">{feat.title}</h3>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest leading-loose">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* --- SUBSCRIPTION ARCHITECTURE --- */}
      <section id="plans" className="max-w-6xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Choose Your Tier</h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">Instant Access to the Full Library</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Monthly */}
          <div className="p-12 bg-[#0A0A0A] rounded-[3rem] border border-white/5 flex flex-col items-center text-center group hover:border-white/10 transition-all">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-8">Base Archive</h4>
            <div className="flex items-baseline gap-1 mb-12">
              <span className="text-7xl font-black italic uppercase tracking-tighter">$2.99</span>
              <span className="text-gray-600 font-black uppercase text-xs">/mo</span>
            </div>
            <Link href="/subscribe?plan=monthly" className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">
              Select Monthly
            </Link>
          </div>

          {/* Yearly */}
          <div className="p-12 bg-[#0A0A0A] rounded-[3rem] border-2 border-purple-600 flex flex-col items-center text-center relative shadow-[0_0_60px_rgba(168,85,247,0.1)] group">
            <div className="absolute -top-4 bg-purple-600 text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em]">Most Popular</div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-8">Annual Pass</h4>
            <div className="flex items-baseline gap-1 mb-12">
              <span className="text-7xl font-black italic uppercase tracking-tighter">$29.99</span>
              <span className="text-gray-600 font-black uppercase text-xs">/yr</span>
            </div>
            <Link href="/subscribe?plan=yearly" className="w-full py-6 bg-purple-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/40">
              Get Annual Access
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-32 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Zap size={16} fill="white" />
            </div>
            <span className="font-black italic uppercase text-2xl tracking-tighter">ClipVault</span>
        </div>
        <div className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-700">
          &copy; {new Date().getFullYear()} CLIPVAULT ARCHIVE SYSTEM
        </div>
      </footer>
    </main>
  );
}