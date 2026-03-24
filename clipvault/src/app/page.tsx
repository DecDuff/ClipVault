'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black mb-4">ClipVault</h1>
      <p className="text-xl text-gray-400 mb-8 max-w-lg">
        The ultimate media vault. Secure, organized, and live.
      </p>
      <div className="flex gap-4">
        <a href="/login" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
          Log In
        </a>
        <a href="/register" className="px-8 py-3 bg-white/10 border border-white/10 font-bold rounded-full hover:bg-white/20 transition">
          Sign Up
        </a>
      </div>
    </main>
  );
}
