'use client'
import React from 'react'
import Image from 'next/image'
import './testimonials.css'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      designation: "Nutritionist, AIIMS Delhi",
      image: "/sample_poster.jpg",
      review: "The quality of this Himalayan honey is exceptional. I recommend it to my patients for its natural healing properties and high nutritional value. The purity is evident in its taste and texture.",
      rating: 5
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      designation: "Organic Farm Owner",
      image: "/sample_poster.jpg",
      review: "As someone in the organic farming business, I can truly appreciate the authentic quality of this honey. It's pure, natural, and reminds me of the honey from my childhood in the mountains.",
      rating: 5
    },
    {
      id: 3,
      name: "Meera Patel",
      designation: "Home Chef & Food Blogger",
      image: "/sample_poster.jpg",
      review: "This honey has transformed my cooking and baking. The natural sweetness and rich flavor profile make every dish special. My family and blog readers absolutely love recipes made with this honey.",
      rating: 5
    },
    {
      id: 4,
      name: "Prof. Vikram Singh",
      designation: "GBPUAT Research Faculty",
      image: "/sample_poster.jpg",
      review: "Being associated with agricultural research, I can confirm this honey meets the highest standards of purity and quality. It's a true representation of Uttarakhand's natural bounty.",
      rating: 5
    }
  ]

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2>What Our Customers Say</h2>
          <p>Don't just take our word for it - hear from our satisfied customers who have experienced the pure goodness of our Himalayan honey</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">"</div>
                <p>{testimonial.review}</p>
                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
              </div>
              <div className="testimonial-author">
                <div className="author-image">
                  <Image 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    width={60}
                    height={60}
                  />
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.designation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonials-footer">
          <div className="trust-badges">
            <div className="badge">
              <span>🏆</span>
              <p>Award Winning Quality</p>
            </div>
            <div className="badge">
              <span>✅</span>
              <p>Certified Organic</p>
            </div>
            <div className="badge">
              <span>🌟</span>
              <p>5 Star Rated</p>
            </div>
            <div className="badge">
              <span>🔒</span>
              <p>100% Secure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
