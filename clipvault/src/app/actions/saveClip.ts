'use server';

import { db } from '@/lib/db';
import { clips } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache'; // ✅ Add this import

interface SaveClipParams {
  url: string;
  title: string;
  description: string;
  hash: string;
  tags: string[];
  mood?: string[];
  style?: string[];
}

export async function saveClipToDatabase(data: SaveClipParams) {
  try {
    const result = await db.insert(clips).values({
      videoUrl: data.url,
      title: data.title,
      description: data.description,
      hash: data.hash,
      tags: data.tags,
      mood: data.mood || [],
      style: data.style || [],
      creatorId: '00000000-0000-0000-0000-000000000000',
      watermarkedUrl: '', 
      thumbnailUrl: '',
    }).returning();

    // ✨ This is the secret sauce: 
    // It tells Next.js to refresh the data on the dashboard immediately.
    revalidatePath('/dashboard'); 

    return result[0];
  } catch (error) {
    console.error("Database Save Error:", error);
    throw new Error("Failed to save to Vault");
  }
}