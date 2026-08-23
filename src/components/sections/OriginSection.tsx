import React from 'react';
import { Sprout, Mountain, Sun, Droplets } from 'lucide-react';

export const OriginSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 01</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            THE LIVING SEED
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-[#F4EFE8] font-display mb-6 leading-tight">
          IT STARTS WITH <br />
          <span className="italic font-editorial text-[#C6955B]">THE ORIGIN.</span>
        </h2>

        {/* Storytelling Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#E8D8C0]/80 font-sans leading-relaxed">
          <p className="border-l-2 border-[#C6955B]/40 pl-4">
            Long before the bean reaches the heat of our Istanbul roasters, its flavor genetics are shaped by high-altitude mist, volcanic soil minerals, and pure mountain rains. Every single origin selected by Brema is a tribute to terroir and generational farming wisdom.
          </p>
          <p>
            From the fertile red soils of Cerrado Mineiro in Brazil to the steep cloud forests of Yirgacheffe and Mount Kenya, we hand-select only dense, fully ripe cherries harvested at peak Brix sweetness.
          </p>
        </div>

        {/* Terroir Factors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5 backdrop-blur-md">
            <Mountain size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8] tracking-wider">1,200 - 2,200m</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-wider">Strictly High Grown</div>
          </div>

          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5 backdrop-blur-md">
            <Sun size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8] tracking-wider">Selective Picking</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-wider">100% Ripe Cherries</div>
          </div>

          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5 backdrop-blur-md">
            <Droplets size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8] tracking-wider">Pure Processing</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-wider">Washed, Honey, Natural</div>
          </div>

          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5 backdrop-blur-md">
            <Sprout size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8] tracking-wider">Direct Trade</div>
            <div className="text-[10px] text-[#E8D8C0]/50 tracking-wider">Sustainable Micro-Lots</div>
          </div>
        </div>
      </div>
    </section>
  );
};
