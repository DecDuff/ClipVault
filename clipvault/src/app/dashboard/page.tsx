import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import VideoGrid from '@/components/clips/VideoGrid';
import { Layers, Zap, HardDrive, PlayCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const allClips = await db.select().from(clips).orderBy(desc(clips.createdAt));
  
  // High-end Metrics Calculations
  const totalClips = allClips.length;
  const latestClip = allClips[0];
  
  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20">
      {/* --- HERO SECTION: The Featured Asset --- */}
      {latestClip && (
        <div className="relative h-[60vh] w-full overflow-hidden border-b border-white/5">
          <video 
            src={latestClip.videoUrl} 
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-end pb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-purple-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full animate-pulse">
                Latest Archive
              </span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                Added {new Date(latestClip.createdAt!).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
              {latestClip.title}
            </h1>
            <p className="max-w-xl text-gray-400 font-medium text-lg mb-8 line-clamp-2">
              {latestClip.description || "Premium high-fidelity sequence secured in the Vault. Optimized for high-end production and seamless integration."}
            </p>
          </div>
        </div>
      )}

      {/* --- QUICK STATS BAR --- */}
      <div className="max-w-7xl mx-auto px-8 -translate-y-12 z-20 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Layers size={18}/>} label="Total Assets" value={totalClips} />
          <StatCard icon={<Zap size={18}/>} label="Storage Tier" value="Unlimited" color="text-purple-500" />
          <StatCard icon={<PlayCircle size={18}/>} label="Resolution" value="4K RAW" />
          <StatCard icon={<HardDrive size={18}/>} label="Vault Status" value="Secure" color="text-green-500" />
        </div>
      </div>

      {/* --- MAIN ARCHIVE SECTION --- */}
      <main className="max-w-7xl mx-auto px-8 pt-4">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Library Archive</h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
              Browsing all sequences in the encrypted vault
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            {/* Future Filter Buttons placeholder */}
            <div className="h-10 w-32 bg-white/5 border border-white/10 rounded-xl animate-pulse" />
          </div>
        </div>

        <VideoGrid clips={allClips} />
      </main>
    </div>
  );
}

// Internal Styled Component for Stats
function StatCard({ icon, label, value, color = "text-white" }: any) {
  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-colors group">
      <div className="flex items-center gap-3 mb-3 text-white/40 group-hover:text-purple-400 transition-colors">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-2xl font-black italic uppercase tracking-tighter ${color}`}>
        {value}
      </div>
    </div>
  );
}