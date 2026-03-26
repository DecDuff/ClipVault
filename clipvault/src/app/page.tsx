'use client';

import { useSession } from "next-auth/react"; // Added this
import { ClipCard } from '@/components/clips/ClipCard';
import { NavButton } from '@/components/clips/NavButton';
import { Zap, Shield, Download, Search, Loader2 } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession(); // Get user status

  // Create a helper for the CTA button
  const renderHeroButton = () => {
    if (status === "loading") {
      return (
        <div className="px-10 py-4 bg-white/10 rounded-full">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      );
    }

    if (session?.user?.hasActiveSubscription) {
      return (
        <NavButton 
          href="/dashboard" 
          label="Enter The Vault" 
          className="group relative px-10 py-4 bg-purple-600 text-white font-extrabold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(147,51,234,0.3)]" 
        />
      );
    }

    return (
      <NavButton 
        href="/subscribe?plan=monthly" 
        label="Start Your Subscription" 
        className="group relative px-10 py-4 bg-white text-black font-extrabold rounded-full transition-all hover:scale-105 active:scale-95 overflow-hidden" 
      />
    );
  };

  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-purple-500/30 font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="relative px-6 pt-32 pb-20 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[700px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-xs font-medium text-purple-200 uppercase tracking-wider">Unlimited Downloads for Editors</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            The Ultimate Vault <br/>