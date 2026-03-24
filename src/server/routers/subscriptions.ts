import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { users, subscriptions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createCheckoutSession, createCustomerPortalSession, cancelSubscription } from '@/lib/stripe';
import { TRPCError } from '@trpc/server';

export const subscriptionsRouter = router({
  // Create checkout session
  createCheckout: protectedProcedure
    .input(
      z.object({
        plan: z.enum(['monthly', 'yearly']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const priceId = input.plan === 'monthly'
        ? process.env.STRIPE_PRICE_ID_MONTHLY!
        : process.env.STRIPE_PRICE_ID_YEARLY!;

      const session = await createCheckoutSession(
        user.id,
        user.email,
        priceId,
        user.stripeCustomerId || undefined
      );

      return { url: session.url };
    }),

  // Get current subscription
  getCurrent: protectedProcedure
    .query(async ({ ctx }) => {
      const [subscription] = await ctx.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      return subscription || null;
    }),

  // Create portal session for managing subscription
  createPortalSession: protectedProcedure
    .mutation(async ({ ctx }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user?.stripeCustomerId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No active subscription found',
        });
      }

      const session = await createCustomerPortalSession(user.stripeCustomerId);

      return { url: session.url };
    }),

  // Cancel subscription
  cancel: protectedProcedure
    .mutation(async ({ ctx }) => {
      const [subscription] = await ctx.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .orderBy(desc(subscriptions.createdAt))
        .limit(1);

      if (!subscription?.stripeSubscriptionId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No active subscription found',
        });
      }

      await cancelSubscription(subscription.stripeSubscriptionId);

      await ctx.db
        .update(subscriptions)
        .set({ cancelAtPeriodEnd: true })
        .where(eq(subscriptions.id, subscription.id));

      return { success: true };
    }),
});
