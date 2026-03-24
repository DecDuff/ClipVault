import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    role: string;
    hasActiveSubscription: boolean;
    isCreator: boolean;
  }

  interface Session {
    user: User & {
      email: string;
      name?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    role: string;
    hasActiveSubscription: boolean;
    isCreator: boolean;
  }
}
