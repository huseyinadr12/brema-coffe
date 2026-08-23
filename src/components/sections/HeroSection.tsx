import React from 'react';
import { ChevronDown, Compass, Award, Flame } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface HeroSectionProps {
  onScrollDown: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollDown }) => {
  const { playClick } = useAudio();

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-16 pointer-events-none z-10 select-none">
      {/* Top spacing for navigation bar */}
      <div className="h-16" />

      {/* Main Centered Hero Typography */}
      <div className="flex flex-col items-center justify-center text-center my-auto max-w-5xl mx-auto px-4">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#16100C]/80 border border-[#C6955B]/30 backdrop-blur-md mb-8 pointer-events-auto shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#C6955B] animate-ping" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#E8D8C0] font-sans font-medium">
            SPECIALTY COFFEE ROASTERY · ISTANBUL
          </span>
        </div>

        {/* Massive Editorial Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.2em] sm:tracking-[0.25em] text-[#F4EFE8] font-display uppercase leading-none drop-shadow-2xl">
          BREMA
        </h1>

        {/* Emotive Subtitle */}
        <div className="mt-6 sm:mt-8 space-y-2">
          <p className="text-xl sm:text-3xl md:text-4xl italic font-editorial text-[#E8D8C0] tracking-wide">
            From Origin to Cup
          </p>
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#C6955B] font-sans font-medium">
            Crafted in Istanbul Since 2012
          </p>
        </div>

        {/* Brand Pillars Minimal Row */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-12 sm:mt-16 pt-8 border-t border-white/10 w-full max-w-2xl text-center pointer-events-auto">
          <div className="flex flex-col items-center">
            <Compass size={18} className="text-[#C6955B] mb-2" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4EFE8] font-medium font-sans">
              8+ GLOBAL
            </span>
            <span className="text-[9px] text-[#E8D8C0]/50 tracking-widest font-mono">
              DIRECT TERROIRS
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-white/10 px-2">
            <Flame size={18} className="text-[#C6955B] mb-2" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4EFE8] font-medium font-sans">
              CAST-IRON
            </span>
            <span className="text-[9px] text-[#E8D8C0]/50 tracking-widest font-mono">
              DRUM PROFILING
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Award size={18} className="text-[#C6955B] mb-2" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#F4EFE8] font-medium font-sans">
              SCA 86+ PTS
            </span>
            <span className="text-[9px] text-[#E8D8C0]/50 tracking-widest font-mono">
              SPECIALTY GRADE
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="flex flex-col items-center justify-center text-center pointer-events-auto pb-4">
        <button
          onClick={() => {
            playClick();
            onScrollDown();
          }}
          className="group flex flex-col items-center gap-2 text-xs uppercase tracking-[0.35em] text-[#E8D8C0]/70 hover:text-[#C6955B] transition-all cursor-pointer focus:outline-none"
          data-cursor="DISCOVER"
        >
          <span>SCROLL TO DISCOVER</span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C6955B] transition-colors">
            <ChevronDown size={14} className="text-[#C6955B] animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
