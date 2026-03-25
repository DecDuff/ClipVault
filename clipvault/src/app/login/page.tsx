'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-center mb-8 tracking-tight">ClipVault</h1>
        
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 transition outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 transition outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
            Log In
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0a0a0a] px-2 text-gray-500">Or continue with</span></div>
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition flex items-center justify-center gap-2"
        >
          Google
        </button>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account? <a href="/register" className="text-white font-bold hover:underline">Create one</a>
        </p>
      </div>
    </main>
  );
}
