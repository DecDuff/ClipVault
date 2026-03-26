import { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// 1. Loose Type Definitions to kill the "Identical Modifiers" error
declare module "next-auth" {
  interface Session {
    user: {
      id: any;
      username: any;
      role: any;
      hasActiveSubscription: any;
      isCreator: any;
    } & DefaultSession["user"]
  }

  interface User {
    id: any;
    username: any;
    role: any;
    hasActiveSubscription: any;
    isCreator: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: any;
    username: any;
    role: any;
    hasActiveSubscription: any;
    isCreator: any;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
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
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const isPasswordValid = await compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          hasActiveSubscription: !!user.hasActiveSubscription,
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
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.isCreator = token.isCreator;
        session.user.hasActiveSubscription = token.hasActiveSubscription;

        try {
          const [dbUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1);

          if (dbUser) {
            session.user.hasActiveSubscription = !!dbUser.hasActiveSubscription;
            session.user.username = dbUser.username;
            session.user.role = dbUser.role;
          }  
        } catch (error) {
          console.error("Session sync error:", error);
        }
      }
      return session;
    },
  },
};