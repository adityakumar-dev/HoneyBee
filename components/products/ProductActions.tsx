'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/product';

interface ProductActionsProps {
  product: Product;
  user: any;
}

export default function ProductActions({ product, user }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const isInStock = (product.stock || 0) > 0;
  const maxQuantity = Math.min(product.stock || 0, 10);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to cart logic here
      console.log(`Added ${quantity} of ${product.name} to cart`);
      
      // Show success message
      alert(`Added ${quantity} ${product.name} to your cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Redirect to checkout with this product
    console.log(`Buy now: ${quantity} of ${product.name}`);
    alert('Redirecting to checkout...');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites: ${product.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Quantity Selection */}
      <div className="space-y-2">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              −
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
              className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
            />
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {maxQuantity} available
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={!isInStock || isAddingToCart}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Adding to Cart...
            </>
          ) : (
            <>
              🛒 Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!isInStock}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          ⚡ Buy Now
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl border transition-colors duration-200 ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{isFavorite ? '❤️' : '🤍'}</span>
            <span className="text-sm font-medium">
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </span>
          </button>

          <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            <span>📤</span>
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900">Delivery Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-green-500">🚚</span>
            <span>Free delivery on orders over $50</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-blue-500">📦</span>
            <span>Standard delivery: 3-5 business days</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <span className="text-purple-500">↩️</span>
            <span>30-day return policy</span>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-green-500">🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-500">🛡️</span>
            <span>Buyer Protection</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span>Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
