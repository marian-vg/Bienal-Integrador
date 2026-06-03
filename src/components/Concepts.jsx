import React, { useRef, useState } from 'react';
import ImageDistortion from './ImageDistortion';

const SpotlightCard = ({ title, number }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-xl border p-5 flex items-center gap-4 transition-all duration-300 hover:scale-105 cursor-pointer select-none"
      style={{
        background: isHovered 
          ? `radial-gradient(circle 120px at ${coords.x}px ${coords.y}px, rgba(230, 57, 70, 0.18), rgba(42, 8, 12, 0.4))`
          : 'rgba(42, 8, 12, 0.3)',
        borderColor: isHovered ? 'rgba(230, 57, 70, 0.3)' : 'rgba(255, 255, 255, 0.05)',
        boxShadow: isHovered ? '0 10px 25px -10px rgba(230, 57, 70, 0.15)' : 'none'
      }}
    >
      {/* Spotlight edge border reflection */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle 120px at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.05), transparent 85%)`
          }}
        />
      )}

      {/* Concept Number */}
      <span className="font-display font-black text-2xl transition-colors duration-300"
            style={{ color: isHovered ? 'rgba(230, 57, 70, 0.6)' : 'rgba(255, 255, 255, 0.12)' }}>
        {number}
      </span>

      {/* Concept Title */}
      <h3 className="font-display font-bold text-sm md:text-base text-white tracking-wide transition-colors duration-300">
        {title}
      </h3>
    </div>
  );
};

const Concepts = () => {
  return (
    <section id="conceptos" className="w-full min-h-screen py-24 bg-color-bienal-dark-red flex items-center justify-center border-t border-white/5 relative">
      
      {/* Purely textual Title Overlay, absolute positioned at the TOP-RIGHT of the entire SECTION, with a top margin */}
      <div className="absolute top-16 right-6 md:right-12 z-10 text-right pointer-events-none select-none space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-color-bienal-red animate-pulse block">
          Manifiesto Visual
        </span>
        <h2 className="font-display font-black text-3xl md:text-4xl xl:text-5xl text-white leading-none">
          Conceptos
        </h2>
      </div>

      {/* Expanded container (added pt-20 on mobile to push grid down, left-aligned to the screen on desktop with 10px margin) */}
      <div className="w-full max-w-[92vw] xl:max-w-[88vw] mx-auto lg:max-w-none lg:mx-0 lg:pl-[10px] lg:pr-12 flex flex-col gap-12 px-4 lg:px-0 pt-20 lg:pt-0">
        
        {/* Expanded Grid Layout to make image 10% larger (9/12 instead of 7/10) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* 75% Width Image Container (using 9 out of 12 grid columns, aspect-4/3) */}
          <div className="lg:col-span-9 aspect-[4/3] relative rounded-2xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl">
            {/* WebGL Image Distortion canvas */}
            <ImageDistortion 
              imageSrc="/documentacion/conceptos-bienal.webp" 
              className="w-full h-full" 
            />
          </div>

          {/* 25% Width Concept Cards Container (using 3 out of 12 grid columns, spacing gap-5) */}
          <div className="lg:col-span-3 flex flex-col gap-5 text-left">
            {/* 4 Custom concept cards */}
            <SpotlightCard number="01" title="Transformación" />
            <SpotlightCard number="02" title="Disruptivo" />
            <SpotlightCard number="03" title="Contrastante" />
            <SpotlightCard number="04" title="Explosivo" />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Concepts;
