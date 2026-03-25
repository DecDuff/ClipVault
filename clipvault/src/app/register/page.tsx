'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // This calls your backend API to save the user to Neon
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) router.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
        <h1 className="text-3xl font-black text-center mb-8 tracking-tight">Join ClipVault</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            placeholder="Username" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 outline-none"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-500 transition shadow-lg shadow-purple-900/20">
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}
