'use client'

import './navbar.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Cart from '@/components/cart/cart';
import AuthModal from '@/components/auth/AuthModal';

import { useUser } from '@/contexts/userContext';
import { signOut } from '@/lib/auth';
export default function Navbar() {
    const { user, loading } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const { state } = useCart();

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

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <>
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
                            <button className="search-btn" title="Search">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                            <button className="cart-btn" onClick={toggleCart} title="Shopping Cart">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4.01"></path>
                                </svg>
                                {state.itemCount > 0 && (
                                    <span className="cart-badge">{state.itemCount}</span>
                                )}
                            </button>
                            {user ? (
                                <UserMenu user={user} />
                            ) : (
                                <button className="login-btn" onClick={() => setAuthOpen(true)}>
                                    Login
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="navbar-mobile">
                        <button className="cart-btn mobile-cart" onClick={toggleCart} title="Shopping Cart">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {state.itemCount > 0 && (
                                <span className="cart-badge">{state.itemCount}</span>
                            )}
                        </button>
                        <button className="menu-toggle" onClick={toggleMenu} title="Menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>

            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}


// show user profile and logout on the tapping the user icon

function UserMenu({ user }: { user: { email?: string | null } }) {
    const [isOpen, setIsOpen] = useState(false);
    // Close dropdown on outside click
    useEffect(() => {
        if (!isOpen) return;
        function handleClick(e: MouseEvent) {
            const menu = document.getElementById('user-menu-root');
            if (menu && !menu.contains(e.target as Node)) setIsOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);
    return (
        <div className="user-menu-root" id="user-menu-root" style={{ position: 'relative', display: 'inline-block' }}>
            <button className="user-icon" onClick={() => setIsOpen(v => !v)} title="User Menu" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                <div className="border-circle bg-white text-black border-black">{user.email?.substring(0, 1)}</div>
            </button>
            <div className={`user-menu${isOpen ? ' active' : ''}`} style={{ position: 'absolute', top: '120%', right: 0, minWidth: 140 }}>
                <div className="user-dropdown">
                    <a href="/profile" className="dropdown-item">Profile</a>
                    <button className="dropdown-item" onClick={signOut}>Logout</button>
                </div>
            </div>
        </div>
    );
}