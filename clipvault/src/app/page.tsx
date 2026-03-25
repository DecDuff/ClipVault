'use client';
import { ClipCard } from '@/components/ClipCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060606] text-white selection:bg-purple-500/30 font-sans">
      {/* 1. HERO SECTION WITH GLOW EFFECTS */}
      <section className="relative px-6 pt-32 pb-24 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-purple-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Your Content, <br/>Perfectly Vaulted.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ClipVault is the premier destination for creators to secure, organize, and showcase their media clips with lightning-fast performance and professional-grade security.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="px-10 py-4 bg-white text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95">
              Get Started for Free
            </a>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="px-10 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
              View Plans
            </button>
          </div>
        </div>
      </section>

      {/* 2. DESCRIPTION & FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-y border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-colors group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔒</div>
            <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
            <p className="text-gray-400 text-sm">Your clips are encrypted before they ever leave your device. Only you hold the keys.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-colors group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast Uploads</h3>
            <p className="text-gray-400 text-sm">Powered by AWS S3, our global edge network ensures your media is always accessible instantly.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-pink-500/50 transition-colors group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
            <h3 className="text-xl font-bold mb-2">Global Sharing</h3>
            <p className="text-gray-400 text-sm">Share password-protected links with clients or fans anywhere in the world in one click.</p>
          </div>
        </div>
      </section>

      {/* 3. SUBSCRIPTION PLANS (PRICING) */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">Choose the plan that fits your creative workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col">
            <h4 className="text-lg font-bold mb-2">Starter</h4>
            <div className="text-4xl font-black mb-6">$0<span className="text-lg font-normal text-gray-500">/mo</span></div>
            <ul className="space-y-4 mb-10 text-gray-400 text-sm flex-1">
              <li>✓ 5GB Storage</li>
              <li>✓ Standard Support</li>
              <li>✓ Basic Analytics</li>
            </ul>
            <a href="/register" className="w-full py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 text-center">Current Plan</a>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="p-8 bg-purple-600/10 rounded-3xl border-2 border-purple-500 relative flex flex-col scale-105 shadow-[0_0_40px_rgba(147,51,234,0.2)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase">Most Popular</div>
            <h4 className="text-lg font-bold mb-2">Pro</h4>
            <div className="text-4xl font-black mb-6">$19<span className="text-lg font-normal text-gray-500">/mo</span></div>
            <ul className="space-y-4 mb-10 text-white text-sm flex-1">
              <li>✓ 100GB Storage</li>
              <li>✓ Priority 24/7 Support</li>
              <li>✓ Advanced Clip Insights</li>
              <li>✓ Custom Branding</li>
            </ul>
            <a href="/register" className="w-full py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-500 text-center shadow-lg shadow-purple-900/20">Upgrade Now</a>
          </div>

          {/* Studio Plan */}
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col">
            <h4 className="text-lg font-bold mb-2">Studio</h4>
            <div className="text-4xl font-black mb-6">$49<span className="text-lg font-normal text-gray-500">/mo</span></div>
            <ul className="space-y-4 mb-10 text-gray-400 text-sm flex-1">
              <li>✓ 1TB Storage</li>
              <li>✓ Dedicated Manager</li>
              <li>✓ Full API Access</li>
              <li>✓ White-label Portals</li>
            </ul>
            <a href="/register" className="w-full py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 text-center">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* 4. RECENT CLIPS PREVIEW (Using your ClipCard) */}
      <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-3xl font-bold mb-12 text-center">Community Showreel</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
<ClipCard 
  clip={{
    id: "1",
    title: "Amazing Clip Example",
    watermarkedUrl: "",
    thumbnailUrl: "https://images.unsplash.com",
    downloadCount: 1200,
    favoriteCount: 450,
    tags: ["viral", "cool"],
    mood: ["energetic", "dark"]
  }}
  creator={{
    id: "user1",
    username: "CreatorName",
  }}
/>

        </div>
      </section>

      <footer className="py-12 text-center text-gray-600 border-t border-white/5 text-sm">
        <p>&copy; {new Date().getFullYear()} ClipVault. All rights reserved.</p>
      </footer>
    </main>
  );
}
