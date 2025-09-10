'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import './products.css'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  
  const categories = [
    { id: 'all', name: 'All Products', count: 24 },
    { id: 'wild', name: 'Wild Honey', count: 8 },
    { id: 'organic', name: 'Organic Honey', count: 6 },
    { id: 'multifloral', name: 'Multifloral', count: 5 },
    { id: 'seasonal', name: 'Seasonal Special', count: 3 },
    { id: 'gift-sets', name: 'Gift Sets', count: 2 }
  ]

  const products = [
    {
      id: 1,
      name: "Himalayan Wild Honey",
      description: "Pure wild honey harvested from pristine mountains",
      price: 899,
      originalPrice: 1200,
      image: "/sample-honey.jpg",
      badge: "Bestseller",
      category: "wild",
      rating: 4.9,
      reviews: 324,
      inStock: true
    },
    {
      id: 2,
      name: "Organic Forest Honey",
      description: "Raw unprocessed honey with natural enzymes",
      price: 749,
      originalPrice: 999,
      image: "/sample-honey.jpg",
      badge: "Organic",
      category: "organic",
      rating: 4.8,
      reviews: 256,
      inStock: true
    },
    {
      id: 3,
      name: "Multifloral Honey",
      description: "Blend from various mountain flowers",
      price: 599,
      originalPrice: 799,
      image: "/sample-honey.jpg",
      badge: "Premium",
      category: "multifloral",
      rating: 4.7,
      reviews: 189,
      inStock: true
    },
    {
      id: 4,
      name: "Acacia Honey",
      description: "Light colored, mild flavored honey",
      price: 649,
      originalPrice: 849,
      image: "/sample-honey.jpg",
      badge: "Pure",
      category: "wild",
      rating: 4.6,
      reviews: 143,
      inStock: false
    },
    {
      id: 5,
      name: "Rhododendron Honey",
      description: "Unique honey from Himalayan rhododendron",
      price: 1299,
      originalPrice: 1599,
      image: "/sample-honey.jpg",
      badge: "Limited",
      category: "seasonal",
      rating: 5.0,
      reviews: 89,
      inStock: true
    },
    {
      id: 6,
      name: "Mustard Honey",
      description: "Golden honey from mustard fields",
      price: 549,
      originalPrice: 699,
      image: "/sample-honey.jpg",
      badge: "Immunity",
      category: "organic",
      rating: 4.5,
      reviews: 167,
      inStock: true
    },
    // Add more products...
    {
      id: 7,
      name: "Lychee Honey",
      description: "Exotic lychee flavored natural honey",
      price: 799,
      originalPrice: 999,
      image: "/sample-honey.jpg",
      badge: "Exotic",
      category: "multifloral",
      rating: 4.7,
      reviews: 98,
      inStock: true
    },
    {
      id: 8,
      name: "Honey Gift Set Premium",
      description: "Collection of 4 premium honey varieties",
      price: 2499,
      originalPrice: 3200,
      image: "/sample-honey.jpg",
      badge: "Gift Set",
      category: "gift-sets",
      rating: 4.9,
      reviews: 45,
      inStock: true
    }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="products-page">
      <Navbar />
      
      {/* Products Hero Section with Background Elements */}
      <div className="products-hero-section">
        <div className="background"/>
        <div className="background-2"/>
        <div className="products-hero">
          <div className="products-hero-content">
            <h1>Our Premium Honey Collection</h1>
            <p>Discover the finest selection of pure, natural honey from the pristine Himalayas</p>
          </div>
        </div>
      </div>

      <div className="products-container">
        <div className="products-sidebar">
          <div className="filters-section">
            <h3>Categories</h3>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                  <span className="count">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="price-filter">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input type="number" placeholder="Min" />
              <span>-</span>
              <input type="number" placeholder="Max" />
            </div>
            <button className="apply-filter-btn">Apply</button>
          </div>

          <div className="features-filter">
            <h3>Features</h3>
            <div className="feature-checkboxes">
              <label>
                <input type="checkbox" />
                Organic Certified
              </label>
              <label>
                <input type="checkbox" />
                Raw & Unprocessed
              </label>
              <label>
                <input type="checkbox" />
                Limited Edition
              </label>
              <label>
                <input type="checkbox" />
                Gift Packaging
              </label>
            </div>
          </div>
        </div>

        <div className="products-main">
          <div className="products-header">
            <div className="results-info">
              <span>Showing {filteredProducts.length} products</span>
            </div>
            <div className="sort-controls">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-badge">
                  {product.badge}
                </div>
                {!product.inStock && <div className="out-of-stock-badge">Out of Stock</div>}
                
                <div className="product-image-container">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    width={300}
                    height={300}
                    className="product-image"
                  />
                  <div className="product-overlay">
                    <button className="quick-view-btn">Quick View</button>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                    <span className="rating-text">({product.rating}) {product.reviews} reviews</span>
                  </div>

                  <div className="product-pricing">
                    <span className="current-price">₹{product.price}</span>
                    <span className="original-price">₹{product.originalPrice}</span>
                    <span className="discount">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <div className="product-actions">
                    <button 
                      className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button className="wishlist-btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="page-btn">‹ Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next ›</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductsPage
