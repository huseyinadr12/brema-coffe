import React, { useState } from 'react';
import { Sliders, Activity, Thermometer, Wind, RotateCw, Sparkles } from 'lucide-react';
import { ROAST_STAGES, ROAST_PRESETS } from '../../data/roastingProfiles';
import { RoastStage } from '../../types';
import { useAudio } from '../../context/AudioContext';

interface RoastingLabSectionProps {
  activeRoastStage: RoastStage;
  onChangeRoastStage: (stage: RoastStage) => void;
}

export const RoastingLabSection: React.FC<RoastingLabSectionProps> = ({
  activeRoastStage,
  onChangeRoastStage,
}) => {
  const { playClick, playCrackle } = useAudio();
  const [drumRpm, setDrumRpm] = useState(48);
  const [airflow, setAirflow] = useState(65);
  const [tempAdjust, setTempAdjust] = useState(0);

  const currentTemp = activeRoastStage.tempC + tempAdjust;

  const handleSelectPreset = (preset: typeof ROAST_PRESETS[0]) => {
    playClick();
    playCrackle(preset.stageIndex);
    onChangeRoastStage(ROAST_STAGES[preset.stageIndex]);
    setDrumRpm(preset.drumRpm);
    setAirflow(preset.airflow);
    setTempAdjust(0);
  };

  const handleSelectStage = (stage: RoastStage) => {
    playClick();
    playCrackle(ROAST_STAGES.findIndex((s) => s.id === stage.id));
    onChangeRoastStage(stage);
    setTempAdjust(0);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      {/* Header */}
      <div className="max-w-5xl mx-auto w-full pointer-events-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 04</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            LABORATORY PROFILING
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display">
              DIGITAL <span className="italic font-editorial text-[#C6955B]">ROASTING LAB.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#E8D8C0]/70 font-sans mt-1">
              Select roast stages or modify thermal airflow parameters to observe real-time 3D bean shader transformation and flavor development.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#C6955B]">STAGE:</span>
            <span className="px-3 py-1 rounded-full bg-[#16100C] border border-[#C6955B]/40 text-[#F4EFE8] font-bold">
              {activeRoastStage.name.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Lab Workspace (Center-Bottom) */}
      <div className="max-w-5xl mx-auto w-full my-auto pointer-events-auto py-6">
        {/* 4 Stages Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {ROAST_STAGES.map((stage, idx) => {
            const isSelected = activeRoastStage.id === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => handleSelectStage(stage)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1E1510] border-[#C6955B] shadow-[0_0_20px_rgba(198,149,91,0.3)] scale-[1.02]'
                    : 'bg-[#120D0A]/70 border-white/5 hover:border-white/20'
                }`}
                data-cursor="ROAST"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#C6955B]">STAGE 0{idx + 1}</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/30"
                    style={{ backgroundColor: stage.beanColor }}
                  />
                </div>
                <div className="text-xs font-semibold text-[#F4EFE8] font-display">
                  {stage.name}
                </div>
                <div className="text-[10px] text-[#E8D8C0]/50 font-mono mt-1">
                  ~{stage.tempC}°C · {stage.durationMin}m
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Control Console & Sensory Radar Card */}
        <div className="luxury-glass rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Roasting Parameters Sliders */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium tracking-[0.2em] text-[#C6955B] uppercase font-mono flex items-center gap-2">
              <Sliders size={16} />
              Thermal Control
            </h3>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#E8D8C0]/70 flex items-center gap-1.5">
                  <Thermometer size={14} className="text-[#C6955B]" /> Drum Temperature
                </span>
                <span className="text-[#F4EFE8] font-bold">{currentTemp}°C</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                value={tempAdjust}
                onChange={(e) => setTempAdjust(Number(e.target.value))}
                className="w-full accent-[#C6955B] bg-[#241913] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Drum RPM Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#E8D8C0]/70 flex items-center gap-1.5">
                  <RotateCw size={14} className="text-[#C6955B]" /> Drum Speed
                </span>
                <span className="text-[#F4EFE8] font-bold">{drumRpm} RPM</span>
              </div>
              <input
                type="range"
                min="35"
                max="65"
                value={drumRpm}
                onChange={(e) => setDrumRpm(Number(e.target.value))}
                className="w-full accent-[#C6955B] bg-[#241913] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Airflow Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#E8D8C0]/70 flex items-center gap-1.5">
                  <Wind size={14} className="text-[#C6955B]" /> Exhaust Airflow
                </span>
                <span className="text-[#F4EFE8] font-bold">{airflow}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={airflow}
                onChange={(e) => setAirflow(Number(e.target.value))}
                className="w-full accent-[#C6955B] bg-[#241913] h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Presets Row */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D8C0]/50 block mb-2">
                Roaster Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ROAST_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    className="px-2.5 py-1 rounded bg-[#1C140F] border border-[#C6955B]/20 text-[10px] font-sans text-[#E8D8C0] hover:border-[#C6955B] transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: RoR Curve Graph */}
          <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-x border-white/10 pt-4 lg:pt-0 lg:px-6 space-y-3">
            <h3 className="text-sm font-medium tracking-[0.2em] text-[#C6955B] uppercase font-mono flex items-center gap-2">
              <Activity size={16} />
              Rate of Rise (RoR)
            </h3>

            {/* RoR SVG Curve Visualization */}
            <div className="h-32 w-full bg-[#120D0A] rounded-xl border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between text-[9px] font-mono text-[#E8D8C0]/40">
                <span>CHARGE (0m)</span>
                <span>DRYING (4m)</span>
                <span>1ST CRACK (9m)</span>
                <span>DROP</span>
              </div>

              {/* Dynamic SVG Line */}
              <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 80">
                <defs>
                  <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C6955B" />
                    <stop offset="60%" stopColor="#E8D8C0" />
                    <stop offset="100%" stopColor="#E76F51" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0,20 Q 80,${80 - (activeRoastStage.rorCurve[2] || 15) * 3} 150,${
                    80 - (activeRoastStage.rorCurve[5] || 10) * 3
                  } T 300,${80 - (activeRoastStage.rorCurve[9] || 4) * 3}`}
                  fill="none"
                  stroke="url(#curveGrad)"
                  strokeWidth="3"
                />
              </svg>

              <div className="flex justify-between text-[10px] font-mono text-[#C6955B]">
                <span>ΔT: +{(24 - (activeRoastStage.rorCurve[9] || 4)).toFixed(1)}°C/min</span>
                <span>STATUS: OPTIMAL EXPANSION</span>
              </div>
            </div>

            <p className="text-[11px] text-[#E8D8C0]/70 font-sans leading-relaxed">
              {activeRoastStage.description}
            </p>
          </div>

          {/* Right: 6-Axis Sensory Radar Breakdown */}
          <div className="flex flex-col justify-between border-t lg:border-t-0 pt-4 lg:pt-0 space-y-3">
            <h3 className="text-sm font-medium tracking-[0.2em] text-[#C6955B] uppercase font-mono flex items-center gap-2">
              <Sparkles size={16} />
              Sensory Profile
            </h3>

            <div className="space-y-2 text-xs font-mono">
              {Object.entries(activeRoastStage.flavorProfile).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-[10px] uppercase text-[#E8D8C0]/70 mb-0.5">
                    <span>{key}</span>
                    <span className="text-[#C6955B] font-bold">{val}/10</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#241913] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8A5A34] to-[#C6955B] transition-all duration-300"
                      style={{ width: `${val * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-center text-[10px] tracking-[0.3em] uppercase text-[#E8D8C0]/40 font-mono">
        INTERACT WITH 3D BEAN SHADER · ADJUST PARAMETERS TO HEAR ROAST CRACKLE
      </div>
    </section>
  );
};
