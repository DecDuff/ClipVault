'use client';

import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SubscribeContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const plan = searchParams.get('plan') || 'monthly';

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error: " + (data.error || "Could not create checkout session"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      </div>

      <button 
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
      >
        {loading ? "Redirecting to Stripe..." : "Proceed to Payment"}
      </button>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <SubscribeContent />
      </Suspense>
    </div>
  );
}