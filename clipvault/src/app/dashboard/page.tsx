'use client';

import { useSession, signOut } from "next-auth/react"; // Added signOut
import { useEffect, useState } from "react";
import { Loader2, LogOut } from "lucide-react"; // Added LogOut icon

export default function DashboardPage() {
  const { data: session, update, status } = useSession();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  // 1. SAFE REDIRECT: Only redirect if status is definitively "unauthenticated"
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  // 2. DEBUG LOGS
  useEffect(() => {
    if (status === "authenticated") {
      console.log("--- DEBUG IDENTITY CHECK ---");
      console.log("Session User ID:", session?.user?.id);
      console.log("Has Active Sub:", session?.user?.hasActiveSubscription);
      console.log("----------------------------");
    }
  }, [session, status]);

  // 3. AUTO-REFRESH: If they are logged in but sub is false, refresh once to check DB
  useEffect(() => {
    const checkSubscription = async () => {
      if (status === "authenticated" && !session?.user?.hasActiveSubscription && !hasRefreshed) {
        console.log("Refreshing session to sync with Neon...");
        await update(); 
        setHasRefreshed(true);
      }
    };
    checkSubscription();
  }, [status, session?.user?.hasActiveSubscription, update, hasRefreshed]);

  // --- RENDERING LOGIC ---

  // Show loader while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Prevent flicker during redirect
  if (status === "unauthenticated") {
    return null;
  }

  // If session exists but subscription is false, show "Confirming Access"
  if (!session?.user?.hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-[#060606] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 max-w-md">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-4 italic">Confirming Access...</h1>
          <p className="text-gray-400 mb-8">
            Stripe is finalizing your secure access to the Vault. This usually takes 10-30 seconds.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-purple-500 hover:text-white transition-all"
          >
            Refresh Now
          </button>
          <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">
            Logged in as: {session?.user?.email}
          </p>
        </div>
      </div>
    );
  }

  // --- PRO DASHBOARD CONTENT ---
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        {/* UPDATED HEADER WITH SIGN OUT */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              The Vault <span className="text-purple-500 text-sm ml-2 not-italic">PRO ACCESS</span>
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {session?.user?.username || session?.user?.email}</p>
          </div>

          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-64 flex items-center justify-center">
            <p className="text-gray-500 font-bold uppercase">Pro Feature #1</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-64 flex items-center justify-center">
            <p className="text-gray-500 font-bold uppercase">Pro Feature #2</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-64 flex items-center justify-center">
            <p className="text-gray-500 font-bold uppercase">Pro Feature #3</p>
          </div>
        </div>
      </div>
    </div>
  );
}