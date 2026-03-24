import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
        password: z.string().min(8),
        name: z.string().min(1).max(50).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingEmail = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existingEmail.length) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Email already exists',
        });
      }

      const existingUsername = await ctx.db
        .select()
        .from(users)
        .where(eq(users.username, input.username))
        .limit(1);

      if (existingUsername.length) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Username already taken',
        });
      }

      const passwordHash = await hash(input.password, 10);

      const [user] = await ctx.db
        .insert(users)
        .values({
          email: input.email,
          username: input.username,
          passwordHash,
          name: input.name,
        })
        .returning({
          id: users.id,
          email: users.email,
          username: users.username,
        });

      return user;
    }),
});
