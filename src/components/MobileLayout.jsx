import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageDistortion from './ImageDistortion';
import Footer from './Footer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const MobileLayout = () => {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const logoRef = useRef(null);
  const glowsRef = useRef(null);
  const heroImgRef = useRef(null);
  const conceptsImgRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Calculate translation distance based on image aspect ratio (1.414)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const imageWidth = viewportHeight * 1.414;
    // Right limit translation: right edge of image aligns with right edge of screen
    const maxTranslation = Math.min(0, -(imageWidth - viewportWidth));
    // Center translation: center of image aligns with center of screen
    const centerTranslation = maxTranslation / 2;

    // Set initial centered styles for the logo
    gsap.set(logoRef.current, {
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "50%"
    });

    // Set initial scale (70%), opacity (0), and position (centered) for transition images
    gsap.set(heroImgRef.current, { scale: 0.7, opacity: 0, x: centerTranslation });
    gsap.set(conceptsImgRef.current, { scale: 0.7, opacity: 0, x: centerTranslation });
    gsap.set(glowsRef.current, { opacity: 1 });

    // Create GSAP context for safe React 18 cleaning
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=950%", // Pinned scroll height (9.5x viewport height for natural cinematic scroll)
          scrub: 1, // Smooth scrub
          pin: true,
          anticipatePin: 1
        }
      });

      // 1. Logo scales/moves to top-left (navbar header position) & Diffused glows fade out
      tl.to(logoRef.current, {
        top: "16px",
        left: "24px",
        xPercent: 0,
        yPercent: 0,
        scale: 0.5,
        transformOrigin: "top left",
        duration: 1.5,
        ease: "power2.inOut"
      }, 0)
      .to(glowsRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
      }, 0);

      // 2. Hero image fades in & zooms in (scale 0.7 -> 1.0) while sliding to the left edge (x: center -> 0)
      tl.to(heroImgRef.current, {
        opacity: 1,
        scale: 1.0,
        x: 0,
        duration: 2.0,
        ease: "power2.inOut"
      });

      // 3. Hero image horizontal scroll (panning left-to-right from x: 0 to x: maxTranslation)
      tl.to(heroImgRef.current, {
        x: maxTranslation,
        duration: 3.5,
        ease: "none" // Linear scrub for direct mapping with scrollbar
      });

      // 4. Hero image fades out and zooms out (1.0 -> 0.7) while returning to the center (x: maxTranslation -> center)
      tl.to(heroImgRef.current, {
        opacity: 0,
        scale: 0.7,
        x: centerTranslation,
        duration: 2.0,
        ease: "power2.inOut"
      });

      // 5. Concepts image fades in & zooms in (scale 0.7 -> 1.0) while sliding to the left edge (x: center -> 0)
      tl.to(conceptsImgRef.current, {
        opacity: 1,
        scale: 1.0,
        x: 0,
        duration: 2.0,
        ease: "power2.inOut"
      });

      // 6. Concepts image horizontal scroll (panning left-to-right from x: 0 to x: maxTranslation)
      tl.to(conceptsImgRef.current, {
        x: maxTranslation,
        duration: 3.5,
        ease: "none"
      });

      // 7. Cards container enters:
      //    - Concepts image fades opacity (normal opacity showing background details), zooms out (scale 1.0 -> 0.8) and returns to the center (x: maxTranslation -> center)
      //    - Cards container fades in and slides up
      tl.to(conceptsImgRef.current, {
        opacity: 0.1, // 35% opacity (30% less than 65% for a much more noticeable fade)
        scale: 0.8,
        x: centerTranslation,
        duration: 2.0,
        ease: "power2.inOut"
      }, "cardsEnter")
      .to(cardsContainerRef.current, {
        opacity: 1,
        y: 0,
        duration: 2.0,
        ease: "power2.out"
      }, "cardsEnter");

      // 8. Staggered reveal for each concept card
      tl.fromTo(".mobile-card-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(".mobile-card-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(".mobile-card-3", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(".mobile-card-4", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });

      // 9. End spacer to hold final view before unpinning
      tl.to({}, { duration: 1.0 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Scroll helper for mobile menu navigation
  const scrollToSection = (sectionId) => {
    setIsOpen(false);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'conceptos') {
      // Calculate scroll position corresponding to the concepts step in timeline (approx 45%)
      const scrollY = window.innerHeight * 4.6;
      window.scrollTo({ top: scrollY, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="w-full relative bg-black">
      
      {/* Mobile Floating Header (always on top, pointer-events-none) */}
      <header className="fixed top-0 left-0 w-full h-16 z-50 pointer-events-none flex items-center justify-between px-6">
        {/* Left side is kept empty for the logo to slide in */}
        <div />
        
        {/* Mobile Menu Button (Hamburger or Back Chevron) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto text-white hover:text-color-bienal-red focus:outline-none transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
            {isOpen ? (
              // Left chevron back arrow icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            ) : (
              // Hamburger menu icon
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Navigation Panel (Pushed to top-0 to cover header area, styled with high-end glassmorphism) */}
      <div className={`fixed top-0 left-0 w-full bg-[#070d19]/45 border-b border-white/10 backdrop-blur-2xl z-45 transition-all duration-300 ease-in-out pt-16 ${
        isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          <button 
            onClick={() => scrollToSection('inicio')}
            className="font-sans font-semibold text-lg text-left text-slate-300 hover:text-white py-2 border-b border-white/5 transition-colors duration-200"
          >
            Inicio
          </button>
          <button 
            onClick={() => scrollToSection('conceptos')}
            className="font-sans font-semibold text-lg text-left text-slate-300 hover:text-white py-2 border-b border-white/5 transition-colors duration-200"
          >
            Conceptos
          </button>
        </div>
      </div>

      {/* Pinned Viewport Wrapper (100dvh to prevent layout shifting on mobile browsers) */}
      <div ref={viewportRef} className="w-full h-[100dvh] relative overflow-hidden flex items-center justify-center bg-black">
        
        {/* Ambient Diffused Glowing Lights (Only visible at start, fading out with logo) */}
        <div ref={glowsRef} className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
          {/* Top Left Red Glow */}
          <div className="absolute top-0 left-0 w-[50vw] h-[50vw] max-w-[250px] max-h-[250px] rounded-full bg-color-bienal-red/20 blur-[80px]" />
          {/* Top Right White Glow */}
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[250px] max-h-[250px] rounded-full bg-white/10 blur-[80px] translate-x-1/4 -translate-y-1/4" />
          
          {/* Center-Left Red Glow */}
          <div className="absolute top-[35%] left-[20%] w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] rounded-full bg-color-bienal-red/15 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          {/* Center-Right Blue Glow */}
          <div className="absolute top-[65%] left-[70%] w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] rounded-full bg-blue-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          {/* Center White Glow */}
          <div className="absolute top-[48%] left-[50%] w-[60vw] h-[60vw] max-w-[300px] max-h-[300px] rounded-full bg-white/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* 1. Animated Logo Wrapper */}
        <div ref={logoRef} className="mobile-logo absolute z-50 flex flex-col items-center gap-2 text-center pointer-events-none select-none">
          <img 
            src="/documentacion/logo-bienal.svg" 
            alt="Bienal Logo" 
            className="h-16 w-auto object-contain" 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="font-display font-black text-xl tracking-wider text-white">
            BIENAL<span className="text-color-bienal-red">.</span>UTN
          </span>
          <span className="text-[10px] text-slate-500 font-sans tracking-wide">
            Lic. en Comunicación Visual • FADU - UTN
          </span>
        </div>

        {/* 2. Hero Distorted Image (fades in, then fades out, panned horizontally) */}
        <div 
          ref={heroImgRef} 
          className="absolute top-0 left-0 h-[100dvh] w-[141.4dvh] max-w-none opacity-0 z-10 pointer-events-none"
        >
          <ImageDistortion 
            imageSrc="/documentacion/presentacion-bienal.svg" 
            className="w-full h-full rounded-none shadow-none border-none" 
          />
        </div>

        {/* 3. Concepts Distorted Image (fades in, then dims to 50% opacity, panned horizontally) */}
        <div 
          ref={conceptsImgRef} 
          className="absolute top-0 left-0 h-[100dvh] w-[141.4dvh] max-w-none opacity-0 z-20 pointer-events-none"
        >
          <ImageDistortion 
            imageSrc="/documentacion/conceptos-bienal.svg" 
            className="w-full h-full rounded-none shadow-none border-none" 
          />
        </div>

        {/* 4. Concepts Title and Cards Container (fades in and slides up) */}
        <div ref={cardsContainerRef} className="mobile-cards-container absolute bottom-8 left-6 right-6 z-30 flex flex-col gap-4 opacity-0 translate-y-12">
          
          {/* Manifiesto Title block */}
          <div className="text-left select-none space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-color-bienal-red animate-pulse block">
              Manifiesto Visual
            </span>
            <h2 className="font-display font-black text-2xl text-white leading-none">
              Conceptos
            </h2>
          </div>

          {/* Staggered Touch Concept Cards (Styled dark blue with custom active states) */}
          <div className="mobile-card-1 border border-[#3b82f6]/25 bg-[#112240]/45 backdrop-blur-lg p-4 rounded-xl flex items-center gap-4 active:scale-97 active:bg-[#2563eb]/30 active:border-[#2563eb]/60 transition-all duration-300 cursor-pointer">
            <span className="font-display font-black text-xl text-white/20">01</span>
            <h3 className="font-display font-bold text-md text-white">Transformación</h3>
          </div>
          <div className="mobile-card-2 border border-[#3b82f6]/25 bg-[#112240]/45 backdrop-blur-lg p-4 rounded-xl flex items-center gap-4 active:scale-97 active:bg-[#2563eb]/30 active:border-[#2563eb]/60 transition-all duration-300 cursor-pointer">
            <span className="font-display font-black text-xl text-white/20">02</span>
            <h3 className="font-display font-bold text-md text-white">Disruptivo</h3>
          </div>
          <div className="mobile-card-3 border border-[#3b82f6]/25 bg-[#112240]/45 backdrop-blur-lg p-4 rounded-xl flex items-center gap-4 active:scale-97 active:bg-[#2563eb]/30 active:border-[#2563eb]/60 transition-all duration-300 cursor-pointer">
            <span className="font-display font-black text-xl text-white/20">03</span>
            <h3 className="font-display font-bold text-md text-white">Contrastante</h3>
          </div>
          <div className="mobile-card-4 border border-[#3b82f6]/25 bg-[#112240]/45 backdrop-blur-lg p-4 rounded-xl flex items-center gap-4 active:scale-97 active:bg-[#2563eb]/30 active:border-[#2563eb]/60 transition-all duration-300 cursor-pointer">
            <span className="font-display font-black text-xl text-white/20">04</span>
            <h3 className="font-display font-bold text-md text-white">Explosivo</h3>
          </div>

        </div>

      </div>

      {/* Footer Section (unpins and scrolls naturally at the end) */}
      <div className="w-full relative z-40 mt-[10px]">
        <Footer isMobile={true} />
      </div>

    </div>
  );
};

export default MobileLayout;
