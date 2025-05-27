import Navbar from '@/components/navbar/navbar';
import './app.css';
import Hero from '@/components/hero/hero';
import About from '@/components/about/about';

export default function Home() {
  return (
    <>
      <Navbar/>
      {/* Hero Section */}

      <div className="relative h-screen w-full overflow-hidden">
        <div className="background"/>
        <div className="background-2"/>
          <Hero/>
      </div>

      {/* About Section */}
      <About />
    </>
  );
}
