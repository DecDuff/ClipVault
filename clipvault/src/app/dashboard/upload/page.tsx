'use client';

import { useState } from 'react';
import { Upload, FileCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { uploadClip } from '@/app/actions/uploadClip';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setError(null);
    }
  };

  // Form Submission Logic
  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    setError(null);

    const result = await uploadClip(formData);

    if (result.success) {
      // Redirect to dashboard on success
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error || "Upload failed. Check file size (Max 4.5MB).");
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <button 
            onClick={() => router.back()} 
            className="text-gray-500 hover:text-white mb-4 transition-all text-sm"
          >
            ← Back to Library
          </button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Upload to <span className="text-purple-500">Vault</span>
          </h1>
          <p className="text-gray-400 mt-2">Add new cinematic content to the pro library.</p>
        </header>

        <form action={handleSubmit} className="space-y-8">
          {/* DRAG & DROP AREA */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={() => setDragActive(false)}
            className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all flex flex-col items-center justify-center text-center ${
              dragActive ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 bg-white/5'
            } ${fileName ? 'border-green-500/50 bg-green-500/5' : ''}`}
          >
            <input 
              type="file" 
              name="video" 
              accept="video/mp4,video/quicktime" 
              required
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            
            <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
              fileName ? 'bg-green-500/20' : 'bg-purple-600/20'
            }`}>
              {fileName ? (
                <FileCheck className="text-green-500" size={32} />
              ) : (
                <Upload className="text-purple-500" size={32} />
              )}
            </div>

            <h3 className="text-xl font-bold">
              {fileName ? "File Ready" : "Select Video File"}
            </h3>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              {fileName ? `Selected: ${fileName}` : "Drag and drop your MP4 or MOV here."}
            </p>
          </div>

          {/* METADATA FORM */}
          <div className="grid grid-cols-1 gap-6 bg-white/5 border border-white/10 p-8 rounded-[2rem]">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Clip Title</label>
              <input 
                name="title"
                type="text" 
                placeholder="e.g. Midnight Rain in Tokyo" 
                required
                className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none transition-all" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Mood</label>
                <select 
                  name="mood"
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none transition-all appearance-none text-white"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Aesthetic">Aesthetic</option>
                  <option value="Sad/Lonely">Sad/Lonely</option>
                  <option value="Hype/Gym">Hype/Gym</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Tags</label>
                <input 
                  name="tags"
                  type="text" 
                  placeholder="night, rain, neon" 
                  className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 focus:border-purple-500/50 outline-none transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUploading}
              className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-purple-500 hover:text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading to Storage...
                </>
              ) : (
                "Publish to Vault"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}