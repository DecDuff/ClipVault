'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  FolderHeart, 
  Download, 
  BarChart3, 
  PlusSquare, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Vault', href: '/dashboard' },
    { icon: Search, label: 'Explore', href: '/dashboard/explore' },
    { icon: FolderHeart, label: 'Sets', href: '/dashboard/sets' },
    { icon: Download, label: 'Downloads', href: '/dashboard/downloads' },
  ];

  const creatorItems = [
    // ✅ FIXED: Points to root /upload instead of /dashboard/upload
    { icon: PlusSquare, label: 'Upload', href: '/upload' }, 
    { icon: BarChart3, label: 'Creator Stats', href: '/dashboard/creator' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[#0A0A0A]/80 backdrop-blur-2xl border-r border-white/5 z-50 transition-all duration-500 group overflow-hidden flex flex-col">
      {/* Logo Section */}
      <div className="p-6 mb-8 flex items-center gap-4">
        <div className="h-8 w-8 bg-purple-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all">
          <Zap size={18} fill="white" className="text-white" />
        </div>
        <span className="font-black italic uppercase tracking-tighter text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          ClipVault
        </span>
      </div>

      {/* Main Navigation (User/Editor) */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="hidden group-hover:block text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] ml-4 mb-4">
          Library
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group/item ${
              pathname === item.href 
                ? "bg-purple-600/10 text-purple-500 border border-purple-500/20" 
                : "text-gray-500 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon size={22} />
            <span className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        ))}

        {/* Creator Tools Section */}
        <div className="pt-8">
          <p className="hidden group-hover:block text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] ml-4 mb-4">
            Studio
          </p>
          {creatorItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group/item ${
                pathname === item.href 
                  ? "bg-purple-600/10 text-purple-500 border border-purple-500/20" 
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={22} />
              <span className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="p-4 space-y-2 border-t border-white/5">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
            pathname === '/dashboard/settings' 
              ? "bg-purple-600/10 text-purple-500 border border-purple-500/20" 
              : "text-gray-500 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings size={22} />
          <span className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100">Settings</span>
        </Link>
        <button className="w-full flex items-center gap-4 p-4 text-gray-500 hover:text-red-500 transition-colors">
          <LogOut size={22} />
          <span className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100">Logout</span>
        </button>
      </div>
    </aside>
  );
}