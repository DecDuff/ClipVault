import { NextResponse } from 'next/server'; // Fixed import for App Router
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', 
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    
    const priceId = plan === 'yearly' 
      ? process.env.STRIPE_YEARLY_PRICE_ID 
      : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json({ error: "Price ID not found in environment variables" }, { status: 500 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      // This uses your Vercel URL to send them back after payment
      success_url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/subscribe`,
      customer_email: session.user.email!,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}