'use client';

import React from 'react';
import { Product } from '@/lib/product';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isInStock = (product.stock || 0) > 0;
  const stockLevel = product.stock || 0;
  
  const getStockStatus = () => {
    if (stockLevel === 0) return { text: 'Out of Stock', color: 'text-red-600' };
    if (stockLevel < 10) return { text: `Only ${stockLevel} left`, color: 'text-orange-600' };
    return { text: 'In Stock', color: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            Premium Honey
          </span>
          <span>•</span>
          <span>Product ID: {product.id.slice(0, 8)}...</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="text-4xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </div>
        <div className="text-sm text-gray-600">
          Free shipping on orders over $50
        </div>
      </div>

      {/* Stock Status */}
      <div className="space-y-2">
        <div className={`text-sm font-medium ${stockStatus.color}`}>
          {stockStatus.text}
        </div>
        {isInStock && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((stockLevel / 50) * 100, 100)}%` 
              }}
            />
          </div>
        )}
      </div>

      {/* Key Features */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Key Features</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-yellow-500">🌻</span>
            <span>100% Pure & Natural</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-green-500">🌿</span>
            <span>Locally Sourced</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-blue-500">❄️</span>
            <span>Raw & Unprocessed</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span className="text-purple-500">🏆</span>
            <span>Award Winning Quality</span>
          </div>
        </div>
      </div>

      {/* Product Benefits */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-2">Health Benefits</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Rich in antioxidants and natural enzymes</li>
          <li>• Supports immune system health</li>
          <li>• Natural energy source</li>
          <li>• Antimicrobial properties</li>
        </ul>
      </div>

      {/* Seller Info */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-yellow-700 font-semibold text-sm">🐝</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">Local Beekeeper</div>
            <div className="text-sm text-gray-600">Trusted seller since 2020</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">⭐</span>
            ))}
            <span className="text-sm text-gray-600 ml-1">(4.9)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
