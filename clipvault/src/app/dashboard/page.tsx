import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Fetch data safely
  const allClips = await db.select().from(clips).orderBy(desc(clips.createdAt)).catch(() => []);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* --- SIDEBAR (Minimal Icons for testing) --- */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
            Clip<span className="text-purple-500">Vault</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="block px-4 py-3 bg-purple-600 rounded-xl text-white font-bold text-sm">
            Library
          </Link>
          <Link href="/dashboard/upload" className="block px-4 py-3 text-gray-400 hover:text-white font-bold text-sm">
            Upload
          </Link>
        </nav>

        <div className="pt-6 border-t border-white/5">
          <p className="px-4 py-2 text-xs text-gray-500 font-bold uppercase">Settings</p>
          <p className="px-4 py-2 text-xs text-gray-500 font-bold uppercase">Sign Out</p>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between p-8">
          <div className="w-[450px]">
            <input 
              type="text" 
              placeholder="Search cinematic clips..." 
              className="w-full bg-[#111] border border-white/5 rounded-full py-2.5 px-6 text-sm outline-none"
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

        {/* --- GRID --- */}
        <div className="px-8 pb-12">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">Newest Additions</h2>

          {allClips.length === 0 ? (
            <div className="aspect-[21/9] flex items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem]">
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs text-center">
                The Vault is empty.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allClips.map((clip: any) => (
                <div key={clip.id} className="flex flex-col bg-[#0F0F0F] border border-white/5 rounded-3xl overflow-hidden">
                  <div className="relative aspect-[3/4] w-full bg-[#111]">
                    {clip.videoUrl && (
                      <video 
                        src={clip.videoUrl} 
                        className="w-full h-full object-cover"
                        muted loop playsInline
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">
                        {clip.description || "Sequence"}
                      </p>
                      <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight truncate text-white">
                        {clip.title || "Untitled"}
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