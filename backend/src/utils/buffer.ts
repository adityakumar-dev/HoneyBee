// src/utils/buffer.ts

/**
 * Utility functions for handling file buffers and streams
 */

export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  
  return Buffer.concat(chunks);
}

export function isValidImageMimeType(mimetype: string): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ];
  
  return validTypes.includes(mimetype.toLowerCase());
}

export function getFileExtensionFromMimeType(mimetype: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg'
  };
  
  return mimeMap[mimetype.toLowerCase()] || 'jpg';
}
