import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function createContext() {
  const session = await getServerSession(authOptions);

  return {
    db,
    session,
    user: session?.user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
