'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, update, status } = useSession();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  // --- DEBUG LOGS (Step 1) ---
  useEffect(() => {
    if (status === "authenticated") {
      console.log("--- DEBUG IDENTITY CHECK ---");
      console.log("Session User ID:", session?.user?.id);
      console.log("Session Email:", session?.user?.email);
      console.log("Has Active Sub (Current Session):", session?.user?.hasActiveSubscription);
      console.log("----------------------------");
    }
  }, [session, status]);

  useEffect(() => {
    const checkSubscription = async () => {
      // If the app thinks they aren't pro, try one manual refresh of the session
      if (status === "authenticated" && !session?.user?.hasActiveSubscription && !hasRefreshed) {
        console.log("Triggering session update to check DB...");
        await update(); 
        setHasRefreshed(true);
      }
    };
    checkSubscription();
  }, [status, session?.user?.hasActiveSubscription, update, hasRefreshed]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // If the DB hasn't updated yet or session is stuck, show the pending screen
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
        <header className="mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            The Vault <span className="text-purple-500 text-sm ml-2 not-italic">PRO ACCESS</span>
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, {session?.user?.username || session?.user?.email}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Your Dashboard Content Goes Here */}
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