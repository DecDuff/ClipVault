import { z } from 'zod';
import { router, publicProcedure, protectedProcedure, subscriberProcedure, creatorProcedure } from '../trpc';
import { clips, downloads, favorites, users } from '@/lib/db/schema';
import { eq, desc, sql, and, ilike, or, inArray } from 'drizzle-orm';
import { searchFiltersSchema, clipUploadSchema } from '@/types';
import { TRPCError } from '@trpc/server';

export const clipsRouter = router({
  // Get clips feed with filters
  getFeed: publicProcedure
    .input(searchFiltersSchema)
    .query(async ({ ctx, input }) => {
      const { query, mood, style, scene, useCase, duration, orientation, sortBy = 'trending', limit, offset } = input;

      let conditions: any[] = [eq(clips.isHidden, false), eq(clips.isRemoved, false)];

      if (query) {
        conditions.push(
          or(
            ilike(clips.title, `%${query}%`),
            sql`${clips.tags} && ARRAY[${query}]::text[]`
          )
        );
      }

      if (mood && mood.length > 0) {
        conditions.push(sql`${clips.mood} && ARRAY[${mood.join(',')}]::text[]`);
      }

      if (style && style.length > 0) {
        conditions.push(sql`${clips.style} && ARRAY[${style.join(',')}]::text[]`);
      }

      if (scene && scene.length > 0) {
        conditions.push(sql`${clips.scene} && ARRAY[${scene.join(',')}]::text[]`);
      }

      if (useCase && useCase.length > 0) {
        conditions.push(sql`${clips.useCase} && ARRAY[${useCase.join(',')}]::text[]`);
      }

      if (duration === '0-5') {
        conditions.push(sql`${clips.duration} <= 5`);
      } else if (duration === '5-10') {
        conditions.push(sql`${clips.duration} > 5 AND ${clips.duration} <= 10`);
      } else if (duration === '10+') {
        conditions.push(sql`${clips.duration} > 10`);
      }

      if (orientation === 'vertical') {
        conditions.push(eq(clips.isVertical, true));
      } else if (orientation === 'horizontal') {
        conditions.push(eq(clips.isVertical, false));
      }

      let orderBy;
      switch (sortBy) {
        case 'new':
          orderBy = desc(clips.createdAt);
          break;
        case 'downloads':
          orderBy = desc(clips.downloadCount);
          break;
        case 'trending':
        default:
          orderBy = sql`${clips.downloadCount} * 0.7 + ${clips.viewCount} * 0.2 + ${clips.favoriteCount} * 0.1 DESC`;
      }

      const results = await ctx.db
        .select({
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
            profileImage: users.profileImage,
          },
        })
        .from(clips)
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return results;
    }),

  // Get single clip details
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select({
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
            profileImage: users.profileImage,
            isCreator: users.isCreator,
          },
        })
        .from(clips)
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(eq(clips.id, input.id))
        .limit(1);

      if (!result) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Clip not found' });
      }

      return result;
    }),

  // Get recommended clips based on a clip
  getRecommended: publicProcedure
    .input(z.object({ clipId: z.string().uuid(), limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const [baseClip] = await ctx.db
        .select()
        .from(clips)
        .where(eq(clips.id, input.clipId))
        .limit(1);

      if (!baseClip) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const recommended = await ctx.db
        .select({
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
            profileImage: users.profileImage,
          },
        })
        .from(clips)
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(
          and(
            eq(clips.isHidden, false),
            eq(clips.isRemoved, false),
            sql`${clips.id} != ${input.clipId}`,
            or(
              sql`${clips.mood} && ${baseClip.mood}`,
              sql`${clips.style} && ${baseClip.style}`,
              sql`${clips.scene} && ${baseClip.scene}`
            )
          )
        )
        .limit(input.limit);

      return recommended;
    }),

  // Download a clip (subscribers only)
  download: subscriberProcedure
    .input(z.object({ clipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [clip] = await ctx.db
        .select()
        .from(clips)
        .where(eq(clips.id, input.clipId))
        .limit(1);

      if (!clip) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Clip not found' });
      }

      const existingDownload = await ctx.db
        .select()
        .from(downloads)
        .where(
          and(
            eq(downloads.userId, ctx.user.id),
            eq(downloads.clipId, input.clipId)
          )
        )
        .limit(1);

      if (!existingDownload.length) {
        await ctx.db.insert(downloads).values({
          userId: ctx.user.id,
          clipId: input.clipId,
        });

        await ctx.db
          .update(clips)
          .set({ downloadCount: sql`${clips.downloadCount} + 1` })
          .where(eq(clips.id, input.clipId));
      }

      return { downloadUrl: clip.videoUrl };
    }),

  // Favorite a clip
  toggleFavorite: protectedProcedure
    .input(z.object({ clipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, ctx.user.id),
            eq(favorites.clipId, input.clipId)
          )
        )
        .limit(1);

      if (existing.length) {
        await ctx.db
          .delete(favorites)
          .where(
            and(
              eq(favorites.userId, ctx.user.id),
              eq(favorites.clipId, input.clipId)
            )
          );

        await ctx.db
          .update(clips)
          .set({ favoriteCount: sql`${clips.favoriteCount} - 1` })
          .where(eq(clips.id, input.clipId));

        return { isFavorited: false };
      } else {
        await ctx.db.insert(favorites).values({
          userId: ctx.user.id,
          clipId: input.clipId,
        });

        await ctx.db
          .update(clips)
          .set({ favoriteCount: sql`${clips.favoriteCount} + 1` })
          .where(eq(clips.id, input.clipId));

        return { isFavorited: true };
      }
    }),

  // Get user's favorites
  getFavorites: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
            profileImage: users.profileImage,
          },
          favoritedAt: favorites.createdAt,
        })
        .from(favorites)
        .innerJoin(clips, eq(favorites.clipId, clips.id))
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(eq(favorites.userId, ctx.user.id))
        .orderBy(desc(favorites.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  // Get user's downloads
  getDownloads: protectedProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select({
          clip: clips,
          creator: {
            id: users.id,
            username: users.username,
            profileImage: users.profileImage,
          },
          downloadedAt: downloads.downloadedAt,
        })
        .from(downloads)
        .innerJoin(clips, eq(downloads.clipId, clips.id))
        .innerJoin(users, eq(clips.creatorId, users.id))
        .where(eq(downloads.userId, ctx.user.id))
        .orderBy(desc(downloads.downloadedAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  // Upload a clip (creators only)
  upload: creatorProcedure
    .input(clipUploadSchema.extend({
      videoUrl: z.string(),
      watermarkedUrl: z.string(),
      thumbnailUrl: z.string(),
      duration: z.number(),
      width: z.number(),
      height: z.number(),
      fileSize: z.number(),
      isVertical: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [clip] = await ctx.db
        .insert(clips)
        .values({
          creatorId: ctx.user.id,
          title: input.title,
          description: input.description,
          videoUrl: input.videoUrl,
          watermarkedUrl: input.watermarkedUrl,
          thumbnailUrl: input.thumbnailUrl,
          duration: input.duration,
          width: input.width,
          height: input.height,
          fileSize: input.fileSize,
          isVertical: input.isVertical,
          tags: input.tags,
          mood: input.mood,
          style: input.style,
          scene: input.scene || [],
          useCase: input.useCase || [],
        })
        .returning();

      return clip;
    }),

  // Get creator's clips
  getCreatorClips: protectedProcedure
    .input(z.object({ creatorId: z.string().uuid().optional(), limit: z.number().default(20), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      const creatorId = input.creatorId || ctx.user.id;

      const results = await ctx.db
        .select()
        .from(clips)
        .where(eq(clips.creatorId, creatorId))
        .orderBy(desc(clips.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),
});
