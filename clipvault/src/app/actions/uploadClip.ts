'use server';

import { getServerSession } from "next-auth";
import { db } from "@/lib/db"; 
import { clips } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth"; 

export async function uploadClip(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to upload." };
  }

  const title = formData.get('title') as string;
  const moodString = formData.get('mood') as string;
  const tagsString = formData.get('tags') as string;

  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
  const mood = moodString ? [moodString] : [];

  // Placeholders
  const videoUrl = "https://placeholder.com/raw-video.mp4"; 
  const watermarkedUrl = "https://placeholder.com/watermarked-video.mp4"; 
  const thumbnailUrl = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7";

  try {
    await db.insert(clips).values({
      creatorId: session.user.id,
      title,
      videoUrl,
      watermarkedUrl,
      thumbnailUrl,
      tags,
      mood,
      duration: 0,
      width: 1080,
      height: 1920,
      fileSize: 0,
      isVertical: true,
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Drizzle Upload Error:", error);
    return { success: false, error: "Failed to save clip to Neon." };
  }
}