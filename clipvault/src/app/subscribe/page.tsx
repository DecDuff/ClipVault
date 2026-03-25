'use client';

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SubscribePage() {
  const { data: session, status } = useSession();

  // Protect the page: If they somehow got here without logging in, boot them
  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
        <h1 className="text-3xl font-bold mb-4">Complete Your Subscription</h1>
        <p className="text-gray-400 mb-8">
          You are logged in as <span className="text-white font-medium">{session?.user?.email}</span>
        </p>
        
        <div className="bg-purple-600/20 border border-purple-500/50 p-6 rounded-2xl mb-8">
          <p className="text-sm uppercase tracking-widest text-purple-300 font-bold mb-2">Selected Plan</p>
          <p className="text-4xl font-black">$2.99<span className="text-lg text-gray-400">/mo</span></p>
        </div>

        <button 
          onClick={() => alert("Next step: Integrating Stripe!")}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
        >
          Proceed to Payment
        </button>
        
        <button 
          onClick={() => window.history.back()}
          className="mt-4 text-gray-500 hover:text-white text-sm"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}