import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/db'; // Double check this path to your db instance
import { users, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Find the user by email
    const userEmail = session.customer_email!;

    // 2. Update the User table to flip the subscription flag
    await db.update(users)
      .set({ 
        hasActiveSubscription: true, 
        stripeCustomerId: session.customer as string 
      })
      .where(eq(users.email, userEmail));

    // 3. (Optional but recommended) Create a record in your Subscriptions table
    // This uses the info Stripe sends back
    const userIdResult = await db.select({ id: users.id }).from(users).where(eq(users.email, userEmail)).limit(1);
    
    if (userIdResult.length > 0) {
      await db.insert(subscriptions).values({
        userId: userIdResult[0].id,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId: session.metadata?.priceId || 'unknown', // Adjust based on your checkout metadata
        plan: (session.metadata?.plan as 'monthly' | 'yearly') || 'monthly',
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Placeholder for 30 days
      });
    }
  }

  return new NextResponse("Webhook processed", { status: 200 });
}