import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('KAHVE ATÖLYESİ HAZIRLANIYOR');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const phases = [
      { at: 15, text: 'DÜNYANIN EN İYİ KAHVE ÇEKİRDEKLERİ SEÇİLİYOR' },
      { at: 40, text: 'KAVURMA TAMBURU ISITILIYOR' },
      { at: 70, text: 'KUSURSUZ LEZZET VE KAVURMA AYARI YAPILIYOR' },
      { at: 90, text: 'TAZE KAHVE KOKULARI YAYILIYOR' },
      { at: 100, text: 'BREMA KAHVE ATÖLYESİNE HOŞ GELDİNİZ' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(onComplete, 700);
          }, 350);
          return 100;
        }

        const currentPhase = phases.find((p) => next >= p.at);
        if (currentPhase) {
          setPhaseText(currentPhase.text);
        }
        return next;
      });
    }, 65);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A120E] text-[#FAF4EB] transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at center, rgba(56, 38, 30, 0.75) 0%, #1A120E 80%)',
      }}
    >
      {/* Animated Floating Stylized Bean Icon */}
      <div className="relative mb-10 flex items-center justify-center">
        {/* Soft Golden Halo */}
        <div className="absolute w-44 h-44 rounded-full bg-[#D49B5B]/20 blur-3xl animate-pulse" />

        {/* Minimal Stylized Bean SVG */}
        <svg
          className="w-20 h-20 text-[#D49B5B] animate-spin"
          style={{ animationDuration: '10s' }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="46"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="opacity-70"
          />
          <path
            d="M50 8 C 58 30, 42 70, 50 92"
            stroke="#FAF4EB"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Brand Stamp in center */}
        <div className="absolute font-mono text-[10px] tracking-ultra text-[#FAF4EB]/90 font-bold">
          2012
        </div>
      </div>

      {/* Brand Title */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-light tracking-[0.35em] text-[#FAF4EB] mb-2 font-display">
          BREMA
        </h1>
        <p className="text-xs uppercase tracking-[0.38em] text-[#D49B5B] font-mono font-bold">
          KAHVE KAVURMA ATÖLYESİ · İSTANBUL
        </p>
      </div>

      {/* Dynamic Status Text */}
      <div className="h-6 mb-4 flex items-center justify-center text-center px-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#D9C3B0] font-mono font-medium">
          {phaseText}
        </span>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="w-56 sm:w-72 flex flex-col items-center gap-3">
        <div className="w-full h-[2.5px] bg-white/10 relative overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-[#8A4F2C] via-[#D49B5B] to-[#FAF4EB] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">
          %{progress.toString().padStart(3, '0')}
        </div>
      </div>
    </div>
  );
};
