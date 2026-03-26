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

        // Return the user data to be encoded in the JWT
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          // Use the snake_case name from your schema here
          hasActiveSubscription: !!user.has_active_subscription,
          isCreator: user.isCreator,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.hasActiveSubscription = user.hasActiveSubscription;
        token.isCreator = user.isCreator;
      }

      // Handle session updates (manual refresh)
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.isCreator = token.isCreator as boolean;

        try {
          // FETCH LIVE STATUS FROM NEON
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1);

          if (dbUser) {
            // MAP: dbUser.has_active_subscription (Neon) -> session.user.hasActiveSubscription (App)
            session.user.hasActiveSubscription = !!dbUser.has_active_subscription;
            
            // Sync any other profile changes
            session.user.username = dbUser.username || token.username as string;
            session.user.role = dbUser.role || token.role as string;
          }  
        } catch (error) {
          console.error("Session sync error:", error);
          // Fallback to the saved token value if the database is unreachable
          session.user.hasActiveSubscription = token.hasActiveSubscription as boolean;
        }
      }
      return session;
    },
  },
};