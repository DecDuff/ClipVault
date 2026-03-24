import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { sets, setItems, clips, users } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { createSetSchema } from '@/types';
import { TRPCError } from '@trpc/server';

export const setsRouter = router({
  // Create a new set
  create: protectedProcedure
    .input(createSetSchema)
    .mutation(async ({ ctx, input }) => {
      const [set] = await ctx.db
        .insert(sets)
        .values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
        })
        .returning();

      return set;
    }),

  // Get user's sets
  getUserSets: protectedProcedure
    .query(async ({ ctx }) => {
      const userSets = await ctx.db
        .select()
        .from(sets)
        .where(eq(sets.userId, ctx.user.id))
        .orderBy(desc(sets.updatedAt));

      return userSets;
    }),

  // Get set with items
  getById: protectedProcedure
    .input(z.object({ setId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [set] = await ctx.db
        .select()
        .from(sets)
        .where(
          and(
            eq(sets.id, input.setId),
            eq(sets.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!set) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const items = await ctx.db
        .select({
          item: setItems,
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
          },
        })
        .from(setItems)
        .innerJoin(clips, eq(setItems.clipId, clips.id))
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(eq(setItems.setId, input.setId))
        .orderBy(setItems.order);

      return { set, items };
    }),

  // Add clip to set
  addClip: protectedProcedure
    .input(
      z.object({
        setId: z.string().uuid(),
        clipId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [set] = await ctx.db
        .select()
        .from(sets)
        .where(
          and(
            eq(sets.id, input.setId),
            eq(sets.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!set) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Set not found' });
      }

      const existingItems = await ctx.db
        .select()
        .from(setItems)
        .where(eq(setItems.setId, input.setId));

      const nextOrder = existingItems.length;

      const [item] = await ctx.db
        .insert(setItems)
        .values({
          setId: input.setId,
          clipId: input.clipId,
          order: nextOrder,
        })
        .returning();

      await ctx.db
        .update(sets)
        .set({ updatedAt: new Date() })
        .where(eq(sets.id, input.setId));

      return item;
    }),

  // Remove clip from set
  removeClip: protectedProcedure
    .input(
      z.object({
        setId: z.string().uuid(),
        clipId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [set] = await ctx.db
        .select()
        .from(sets)
        .where(
          and(
            eq(sets.id, input.setId),
            eq(sets.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!set) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db
        .delete(setItems)
        .where(
          and(
            eq(setItems.setId, input.setId),
            eq(setItems.clipId, input.clipId)
          )
        );

      await ctx.db
        .update(sets)
        .set({ updatedAt: new Date() })
        .where(eq(sets.id, input.setId));

      return { success: true };
    }),

  // Reorder clips in set
  reorderClips: protectedProcedure
    .input(
      z.object({
        setId: z.string().uuid(),
        clipIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [set] = await ctx.db
        .select()
        .from(sets)
        .where(
          and(
            eq(sets.id, input.setId),
            eq(sets.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!set) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      for (let i = 0; i < input.clipIds.length; i++) {
        await ctx.db
          .update(setItems)
          .set({ order: i })
          .where(
            and(
              eq(setItems.setId, input.setId),
              eq(setItems.clipId, input.clipIds[i])
            )
          );
      }

      await ctx.db
        .update(sets)
        .set({ updatedAt: new Date() })
        .where(eq(sets.id, input.setId));

      return { success: true };
    }),

  // Delete set
  delete: protectedProcedure
    .input(z.object({ setId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(sets)
        .where(
          and(
            eq(sets.id, input.setId),
            eq(sets.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});
