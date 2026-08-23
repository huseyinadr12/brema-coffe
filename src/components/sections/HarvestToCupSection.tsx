import React, { useState } from 'react';
import { Sun, CheckSquare, Wind, Flame, Eye, Cog, Coffee, ArrowRight } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const STEPS = [
  {
    num: '01',
    title: 'SELECTIVE HARVEST',
    subtitle: 'High Altitude Terroir Hand-Picking',
    icon: Sun,
    description: 'Specialty Arabica cherries are hand-harvested only when sugar content exceeds 21° Brix, ensuring maximum sweetness and precursor flavor compounds.',
    metric: '21°+ BRIX SWEETNESS',
  },
  {
    num: '02',
    title: 'OPTICAL DENSITY SORTING',
    subtitle: 'Density Floatation & Color Grading',
    icon: CheckSquare,
    description: 'Cherries pass through hydrodynamic density channels and optical sorting beds to eliminate under-ripe or defective beans with sub-millimeter precision.',
    metric: 'ZERO DEFECT TOLERANCE',
  },
  {
    num: '03',
    title: 'AFRICAN BED DRYING',
    subtitle: 'Slow Sun Aeration & Fermentation',
    icon: Wind,
    description: 'Beans cure slowly on elevated African mesh beds under constant shade netting, stabilizing cellular moisture precisely at 10.5% - 11.5%.',
    metric: '11.0% TARGET MOISTURE',
  },
  {
    num: '04',
    title: 'ISTANBUL DRUM ROASTING',
    subtitle: 'Cast-Iron Thermodynamic Curve Profiling',
    icon: Flame,
    description: 'Roasting in small batches inside double-walled cast-iron drums in Istanbul. Proprietary RoR curve modulation unlocks delicate floral, chocolate, and nut aromatics.',
    metric: '0.1°C SENSOR PRECISION',
  },
  {
    num: '05',
    title: 'SCA PROTOCOL CUPPING',
    subtitle: 'Strict Blind Sensory Evaluation',
    icon: Eye,
    description: 'Every production batch undergoes blind SCA sensory evaluation (Fragrance, Aroma, Flavor, Aftertaste, Acidity, Body, Balance, Clean Cup) before packaging clearance.',
    metric: '86+ SPECIALTY SCORE',
  },
  {
    num: '06',
    title: 'NITROGEN SEALING & GRIND',
    subtitle: 'Micron-Aligned Burr Particle Distribution',
    icon: Cog,
    description: 'Freshly degassed beans are packaged in nitrogen-flushed, one-way valved multi-layer foil pouches to lock in volatile oils and freshness for months.',
    metric: '<0.5% RESIDUAL OXYGEN',
  },
  {
    num: '07',
    title: 'THE BREMA CUP',
    subtitle: 'The Ultimate Aromatic Experience',
    icon: Coffee,
    description: 'From origin soil across continents to the final velvety crema in Istanbul. A coffee experience that is not merely consumed, but deeply understood.',
    metric: 'THE SIGNATURE FINISH',
  },
];

export const HarvestToCupSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { playClick } = useAudio();

  const current = STEPS[activeStep];
  const IconComponent = current.icon;

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      <div className="max-w-5xl mx-auto w-full pointer-events-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 08</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            THE 7 PILLARS OF MASTERY
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display mb-8">
          FROM HARVEST <br />
          <span className="italic font-editorial text-[#C6955B]">TO THE CUP.</span>
        </h2>

        {/* 7-Step Horizontal Stepper */}
        <div className="grid grid-cols-7 gap-2 mb-8 overflow-x-auto no-scrollbar py-2">
          {STEPS.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => {
                  playClick();
                  setActiveStep(idx);
                }}
                className={`py-3 px-2 rounded-xl border text-center transition-all duration-300 flex flex-col items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#C6955B] text-[#080706] border-[#F4EFE8] font-bold shadow-[0_0_20px_rgba(198,149,91,0.4)] scale-105'
                    : 'bg-[#16100C]/70 text-[#E8D8C0]/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
                data-cursor="STEP"
              >
                <span className="text-[10px] font-mono">{step.num}</span>
                <span className="text-[9px] uppercase tracking-wider hidden sm:inline font-sans truncate max-w-full">
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step Inspector Card */}
        <div className="luxury-glass rounded-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-in">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#C6955B]/20 text-[#C6955B] text-xs font-mono font-bold tracking-widest border border-[#C6955B]/40">
                STEP {current.num} / 07
              </span>
              <span className="text-xs text-[#E8D8C0]/60 font-mono uppercase tracking-wider">
                {current.subtitle}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-light text-[#F4EFE8] font-display">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-[#E8D8C0]/85 font-sans leading-relaxed">
              {current.description}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  playClick();
                  setActiveStep((prev) => (prev + 1) % STEPS.length);
                }}
                className="btn-luxury text-xs flex items-center gap-2"
              >
                <span>NEXT STAGE</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Pillar Metric Badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#1D140F] border border-[#C6955B]/30 text-center space-y-3 shadow-inner">
            <div className="w-14 h-14 rounded-full bg-[#C6955B]/15 border border-[#C6955B]/40 flex items-center justify-center text-[#C6955B]">
              <IconComponent size={28} />
            </div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#E8D8C0]/50">
              BENCHMARK METRIC
            </div>
            <div className="text-sm font-mono text-[#F4EFE8] font-bold tracking-wider">
              {current.metric}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
