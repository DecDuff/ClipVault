'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react"; // Import a spinner

export default function DashboardPage() {
  const { data: session, update, status } = useSession();
  const [hasRefreshed, setHasRefreshed] = useState(false);

  useEffect(() => {
    // Only try to update the session ONCE when the page loads
    if (status === "authenticated" && !session?.user?.hasActiveSubscription && !hasRefreshed) {
      update();
      setHasRefreshed(true);
    }
  }, [status, session, update, hasRefreshed]);

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  }

  // If the DB hasn't updated yet, show a CALM pending screen
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
        </div>
      </div>
    );
  }

  // --- REST OF YOUR PRO DASHBOARD CODE STARTS HERE ---
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-black">Welcome to Pro Access</h1>
      {/* ... your dashboard grid ... */}
    </div>
  );
}