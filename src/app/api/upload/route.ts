import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { processVideo, cleanupTempFiles } from '@/lib/video';
import { uploadToS3 } from '@/lib/s3';
import { readFile } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.isCreator) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { originalPath, watermarkedPath, thumbnailPath, metadata } =
      await processVideo(buffer, process.env.WATERMARK_TEXT);

    const timestamp = Date.now();
    const userId = session.user.id;

    const [originalBuffer, watermarkedBuffer, thumbnailBuffer] = await Promise.all([
      readFile(originalPath),
      readFile(watermarkedPath),
      readFile(thumbnailPath),
    ]);

    const [videoUrl, watermarkedUrl, thumbnailUrl] = await Promise.all([
      uploadToS3(
        originalBuffer,
        `videos/${userId}/${timestamp}-original.mp4`,
        'video/mp4'
      ),
      uploadToS3(
        watermarkedBuffer,
        `videos/${userId}/${timestamp}-watermarked.mp4`,
        'video/mp4'
      ),
      uploadToS3(
        thumbnailBuffer,
        `thumbnails/${userId}/${timestamp}.jpg`,
        'image/jpeg'
      ),
    ]);

    await cleanupTempFiles([originalPath, watermarkedPath, thumbnailPath]);

    return NextResponse.json({
      videoUrl,
      watermarkedUrl,
      thumbnailUrl,
      metadata,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
