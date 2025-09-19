'use client';

import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-dashed border-yellow-200">
        <div className="text-center text-yellow-600">
          <div className="text-4xl mb-2">🍯</div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Image Display */}
      <div 
        className="relative mb-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <div className="aspect-square relative">
          <img
            src={currentImage}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/20 text-white px-2 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? 'border-yellow-400 shadow-md'
                  : 'border-gray-200 hover:border-yellow-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={currentImage}
              alt={`${productName} - Zoomed view`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
