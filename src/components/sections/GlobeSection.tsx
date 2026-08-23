import React from 'react';
import { Globe, MapPin, Wind, Sparkles, ArrowRight } from 'lucide-react';
import { ORIGINS_DATA, ISTANBUL_COORDINATES } from '../../data/origins';
import { OriginData } from '../../types';
import { useAudio } from '../../context/AudioContext';

interface GlobeSectionProps {
  selectedOrigin: OriginData | null;
  onSelectOrigin: (origin: OriginData) => void;
}

export const GlobeSection: React.FC<GlobeSectionProps> = ({
  selectedOrigin,
  onSelectOrigin,
}) => {
  const { playClick } = useAudio();
  const currentOrigin = selectedOrigin || ORIGINS_DATA[0];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 02</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            GLOBAL TERROIR
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display">
          THE ORIGINS WE <span className="italic font-editorial text-[#C6955B]">SOURCED.</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#E8D8C0]/70 font-sans max-w-xl mt-2">
          Click any origin node below to navigate the 3D globe and inspect its flavor profile, elevation, and direct flight route to our Istanbul roastery.
        </p>
      </div>

      {/* Origin Selection Horizontal Bar (Center-Bottom) */}
      <div className="max-w-5xl mx-auto w-full my-auto pointer-events-auto py-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {ORIGINS_DATA.map((origin) => {
            const isSelected = currentOrigin.id === origin.id;

            return (
              <button
                key={origin.id}
                onClick={() => {
                  playClick();
                  onSelectOrigin(origin);
                }}
                className={`px-4 py-2.5 rounded-full text-xs font-sans tracking-[0.2em] whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#C6955B] text-[#080706] border-[#F4EFE8] font-bold shadow-[0_0_20px_rgba(198,149,91,0.4)] scale-105'
                    : 'bg-[#16100C]/80 text-[#E8D8C0]/70 border-white/10 hover:border-[#C6955B]/50 hover:text-white'
                }`}
                data-cursor="INSPECT"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: origin.color }}
                />
                {origin.country.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Selected Origin Terroir Card */}
        <div className="mt-6 luxury-glass rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Left Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#C6955B]/20 text-[#C6955B] text-[10px] font-mono uppercase tracking-widest border border-[#C6955B]/30">
                {currentOrigin.region}
              </span>
              <span className="text-xs text-[#E8D8C0]/50 font-mono">
                {currentOrigin.lat > 0 ? `${currentOrigin.lat}° N` : `${Math.abs(currentOrigin.lat)}° S`},{' '}
                {currentOrigin.lng > 0 ? `${currentOrigin.lng}° E` : `${Math.abs(currentOrigin.lng)}° W`}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-light text-[#F4EFE8] font-display">
              {currentOrigin.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#E8D8C0]/80 leading-relaxed font-sans">
              {currentOrigin.description}
            </p>

            {/* Flavor Notes Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentOrigin.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 rounded-md bg-[#241913] border border-[#C6955B]/30 text-xs font-sans text-[#E8D8C0] tracking-wider"
                >
                  • {note}
                </span>
              ))}
            </div>
          </div>

          {/* Right Sensory Specs */}
          <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-4 text-xs font-mono">
            <div>
              <div className="text-[#C6955B] text-[10px] tracking-widest uppercase mb-1">
                ALTITUDE & TERROIR
              </div>
              <div className="text-[#F4EFE8] font-semibold">{currentOrigin.altitude}</div>
            </div>

            <div>
              <div className="text-[#C6955B] text-[10px] tracking-widest uppercase mb-1">
                PROCESSING METHOD
              </div>
              <div className="text-[#F4EFE8] font-semibold">{currentOrigin.process}</div>
            </div>

            <div>
              <div className="text-[#C6955B] text-[10px] tracking-widest uppercase mb-1">
                HARVEST SEASON
              </div>
              <div className="text-[#F4EFE8] font-semibold">{currentOrigin.harvest}</div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-[#E8D8C0]/70">
              <span>DESTINATION:</span>
              <span className="text-[#C6955B] font-bold">ISTANBUL ROASTERY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-center text-[10px] tracking-[0.3em] uppercase text-[#E8D8C0]/40 font-mono">
        DRAG GLOBE TO ROTATE · FLIGHT ARCS CONVERGE AT 41.0082° N, 28.9784° E
      </div>
    </section>
  );
};
