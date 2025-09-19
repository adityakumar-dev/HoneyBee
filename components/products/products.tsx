'use client'
import React from 'react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import './products.css'

const Products = () => {
  const { addItem } = useCart()

  const products = [
    {
      id: 1,
      name: "Himalayan Wild Honey",
      description: "Pure wild honey harvested from the pristine mountains of Uttarakhand",
      price: 899,
      originalPrice: 1200,
      image: "/sample-honey.jpg",
      badge: "Bestseller"
    },
    {
      id: 2,
      name: "Organic Forest Honey",
      description: "Raw unprocessed honey from ancient forests with natural enzymes",
      price: 749,
      originalPrice: 999,
      image: "/sample-honey.jpg",
      badge: "Organic"
    },
    {
      id: 3,
      name: "Multifloral Honey",
      description: "Delicious blend from various mountain flowers, rich in antioxidants",
      price: 599,
      originalPrice: 799,
      image: "/sample-honey.jpg",
      badge: "Premium"
    },
    {
      id: 4,
      name: "Acacia Honey",
      description: "Light colored, mild flavored honey perfect for daily consumption",
      price: 649,
      originalPrice: 849,
      image: "/sample-honey.jpg",
      badge: "Pure"
    },
    {
      id: 5,
      name: "Rhododendron Honey",
      description: "Unique honey from Himalayan rhododendron flowers, limited edition",
      price: 1299,
      originalPrice: 1599,
      image: "/sample-honey.jpg",
      badge: "Limited"
    },
    {
      id: 6,
      name: "Mustard Honey",
      description: "Golden honey from mustard fields, great for immunity boosting",
      price: 549,
      originalPrice: 699,
      image: "/sample-honey.jpg",
      badge: "Immunity"
    }
  ]

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  return (
    <section className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2>Our Premium Honey Collection</h2>
          <p>Discover the finest honey varieties from the pristine valleys of Uttarakhand, 
             crafted by nature and blessed by the Himalayas</p>
        </div>
        
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-badge">
                {product.badge}
              </div>
              <div className="product-image-container">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  width={250}
                  height={250}
                  className="product-image"
                />
                <div className="product-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-pricing">
                  <span className="current-price">₹{product.price}</span>
                  <span className="original-price">₹{product.originalPrice}</span>
                </div>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button className="wishlist-btn" title="Add to Wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="products-footer">
          <button className="view-all-btn">View All Products</button>
        </div>
      </div>
    </section>
  )
}

export default Products
