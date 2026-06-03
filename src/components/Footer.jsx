import React from 'react';

const Footer = ({ isMobile = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`relative border-t border-white/5 overflow-hidden ${
      isMobile ? 'bg-[#070d19] py-6' : 'bg-[#050000] py-12'
    }`}>
      {/* Decorative blur glow */}
      <div className={`absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl -z-10 ${
        isMobile ? 'bg-[#2563eb]/5' : 'bg-color-bienal-red/5'
      }`} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo and Academic stamp */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div className="flex items-center gap-2">
            <img 
              src="/documentacion/logo-bienal.svg" 
              alt="Bienal Logo" 
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-display font-black text-lg tracking-wider text-white">
              BIENAL<span className="text-color-bienal-red">.</span>UTN
            </span>
          </div>
          <span className="text-xs text-slate-500 font-sans">
            Lic. en Comunicación Visual • FADU - UTN
          </span>
        </div>

        {/* Copyright info */}
        <div className="text-center md:text-right font-sans text-xs text-slate-500 space-y-1">
          <p>© {currentYear} Bienal UTN. Todos los derechos reservados.</p>
          <p>Hecho con fines académicos y de presentación visual.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
