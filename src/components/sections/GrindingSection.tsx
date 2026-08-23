import React from 'react';
import { Layers, Disc, Zap, Check } from 'lucide-react';

export const GrindingSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 05</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            MECHANICAL FRACTURE
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#F4EFE8] font-display mb-4 leading-tight">
          PARTICLE <br />
          <span className="italic font-editorial text-[#C6955B]">PHYSICS.</span>
        </h2>

        <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-[#E8D8C0]/80 font-mono mb-8">
          The Burr Grinder Vortex
        </p>

        {/* Editorial Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#E8D8C0]/80 font-sans leading-relaxed">
          <div className="luxury-glass p-6 rounded-2xl">
            <h3 className="text-base font-medium text-[#F4EFE8] mb-2 font-display flex items-center gap-2">
              <Disc size={18} className="text-[#C6955B]" />
              Micrometric Burr Alignment
            </h3>
            <p>
              As gravity draws the roasted bean into hardened steel conical burrs, the cell structure is sheared rather than crushed. This preserves volatile aromatics and creates a bimodal particle distribution engineered for unimpeded water flow.
            </p>
          </div>

          <div className="luxury-glass p-6 rounded-2xl">
            <h3 className="text-base font-medium text-[#F4EFE8] mb-2 font-display flex items-center gap-2">
              <Layers size={18} className="text-[#C6955B]" />
              Zero Frictional Heat Build-Up
            </h3>
            <p>
              Low-RPM reduction gearing prevents thermal degradation during grinding, ensuring every micro-ground particle retains the chocolate, fruit, and floral oils unlocked during roasting.
            </p>
          </div>
        </div>

        {/* Grind Micron Metrics */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 text-center font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#16100C]/50 border border-white/5">
            <div className="text-lg text-[#C6955B] font-bold">50 - 100 μm</div>
            <div className="text-[9px] text-[#E8D8C0]/50 uppercase tracking-widest mt-1">TURKISH POWDER</div>
          </div>

          <div className="p-3 rounded-xl bg-[#16100C]/50 border border-white/5">
            <div className="text-lg text-[#C6955B] font-bold">200 - 350 μm</div>
            <div className="text-[9px] text-[#E8D8C0]/50 uppercase tracking-widest mt-1">ESPRESSO 9-BAR</div>
          </div>

          <div className="p-3 rounded-xl bg-[#16100C]/50 border border-white/5">
            <div className="text-lg text-[#C6955B] font-bold">600 - 900 μm</div>
            <div className="text-[9px] text-[#E8D8C0]/50 uppercase tracking-widest mt-1">V60 / POUR OVER</div>
          </div>
        </div>
      </div>
    </section>
  );
};
