import React from 'react';
import { Flame, Gauge, Zap, Cog } from 'lucide-react';

export const RoasterySection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 03</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            THE ROASTING ENGINE
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#F4EFE8] font-display mb-4 leading-tight">
          ROASTED IN <br />
          <span className="italic font-editorial text-[#C6955B]">ISTANBUL.</span>
        </h2>

        <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-[#E8D8C0]/80 font-mono mb-8">
          Crafted by Brema Since 2012
        </p>

        {/* Editorial Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#E8D8C0]/80 font-sans leading-relaxed">
          <div className="luxury-glass p-6 rounded-2xl">
            <h3 className="text-base font-medium text-[#F4EFE8] mb-2 font-display flex items-center gap-2">
              <Flame size={18} className="text-[#C6955B]" />
              Cast-Iron Conduction & Convection
            </h3>
            <p>
              Unlike generic hot-air roasting, Brema employs heavy double-walled cast-iron drums. This delivers gentle radiant conduction alongside precisely metered airflow, allowing core cellular expansion without scorching delicate bean surfaces.
            </p>
          </div>

          <div className="luxury-glass p-6 rounded-2xl">
            <h3 className="text-base font-medium text-[#F4EFE8] mb-2 font-display flex items-center gap-2">
              <Gauge size={18} className="text-[#C6955B]" />
              Thermodynamic Curve Precision
            </h3>
            <p>
              Each micro-lot is assigned a proprietary roasting curve tracked in millisecond intervals. By monitoring Rate of Rise (RoR), exhaust gas temperature, and development time ratio (DTR), our master roasters unlock each bean’s distinct aromatic potential.
            </p>
          </div>
        </div>

        {/* Roastery Specifications Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center font-mono">
          <div>
            <div className="text-2xl sm:text-3xl text-[#C6955B] font-bold">2012</div>
            <div className="text-[10px] text-[#E8D8C0]/60 uppercase tracking-widest mt-1">
              ESTABLISHED IN ISTANBUL
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl text-[#C6955B] font-bold">0.1°C</div>
            <div className="text-[10px] text-[#E8D8C0]/60 uppercase tracking-widest mt-1">
              THERMAL PRECISION
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl text-[#C6955B] font-bold">SCA 86+</div>
            <div className="text-[10px] text-[#E8D8C0]/60 uppercase tracking-widest mt-1">
              CUPPING STANDARDS
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl text-[#C6955B] font-bold">100%</div>
            <div className="text-[10px] text-[#E8D8C0]/60 uppercase tracking-widest mt-1">
              NITROGEN PACKAGED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
