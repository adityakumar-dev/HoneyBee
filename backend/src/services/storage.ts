// src/services/storage.ts
import { supabaseAdmin } from '../utils/supabaseClient';
import { streamToBuffer, isValidImageMimeType, getFileExtensionFromMimeType } from '../utils/buffer';

export async function uploadImageToStorage(
  file: any, // Fastify multipart file object or File/Blob
  folder = 'products',
  bucketName = 'Testing HoneyBee'
): Promise<string> {
  try {
    // Validate file exists
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate mimetype if available
    if (file.mimetype && !isValidImageMimeType(file.mimetype)) {
      throw new Error(`Invalid file type: ${file.mimetype}. Only image files are allowed.`);
    }

    let fileBuffer: Buffer;
    let fileName: string;
    let fileExtension: string;
    let mimeType: string;

    // Handle different file types (Fastify multipart vs browser File)
    if (file.buffer && file.filename) {
      // Fastify multipart file object with buffer
      fileBuffer = file.buffer;
      fileExtension = file.filename.split('.').pop() || getFileExtensionFromMimeType(file.mimetype || 'image/jpeg');
      mimeType = file.mimetype || `image/${fileExtension}`;
      fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    } else if (file._buf) {
      // Alternative buffer access for Fastify multipart
      fileBuffer = file._buf;
      fileExtension = file.filename?.split('.').pop() || getFileExtensionFromMimeType(file.mimetype || 'image/jpeg');
      mimeType = file.mimetype || `image/${fileExtension}`;
      fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    } else if (file.stream) {
      // Handle readable stream
      fileBuffer = await streamToBuffer(file.stream);
      fileExtension = file.filename?.split('.').pop() || getFileExtensionFromMimeType(file.mimetype || 'image/jpeg');
      mimeType = file.mimetype || `image/${fileExtension}`;
      fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    } else if (file instanceof File || file instanceof Blob) {
      // Browser File/Blob object
      fileBuffer = Buffer.from(await file.arrayBuffer());
      fileExtension = (file as File).name?.split('.').pop() || 'jpg';
      mimeType = file.type || `image/${fileExtension}`;
      fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
    } else {
      throw new Error(`Unsupported file format. Received: ${JSON.stringify(Object.keys(file))}`);
    }

    // Validate buffer size
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty');
    }

    console.log(`Uploading file: ${fileName}, size: ${fileBuffer.length} bytes, type: ${mimeType}`);

    // Upload to Supabase Storage using Buffer
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: mimeType,
      });

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('File uploaded successfully:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl; // direct URL to use in DB
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
}

interface ImageUrlsBucketParse {
  bucketName: string;
  filePath: string;  
  folderPath: string; 
  fileName: string;   
}

export function parseSupabaseUrl(fullUrl : String) {
  const baseParts = fullUrl.split('/storage/v1/object/public/');
  if (baseParts.length < 2) throw new Error('Invalid Supabase storage URL');

  const path = baseParts[1];

  const [bucketEncoded, ...fileParts] = path.split('/');
  const bucketName = decodeURIComponent(bucketEncoded); 
  const filePath = fileParts.join('/'); 

  const lastSlash = filePath.lastIndexOf('/');
  const folderPath = lastSlash >= 0 ? filePath.slice(0, lastSlash) : '';
  const fileName = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
  const imageUrlObj : ImageUrlsBucketParse = {
    bucketName,
    filePath,
    folderPath,
    fileName
  }
  return imageUrlObj;

}