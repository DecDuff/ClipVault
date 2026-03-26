'use server';

import { getServerSession } from "next-auth";
import { db } from "@/lib/db"; 
import { clips } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth"; 
import { put } from "@vercel/blob";

export async function uploadClip(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  // 1. Auth Guard
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to upload." };
  }

  // 2. Extract File & Metadata
  const videoFile = formData.get('video') as File;
  const title = formData.get('title') as string;
  const moodString = formData.get('mood') as string;
  const tagsString = formData.get('tags') as string;

  if (!videoFile) {
    return { success: false, error: "Please select a video file." };
  }

  try {
    // 3. Upload to Vercel Blob
    // 'access: public' allows the video to be streamed in your app
    const blob = await put(videoFile.name, videoFile, {
      access: 'public',
    });

    // 4. Format Data for Database
    const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : [];
    const mood = moodString ? [moodString] : [];

    // 5. Insert into Neon via Drizzle
    await db.insert(clips).values({
      creatorId: session.user.id,
      title: title || "Untitled Clip",
      videoUrl: blob.url,           // The high-quality master file
      watermarkedUrl: blob.url,     // Temporary: same as videoUrl
      thumbnailUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      tags: tags,
      mood: mood,
      duration: 0, 
      width: 1080,
      height: 1920,
      fileSize: videoFile.size,
      isVertical: true,
    });

    // 6. Refresh the Dashboard
    revalidatePath('/dashboard');
    
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Failed to upload to storage or save to DB." };
  }
}