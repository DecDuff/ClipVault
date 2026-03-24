import ClipCard from '@/components/ClipCard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-24 pb-16 text-center border-b border-white/5 overflow-hidden">
        {/* Fancy Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Manage your clips with <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">ClipVault</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
            The ultimate vault for your media content. Secure, organized, and ready to share.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a href="/login" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95">
              Start Free Trial
            </a>
            <a href="/register" className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-full hover:bg-white/10 transition-all">
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* 2. CONTENT FEED */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-bold tracking-tight">Recent Clips</h2>
          <div className="h-px flex-1 bg-white/10 ml-8" />
        </div>

        {/* This creates a nice grid layout for your ClipCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* We're showing 3 cards as placeholders */}
          <ClipCard />
          <ClipCard />
          <ClipCard />
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ClipVault. All rights reserved.</p>
      </footer>
    </main>
  );
}
