'use client';

import { useState } from 'react';
import { Upload, X, CheckCircle2, Film } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#060606] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-white mb-4 transition-all text-sm">← Back to Library</button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Upload to <span className="text-purple-500">Vault</span></h1>
          <p className="text-gray-400 mt-2">Add new cinematic content to the pro library.</p>
        </header>

        <div className="space-y-8">
          {/* DRAG & DROP AREA */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center text-center ${
              dragActive ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="h-16 w-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-4">
              <Upload className="text-purple-500" size={32} />
            </div>
            <h3 className="text-xl font-bold">Select Video Files</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">Drag and drop your MP4 or MOV files here. High-res preferred.</p>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          {/* METADATA FORM */}
          <div className="grid grid-cols-1 gap-6 bg-white/5 border border-white/10 p-8 rounded-[2rem]">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Clip Title</label>
              <input type="text" placeholder="e.g. Midnight Rain in Tokyo" className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Mood</label>
                <select className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none transition-all appearance-none">
                  <option>Cinematic</option>
                  <option>Aesthetic</option>
                  <option>Sad/Lonely</option>
                  <option>Hype/Gym</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Tags</label>
                <input type="text" placeholder="night, rain, neon" className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none transition-all" />
              </div>
            </div>

            <button className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-purple-500 hover:text-white transition-all shadow-xl">
              Publish to Vault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}