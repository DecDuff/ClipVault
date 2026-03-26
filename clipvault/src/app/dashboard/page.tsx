import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Play, Clock, Tag as TagIcon, Plus } from 'lucide-react';

type Clip = typeof clips.$inferSelect;

export default async function DashboardPage() {
  let allClips: Clip[] = [];
  try {
    allClips = await db.select().from(clips).orderBy(desc(clips.createdAt));
  } catch (err) {
    console.error("Fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Live Vault</span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Archive</span>
            </h1>
          </div>
          
          <Link href="/dashboard/upload" className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-sm transition-all hover:bg-purple-600 hover:text-white hover:-translate-y-1 active:translate-y-0">
            <Plus size={18} />
            <span>New Selection</span>
          </Link>
        </header>

        {/* --- GRID --- */}
        {allClips.length === 0 ? (
          <div className="group relative aspect-[21/9] flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent opacity-50" />
            <p className="relative text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Vault Empty</p>
            <p className="relative text-gray-600 text-xs italic">Awaiting your first sequence...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allClips.map((clip) => (
              <div key={clip.id} className="group relative flex flex-col bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]">
                
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <video 
                    src={clip.videoUrl || ''} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    muted
                    loop
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => {
                       e.currentTarget.pause();
                       e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <Play fill="white" size={20} className="ml-1" />
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Replaced .category with .description as per your schema */}
                    <span className="text-[9px] font-black px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                      {clip.description || "Selection"}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock size={10} /> {clip.duration ? `${clip.duration}s` : 'RAW'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 group-hover:text-purple-400 transition-colors">
                    {clip.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {clip.tags?.map((tag: string) => (
                      <div key={tag} className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full lowercase font-medium">
                        <TagIcon size={8} /> {tag}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-1 w-0 group-hover:w-full bg-purple-500 transition-all duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}