import React, { useEffect } from 'react';
import useMediaQuery from './hooks/useMediaQuery';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Concepts from './components/Concepts';
import Footer from './components/Footer';
import MobileLayout from './components/MobileLayout';

function App() {
  // Mobile breakpoint (screens smaller than lg / 1024px)
  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    // Settle browser scroll track and prevent viewport contamination when switching in DevTools
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [isMobile]);

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div className="relative min-h-screen bg-color-bienal-dark-red text-color-bienal-light antialiased font-sans selection:bg-color-bienal-red selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section: Full Viewport Image 1 */}
        <Hero />

        {/* Concepts Section: Full Viewport Image 2 */}
        <Concepts />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default App;
