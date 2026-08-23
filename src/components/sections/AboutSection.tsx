import React from 'react';
import { Compass, Award, ShieldCheck, Heart } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 09</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            HERITAGE & CRAFTSMANSHIP
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display mb-6 leading-tight">
          COFFEE IS NOT SIMPLY PRODUCED. <br />
          <span className="italic font-editorial text-[#C6955B]">IT IS UNDERSTOOD.</span>
        </h2>

        {/* Story Text */}
        <div className="space-y-6 text-sm sm:text-base text-[#E8D8C0]/85 font-sans leading-relaxed">
          <p className="border-l-2 border-[#C6955B] pl-4 text-[#F4EFE8] font-medium text-base sm:text-lg">
            Brema was founded in Istanbul in 2012 with a singular conviction: to bridge five centuries of historic Istanbul coffee culture with the pinnacle of modern specialty roasting science.
          </p>

          <p>
            We operate at the intersection of artisanal intuition and industrial precision. By partnering directly with origin cooperatives across South America, East Africa, and Southeast Asia, we secure micro-lots with pristine cup clarity while guaranteeing ethical premiums to the farmers who nurture them.
          </p>

          <p>
            Inside our Istanbul Roastery, master roasters monitor every thermodynamics curve on heavy cast-iron drums. Nothing is rushed; every temperature curve is sculpted to highlight the innate personality of the seed.
          </p>
        </div>

        {/* Four Heritage Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5">
            <Compass size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8]">Direct Origin Trade</div>
            <div className="text-[10px] text-[#E8D8C0]/50 mt-0.5">Fair Farmer Premiums</div>
          </div>

          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5">
            <Award size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8]">Istanbul Roasting</div>
            <div className="text-[10px] text-[#E8D8C0]/50 mt-0.5">Crafted Since 2012</div>
          </div>

          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5">
            <ShieldCheck size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8]">Nitrogen Preserved</div>
            <div className="text-[10px] text-[#E8D8C0]/50 mt-0.5">Zero Flavor Oxidation</div>
          </div>

          <div className="p-4 rounded-xl bg-[#16100C]/60 border border-white/5">
            <Heart size={20} className="text-[#C6955B] mb-2" />
            <div className="text-xs font-semibold text-[#F4EFE8]">Master Roasters</div>
            <div className="text-[10px] text-[#E8D8C0]/50 mt-0.5">SCA Certified QA</div>
          </div>
        </div>
      </div>
    </section>
  );
};
