import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

export const subscriberProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user.hasActiveSubscription) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Active subscription required'
    });
  }
  return next({ ctx });
});

export const creatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user.isCreator) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Creator account required'
    });
  }
  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'moderator') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required'
    });
  }
  return next({ ctx });
});
