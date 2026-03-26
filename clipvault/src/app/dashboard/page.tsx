import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { 
  Search, LayoutGrid, Upload, TrendingUp, Heart, History, Settings, LogOut 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let allClips = [];
  
  try {
    const result = await db.select().from(clips).orderBy(desc(clips.createdAt));
    // Ensure we are working with a clean array
    allClips = JSON.parse(JSON.stringify(result)); 
  } catch (err) {
    console.error("Database Fetch Error:", err);
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <p className="text-gray-500">Database connection error. Check Vercel Logs.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
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
          {/* ... keeping the rest of your nav links ... */}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between p-8">
          <div className="relative w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search cinematic clips..." className="w-full bg-[#111] border border-white/5 rounded-full py-2.5 pl-12 pr-4 text-sm outline-none" />
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
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Newest Additions</h2>

          {allClips.length === 0 ? (
            <div className="aspect-[21/9] flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem]">
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">The Vault is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allClips.map((clip: any) => (
                <div key={clip.id} className="group flex flex-col bg-[#0F0F0F] border border-white/5 rounded-3xl overflow-hidden transition-all hover:border-white/20">
                  <div className="relative aspect-[3/4] w-full bg-[#111]">
                    <video 
                      src={clip.videoUrl} 
                      className="w-full h-full object-cover"
                      muted loop
                      onMouseOver={(e) => e.currentTarget.play()}
                      onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">
                        {/* We use typeof check to prevent rendering objects/arrays */}
                        {typeof clip.description === 'string' ? clip.description : 'Selection'}
                      </p>
                      <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight truncate">
                        {typeof clip.title === 'string' ? clip.title : 'Untitled Clip'}
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