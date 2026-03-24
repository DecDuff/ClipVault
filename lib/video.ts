import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fileSize: number;
  isVertical: boolean;
}

export async function getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      const width = videoStream.width || 0;
      const height = videoStream.height || 0;

      resolve({
        duration: Math.floor(metadata.format.duration || 0),
        width,
        height,
        fileSize: metadata.format.size || 0,
        isVertical: height > width,
      });
    });
  });
}

export async function addWatermark(
  inputPath: string,
  outputPath: string,
  watermarkText: string = 'ClipVault'
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoFilters([
        {
          filter: 'drawtext',
          options: {
            text: watermarkText,
            fontsize: 48,
            fontcolor: 'white@0.6',
            x: '(w-text_w)/2',
            y: '(h-text_h)/2',
            shadowcolor: 'black@0.7',
            shadowx: 2,
            shadowy: 2,
          },
        },
      ])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

export async function generateThumbnail(
  videoPath: string,
  outputPath: string,
  timeInSeconds: number = 1
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timeInSeconds],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '640x?',
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

export async function processVideo(
  videoBuffer: Buffer,
  watermarkText?: string
): Promise<{
  originalPath: string;
  watermarkedPath: string;
  thumbnailPath: string;
  metadata: VideoMetadata;
}> {
  const tmpDir = '/tmp';
  const id = randomUUID();

  const originalPath = path.join(tmpDir, `${id}-original.mp4`);
  const watermarkedPath = path.join(tmpDir, `${id}-watermarked.mp4`);
  const thumbnailPath = path.join(tmpDir, `${id}-thumb.jpg`);

  try {
    await writeFile(originalPath, videoBuffer);

    const metadata = await getVideoMetadata(originalPath);

    await addWatermark(originalPath, watermarkedPath, watermarkText);

    await generateThumbnail(originalPath, thumbnailPath);

    return {
      originalPath,
      watermarkedPath,
      thumbnailPath,
      metadata,
    };
  } catch (error) {
    await Promise.all([
      unlink(originalPath).catch(() => {}),
      unlink(watermarkedPath).catch(() => {}),
      unlink(thumbnailPath).catch(() => {}),
    ]);
    throw error;
  }
}

export async function cleanupTempFiles(paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => unlink(p).catch(() => {})));
}
