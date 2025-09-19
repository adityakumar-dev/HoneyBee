'use client'
import React from 'react'
import Image from 'next/image'
import './features.css'

const Features = () => {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.5 12.5c0 .28-.11.53-.29.71l-4.5 4.5c-.18.18-.43.29-.71.29s-.53-.11-.71-.29l-4.5-4.5c-.18-.18-.29-.43-.29-.71s.11-.53.29-.71l4.5-4.5c.18-.18.43-.29.71-.29s.53.11.71.29l4.5 4.5c.18.18.29.43.29.71z" fill="currentColor"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
      ),
      title: "100% Pure & Natural",
      description: "Our honey is harvested directly from beehives in the pristine Himalayan region, ensuring complete purity without any artificial additives."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a10 10 0 0 1 10 10c0 2.5-2 5-2 5s2 2.5 2 5a10 10 0 0 1-10 10A10 10 0 0 1 2 12c0-2.5 2-5 2-5s-2-2.5-2-5A10 10 0 0 1 12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 14s.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 8s2-2 4-2 4 2 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Organic Certified",
      description: "Certified organic by recognized authorities, our honey maintains the highest standards of natural production methods."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 20.5c0 0 2-3 9-3s9 3 9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 17.5c0 0 2-3 9-3s9 3 9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M3 14.5c0 0 2-3 9-3s9 3 9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 3l2 3-2 3-2-3 2-3z" fill="currentColor"/>
        </svg>
      ),
      title: "Himalayan Source",
      description: "Sourced from the untouched valleys of Uttarakhand, where bees collect nectar from rare medicinal flowers and herbs."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Lab Tested",
      description: "Each batch undergoes rigorous quality testing to ensure purity, nutritional value, and safety standards."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3h15l1.68 7.14a2 2 0 0 1-1.95 2.86H1M1 3l4 13h13l4-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7" cy="20" r="1" fill="currentColor"/>
          <circle cx="17" cy="20" r="1" fill="currentColor"/>
        </svg>
      ),
      title: "Fresh Delivery",
      description: "Direct from hive to your home with temperature-controlled packaging to preserve natural enzymes and nutrients."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Sustainable Practices",
      description: "We follow eco-friendly beekeeping practices that support bee colonies and protect the natural ecosystem."
    }
  ]

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Why Choose Our Honey?</h2>
          <p>Experience the difference of authentic Himalayan honey with our commitment to quality and sustainability</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="features-stats">
          <div className="stat-item">
            <h3>50,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>15+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Pure Honey</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Beehives</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
