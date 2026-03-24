import { router } from '../trpc';
import { authRouter } from './auth';
import { clipsRouter } from './clips';
import { subscriptionsRouter } from './subscriptions';
import { moderationRouter } from './moderation';
import { setsRouter } from './sets';
import { creatorRouter } from './creator';

export const appRouter = router({
  auth: authRouter,
  clips: clipsRouter,
  subscriptions: subscriptionsRouter,
  moderation: moderationRouter,
  sets: setsRouter,
  creator: creatorRouter,
});

export type AppRouter = typeof appRouter;
