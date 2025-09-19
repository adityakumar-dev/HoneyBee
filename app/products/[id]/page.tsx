'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSupabaseUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/product';
import { getProductById } from '@/api/product/api_product.client';
import ProductImageGallery from '@/components/products/ProductImageGallery';
// import ProductImageGallery from '@/components/products/ProductImageGallery';
import ProductInfo from '@/components/products/ProductInfo';
import ProductActions from '@/components/products/ProductActions';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductReviews from '@/components/products/ProductReviews';
import './product-view.css';

export default function ProductViewPage() {
  const params = useParams();
  const router = useRouter();
  const user = useSupabaseUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Get auth token
  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.access_token) {
        setToken(data.session.access_token);
      }
    };
    getToken();
  }, [user]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id || !token) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const productData = await getProductById(params.id as string, token);
        setProduct(productData);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, token]);

  // Loading state - show loading while we get the token or product
  if (loading || !token) {
    return (
      <div className="product-view-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-view-error">
        <h2>Product Not Found</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/products')} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-view-error">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => router.push('/products')} className="back-btn">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-view-page">
      <div className="product-view-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => router.push('/products')} className="breadcrumb-link">
            Products
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="product-main-section">
          <div className="product-images-section">
            <ProductImageGallery images={product.image_url || []} productName={product.name} />
          </div>
          
          <div className="product-details-section">
            <ProductInfo product={product} />
            <ProductActions product={product} user={user} />
          </div>
        </div>

        {/* Product Description & Details */}
        <div className="product-description-section">
          <div className="description-tabs">
            <button className="tab-button active">Description</button>
            <button className="tab-button">Specifications</button>
            <button className="tab-button">Reviews</button>
          </div>
          
          <div className="description-content">
            <div className="description-text">
              <h3>About this honey</h3>
              <p>{product.description || 'No description available for this product.'}</p>
              
              <div className="honey-details">
                <div className="detail-item">
                  <strong>🍯 Type:</strong> Premium Wildflower Honey
                </div>
                <div className="detail-item">
                  <strong>🌸 Source:</strong> Local Wildflowers
                </div>
                <div className="detail-item">
                  <strong>📦 Storage:</strong> Store in a cool, dry place
                </div>
                <div className="detail-item">
                  <strong>⏰ Shelf Life:</strong> 2+ years
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} />

        {/* Related Products */}
        {/* <RelatedProducts currentProduct={product} /> */}
      </div>
    </div>
  );
}
