import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';
import { reports, clips, strikes, users, notifications } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { reportSchema } from '@/types';
import { TRPCError } from '@trpc/server';

export const moderationRouter = router({
  // Submit a report
  submitReport: protectedProcedure
    .input(reportSchema)
    .mutation(async ({ ctx, input }) => {
      const [report] = await ctx.db
        .insert(reports)
        .values({
          reporterId: ctx.user.id,
          clipId: input.clipId,
          reason: input.reason,
          details: input.details,
        })
        .returning();

      await ctx.db
        .update(clips)
        .set({ reportCount: sql`${clips.reportCount} + 1` })
        .where(eq(clips.id, input.clipId));

      const [clip] = await ctx.db
        .select()
        .from(clips)
        .where(eq(clips.id, input.clipId))
        .limit(1);

      if (clip && clip.reportCount >= 10) {
        await ctx.db
          .update(clips)
          .set({ isHidden: true })
          .where(eq(clips.id, input.clipId));
      }

      return report;
    }),

  // Get all reports (admin)
  getAllReports: adminProcedure
    .input(
      z.object({
        status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      let conditions: any[] = [];

      if (input.status) {
        conditions.push(eq(reports.status, input.status));
      }

      const results = await ctx.db
        .select({
          report: reports,
          clip: clips,
          reporter: {
            id: users.id,
            username: users.username,
          },
        })
        .from(reports)
        .leftJoin(clips, eq(reports.clipId, clips.id))
        .leftJoin(users, eq(reports.reporterId, users.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(reports.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  // Review a report (admin)
  reviewReport: adminProcedure
    .input(
      z.object({
        reportId: z.string().uuid(),
        action: z.enum(['dismiss', 'remove_clip', 'strike_user', 'ban_user']),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [report] = await ctx.db
        .select()
        .from(reports)
        .where(eq(reports.id, input.reportId))
        .limit(1);

      if (!report) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const [clip] = await ctx.db
        .select()
        .from(clips)
        .where(eq(clips.id, report.clipId))
        .limit(1);

      if (!clip) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db
        .update(reports)
        .set({
          status: input.action === 'dismiss' ? 'dismissed' : 'resolved',
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
          reviewNotes: input.notes,
        })
        .where(eq(reports.id, input.reportId));

      if (input.action === 'remove_clip') {
        await ctx.db
          .update(clips)
          .set({
            isRemoved: true,
            removalReason: input.notes || 'Violation of community guidelines',
          })
          .where(eq(clips.id, clip.id));
      }

      if (input.action === 'strike_user' || input.action === 'ban_user') {
        const [strike] = await ctx.db
          .insert(strikes)
          .values({
            userId: clip.creatorId,
            clipId: clip.id,
            reportId: report.id,
            type: report.reason as any,
            reason: input.notes || 'Content policy violation',
            issuedBy: ctx.user.id,
          })
          .returning();

        const activeStrikes = await ctx.db
          .select()
          .from(strikes)
          .where(
            and(
              eq(strikes.userId, clip.creatorId),
              eq(strikes.isActive, true)
            )
          );

        await ctx.db.insert(notifications).values({
          userId: clip.creatorId,
          type: 'strike',
          title: 'Strike Issued',
          message: `You have received a strike for: ${input.notes || 'Content policy violation'}`,
          link: `/creator/dashboard`,
        });

        if (input.action === 'ban_user' || activeStrikes.length >= 3) {
          await ctx.db
            .update(users)
            .set({
              banType: activeStrikes.length >= 3 ? 'hard_ban' : 'upload_ban',
              banReason: input.notes,
              bannedAt: new Date(),
            })
            .where(eq(users.id, clip.creatorId));

          await ctx.db.insert(notifications).values({
            userId: clip.creatorId,
            type: 'ban',
            title: 'Account Restricted',
            message: `Your account has been ${activeStrikes.length >= 3 ? 'banned' : 'restricted'} due to multiple violations.`,
            link: `/profile`,
          });
        }
      }

      return { success: true };
    }),

  // Get user strikes
  getUserStrikes: protectedProcedure
    .query(async ({ ctx }) => {
      const results = await ctx.db
        .select()
        .from(strikes)
        .where(
          and(
            eq(strikes.userId, ctx.user.id),
            eq(strikes.isActive, true)
          )
        )
        .orderBy(desc(strikes.createdAt));

      return results;
    }),

  // Get flagged clips (admin)
  getFlaggedClips: adminProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
          },
        })
        .from(clips)
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(sql`${clips.reportCount} >= 3`)
        .orderBy(desc(clips.reportCount))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),
});
