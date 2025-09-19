"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToStorage = uploadImageToStorage;
exports.parseSupabaseUrl = parseSupabaseUrl;
// src/services/storage.ts
const supabaseClient_1 = require("../utils/supabaseClient");
const buffer_1 = require("../utils/buffer");
async function uploadImageToStorage(file, // Fastify multipart file object or File/Blob
folder = 'products', bucketName = 'Testing HoneyBee') {
    try {
        // Validate file exists
        if (!file) {
            throw new Error('No file provided');
        }
        // Validate mimetype if available
        if (file.mimetype && !(0, buffer_1.isValidImageMimeType)(file.mimetype)) {
            throw new Error(`Invalid file type: ${file.mimetype}. Only image files are allowed.`);
        }
        let fileBuffer;
        let fileName;
        let fileExtension;
        let mimeType;
        // Handle different file types (Fastify multipart vs browser File)
        if (file.buffer && file.filename) {
            // Fastify multipart file object with buffer
            fileBuffer = file.buffer;
            fileExtension = file.filename.split('.').pop() || (0, buffer_1.getFileExtensionFromMimeType)(file.mimetype || 'image/jpeg');
            mimeType = file.mimetype || `image/${fileExtension}`;
            fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        }
        else if (file._buf) {
            // Alternative buffer access for Fastify multipart
            fileBuffer = file._buf;
            fileExtension = file.filename?.split('.').pop() || (0, buffer_1.getFileExtensionFromMimeType)(file.mimetype || 'image/jpeg');
            mimeType = file.mimetype || `image/${fileExtension}`;
            fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        }
        else if (file.stream) {
            // Handle readable stream
            fileBuffer = await (0, buffer_1.streamToBuffer)(file.stream);
            fileExtension = file.filename?.split('.').pop() || (0, buffer_1.getFileExtensionFromMimeType)(file.mimetype || 'image/jpeg');
            mimeType = file.mimetype || `image/${fileExtension}`;
            fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        }
        else if (file instanceof File || file instanceof Blob) {
            // Browser File/Blob object
            fileBuffer = Buffer.from(await file.arrayBuffer());
            fileExtension = file.name?.split('.').pop() || 'jpg';
            mimeType = file.type || `image/${fileExtension}`;
            fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        }
        else {
            throw new Error(`Unsupported file format. Received: ${JSON.stringify(Object.keys(file))}`);
        }
        // Validate buffer size
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new Error('File buffer is empty');
        }
        console.log(`Uploading file: ${fileName}, size: ${fileBuffer.length} bytes, type: ${mimeType}`);
        // Upload to Supabase Storage using Buffer
        const { data, error } = await supabaseClient_1.supabaseAdmin.storage
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
        const { data: publicUrlData } = supabaseClient_1.supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(fileName);
        console.log('File uploaded successfully:', publicUrlData.publicUrl);
        return publicUrlData.publicUrl; // direct URL to use in DB
    }
    catch (err) {
        console.error('Upload failed:', err);
        throw err;
    }
}
function parseSupabaseUrl(fullUrl) {
    const baseParts = fullUrl.split('/storage/v1/object/public/');
    if (baseParts.length < 2)
        throw new Error('Invalid Supabase storage URL');
    const path = baseParts[1];
    const [bucketEncoded, ...fileParts] = path.split('/');
    const bucketName = decodeURIComponent(bucketEncoded);
    const filePath = fileParts.join('/');
    const lastSlash = filePath.lastIndexOf('/');
    const folderPath = lastSlash >= 0 ? filePath.slice(0, lastSlash) : '';
    const fileName = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
    const imageUrlObj = {
        bucketName,
        filePath,
        folderPath,
        fileName
    };
    return imageUrlObj;
}
