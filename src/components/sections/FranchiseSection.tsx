import React from 'react';
import { Store, ShieldCheck, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

export const FranchiseSection: React.FC = () => {
  const { openSampleModal } = useCart();
  const { playClick } = useAudio();

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-5xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 11</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            COMMERCIAL EXPANSION
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display mb-4 leading-tight">
          BUILD THE <br />
          <span className="italic font-editorial text-[#C6955B]">BREMA EXPERIENCE.</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#E8D8C0]/70 font-sans max-w-xl mb-8">
          Partner with Brema to open an architectural specialty coffee destination. We provide turnkey architectural design, supply chain mastery, and comprehensive barista academy training.
        </p>

        {/* 3 Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="luxury-glass p-6 rounded-2xl">
            <Store size={22} className="text-[#C6955B] mb-3" />
            <h3 className="text-base font-medium text-[#F4EFE8] mb-1 font-display">
              Turnkey Architectural Concept
            </h3>
            <p className="text-xs text-[#E8D8C0]/70 leading-relaxed font-sans">
              Monolithic dark stone counters, brass details, and immersive open-barista layouts customized for your location.
            </p>
          </div>

          <div className="luxury-glass p-6 rounded-2xl">
            <TrendingUp size={22} className="text-[#C6955B] mb-3" />
            <h3 className="text-base font-medium text-[#F4EFE8] mb-1 font-display">
              Direct Roastery Supply Chain
            </h3>
            <p className="text-xs text-[#E8D8C0]/70 leading-relaxed font-sans">
              Weekly nitrogen-flushed roast dispatches directly from our Istanbul headquarters at competitive partner margins.
            </p>
          </div>

          <div className="luxury-glass p-6 rounded-2xl">
            <Users size={22} className="text-[#C6955B] mb-3" />
            <h3 className="text-base font-medium text-[#F4EFE8] mb-1 font-display">
              Brema Barista Academy
            </h3>
            <p className="text-xs text-[#E8D8C0]/70 leading-relaxed font-sans">
              Rigorous staff onboarding, dial-in calibrating, sensory evaluation, and ongoing quality assurance audits.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="luxury-glass p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border-l-4 border-l-[#C6955B]">
          <div>
            <h4 className="text-lg font-light tracking-wide text-[#F4EFE8] font-display">
              Ready to bring Brema Coffee to your city?
            </h4>
            <p className="text-xs text-[#E8D8C0]/60 font-sans mt-0.5">
              Franchise and flagship licenses currently open for Türkiye, GCC, and Europe.
            </p>
          </div>

          <button
            onClick={() => {
              playClick();
              openSampleModal();
            }}
            className="btn-luxury btn-luxury-primary shrink-0"
            data-cursor="PARTNER"
          >
            <span>DISCOVER FRANCHISE OPPORTUNITIES</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
