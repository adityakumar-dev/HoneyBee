'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './about.css'

gsap.registerPlugin(ScrollTrigger)

const AboutPage = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Timeline animation
    if (timelineRef.current) {
      const timelineItems = timelineRef.current.querySelectorAll('.timeline-item')
      
      gsap.fromTo(timelineItems, 
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }

    // Team members animation
    if (teamRef.current) {
      const teamMembers = teamRef.current.querySelectorAll('.team-member')
      
      gsap.fromTo(teamMembers,
        {
          y: 80,
          opacity: 0,
          rotationY: 45
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }

    // Values cards animation
    if (valuesRef.current) {
      const valueCards = valuesRef.current.querySelectorAll('.value-card')
      
      gsap.fromTo(valueCards,
        {
          x: -100,
          opacity: 0,
          rotation: -5
        },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      )
    }
  }, [])
  return (
    <div className="about-page">
      <Navbar />
      
      {/* About Hero Section with Background Elements */}
      <div className="about-hero-section">
        <div className="background"/>
        <div className="background-2"/>
        <div className="about-hero">
          <div className="about-hero-content">
            <h1>About HoneyBee</h1>
            <p>Rooted in tradition, inspired by innovation, blessed by the Himalayas</p>
          </div>
        </div>
      </div>

      <div className="about-container">
        <section className="story-section">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                HoneyBee was born from the vision and research excellence of Govind Ballabh Pant University 
                of Agriculture and Technology, Pantnagar. Founded with a mission to bring the purest 
                Himalayan honey to families across India, we combine traditional beekeeping practices 
                with modern agricultural science.
              </p>
              <p>
                Our journey began in the pristine valleys of Uttarakhand, where the confluence of 
                diverse flora and ancient beekeeping traditions creates honey of unparalleled quality. 
                Every jar of our honey tells a story of dedication, purity, and the natural bounty 
                of the Himalayas.
              </p>
              <div className="highlights">
                <div className="highlight-item">
                  <h4>🏛️ University Heritage</h4>
                  <p>Backed by the research and expertise of G.B. Pant University</p>
                </div>
                <div className="highlight-item">
                  <h4>
                    <svg style={{display: 'inline', width: '1.2em', height: '1.2em', marginRight: '0.5rem'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2a10 10 0 0 1 10 10c0 2.5-2 5-2 5s2 2.5 2 5a10 10 0 0 1-10 10A10 10 0 0 1 2 12c0-2.5 2-5 2-5s-2-2.5-2-5A10 10 0 0 1 12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M8 14s.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 8s2-2 4-2 4 2 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Sustainable Practices
                  </h4>
                  <p>Eco-friendly methods that protect our environment</p>
                </div>
                <div className="highlight-item">
                  <h4>
                    <svg style={{display: 'inline', width: '1.2em', height: '1.2em', marginRight: '0.5rem'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Quality Assurance
                  </h4>
                  <p>Scientific testing and quality control at every step</p>
                </div>
              </div>
            </div>
            <div className="story-image">
              <Image 
                src="/beehive.png" 
                alt="Our Story"
                width={500}
                height={400}
                className="about-image"
              />
            </div>
          </div>
        </section>

        <section className="university-section">
          <div className="university-content">
            <h2>G.B. Pant University Legacy</h2>
            <div className="university-grid">
              <div className="university-info">
                <h3>Academic Excellence</h3>
                <p>
                  Govind Ballabh Pant University of Agriculture and Technology stands as a 
                  premier institution in agricultural education and research. Our honey 
                  production is guided by the university's cutting-edge research in 
                  apiculture and sustainable farming practices.
                </p>
                
                <h3>Research & Innovation</h3>
                <p>
                  Our beekeeping methods are continuously refined through ongoing research 
                  in bee biology, honey chemistry, and sustainable agriculture. This 
                  scientific approach ensures that every product meets the highest 
                  standards of purity and nutritional value.
                </p>
                
                <h3>Community Impact</h3>
                <p>
                  Beyond producing exceptional honey, we work with local farmers and 
                  beekeepers, providing training and support to create sustainable 
                  livelihoods in rural Uttarakhand.
                </p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>1960</h3>
                  <p>University Founded</p>
                </div>
                <div className="stat-card">
                  <h3>15+</h3>
                  <p>Years in Honey Production</p>
                </div>
                <div className="stat-card">
                  <h3>500+</h3>
                  <p>Partner Beekeepers</p>
                </div>
                <div className="stat-card">
                  <h3>50,000+</h3>
                  <p>Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid" ref={valuesRef}>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5 12.5c0 .28-.11.53-.29.71l-4.5 4.5c-.18.18-.43.29-.71.29s-.53-.11-.71-.29l-4.5-4.5c-.18-.18-.29-.43-.29-.71s.11-.53.29-.71l4.5-4.5c.18-.18.43-.29.71-.29s.53.11.71.29l4.5 4.5c.18.18.29.43.29.71z" fill="currentColor"/>
                  <circle cx="12" cy="12" r="2" fill="white"/>
                </svg>
              </div>
              <h3>Purity</h3>
              <p>We never compromise on the natural purity of our honey. No additives, no processing - just pure, raw honey as nature intended.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2a10 10 0 0 1 10 10c0 2.5-2 5-2 5s2 2.5 2 5a10 10 0 0 1-10 10A10 10 0 0 1 2 12c0-2.5 2-5 2-5s-2-2.5-2-5A10 10 0 0 1 12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M8 14s.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 8s2-2 4-2 4 2 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Sustainability</h3>
              <p>Our practices support bee populations and protect the delicate ecosystem of the Himalayas for future generations.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Community</h3>
              <p>We empower local beekeepers and farmers, creating sustainable livelihoods in mountain communities.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>Combining traditional wisdom with modern science to deliver the highest quality honey products.</p>
            </div>
          </div>
        </section>

        <section className="process-section">
          <h2>Our Process</h2>
          <div className="process-timeline" ref={timelineRef}>
            <div className="timeline-item">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h3>Sustainable Beekeeping</h3>
                <p>Our partner beekeepers follow sustainable practices in the pristine Himalayan environment</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h3>Natural Harvesting</h3>
                <p>Honey is harvested at optimal times, ensuring maximum nutritional value and flavor</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h3>Quality Testing</h3>
                <p>Every batch undergoes rigorous testing at our university-grade laboratory facilities</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h3>Careful Packaging</h3>
                <p>Temperature-controlled packaging preserves natural enzymes and nutrients</p>
              </div>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid" ref={teamRef}>
            <div className="team-member">
              <div className="member-image">
                <Image 
                  src="/sample_poster.jpg" 
                  alt="Dr. Rajesh Kumar"
                  width={200}
                  height={200}
                />
              </div>
              <h3>Dr. Rajesh Kumar</h3>
              <p>Chief Apiculture Researcher</p>
              <span>15+ years in bee research</span>
            </div>
            <div className="team-member">
              <div className="member-image">
                <Image 
                  src="/sample_poster.jpg" 
                  alt="Priya Sharma"
                  width={200}
                  height={200}
                />
              </div>
              <h3>Priya Sharma</h3>
              <p>Quality Assurance Manager</p>
              <span>Expert in honey chemistry</span>
            </div>
            <div className="team-member">
              <div className="member-image">
                <Image 
                  src="/sample_poster.jpg" 
                  alt="Vikram Singh"
                  width={200}
                  height={200}
                />
              </div>
              <h3>Vikram Singh</h3>
              <p>Community Outreach Director</p>
              <span>Local beekeeper coordinator</span>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default AboutPage
