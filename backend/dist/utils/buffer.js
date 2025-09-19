"use strict";
// src/utils/buffer.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToBuffer = streamToBuffer;
exports.isValidImageMimeType = isValidImageMimeType;
exports.getFileExtensionFromMimeType = getFileExtensionFromMimeType;
/**
 * Utility functions for handling file buffers and streams
 */
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}
function isValidImageMimeType(mimetype) {
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
function getFileExtensionFromMimeType(mimetype) {
    const mimeMap = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/svg+xml': 'svg'
    };
    return mimeMap[mimetype.toLowerCase()] || 'jpg';
}
