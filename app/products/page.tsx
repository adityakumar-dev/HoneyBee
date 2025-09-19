'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSupabaseUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { getProductList, ProductListQuery } from '@/api/productlist/api_productlist.client'
import { getCategories } from '@/api/category/api_category.client'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import './products.css'

const ProductsPage = () => {
  const router = useRouter()
  const user = useSupabaseUser()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('created_at_desc')
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Get auth token
  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.access_token) {
        setToken(data.session.access_token)
      }
    }
    getToken()
  }, [user])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) return
      
      try {
        const categoriesData = await getCategories(token)
        const categoriesWithCounts = [
          { id: 'all', name: 'All Products', count: 0 },
          ...categoriesData.map((cat: any) => ({ ...cat, count: 0 }))
        ]
        setCategories(categoriesWithCounts)
      } catch (err: any) {
        console.error('Failed to fetch categories:', err)
        // Fallback categories
        setCategories([
          { id: 'all', name: 'All Products', count: 0 }
        ])
      }
    }
    
    fetchCategories()
  }, [token])

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return
      
      setLoading(true)
      setError(null)
      
      try {
        const query: ProductListQuery = {
          limit: 20,
          offset: 0,
          sort_by: sortBy as any
        }
        
        if (selectedCategory !== 'all') {
          query.category_id = selectedCategory
        }
        
        const data = await getProductList(token, query)
        setProducts(data.products || [])
      } catch (err: any) {
        console.error('Failed to fetch products:', err)
        setError(err.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [token, selectedCategory, sortBy])

  // Products are already filtered by the backend based on selectedCategory
  const filteredProducts = products

  // Helper functions
  const formatPrice = (price: number) => `₹${price}`
  const getProductImage = (product: any) => {
    return product.image_url && product.image_url.length > 0 
      ? product.image_url[0] 
      : "/sample-honey.jpg"
  }

  // Loading state
  if (!token) {
    return (
      <div className="products-page">
        <Navbar />
        <div className="products-container" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Please log in to view products</p>
        </div>
        <Footer />
      </div>
    )
  }

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

          {/* TODO: Implement price filter in backend
          <div className="price-filter">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input type="number" placeholder="Min" />
              <span>-</span>
              <input type="number" placeholder="Max" />
            </div>
            <button className="apply-filter-btn">Apply</button>
          </div>
          */}

          {/* TODO: Implement feature filters in backend
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
          */}
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
                <option value="created_at_desc">Newest First</option>
                <option value="created_at_asc">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {loading ? (
              // Loading skeleton
              [...Array(8)].map((_, i) => (
                <div key={i} className="product-card">
                  <div className="product-image-container">
                    <div style={{ width: '100%', height: '200px', background: '#f0f0f0', borderRadius: '8px' }}></div>
                  </div>
                  <div className="product-info">
                    <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                    <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                    <div style={{ height: '24px', background: '#f0f0f0', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>Error loading products: {error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>No products found</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="product-card" onClick={() => router.push(`/products/${product.id}`)}>
                  <div className="product-badge">
                    Premium
                  </div>
                  {(product.stock || 0) === 0 && <div className="out-of-stock-badge">Out of Stock</div>}
                  
                  <div className="product-image-container">
                    <Image 
                      src={getProductImage(product)} 
                      alt={product.name}
                      width={300}
                      height={300}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <button 
                        className="quick-view-btn" 
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/products/${product.id}`)
                        }}
                      >
                        Quick View
                      </button>
                      {/* <button 
                        className="add-to-cart-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Add to Cart
                      </button> */}
                    </div>
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description || 'Premium honey product'}</p>
                    
                    {/* <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < 4 ? 'filled' : ''}`}>★</span>
                        ))}
                      </div>
                      <span className="rating-text">(4.5) Reviews</span>
                    </div> */}

                    <div className="product-pricing">
                      <span className="current-price">{formatPrice(product.price)}</span>
                      {/* <span className="original-price">₹{Math.round(product.price * 1.3)}</span>
                      <span className="discount">23% OFF</span> */}
                    </div>

                    <div className="product-actions">
                      <button 
                        className={`add-to-cart-btn ${(product.stock || 0) === 0 ? 'disabled' : ''}`}
                        disabled={(product.stock || 0) === 0}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {(product.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      {/* <button className="wishlist-btn">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button> */}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* TODO: Implement proper pagination
          <div className="pagination">
            <button className="page-btn">‹ Previous</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">Next ›</button>
          </div>
          */}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProductsPage
