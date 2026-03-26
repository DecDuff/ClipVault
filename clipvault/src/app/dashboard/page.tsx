import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { 
  Play, 
  Clock, 
  Tag as TagIcon, 
  Plus, 
  LayoutDashboard, 
  Film, 
  Settings, 
  Search,
  User,
  Zap
} from 'lucide-react';

type Clip = typeof clips.$inferSelect;

export default async function DashboardPage() {
  let allClips: Clip[] = [];
  try {
    allClips = await db.select().from(clips).orderBy(desc(clips.createdAt));
  } catch (err) {
    console.error("Fetch error:", err);
  }

  return (
    <div className="flex min-h-screen bg-[#060606] text-white">
      
      {/* --- FIXED SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center italic font-black">V</div>
          <span className="text-xl font-black italic tracking-tighter uppercase">Vault</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-purple-400 font-bold text-sm transition-all">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/dashboard/library" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white font-bold text-sm transition-all">
            <Film size={18} /> My Library
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white font-bold text-sm transition-all">
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px]">
                <div className="h-full w-full bg-black rounded-full flex items-center justify-center">
                    <User size={18} className="text-gray-400" />
                </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-tight">Editor Pro</p>
              <p className="text-[10px] text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* --- TOP NAV BAR --- */}
        <header className="flex items-center justify-between mb-12">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search your vault..." 
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-purple-500/50 outline-none transition-all"
            />
          </div>

          <Link href="/dashboard/upload" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
            <Plus size={16} /> New Clip
          </Link>
        </header>

        {/* --- HERO SECTION --- */}
        <section className="mb-12">
           <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-purple-400 fill-purple-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Featured Archive</span>
           </div>
           <h2 className="text-5xl font-black italic uppercase tracking-tighter">Recently <span className="text-gray-500">Captured</span></h2>
        </section>

        {/* --- CLIP GRID --- */}
        {allClips.length === 0 ? (
          <div className="aspect-[21/9] flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem]">
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">No media found in vault</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {allClips.map((clip) => (
              <div key={clip.id} className="group flex flex-col bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-purple-500/40 transition-all duration-500 shadow-2xl">
                
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <video 
                    src={clip.videoUrl || ''} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    muted
                    loop
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60" />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-white/5 text-gray-400 border border-white/10 uppercase tracking-widest">
                      {clip.description || "Sequence"}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                      <Clock size={10} /> {clip.duration ? `${clip.duration}s` : 'RAW'}
                    </div>
                  </div>

                  <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 truncate group-hover:text-purple-400 transition-colors">
                    {clip.title}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {clip.tags?.slice(0, 3).map((tag: string) => (
                      <div key={tag} className="flex items-center gap-1 text-[9px] text-gray-500 bg-black border border-white/5 px-3 py-1.5 rounded-full lowercase">
                        <TagIcon size={8} /> {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}