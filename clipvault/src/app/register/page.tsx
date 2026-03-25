'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="bg-white/5 p-10 rounded-3xl border border-white/10 text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to ClipVault</h1>
        <button 
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
