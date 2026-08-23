import React, { useState } from 'react';
import { Building2, Coffee, Shield, CheckCircle, Sliders, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

export const HorecaSection: React.FC = () => {
  const { openSampleModal } = useCart();
  const { playClick } = useAudio();

  const [arabicaRatio, setArabicaRatio] = useState(80);
  const [monthlyKg, setMonthlyKg] = useState(60);

  const costPerKg = (arabicaRatio * 7.5 + (100 - arabicaRatio) * 4.2).toFixed(0);
  const cupsPerMonth = monthlyKg * 55; // ~18g per double dose
  const costPerCup = ((Number(costPerKg) / 55)).toFixed(2);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-5xl mx-auto w-full pointer-events-auto">
        {/* Chapter Pre-header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 10</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            B2B & WHOLESALE PARTNERSHIP
          </span>
        </div>

        {/* Large Editorial Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display mb-3">
          COFFEE FOR <br />
          <span className="italic font-editorial text-[#C6955B]">PROFESSIONALS.</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#E8D8C0]/70 font-sans max-w-2xl mb-8">
          Turnkey coffee solutions engineered for high-volume specialty coffee shops, luxury hotels, Michelin-starred restaurants, and corporate environments.
        </p>

        {/* Wholesale Blend Customizer & HORECA Suite Card */}
        <div className="luxury-glass rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Blend & Cost Calculator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#C6955B]" />
              <h3 className="text-sm font-medium tracking-[0.2em] text-[#F4EFE8] uppercase font-mono">
                Interactive Wholesale Calculator
              </h3>
            </div>

            {/* Arabica / Robusta Blend Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#E8D8C0]/70">Blend Formulation:</span>
                <span className="text-[#C6955B] font-bold">
                  {arabicaRatio}% Specialty Arabica / {100 - arabicaRatio}% Fine Robusta
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={arabicaRatio}
                onChange={(e) => setArabicaRatio(Number(e.target.value))}
                className="w-full accent-[#C6955B] bg-[#241913] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#E8D8C0]/40 mt-1">
                <span>Traditional Bar Crema (50/50)</span>
                <span>100% Single Origin Specialty</span>
              </div>
            </div>

            {/* Monthly Volume Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-[#E8D8C0]/70">Estimated Monthly Consumption:</span>
                <span className="text-[#F4EFE8] font-bold">{monthlyKg} kg / month</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={monthlyKg}
                onChange={(e) => setMonthlyKg(Number(e.target.value))}
                className="w-full accent-[#C6955B] bg-[#241913] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#E8D8C0]/40 mt-1">
                <span>Boutique Cafe (10 kg)</span>
                <span>Multi-branch Chain (300+ kg)</span>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
              <div className="p-3 rounded-xl bg-[#1D140F] border border-white/5">
                <div className="text-[10px] text-[#E8D8C0]/50 uppercase">MONTHLY CUPS</div>
                <div className="text-base text-[#F4EFE8] font-bold mt-1">~{cupsPerMonth.toLocaleString()}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#1D140F] border border-white/5">
                <div className="text-[10px] text-[#E8D8C0]/50 uppercase">EST. WHOLESALE / KG</div>
                <div className="text-base text-[#C6955B] font-bold mt-1">{costPerKg} ₺</div>
              </div>

              <div className="p-3 rounded-xl bg-[#1D140F] border border-white/5">
                <div className="text-[10px] text-[#E8D8C0]/50 uppercase">COST PER DOUBLE SHOT</div>
                <div className="text-base text-green-400 font-bold mt-1">{costPerCup} ₺</div>
              </div>
            </div>
          </div>

          {/* Right: HORECA Support Package & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8 space-y-4">
            <h4 className="text-sm font-semibold tracking-wider font-display text-[#F4EFE8]">
              The Brema Professional Guarantee
            </h4>

            <ul className="space-y-2.5 text-xs text-[#E8D8C0]/80 font-sans">
              <li className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-[#C6955B] shrink-0" />
                <span>Custom private label roast curve development</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-[#C6955B] shrink-0" />
                <span>Commercial espresso machine leasing & maintenance</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-[#C6955B] shrink-0" />
                <span>SCA Barista training & extraction workshops</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle size={14} className="text-[#C6955B] shrink-0" />
                <span>24-Hour emergency roastery courier in Istanbul</span>
              </li>
            </ul>

            <button
              onClick={() => {
                playClick();
                openSampleModal();
              }}
              className="w-full btn-luxury btn-luxury-primary mt-2"
              data-cursor="INQUIRE"
            >
              <span>REQUEST WHOLESALE PROPOSAL</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
