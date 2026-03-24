import { z } from 'zod';
import { router, protectedProcedure, creatorProcedure } from '../trpc';
import { users, clips, earnings, downloads } from '@/lib/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { createConnectAccount, createConnectAccountLink } from '@/lib/stripe';
import { TRPCError } from '@trpc/server';

export const creatorRouter = router({
  // Become a creator
  becomeCreator: protectedProcedure
    .mutation(async ({ ctx }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (user.isCreator) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Already a creator',
        });
      }

      const account = await createConnectAccount(user.email);

      await ctx.db
        .update(users)
        .set({
          isCreator: true,
          stripeConnectId: account.id,
        })
        .where(eq(users.id, ctx.user.id));

      const accountLink = await createConnectAccountLink(account.id);

      return { onboardingUrl: accountLink.url };
    }),

  // Get creator dashboard stats
  getDashboard: creatorProcedure
    .query(async ({ ctx }) => {
      const creatorClips = await ctx.db
        .select({
          id: clips.id,
          downloadCount: clips.downloadCount,
        })
        .from(clips)
        .where(eq(clips.creatorId, ctx.user.id));

      const totalDownloads = creatorClips.reduce((sum, clip) => sum + clip.downloadCount, 0);

      const totalEarningsResult = await ctx.db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${earnings.amount} AS NUMERIC)), 0)`,
        })
        .from(earnings)
        .where(eq(earnings.creatorId, ctx.user.id));

      const unpaidEarningsResult = await ctx.db
        .select({
          total: sql<number>`COALESCE(SUM(CAST(${earnings.amount} AS NUMERIC)), 0)`,
        })
        .from(earnings)
        .where(
          and(
            eq(earnings.creatorId, ctx.user.id),
            eq(earnings.isPaid, false)
          )
        );

      const topClips = await ctx.db
        .select()
        .from(clips)
        .where(eq(clips.creatorId, ctx.user.id))
        .orderBy(desc(clips.downloadCount))
        .limit(5);

      return {
        totalClips: creatorClips.length,
        totalDownloads,
        totalEarnings: totalEarningsResult[0]?.total || 0,
        unpaidEarnings: unpaidEarningsResult[0]?.total || 0,
        topClips,
      };
    }),

  // Get earnings history
  getEarnings: creatorProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(earnings)
        .where(eq(earnings.creatorId, ctx.user.id))
        .orderBy(desc(earnings.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  // Get clip analytics
  getClipAnalytics: creatorProcedure
    .input(z.object({ clipId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [clip] = await ctx.db
        .select()
        .from(clips)
        .where(
          and(
            eq(clips.id, input.clipId),
            eq(clips.creatorId, ctx.user.id)
          )
        )
        .limit(1);

      if (!clip) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const downloadHistory = await ctx.db
        .select({
          date: sql<string>`DATE(${downloads.downloadedAt})`,
          count: sql<number>`COUNT(*)`,
        })
        .from(downloads)
        .where(eq(downloads.clipId, input.clipId))
        .groupBy(sql`DATE(${downloads.downloadedAt})`)
        .orderBy(sql`DATE(${downloads.downloadedAt})`);

      return {
        clip,
        downloadHistory,
      };
    }),
});
