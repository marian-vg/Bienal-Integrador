import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Concepts from './components/Concepts';
import Footer from './components/Footer';

function App() {
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
