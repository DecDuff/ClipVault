'use server';

import { db } from '@/lib/db'; 
import { clips } from '@/lib/db/schema'; 
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function saveClipToDatabase(data: {
  url: string;
  title: string;
  category: string;
  tags: string;
  hash: string; // ✨ Now accepting the unique fingerprint
}) {
  try {
    // 1. PRO CHECK: Does this video fingerprint already exist?
    const existing = await db
      .select()
      .from(clips)
      .where(eq(clips.hash, data.hash))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("DUPLICATE_DETECTED");
    }

    // 2. SAVE: If it's a new unique video, write to Neon
    // @ts-ignore - silences minor column name mismatches while we dial in your schema
    await db.insert(clips).values({
      title: data.title,
      videoUrl: data.url,
      hash: data.hash, // Storing the fingerprint
      
      // We'll keep category commented out until you check your schema.ts names
      // category: data.category, 
      
      // Convert "tag1, tag2" string into database-friendly array ["tag1", "tag2"]
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      
      creatorId: "user_placeholder", // Required field for your DB
      createdAt: new Date(),
    });

    // 3. REFRESH: Tell Next.js to update the dashboard gallery
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error: any) {
    if (error.message === "DUPLICATE_DETECTED") {
      throw new Error("This exact video has already been published to the Vault.");
    }
    
    console.error("Database Error:", error);
    throw new Error("The Vault failed to store this clip. Try again.");
  }
}