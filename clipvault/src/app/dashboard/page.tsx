import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { 
  Search, 
  LayoutGrid, 
  Upload, 
  TrendingUp, 
  Heart, 
  History, 
  Settings, 
  LogOut 
} from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensures the dashboard always pulls fresh data

export default async function DashboardPage() {
  let allClips = [];
  
  try {
    allClips = await db.select().from(clips).orderBy(desc(clips.createdAt));
  } catch (err) {
    console.error("Database Fetch Error:", err);
    // This will catch the error so the page doesn't go white
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <p className="text-gray-500">Database connection lost. Check your Neon credentials.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Clip<span className="text-purple-500">Vault</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-purple-600 rounded-xl text-white font-bold text-sm">
            <LayoutGrid size={18} /> Library
          </Link>
          <Link href="/dashboard/upload" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white font-bold text-sm transition-all">
            <Upload size={18} /> Upload
          </Link>
          <Link href="/dashboard/trending" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white font-bold text-sm transition-all">
            <TrendingUp size={18} /> Trending
          </Link>
          <Link href="/dashboard/favorites" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white font-bold text-sm transition-all">
            <Heart size={18} /> Favorites
          </Link>
          <Link href="/dashboard/downloads" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white font-bold text-sm transition-all">
            <History size={18} /> Downloads
          </Link>
        </nav>

        <div className="space-y-1 pt-6 border-t border-white/5">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white font-bold text-sm transition-all text-xs">
            <Settings size={16} /> Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white font-bold text-sm transition-all text-xs">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between p-8">
          <div className="relative w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search cinematic clips, moods, tags..." 
              className="w-full bg-[#111] border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none focus:border-white/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-sm font-black text-white">Binkus123</p>
              <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Pro Member</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          </div>
        </header>

        <div className="px-8 pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Newest Additions</h2>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">All Moods</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">Cinematic</button>
            </div>
          </div>

          {allClips.length === 0 ? (
            <div className="aspect-[21/9] flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem]">
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs text-center">
                The Vault is currently empty.<br/>
                <span className="text-gray-700 normal-case font-medium">Upload a clip to get started.</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allClips.map((clip) => (
                <div key={clip.id} className="group flex flex-col bg-[#0F0F0F] border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-white/20">
                  <div className="relative aspect-[3/4] w-full bg-[#111]">
                    {clip.videoUrl ? (
                      <video 
                        src={clip.videoUrl} 
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseOver={(e) => e.currentTarget.play()}
                        onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-xs text-gray-600">No Video Data</div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent">
                      <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">
                        {/* Fallback to 'Selection' if description is null */}
                        {clip.description || "Selection"}
                      </p>
                      <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight truncate">
                        {clip.title || "Untitled Clip"}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}