'use server';

import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client';

export async function getBlobToken(pathname: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN in environment variables');
  }

  return generateClientTokenFromReadWriteToken({
    token,
    pathname, // This is now required by the SDK
  });
}