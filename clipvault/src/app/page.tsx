'use client';

import { ClipCard } from '@/components/clips/ClipCard';
import { NavButton } from '@/components/clips/NavButton';
import { Zap, Shield, Download, Search } from 'lucide-react';

export default function Home() {
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
            The Ultimate Vault <br/> for Short-Form Edits.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Find the perfect cinematic clips, moods, and scenes. Unlimited access for one low price. 
            Built for TikTok, Reels, and Shorts creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Loop-Proof Button */}
            <NavButton 
              href="/subscribe" 
              label="Start Your Subscription" 
              className="group relative px-10 py-4 bg-white text-black font-extrabold rounded-full transition-all hover:scale-105 active:scale-95 overflow-hidden" 
            />
            <button 
              onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} 
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Browse Pricing
            </button>
          </div>
        </div>
      </section>

      {/* --- FEATURE HIGHLIGHTS --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Zap className="text-yellow-400" />, title: "Unlimited Downloads", desc: "No per-clip fees. One sub, infinite edits." },
          { icon: <Search className="text-blue-400" />, title: "Mood-Based Search", desc: "Filter by Sad, Aesthetic, Cinematic, or POV." },
          { icon: <Download className="text-green-400" />, title: "Clean Files", desc: "Watermarked previews, high-quality final exports." },
          { icon: <Shield className="text-purple-400" />, title: "Moderated Content", desc: "Full safety system to protect your brand." }
        ].map((feat, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.07] transition-colors">
            <div className="mb-4">{feat.icon}</div>
            <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* --- SHOWCASE FEED --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Trending Now</h2>
            <p className="text-gray-400 mt-2">The most downloaded clips this week.</p>
          </div>
          <a href="/explore" className="text-purple-400 font-bold hover:text-purple-300 transition">View Full Feed →</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ClipCard 
            clip={{ id: "1", title: "Midnight Night Drive - Cinematic", watermarkedUrl: "", thumbnailUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7", downloadCount: 5400, favoriteCount: 120, tags: ["night", "drive"], mood: ["aesthetic", "lonely"] }}
            creator={{ id: "c1", username: "NightVibes", profileImage: null }}
          />
          <ClipCard 
            clip={{ id: "2", title: "Gym Motivation POV", watermarkedUrl: "", thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48", downloadCount: 12000, favoriteCount: 890, tags: ["gym", "workout"], mood: ["hype", "motivational"] }}
            creator={{ id: "c2", username: "AlphaEdits", profileImage: null }}
          />
          <ClipCard 
            clip={{ id: "3", title: "Lofi Beach Sunset", watermarkedUrl: "", thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", downloadCount: 3200, favoriteCount: 45, tags: ["beach", "nature"], mood: ["chill", "aesthetic"] }}
            creator={{ id: "c3", username: "ZenCreator", profileImage: null }}
          />
        </div>
      </section>

      {/* --- SUBSCRIPTION PLANS --- */}
      <section id="plans" className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4">Choose Your Plan</h2>
          <p className="text-gray-400">Unlock the full ClipVault experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="group p-10 bg-white/5 rounded-[2.5rem] border border-white/10 hover:border-purple-500/50 transition-all flex flex-col items-center">
            <h4 className="text-xl font-bold mb-2">Monthly Access</h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black">$2.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <ul className="space-y-4 mb-10 text-gray-400 text-center flex-1">
              <li className="flex items-center gap-2">✓ Unlimited Downloads</li>
              <li className="flex items-center gap-2">✓ Full Search Access</li>
              <li className="flex items-center gap-2">✓ Early Access to New Packs</li>
            </ul>
            <NavButton 
              href="/subscribe" 
              label="Select Monthly" 
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors" 
            />
          </div>

          {/* Yearly Plan */}
          <div className="group p-10 bg-purple-600/10 rounded-[2.5rem] border-2 border-purple-500 relative flex flex-col items-center shadow-[0_0_50px_rgba(147,51,234,0.15)]">
            <div className="absolute -top-4 bg-purple-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Best Value - 2 Months Free</div>
            <h4 className="text-xl font-bold mb-2">Annual Access</h4>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black">$29.99</span>
              <span className="text-gray-500">/year</span>
            </div>
            <ul className="space-y-4 mb-10 text-white/80 text-center flex-1">
              <li className="flex items-center gap-2">✓ Unlimited Downloads</li>
              <li className="flex items-center gap-2">✓ Full Search Access</li>
              <li className="flex items-center gap-2">✓ Custom "Build A Set" Feature</li>
              <li className="flex items-center gap-2">✓ Priority High-Res Exports</li>
            </ul>
            <NavButton 
              href="/subscribe" 
              label="Get Annual Access" 
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/40" 
            />
          </div>
        </div>
      </section>

      {/* --- CREATOR ECONOMY SECTION --- */}
      <section className="bg-white/5 py-24 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Are you a Creator?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Upload your high-quality clips and earn <span className="text-white font-bold">$0.99 for every 5,000 downloads</span>, plus massive bonuses for milestones.
          </p>
          <NavButton 
            href="/creator/dashboard" 
            label="Join as a Creator" 
            className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all" 
          />
        </div>
      </section>

      <footer className="py-20 text-center text-gray-600">
        <p className="font-bold text-white mb-4">ClipVault</p>
        <p className="max-w-xs mx-auto text-xs leading-relaxed opacity-50">
          The curated media library for the next generation of editors.
        </p>
        <div className="mt-8 text-[10px] uppercase tracking-[0.2em] opacity-40">
          &copy; {new Date().getFullYear()} CLIPVAULT LTD
        </div>
      </footer>
    </main>
  );
}