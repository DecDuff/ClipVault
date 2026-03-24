export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          ClipVault
        </h1>
      </div>
      <div className="mt-12 text-center">
        <p className="text-xl text-gray-400">Secure. Fast. Simple. Your media vault is ready.</p>
        <div className="mt-8 flex gap-4 justify-center">
          <a href="/login" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200">Get Started</a>
          <a href="/about" className="border border-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-900">Learn More</a>
        </div>
      </div>
    </main>
  );
}
