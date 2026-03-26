'use client';

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link"; // Added for navigation
import { 
  Loader2, 
  LogOut, 
  Search, 
  LayoutDashboard, 
  Film, 
  Heart, 
  History, 
  Settings,
  Download,
  Upload // Added Upload icon
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, update, status } = useSession();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (status === "authenticated" && !session?.user?.hasActiveSubscription && !hasRefreshed) {
        await update(); 
        setHasRefreshed(true);
      }
    };
    checkSubscription();
  }, [status, session?.user?.hasActiveSubscription, update, hasRefreshed]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user?.hasActiveSubscription) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#060606] text-white font-sans">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="mb-10 px-2">
          <Link href="/">
            <h1 className="text-xl font-black italic tracking-tighter uppercase cursor-pointer">
              Clip<span className="text-purple-500">Vault</span>
            </h1>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/dashboard">
            <SidebarItem icon={<LayoutDashboard size={18}/>} label="Library" active />
          </Link>
          <Link href="/dashboard/upload">
            <SidebarItem icon={<Upload size={18}/>} label="Upload" />
          </Link>
          <SidebarItem icon={<Film size={18}/>} label="Trending" />
          <SidebarItem icon={<Heart size={18}/>} label="Favorites" />
          <SidebarItem icon={<History size={18}/>} label="Downloads" />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-1">
          <SidebarItem icon={<Settings size={18}/>} label="Settings" />
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col">
        
        {/* TOP BAR */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search cinematic clips, moods, tags..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{session?.user?.username || 'User'}</p>
              <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest">Pro Member</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 border border-white/10" />
          </div>
        </header>

        {/* DASHBOARD GRID */}
        <section className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black italic uppercase">Newest Additions</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">All Moods</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">Cinematic</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group relative aspect-[9/16] bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                
                <button className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                  <Download size={18} className="text-white" />
                </button>

                <div className="absolute bottom-6 left-6 z-20">
                  <p className="text-xs font-bold text-purple-400 uppercase mb-1">Night Drive</p>
                  <h3 className="text-lg font-black leading-tight italic">CINEMATIC NOIR #0{i}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Updated SidebarItem helper to handle nav links better
function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer ${
      active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}