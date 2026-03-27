import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let allClips: any[] = [];
  
  try {
    const data = await db.select().from(clips).orderBy(desc(clips.createdAt));
    // Completely flatten the data to strings to bypass Next.js serialization errors
    allClips = JSON.parse(JSON.stringify(data)); 
  } catch (err) {
    return <div className="p-20 text-white">Database Connection Error. Check Vercel Environment Variables.</div>;
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black tracking-tighter uppercase italic text-white">
            Clip<span className="text-purple-500">Vault</span>
          </h1>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" className="block px-4 py-3 bg-purple-600 rounded-xl text-white font-bold text-sm">Library</Link>
          <Link href="/dashboard/upload" className="block px-4 py-3 text-gray-400 hover:text-white font-bold text-sm">Upload</Link>
          <div className="px-4 py-3 text-gray-600 font-bold text-sm">Trending</div>
          <div className="px-4 py-3 text-gray-600 font-bold text-sm">Favorites</div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between p-8">
          <div className="w-[450px]">
            <div className="w-full bg-[#111] border border-white/5 rounded-full py-2.5 px-6 text-sm text-gray-500">
              Search cinematic clips...
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-sm font-black text-white">Binkus123</p>
              <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest text-right">Pro Member</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
          </div>
        </header>

        <div className="px-8 pb-12">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-white">Newest Additions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allClips.map((clip: any) => (
              <div key={clip.id} className="group flex flex-col bg-[#0F0F0F] border border-white/5 rounded-3xl overflow-hidden">
                <div className="relative aspect-[3/4] w-full bg-[#111]">
                  {clip.videoUrl && (
                    <video src={clip.videoUrl} className="w-full h-full object-cover" muted loop playsInline />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">{clip.description || 'Night Drive'}</p>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight truncate text-white">{clip.title || 'Untitled'}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}