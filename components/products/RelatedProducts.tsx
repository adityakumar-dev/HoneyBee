'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/product';

interface RelatedProductsProps {
  currentProduct: Product;
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const router = useRouter();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching related products
    const fetchRelatedProducts = async () => {
      setLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock related products data
        const mockProducts: Product[] = [
          {
            id: 'related-1',
            seller_id: 'seller-1',
            name: 'Clover Honey',
            description: 'Sweet and mild clover honey',
            price: 18.99,
            stock: 25,
            image_url: ['/sample-honey.jpg'],
            category_id: currentProduct.category_id,
          },
          {
            id: 'related-2',
            seller_id: 'seller-2',
            name: 'Wildflower Honey',
            description: 'Rich wildflower honey with complex flavors',
            price: 22.50,
            stock: 15,
            image_url: ['/sample-honey.jpg'],
            category_id: currentProduct.category_id,
          },
          {
            id: 'related-3',
            seller_id: 'seller-3',
            name: 'Manuka Honey',
            description: 'Premium Manuka honey from New Zealand',
            price: 45.00,
            stock: 8,
            image_url: ['/sample-honey.jpg'],
            category_id: currentProduct.category_id,
          },
          {
            id: 'related-4',
            seller_id: 'seller-4',
            name: 'Orange Blossom Honey',
            description: 'Citrusy orange blossom honey',
            price: 19.99,
            stock: 20,
            image_url: ['/sample-honey.jpg'],
            category_id: currentProduct.category_id,
          },
        ];
        
        // Filter out current product
        const filtered = mockProducts.filter(p => p.id !== currentProduct.id);
        setRelatedProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct.id, currentProduct.category_id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Product Image */}
            <div className="aspect-square bg-gradient-to-br from-yellow-50 to-amber-50 overflow-hidden">
              {product.image_url && product.image_url[0] ? (
                <img
                  src={product.image_url[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-yellow-500">
                  <span className="text-4xl">🍯</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-yellow-700 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">⭐</span>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mt-2">
                {(product.stock || 0) > 0 ? (
                  <span className="text-xs text-green-600 font-medium">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Quick Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`Quick add to cart: ${product.name}`);
                }}
                disabled={(product.stock || 0) === 0}
                className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-200"
              >
                {(product.stock || 0) > 0 ? 'Quick Add' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
