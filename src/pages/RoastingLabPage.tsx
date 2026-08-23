import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sliders, Activity, Thermometer, Wind, RotateCw, Sparkles } from 'lucide-react';
import { CoffeeBean3D } from '../components/canvas/CoffeeBean3D';
import { ROAST_STAGES, ROAST_PRESETS } from '../data/roastingProfiles';
import { RoastStage } from '../types';
import { useAudio } from '../context/AudioContext';

export const RoastingLabPage: React.FC = () => {
  const [activeStage, setActiveStage] = useState<RoastStage>(ROAST_STAGES[2]);
  const [drumRpm, setDrumRpm] = useState(48);
  const [airflow, setAirflow] = useState(65);
  const [tempAdjust, setTempAdjust] = useState(0);

  const { playClick, playCrackle } = useAudio();
  const currentTemp = activeStage.tempC + tempAdjust;

  const handleSelectStage = (stage: RoastStage) => {
    playClick();
    playCrackle(ROAST_STAGES.findIndex((s) => s.id === stage.id));
    setActiveStage(stage);
    setTempAdjust(0);
  };

  const handleSelectPreset = (preset: typeof ROAST_PRESETS[0]) => {
    playClick();
    playCrackle(preset.stageIndex);
    setActiveStage(ROAST_STAGES[preset.stageIndex]);
    setDrumRpm(preset.drumRpm);
    setAirflow(preset.airflow);
    setTempAdjust(0);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 03</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            İNTERAKTİF KAVURMA REHBERİ
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
          KAVURMA DERECESİ VE <br />
          <span className="italic font-editorial text-[#D49B5B]">LEZZET DENGESİ.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans max-w-2xl mt-2 leading-relaxed">
          Kahve kavruldukça rengi açılır veya koyulaşır, tadındaki meyvemsi asidite yerini zengin çikolata ve karamel gövdesine bırakır. Aşağıdaki aşamaları seçerek lezzetin nasıl değiştiğini görün.
        </p>
      </div>

      {/* 3D Bean Live Shader Canvas */}
      <div className="max-w-6xl mx-auto h-[400px] sm:h-[460px] luxury-glass rounded-3xl relative overflow-hidden border border-[#D49B5B]/25 my-6">
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.75} />
          <spotLight position={[4, 6, 4]} intensity={3} color="#FFE2C2" />
          <pointLight position={[-4, -3, -3]} intensity={1.5} color="#D49B5B" />
          <CoffeeBean3D
            scale={1.4}
            position={[0, 0, 0]}
            roastColor={activeStage.beanColor}
            roughness={activeStage.beanRoughness}
            metalness={activeStage.beanGloss * 0.3}
            interactive={true}
            floating={true}
          />
        </Canvas>

        <div className="absolute top-4 left-6 pointer-events-none text-xs font-mono text-[#D49B5B] tracking-widest uppercase flex items-center gap-2 font-bold">
          <Sparkles size={14} />
          <span>CANLI 3D ÇEKİRDEK GÖRÜNÜMÜ · {activeStage.name.toUpperCase()} (~{currentTemp}°C)</span>
        </div>
      </div>

      {/* 4 Stage Selector Buttons */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {ROAST_STAGES.map((stage, idx) => {
          const isSelected = activeStage.id === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => handleSelectStage(stage)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#2A1C16] border-[#D49B5B] shadow-[0_0_25px_rgba(212,155,91,0.4)] scale-[1.02]'
                  : 'bg-[#201510]/90 border-white/10 hover:border-white/30'
              }`}
              data-cursor="SEÇ"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#D49B5B] font-bold">SEVİYE 0{idx + 1}</span>
                <span
                  className="w-4 h-4 rounded-full border border-white/30"
                  style={{ backgroundColor: stage.beanColor }}
                />
              </div>
              <div className="text-sm font-semibold text-[#FAF4EB] font-display">
                {stage.name}
              </div>
              <div className="text-[10px] text-[#D9C3B0]/70 font-mono mt-1">
                ~{stage.tempC}°C · {stage.durationMin} dakika
              </div>
            </button>
          );
        })}
      </div>

      {/* Control Sliders & Graph & Sensory Profile */}
      <div className="max-w-6xl mx-auto luxury-glass rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Parametre Sürgüleri */}
        <div className="space-y-6">
          <h2 className="text-sm font-medium tracking-[0.2em] text-[#D49B5B] uppercase font-mono flex items-center gap-2 font-bold">
            <Sliders size={16} />
            Kavurma Ayarları
          </h2>

          {/* Sıcaklık */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#D9C3B0] flex items-center gap-1.5 font-medium">
                <Thermometer size={14} className="text-[#D49B5B]" /> Tambur Sıcaklığı
              </span>
              <span className="text-[#FAF4EB] font-bold">{currentTemp}°C</span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              value={tempAdjust}
              onChange={(e) => setTempAdjust(Number(e.target.value))}
              className="w-full accent-[#D49B5B] bg-[#2E1F18] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Devir */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#D9C3B0] flex items-center gap-1.5 font-medium">
                <RotateCw size={14} className="text-[#D49B5B]" /> Karıştırma Hızı
              </span>
              <span className="text-[#FAF4EB] font-bold">{drumRpm} Devir/dk</span>
            </div>
            <input
              type="range"
              min="35"
              max="65"
              value={drumRpm}
              onChange={(e) => setDrumRpm(Number(e.target.value))}
              className="w-full accent-[#D49B5B] bg-[#2E1F18] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Hava Akışı */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-[#D9C3B0] flex items-center gap-1.5 font-medium">
                <Wind size={14} className="text-[#D49B5B]" /> Temiz Hava Akımı
              </span>
              <span className="text-[#FAF4EB] font-bold">%{airflow}</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={airflow}
              onChange={(e) => setAirflow(Number(e.target.value))}
              className="w-full accent-[#D49B5B] bg-[#2E1F18] h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Hazır Profiller */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#D9C3B0]/70 block mb-2 font-bold">
              Hazır Lezzet Tercihleri:
            </span>
            <div className="flex flex-wrap gap-2">
              {ROAST_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="px-3 py-1.5 rounded-lg bg-[#2E1F18] border border-[#D49B5B]/30 text-[11px] font-sans text-[#FAF4EB] hover:border-[#D49B5B] transition-colors cursor-pointer shadow-xs"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Isı ve Zaman Dengesi */}
        <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-x border-white/10 pt-6 lg:pt-0 lg:px-8 space-y-4">
          <h2 className="text-sm font-medium tracking-[0.2em] text-[#D49B5B] uppercase font-mono flex items-center gap-2 font-bold">
            <Activity size={16} />
            Isı ve Süre Eğrisi
          </h2>

          <div className="h-36 w-full bg-[#140C08] rounded-xl border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden shadow-inner">
            <div className="flex justify-between text-[9px] font-mono text-[#D9C3B0]/60">
              <span>BAŞLANGIÇ</span>
              <span>KURUMA</span>
              <span>ÇITIRTI SESİ</span>
              <span>BOŞALTMA</span>
            </div>

            <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 80">
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#D49B5B" />
                  <stop offset="60%" stopColor="#FAF4EB" />
                  <stop offset="100%" stopColor="#E76F51" />
                </linearGradient>
              </defs>
              <path
                d={`M 0,20 Q 80,${80 - (activeStage.rorCurve[2] || 15) * 3} 150,${
                  80 - (activeStage.rorCurve[5] || 10) * 3
                } T 300,${80 - (activeStage.rorCurve[9] || 4) * 3}`}
                fill="none"
                stroke="url(#curveGrad)"
                strokeWidth="3"
              />
            </svg>

            <div className="flex justify-between text-[10px] font-mono text-[#D49B5B] font-bold">
              <span>ISINMA HIZI: DENGELİ</span>
              <span>DURUM: KUSURSUZ LEZZET</span>
            </div>
          </div>

          <p className="text-xs text-[#D9C3B0]/90 font-sans leading-relaxed">
            {activeStage.description}
          </p>
        </div>

        {/* Right: Lezzet Puanları */}
        <div className="flex flex-col justify-between border-t lg:border-t-0 pt-6 lg:pt-0 space-y-3">
          <h2 className="text-sm font-medium tracking-[0.2em] text-[#D49B5B] uppercase font-mono flex items-center gap-2 font-bold">
            <Sparkles size={16} />
            Fincandaki Tat Dengesi
          </h2>

          <div className="space-y-2.5 text-xs font-mono">
            {Object.entries({
              'Meyvemsi Asidite (Canlılık)': activeStage.flavorProfile.acidity,
              'Gövde (Ağızdaki Dolgunluk)': activeStage.flavorProfile.body,
              'Doğal Tatlılık (Karamel)': activeStage.flavorProfile.sweetness,
              'Mis Kokulu Aroma': activeStage.flavorProfile.aroma,
              'Kahve Yoğunluğu': activeStage.flavorProfile.intensity,
              'Acılık Dengesi': activeStage.flavorProfile.bitterness,
            }).map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] uppercase text-[#D9C3B0] mb-0.5 font-medium">
                  <span>{label}</span>
                  <span className="text-[#D49B5B] font-bold">{val}/10</span>
                </div>
                <div className="w-full h-2 bg-[#2E1F18] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8A4F2C] to-[#D49B5B] transition-all duration-300"
                    style={{ width: `${val * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
