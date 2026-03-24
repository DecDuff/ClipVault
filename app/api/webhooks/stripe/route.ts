import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { users, subscriptions, earnings, notifications } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId || !session.subscription) {
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db
          .update(users)
          .set({
            hasActiveSubscription: true,
            stripeCustomerId: session.customer as string,
          })
          .where(eq(users.id, userId));

        await db.insert(subscriptions).values({
          userId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          plan: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
          status: 'active',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        });

        await db.insert(notifications).values({
          userId,
          type: 'download',
          title: 'Subscription Active',
          message: 'Your subscription is now active! You can download unlimited clips.',
          link: '/explore',
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await db
          .update(subscriptions)
          .set({
            status: subscription.status as any,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

        const [sub] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (sub) {
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          await db
            .update(users)
            .set({ hasActiveSubscription: isActive })
            .where(eq(users.id, sub.userId));
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const [sub] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
          .limit(1);

        if (sub) {
          await db
            .update(users)
            .set({ hasActiveSubscription: false })
            .where(eq(users.id, sub.userId));

          await db
            .update(subscriptions)
            .set({ status: 'canceled' })
            .where(eq(subscriptions.id, sub.id));
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
