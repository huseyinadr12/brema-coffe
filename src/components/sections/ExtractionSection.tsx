import React from 'react';
import { Droplet, Gauge, Sparkles, CheckCircle2 } from 'lucide-react';

export const ExtractionSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 06</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            HYDROSTATIC ALCHEMY
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#F4EFE8] font-display mb-4 leading-tight">
          9-BAR <br />
          <span className="italic font-editorial text-[#C6955B]">EXTRACTION.</span>
        </h2>

        <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-[#E8D8C0]/80 font-mono mb-8">
          The Moment of Perfect Emulsion
        </p>

        {/* Editorial Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#E8D8C0]/80 font-sans leading-relaxed">
          <div className="luxury-glass p-6 rounded-2xl">
            <h3 className="text-base font-medium text-[#F4EFE8] mb-2 font-display flex items-center gap-2">
              <Gauge size={18} className="text-[#C6955B]" />
              93.5°C Thermal Stability
            </h3>
            <p>
              Pre-infusion gently saturates the puck before 9-bar pressure forces mountain water through the compressed coffee matrix, dissolving sugars, lipids, and aromatic phenols into a viscous golden fluid stream.
            </p>
          </div>

          <div className="luxury-glass p-6 rounded-2xl">
            <h3 className="text-base font-medium text-[#F4EFE8] mb-2 font-display flex items-center gap-2">
              <Droplet size={18} className="text-[#C6955B]" />
              Elastic Golden Crema
            </h3>
            <p>
              As the extraction completes, millions of carbon dioxide micro-bubbles become trapped in natural emulsified oils, creating a dense, tiger-striped crema that seals in the intense cocoa and caramel aroma until the first sip.
            </p>
          </div>
        </div>

        {/* Extraction Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center font-mono text-xs">
          <div>
            <div className="text-xl text-[#C6955B] font-bold">18.5g</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-widest mt-0.5">DRY DOSE</div>
          </div>

          <div>
            <div className="text-xl text-[#C6955B] font-bold">38g</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-widest mt-0.5">LIQUID YIELD</div>
          </div>

          <div>
            <div className="text-xl text-[#C6955B] font-bold">27s</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-widest mt-0.5">EXTRACTION TIME</div>
          </div>

          <div>
            <div className="text-xl text-[#C6955B] font-bold">9.0 BAR</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-widest mt-0.5">EXTRACTION PRESSURE</div>
          </div>
        </div>
      </div>
    </section>
  );
};
