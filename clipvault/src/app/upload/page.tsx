'use client';

import { useState } from 'react';
import { Upload, FileCheck, Loader2, AlertCircle, Tag, LayoutGrid, Smile, Camera, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client'; 
import { getBlobToken } from '@/app/actions/blobToken';
import { saveClipToDatabase } from '@/app/actions/saveClip';
import Sidebar from '@/components/clips/layout/Sidebar';

async function computeHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError(null);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    setIsUploading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tagsRaw = formData.get('tags') as string;
    const mood = formData.get('mood') as string;
    const style = formData.get('style') as string;

    if (!file || file.size === 0) {
      setError("Please select a video file first.");
      setIsUploading(false);
      return;
    }

    try {
      const fileHash = await computeHash(file);

      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/process',
        // @ts-ignore
        onUploadGenerateClientToken: async (pathname: string) => {
          return await getBlobToken(pathname);
        },
      });

      // ✨ Saving with full Metadata for "Top of the Line" Search
      await saveClipToDatabase({
        url: newBlob.url,
        title: title,
        description: category || "General",
        hash: fileHash,
        tags: tagsRaw ? tagsRaw.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        mood: mood ? [mood] : [], // Captured from select
        style: style ? [style] : [], // Captured from select
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(err.message || "Upload failed. Try again.");
      setIsUploading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <Sidebar />
      
      <main className="flex-1 ml-20 p-8 lg:p-12 flex justify-center items-start overflow-y-auto">
        <div className="w-full max-w-4xl">
          <header className="mb-12 flex flex-col gap-4">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <ChevronLeft size={14} /> Back to Archive
            </button>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">
              Asset <span className="text-purple-500">Intake</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] ml-1">Securely encrypt and archive new sequences</p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Video Dropzone */}
            <div className="space-y-6">
              <div className={`relative aspect-[9/16] border-2 border-dashed rounded-[3rem] transition-all flex flex-col items-center justify-center text-center overflow-hidden group ${fileName ? 'border-purple-500/40 bg-purple-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}>
                <input 
                  type="file" 
                  name="video" 
                  accept="video/mp4,video/quicktime" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                />
                
                <div className={`h-20 w-20 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 ${fileName ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                  {fileName ? <FileCheck size={32} /> : <Upload size={32} />}
                </div>
                
                <h3 className="text-xl font-black italic uppercase tracking-tight z-10">
                  {fileName ? "File Validated" : "Drop Sequence"}
                </h3>
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mt-2 z-10 px-6">
                  {fileName || "ProRes, 4K RAW or MOV preferred"}
                </p>

                {/* Aesthetic Background Glow */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
              </div>
            </div>

            {/* Right: Metadata Fields */}
            <div className="bg-[#0A0A0A] border border-white/5 p-8 lg:p-10 rounded-[3rem] space-y-8 shadow-2xl relative">
              {error && (
                <div className="flex items-center gap-3 text-red-400 bg-red-400/10 p-5 rounded-2xl border border-red-400/20 text-[10px] font-black uppercase tracking-widest">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Clip Title</label>
                  <input name="title" type="text" placeholder="E.G. NEON_STREET_01" required className="w-full bg-black border border-white/5 rounded-2xl py-5 px-6 focus:border-purple-500/50 outline-none transition-all font-bold tracking-tight text-lg placeholder:text-gray-800 uppercase" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                      <Smile size={12} /> Mood
                    </label>
                    <select name="mood" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-purple-500 transition-all cursor-pointer">
                      <option value="Aesthetic">Aesthetic</option>
                      <option value="Dark">Dark/Moody</option>
                      <option value="Hype">Hype/Energy</option>
                      <option value="Sad">Sad/Lonely</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 ml-1 flex items-center gap-2">
                      <Camera size={12} /> Style
                    </label>
                    <select name="style" className="w-full bg-black border border-white/5 rounded-2xl p-5 text-[10px] font-black uppercase tracking-widest appearance-none outline-none focus:border-purple-500 transition-all cursor-pointer">
                      <option value="Night Drive">Night Drive</option>
                      <option value="Urban">Urban/City</option>
                      <option value="Nature">Nature/Travel</option>
                      <option value="Cinematic">Cinematic POV</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">Keywords / Search Tags</label>
                  <div className="relative group">
                    <Tag className="absolute left-5 top-5 text-gray-700 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <input name="tags" type="text" placeholder="RAW, 4K, 60FPS" className="w-full bg-black border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-[10px] font-black tracking-widest uppercase focus:border-purple-500 outline-none transition-all placeholder:text-gray-800" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploading} 
                className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[11px] hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl"
              >
                {isUploading ? (
                  <><Loader2 className="animate-spin" size={18} /> Archiving Sequence...</>
                ) : (
                  "Secure to Vault"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}