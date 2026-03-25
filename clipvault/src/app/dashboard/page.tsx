'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
// ... your other imports

export default function DashboardPage() {
  const { data: session, update, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    // This is the magic part:
    // If they are logged in but 'hasActiveSubscription' is false,
    // tell NextAuth to re-fetch the user data from the database.
    if (status === "authenticated") {
      if (!session?.user?.hasActiveSubscription) {
        update(); // This triggers the 'jwt' callback to refresh the token
      }
      setIsChecking(false);
    }
  }, [status, session, update]);

  if (status === "loading" || isChecking) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Verifying Subscription...</div>;
  }

  // If after the refresh they STILL aren't pro, show the "Buy" screen instead of redirecting
  if (!session?.user?.hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Pending</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Stripe is processing your payment. This usually takes a few seconds. 
          Try refreshing the page in a moment.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // ... rest of your dashboard code for Pro users
  return (
    <div>
       {/* Your actual Dashboard UI goes here */}
       <h1>Welcome to the Pro Dashboard</h1>
    </div>
  );
}