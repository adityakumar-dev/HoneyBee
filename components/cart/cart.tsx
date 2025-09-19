'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import './cart.css'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  
  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>
        
        <div className="cart-content">
          {state.items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="19" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                  <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some delicious honey to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {state.items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <div className="item-price">₹{item.price}</div>
                    </div>
                    <div className="item-quantity">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({state.itemCount} items):</span>
                  <span className="total-price">₹{state.total}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span className="total-price">₹{state.total}</span>
                </div>
              </div>
              
              <div className="cart-actions">
                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Cart
