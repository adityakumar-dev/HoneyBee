import React, { useState } from 'react';
import { Category } from '@/lib/product';

interface CategorySelectorProps {
  categories: Category[];
  onSelect: (category: Category | null, customName?: string) => void;
  onClose: () => void;
}

export default function CategorySelector({ categories, onSelect, onClose }: CategorySelectorProps) {
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const handleCreateNew = () => {
    if (customCategoryName.trim()) {
      onSelect(null, customCategoryName.trim());
      setCustomCategoryName('');
      setShowCreateNew(false);
    }
  };

  return (
    <div className="category-selector">
      <div className="category-selector-header">
        <h4>Select Category</h4>
        <button className="close-selector" onClick={onClose}>×</button>
      </div>

      <div className="category-options">
        {/* Existing Categories */}
        {categories.length > 0 && (
          <div className="existing-categories">
            <div className="category-section-title">Existing Categories</div>
            {categories.map((category) => (
              <button
                key={category.id}
                className="category-option"
                onClick={() => onSelect(category)}
              >
                <span className="category-icon">📋</span>
                {category.name}
              </button>
            ))}
          </div>
        )}

        {/* Create New Category */}
        <div className="create-category-section">
          {!showCreateNew ? (
            <button
              className="create-new-btn"
              onClick={() => setShowCreateNew(true)}
            >
              <span className="create-icon">+</span>
              Create New Category
            </button>
          ) : (
            <div className="create-new-form">
              <div className="create-form-title">Create New Category</div>
              <div className="create-input-group">
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateNew();
                    }
                  }}
                />
                <div className="create-actions">
                  <button
                    className="create-cancel"
                    onClick={() => {
                      setShowCreateNew(false);
                      setCustomCategoryName('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="create-confirm"
                    onClick={handleCreateNew}
                    disabled={!customCategoryName.trim()}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Option */}
        <div className="other-category">
          <button
            className="category-option other-option"
            onClick={() => onSelect(null, 'Other')}
          >
            <span className="category-icon">📦</span>
            Other
          </button>
        </div>
      </div>
    </div>
  );
}
