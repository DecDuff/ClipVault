import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';

// Define what a "Clip" looks like for TypeScript
type Clip = typeof clips.$inferSelect;

export default async function DashboardPage() {
  let allClips: Clip[] = []; // ✨ Added the explicit type here
  
  try {
    allClips = await db.select().from(clips).orderBy(desc(clips.createdAt));
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            The <span className="text-purple-500">Vault</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Your Library for Editors</p>
        </div>
        <Link 
          href="/dashboard/upload" 
          className="bg-white text-black px-6 py-3 rounded-full font-bold uppercase text-sm hover:bg-purple-500 hover:text-white transition-all"
        >
          + Add New Clip
        </Link>
      </header>

      {allClips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
          <p className="text-gray-500 font-medium">The Vault is empty.</p>
          <p className="text-gray-700 text-sm">Upload your first masterpiece to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allClips.map((clip) => (
            <div key={clip.id} className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-purple-500/50 transition-all">
              <div className="aspect-video bg-black relative">
                <video 
                  src={clip.videoUrl || ''} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all"
                  controls
                />
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-lg truncate">{clip.title}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {clip.tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 uppercase font-black tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}