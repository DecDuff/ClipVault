'use client';

import { useState } from 'react';
import { Upload, FileCheck, Loader2, AlertCircle, Tag, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client'; 
import { getBlobToken } from '@/app/actions/blobToken';
import { saveClipToDatabase } from '@/app/actions/saveClip';

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
    const tags = formData.get('tags') as string; // Keep as string for the action

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

      // Match your action's expected type: { url, title, category, tags, hash }
      await saveClipToDatabase({
        url: newBlob.url,
        title: title,
        category: category || "General",
        tags: tags || "", // Sending as string to satisfy saveClip.ts
        hash: fileHash,
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
    <div className="min-h-screen bg-[#060606] text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <button 
            type="button"
            onClick={() => router.back()} 
            className="text-gray-500 hover:text-white mb-4 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            ← Back to Archive
          </button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Upload to <span className="text-purple-500">Vault</span>
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- DROPZONE --- */}
          <div className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center text-center ${fileName ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 bg-white/5'}`}>
            <input 
              type="file" 
              name="video" 
              accept="video/mp4,video/quicktime" 
              onChange={handleFileChange} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${fileName ? 'bg-purple-500/20 text-purple-500' : 'bg-white/5 text-gray-500'}`}>
              {fileName ? <FileCheck size={32} /> : <Upload size={32} />}
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight">
              {fileName ? "Sequence Ready" : "Select Media"}
            </h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-2">
              {fileName || "ProRes, MP4 or MOV preferred"}
            </p>
          </div>

          {/* --- FIELDS --- */}
          <div className="bg-[#0F0F0F] border border-white/5 p-8 rounded-[2rem] space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-[10px] font-black uppercase">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Clip Title</label>
              <input name="title" type="text" placeholder="Cinematic Noir #01" required className="w-full bg-black border border-white/5 rounded-xl py-4 px-5 focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-800" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Category</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-4 text-gray-700" size={16} />
                  <input name="category" type="text" placeholder="Night Drive" className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-4 text-gray-700" size={16} />
                  <input name="tags" type="text" placeholder="raw, 4k" className="w-full bg-black border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-800" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUploading} 
              className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-purple-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-purple-500/10"
            >
              {isUploading ? (
                <><Loader2 className="animate-spin" size={20} /> Analyzing Sequence...</>
              ) : (
                "Publish to Archive"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}