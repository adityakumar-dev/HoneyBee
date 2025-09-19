import React, { useState } from 'react';
import { Product, Category, formatPrice } from '@/lib/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  token: string | null;
  onRefresh: () => void;
  categories: Category[];
}

export default function ProductCard({ product, onEdit, token, onRefresh, categories }: ProductCardProps) {
  const [deleting, setDeleting] = useState(false);

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getStockStatus = (stock?: number) => {
    if (!stock || stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= 5) return { text: 'Low Stock', class: 'low-stock' };
    return { text: 'In Stock', class: 'in-stock' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="product-card">
      <div className="product-image-container">
        {product.image_url && product.image_url.length > 0 ? (
          <img 
            src={product.image_url[0]} 
            alt={product.name}
            className="product-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/sample-honey.jpg';
            }}
          />
        ) : (
          <div className="product-image-placeholder">
            <span className="placeholder-icon">🍯</span>
          </div>
        )}
        <div className={`stock-badge ${stockStatus.class}`}>
          {stockStatus.text}
        </div>
      </div>

      <div className="product-content">
        <div className="product-header">
          <h4 className="product-name">{product.name}</h4>
          <div className="product-actions">
            <button 
              className="edit-btn" 
              onClick={() => onEdit(product)}
              title="Edit product"
            >
              ✏️
            </button>
          </div>
        </div>

        <div className="product-category">
          <span className="category-icon">📋</span>
          {getCategoryName(product.category_id)}
        </div>

        {product.description && (
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
        )}

        <div className="product-details">
          <div className="price-stock-row">
            <div className="product-price">
              <span className="price-label">Price:</span>
              <span className="price-value">{formatPrice(product.price)}</span>
            </div>
            <div className="product-stock">
              <span className="stock-label">Stock:</span>
              <span className="stock-value">{product.stock || 0}</span>
            </div>
          </div>
          
          <div className="inventory-value">
            <span className="value-label">Total Value:</span>
            <span className="value-amount">
              {formatPrice(product.price * (product.stock || 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="product-footer">
        <span className="product-date">
          Created {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Unknown'}
        </span>
      </div>
    </div>
  );
}
