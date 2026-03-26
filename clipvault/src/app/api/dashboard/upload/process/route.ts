import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // This is where you'd check if a user is logged in
        // For now, we allow MP4 and MOV
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime'],
          tokenPayload: JSON.stringify({
            // optional data to pass to onUploadCompleted
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs on the SERVER after the upload finishes
        console.log('Upload completed:', blob.url);
        
        try {
          // Future: Add your Neon database logic here to save the URL
        } catch (error) {
          throw new Error('Could not update database');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}