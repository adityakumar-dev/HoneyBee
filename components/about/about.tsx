import React from 'react';
import Image from 'next/image';
import './about.css';

const About = () => {
  return (
    <div className="about-wrapper">
          <div className="about-background"/>
          <div className="about-background-2"/>
      <div className="about-container">
        <div className="about-content">
          <div className="about-header">
            <h2>Our Mission</h2>
            <div className="honeycomb-divider">
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex"></div>
            </div>
          </div>
          
          <div className="about-grid">
            <div className="about-card">
              <div className="card-icon">
                <Image src="/logo.png" alt="Quality" width={64} height={64} />
              </div>
              <h3>Premium Quality</h3>
              <p>We source the finest Himalayan honey, ensuring unmatched purity and taste in every drop.</p>
            </div>

            <div className="about-card">
              <div className="card-icon">
                <Image src="/logo.png" alt="Sustainable" width={64} height={64} />
              </div>
              <h3>Sustainable Practice</h3>
              <p>Supporting local beekeepers and maintaining ecological balance in honey harvesting.</p>
            </div>

            <div className="about-card">
              <div className="card-icon">
                <Image src="/logo.png" alt="Community" width={64} height={64} />
              </div>
              <h3>Community First</h3>
              <p>Empowering local communities through fair trade practices and sustainable development.</p>
            </div>
          </div>

          <div className="about-story">
            <div className="story-image">
              <Image 
                src="/sample_poster.jpg" 
                alt="Honey harvesting" 
                width={400} 
                height={300}
                className="rounded-image"
              />
            </div>
            <div className="story-content">
              <h3>Our Story</h3>
              <p>From the pristine heights of the Himalayas, we bring you nature's liquid gold. Our journey began with a simple mission: to share the purest honey while preserving traditional harvesting methods and supporting local communities.</p>
              <p>Every jar of our honey tells a story of dedication, sustainability, and the amazing connection between bees, nature, and human craftsmanship.</p>
              <button className="learn-more">Discover More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 