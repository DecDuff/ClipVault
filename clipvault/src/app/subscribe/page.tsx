'use client';

import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// 1. Create a sub-component for the content
function SubscribeContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  
  const plan = searchParams.get('plan') || 'monthly';

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const isYearly = plan === 'yearly';
  const price = isYearly ? "$29.99" : "$2.99";
  const period = isYearly ? "/year" : "/month";

  return (
    <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
      <h1 className="text-3xl font-bold mb-4">Complete Your Subscription</h1>
      <p className="text-gray-400 mb-8">
        Logged in as <span className="text-white">{session?.user?.email}</span>
      </p>
      
      <div className="bg-purple-600/20 border border-purple-500/50 p-6 rounded-2xl mb-8">
        <p className="text-sm uppercase tracking-widest text-purple-300 font-bold mb-2">
          {isYearly ? "Annual Access" : "Monthly Access"}
        </p>
        <p className="text-4xl font-black">{price}<span className="text-lg text-gray-400">{period}</span></p>
        {isYearly && <p className="text-xs text-green-400 mt-2 font-bold">2 MONTHS FREE INCLUDED</p>}
      </div>

      <button 
        onClick={() => alert(`Redirecting to Stripe for the ${plan} plan...`)}
        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
      >
        Proceed to Payment
      </button>
      
      <button 
        onClick={() => window.history.back()}
        className="mt-4 text-gray-500 hover:text-white text-sm underline"
      >
        Change Plan
      </button>
    </div>
  );
}

// 2. The main page component wraps it in Suspense
export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <Suspense fallback={<div className="text-white text-xl font-bold">Loading...</div>}>
        <SubscribeContent />
      </Suspense>
    </div>
  );
}