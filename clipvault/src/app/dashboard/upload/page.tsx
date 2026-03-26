'use client';

import { useState } from 'react';
import { Upload, FileCheck, Loader2, AlertCircle, Tag, Smile, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client'; 
import { getBlobToken } from '@/app/actions/blobToken';

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
    const tags = formData.get('tags') as string;

    if (!file || file.size === 0) {
      setError("Please select a video file first.");
      setIsUploading(false);
      return;
    }

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload/process',
        // @ts-ignore
        onUploadGenerateClientToken: async (pathname: string) => {
          return await getBlobToken(pathname);
        },
      });

      console.log("Uploaded successfully:", newBlob.url);
      
      // Database save logic will go here next!
      
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(err.message || "Upload failed. Check your Vercel Token.");
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-white mb-4 transition-all text-sm">← Back</button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Upload to <span className="text-purple-500">Vault</span></h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. FILE UPLOAD BOX */}
          <div className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center text-center ${fileName ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
            <input type="file" name="video" accept="video/mp4,video/quicktime" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${fileName ? 'bg-green-500/20' : 'bg-purple-600/20'}`}>
              {fileName ? <FileCheck className="text-green-500" size={32} /> : <Upload className="text-purple-500" size={32} />}
            </div>
            <h3 className="text-xl font-bold">{fileName ? "Ready to Sync" : "Select Video"}</h3>
            <p className="text-gray-500 text-sm mt-2">{fileName || "MP4 or MOV preferred"}</p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-6">
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            
            {/* 2. TITLE BOX */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Clip Title</label>
              <input name="title" type="text" placeholder="Enter title..." required className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none" />
            </div>

            {/* 3. CATEGORY BOX */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Category</label>
              <div className="relative">
                <LayoutGrid className="absolute left-4 top-3 text-gray-500" size={18} />
                <input name="category" type="text" placeholder="e.g. Gaming, Vlog, Tutorial..." className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500/50 outline-none" />
              </div>
            </div>

            {/* 4. TAGS BOX */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Tags</label>
              <div className="relative">
                <Tag className="absolute left-4 top-3 text-gray-500" size={18} />
                <input name="tags" type="text" placeholder="e.g. #epic, #win, #setup..." className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-purple-500/50 outline-none" />
              </div>
            </div>

            <button disabled={isUploading} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isUploading ? <><Loader2 className="animate-spin" size={20} /> Syncing with Cloud...</> : "Publish to Vault"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}