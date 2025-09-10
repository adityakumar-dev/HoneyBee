"use client";
import Navbar from '@/components/navbar/navbar';
import './app.css';
import Hero from '@/components/hero/hero';
import About from '@/components/about/about';
import Products from '@/components/products/products';
import Features from '@/components/features/features';
import Testimonials from '@/components/testimonials/testimonials';
import Footer from '@/components/footer/footer';
import { useUser } from '@/contexts/userContext';
import Loading from '@/components/loading/loading';

export default function Home() {

  const {user,loading} = useUser();

  if(loading){
    return <Loading/>
  }
return (
    <>
      <Navbar/>
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="background"/>
        <div className="background-2"/>
        <Hero/>
      </div>

      {/* About Section */}
      <About />
      
      {/* Products Section */}
      <Products />
      
      {/* Features Section */}
      <Features />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Footer */}
      <Footer />
    </>
  );
}
