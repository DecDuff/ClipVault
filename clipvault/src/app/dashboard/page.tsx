'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { CheckCircle2, Play, Download, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Protect the route: if not logged in, kick them to login
  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Vault...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white font-sans">
      {/* --- TOP NAVIGATION --- */}
      <nav className="border-b border-white/5 bg-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <LayoutDashboard className="text-purple-500" />
          ClipVault <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full ml-2 uppercase">Pro Access</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-400 hidden md:inline">{session?.user?.email}</span>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* --- SUCCESS STATE --- */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-500/20 to-emerald-500/5 border border-green-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="bg-green-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <CheckCircle2 className="text-black h-8 w-8" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-white">Welcome to the Vault, {session?.user?.name || 'Creator'}.</h2>
            <p className="text-green-500/80 font-medium">Your subscription is active. All download limits have been lifted.</p>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight italic">Premium Feed</h1>
            <p className="text-gray-500">Exclusive 4K cinematic clips for your next edit.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold border border-white/10">All Moods</span>
            <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold border border-white/10">Recent</span>
          </div>
        </div>

        {/* --- CLIP GRID (PLACEHOLDERS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group relative aspect-video bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
               <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 h-12 w-12 group-hover:text-purple-500 group-hover:scale-110 transition-all" />
               
               <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">Cinematic</p>
                    <p className="font-bold">Clip #{i}042</p>
                  </div>
                  <button className="bg-white text-black p-3 rounded-2xl hover:bg-purple-500 hover:text-white transition-colors">
                    <Download size={18} />
                  </button>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
           <p className="text-gray-600 font-medium">End of the feed. More drops coming Friday.</p>
        </div>
      </main>
    </div>
  );
}