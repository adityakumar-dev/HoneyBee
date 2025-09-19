'use client'
import React, { useState } from 'react'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import './contact.css'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="contact-page">
      <Navbar />
      
      {/* Contact Hero Section with Background Elements */}
      <div className="contact-hero-section">
        <div className="background"/>
        <div className="background-2"/>
        <div className="contact-hero">
          <div className="contact-hero-content">
            <h1>Get in Touch</h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>Feel free to reach out to us through any of the following methods:</p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="method-details">
                  <h3>Visit Us</h3>
                  <p>G.B. Pant University of Agriculture & Technology<br />
                     Pantnagar, Uttarakhand 263145<br />
                     India</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="method-details">
                  <h3>Call Us</h3>
                  <p>Phone: +91 9876543210<br />
                     Toll Free: 1800-XXX-XXXX<br />
                     Mon-Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m4 4 16 0 0 16-16 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="method-details">
                  <h3>Email Us</h3>
                  <p>General: info@honeybee.com<br />
                     Sales: sales@honeybee.com<br />
                     Support: support@honeybee.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="method-icon">💬</div>
                <div className="method-details">
                  <h3>Social Media</h3>
                  <p>Follow us for updates:<br />
                     @HoneyBeeOfficial on all platforms</p>
                </div>
              </div>
            </div>
            
            <div className="business-hours">
              <h3>Business Hours</h3>
              <div className="hours-grid">
                <div className="hour-item">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="hour-item">
                  <span>Saturday</span>
                  <span>9:00 AM - 4:00 PM</span>
                </div>
                <div className="hour-item">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Information</option>
                    <option value="order">Order Support</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
        
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What makes your honey special?</h3>
              <p>Our honey is sourced from the pristine Himalayan region and is completely pure, raw, and unprocessed. It retains all natural enzymes and nutrients.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer wholesale pricing?</h3>
              <p>Yes, we offer competitive wholesale pricing for bulk orders. Please contact our sales team for detailed pricing information.</p>
            </div>
            <div className="faq-item">
              <h3>How is your honey tested for quality?</h3>
              <p>Every batch of our honey undergoes rigorous testing at our university-grade laboratory facilities to ensure purity and quality.</p>
            </div>
            <div className="faq-item">
              <h3>What is your shipping policy?</h3>
              <p>We offer free shipping on orders above ₹500. Standard delivery takes 3-5 business days across India.</p>
            </div>
            <div className="faq-item">
              <h3>Can I visit your facility?</h3>
              <p>We welcome visitors to our facility at G.B. Pant University. Please contact us in advance to schedule a tour.</p>
            </div>
            <div className="faq-item">
              <h3>Do you have organic certification?</h3>
              <p>Yes, all our organic honey varieties are certified by recognized organic certification bodies.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ContactPage
