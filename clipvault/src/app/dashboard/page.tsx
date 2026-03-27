import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { 
  Search, LayoutGrid, Upload, TrendingUp, Settings 
} from 'lucide-react';

// ✅ FIX ERROR 2307: Changed path to include /clips/ subfolder
import VideoGrid from '@/components/clips/VideoGrid'; 

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // ✅ FIX ERROR 7034 & 7005: Added explicit type ': any[]'
  let rawClips: any[] = []; 
  
  try {
    rawClips = await db.select().from(clips).orderBy(desc(clips.createdAt));
  } catch (err) {
    console.error("Fetch error:", err);
  }

  // Deep-serialize to prevent hydration mismatches with Dates
  const allClips = JSON.parse(JSON.stringify(rawClips));

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen bg-black/50 backdrop-blur-xl">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Clip<span className="text-purple-500">Vault</span>
          </h1>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm shadow-lg">
            <LayoutGrid size={18} className="text-purple-500" /> Library
          </Link>
          <Link href="/dashboard/upload" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white font-bold text-sm transition-all group">
            <Upload size={18} className="group-hover:text-purple-500" /> Upload
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <header className="flex items-center justify-between p-8">
          <div className="relative w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="Filter archive..." 
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none focus:border-purple-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black uppercase italic tracking-tighter">Binkus123</p>
              <p className="text-[9px] font-bold text-purple-500 uppercase tracking-[0.2em]">Archivist</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 border border-white/10" />
          </div>
        </header>

        <div className="px-8 pb-12">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-black italic uppercase tracking-tighter">The Archive</h2>
             <div className="text-[10px] font-black text-gray-600 tracking-widest uppercase">
                {allClips.length} Objects Loaded
             </div>
          </div>

          {/* Render the grid component */}
          <VideoGrid clips={allClips} />
        </div>
      </main>
    </div>
  );
}