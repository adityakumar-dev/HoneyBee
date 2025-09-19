import React, { useState, useEffect } from 'react';
import { Product, Category, ProductFormData } from '@/lib/product';
import { createProduct, updateProduct } from '@/api/product/api_product.client';
import CategorySelector from './CategorySelector';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  token: string | null;
  categories: Category[];
}

export default function ProductForm({ open, onClose, product, token, categories }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: [],
    category_id: '',
    category_name: '',
    image: null,
  });
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        image_url: Array.isArray(product.image_url) ? product.image_url : (product.image_url ? [product.image_url] : []),
        category_id: product.category_id || '',
        category_name: '',
        image: null,
      });
      const cat = categories.find(c => c.id === product.category_id);
      setSelectedCategory(cat || null);
      setPreviewUrl(product.image_url && Array.isArray(product.image_url) && product.image_url.length > 0 ? product.image_url[0] : '');
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image_url: [],
        category_id: '',
        category_name: '',
        image: null
      });
      setSelectedCategory(null);
      setPreviewUrl('');
    }
    setSelectedImageFiles([]);
  }, [product, categories, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      if (name === 'image_url') {
        // Split comma-separated URLs into array
        const urls = value.split(',').map(s => s.trim()).filter(Boolean);
        setPreviewUrl(urls[0] || '');
        setSelectedImageFiles([]);
        return { ...prev, image_url: urls };
      }
      return {
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArr = Array.from(files);
      setSelectedImageFiles(fileArr);
  setFormData(prev => ({ ...prev, image_url: [] }));
      setPreviewUrl(URL.createObjectURL(fileArr[0]));
    } else {
      setSelectedImageFiles([]);
    }
  };

  const handleCategorySelect = (category: Category | null, customName?: string) => {
    if (category) {
      setSelectedCategory(category);
      setFormData(prev => ({
        ...prev,
        category_id: category.id,
        category_name: ''
      }));
    } else if (customName) {
      setSelectedCategory(null);
      setFormData(prev => ({
        ...prev,
        category_id: '',
        category_name: customName
      }));
    }
    setShowCategorySelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setError(null);

    try {
      if (product) {
        // Update existing product (no file upload for update in this version)
        await updateProduct(token, product.id, formData);
      } else {
        // Create new product, send files if present
  await createProduct(token, formData, selectedImageFiles.length > 0 ? selectedImageFiles : undefined);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Placeholder upload function - replace with actual upload logic

  if (!open) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="product-modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && (
            <div className="product-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Category Selection */}
          <div className="form-group">
            <label>Category *</label>
            <div className="category-input-wrapper">
              <div className="selected-category" onClick={() => setShowCategorySelector(true)}>
                {selectedCategory ? (
                  <span className="category-name">{selectedCategory.name}</span>
                ) : formData.category_name ? (
                  <span className="category-name">{formData.category_name} (New)</span>
                ) : (
                  <span className="category-placeholder">Select or create category</span>
                )}
                <span className="category-arrow">▼</span>
              </div>
              {showCategorySelector && (
                <CategorySelector
                  categories={categories}
                  onSelect={handleCategorySelect}
                  onClose={() => setShowCategorySelector(false)}
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Wildflower Honey"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your honey product..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Images</label>
            <div className="image-input-options">
              <div className="image-option">
                <label htmlFor="image_url">Image URLs</label>
                <input
                  type="text"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url ? formData.image_url.join(', ') : ''}
                  onChange={handleChange}
                  placeholder="Paste one or more image URLs, separated by commas"
                  disabled={selectedImageFiles.length > 0}
                />
              </div>
              <div className="image-option-divider">
                <span>OR</span>
              </div>
              <div className="image-option">
                <label htmlFor="image_file">Upload Image Files</label>
                <input
                  type="file"
                  id="image_file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={formData.image_url && formData.image_url.length > 0}
                />
              </div>
            </div>

            {/* Image Gallery Preview (Tailwind) */}
            {(() => {
              const allPreviewUrls = selectedImageFiles.length > 0
                ? selectedImageFiles.map(file => URL.createObjectURL(file))
                : (formData.image_url || []);
              return allPreviewUrls.length > 0 && (
                <div className="flex gap-4 mt-4 flex-wrap">
                  {allPreviewUrls.map((url, idx) => (
                    <div
                      className="relative w-20 h-20 rounded-lg overflow-hidden shadow-sm bg-yellow-50 flex items-center justify-center"
                      key={url + idx}
                    >
                      <img
                        src={url}
                        alt={`Product preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-yellow-100 border-none rounded-full text-yellow-700 w-6 h-6 flex items-center justify-center text-base cursor-pointer shadow hover:bg-yellow-200 transition"
                        title="Remove"
                        onClick={() => {
                          if (selectedImageFiles.length > 0) {
                            // Remove file
                            const newFiles = [...selectedImageFiles];
                            newFiles.splice(idx, 1);
                            setSelectedImageFiles(newFiles);
                          } else {
                            // Remove URL
                            const newUrls = [...(formData.image_url || [])];
                            newUrls.splice(idx, 1);
                            setFormData(prev => ({ ...prev, image_url: newUrls }));
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="product-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
