import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// This extends the built-in session types so TypeScript doesn't complain
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      role?: string;
      hasActiveSubscription?: boolean;
      isCreator?: boolean;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    username?: string | null;
    role?: string | null;
    hasActiveSubscription?: boolean | null;
    isCreator?: boolean | null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        // Check if user exists and has a password
        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        if (user.banType === 'hard_ban') {
          throw new Error('Your account has been banned');
        }

        // IMPORTANT: Return all the data we want to keep in the cookie
        return {
          id: user.id, // This is your new UUID
          email: user.email,
          username: user.username,
          role: user.role,
          hasActiveSubscription: user.hasActiveSubscription,
          isCreator: user.isCreator,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On initial login, 'user' is passed here from authorize()
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.hasActiveSubscription = user.hasActiveSubscription;
        token.isCreator = user.isCreator;
      }

      // Handle session updates (e.g. after buying a subscription)
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // 1. First, pull the basic info from the token as usual
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.isCreator = token.isCreator as boolean;

        // 2. FETCH LIVE STATUS: Check the DB for the subscription status
        // This ensures that as soon as Stripe updates Neon, the app sees it.
        try {
          const [dbUser] = await db
            .select({ hasActiveSubscription: users.hasActiveSubscription })
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1);

          if (dbUser) {
            session.user.hasActiveSubscription = !!dbUser.has_active_subscription;
          }  
        } catch (error) {
          console.error("Session sync error:", error);
          // Fallback to token value if DB check fails
          session.user.hasActiveSubscription = token.hasActiveSubscription as boolean;
        }
      }
      return session;
    },
  },
};