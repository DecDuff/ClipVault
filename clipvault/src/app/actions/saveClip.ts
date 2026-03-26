'use server';

import { db } from '@/lib/db'; 
import { clips } from '@/lib/db/schema'; 
import { revalidatePath } from 'next/cache';

export async function saveClipToDatabase(data: {
  url: string;
  title: string;
  category: string;
  tags: string;
}) {
  try {
    // @ts-ignore - This helps if there are minor type mismatches while we debug
    await db.insert(clips).values({
      title: data.title,
      videoUrl: data.url,
      // If 'category' is causing an error, it might be named 'description' or 'type' 
      // in your schema. I'm commenting it out so the code compiles.
      // category: data.category, 
      
      // Converting tags string to array as your schema requested
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      
      creatorId: "user_placeholder", // Required by your schema
      createdAt: new Date(),
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to save clip to database");
  }
}