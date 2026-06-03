import React from 'react';
import ImageDistortion from './ImageDistortion';

const Hero = () => {
  return (
    <section id="inicio" className="w-full h-[calc(116vh)] relative overflow-hidden bg-color-bienal-dark-red">
      {/* Full Viewport Interactive WebGL Image */}
      <div className="absolute inset-0 w-full">
        <ImageDistortion 
          imageSrc="/documentacion/presentacion-bienal.webp" 
          className="w-full h-full rounded-none shadow-none border-none" 
        />
      </div>

      {/* Subtle bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none animate-pulse">
        <span className="text-xs uppercase tracking-widest text-white/50 font-sans font-semibold">
          Desplazar
        </span>
        <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
