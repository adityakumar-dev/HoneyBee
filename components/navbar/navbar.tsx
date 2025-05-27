'use client'
import './navbar.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Image src="/logo.png" alt="logo" width={50} height={50} />
                    <h1>HoneyBee</h1>
                </div>

                <div className={`navbar-content ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="navbar-links">
                        <li className="nav-item">
                            <a href="/" className="nav-link">
                                <span>Home</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/products" className="nav-link">
                                <span>Products</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/about" className="nav-link">
                                <span>About</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/contact" className="nav-link">
                                <span>Contact</span>
                            </a>
                        </li>
                    </ul>

                    <div className="navbar-actions">
                        <button className="navbar-login">Login</button>
                        {/* <button className="navbar-signup">Signup</button> */}
                    </div>
                </div>

                <button 
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <div className="hamburger-lines">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
            </div>
        </div>
    );
}
