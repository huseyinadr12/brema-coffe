import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Globe, Mountain, Sun, Droplets } from 'lucide-react';
import { EarthGlobe3D } from '../components/canvas/EarthGlobe3D';
import { ORIGINS_DATA } from '../data/origins';
import { OriginData } from '../types';
import { useAudio } from '../context/AudioContext';

export const OriginsPage: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState<OriginData>(ORIGINS_DATA[0]);
  const { playClick } = useAudio();

  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 01</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            DÜNYANIN EN İYİ KAHVE BÖLGELERİ
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
          HER ŞEY KÖKENDE <span className="italic font-editorial text-[#D49B5B]">BAŞLAR.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans max-w-2xl mt-2 leading-relaxed">
          Kahvenin lezzeti; yetiştiği dağların yüksekliğine, toprağın zenginliğine ve güneşin açısına göre değişir. 3D Dünya küresi üzerinden dilediğiniz ülkeyi seçerek lezzet özelliklerini inceleyin.
        </p>
      </div>

      {/* 3D Globe Dedicated Canvas Area */}
      <div className="max-w-6xl mx-auto h-[480px] sm:h-[540px] luxury-glass rounded-3xl relative overflow-hidden border border-[#D49B5B]/25 my-6">
        <Canvas
          camera={{ position: [0, 0.4, 5.6], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.75} />
          <spotLight position={[5, 8, 5]} intensity={3} color="#FFE2C2" />
          <pointLight position={[-6, -4, -4]} intensity={1.5} color="#D49B5B" />
          <EarthGlobe3D
            selectedOrigin={selectedOrigin}
            onSelectOrigin={setSelectedOrigin}
            scale={1.0}
            position={[0, 0, 0]}
          />
        </Canvas>

        {/* Overlay Helper Label */}
        <div className="absolute top-4 left-6 pointer-events-none text-xs font-mono text-[#D49B5B] tracking-widest uppercase flex items-center gap-2 font-bold">
          <Globe size={14} />
          <span>İNTERAKTİF DÜNYA KÜRESİ · İSTANBUL VARIŞLI SEÇKİN KAHVELER</span>
        </div>
      </div>

      {/* Horizontal Origin Selector Tabs */}
      <div className="max-w-6xl mx-auto my-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {ORIGINS_DATA.map((origin) => {
            const isSelected = selectedOrigin.id === origin.id;

            return (
              <button
                key={origin.id}
                onClick={() => {
                  playClick();
                  setSelectedOrigin(origin);
                }}
                className={`px-4 py-2.5 rounded-full text-xs font-sans tracking-[0.2em] whitespace-nowrap transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#D49B5B] text-[#140C08] border-[#FAF4EB] font-bold shadow-[0_0_20px_rgba(212,155,91,0.4)] scale-105'
                    : 'bg-[#241812]/90 text-[#D9C3B0] border-white/10 hover:border-[#D49B5B]/50 hover:text-white'
                }`}
                data-cursor="İNCELE"
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
      </div>

      {/* Detailed Terroir Information Card */}
      <div className="max-w-6xl mx-auto luxury-glass rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Origin Story & Flavor Notes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#D49B5B]/20 text-[#D49B5B] text-xs font-mono uppercase tracking-widest border border-[#D49B5B]/35 font-bold">
              {selectedOrigin.region}
            </span>
            <span className="text-xs text-[#D9C3B0]/70 font-mono">
              {selectedOrigin.lat > 0 ? `${selectedOrigin.lat}° K` : `${Math.abs(selectedOrigin.lat)}° G`},{' '}
              {selectedOrigin.lng > 0 ? `${selectedOrigin.lng}° D` : `${Math.abs(selectedOrigin.lng)}° B`}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#FAF4EB] font-display">
            {selectedOrigin.name}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C3B0]/90 leading-relaxed font-sans">
            {selectedOrigin.description}
          </p>

          {/* Flavor Notes Pills */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase text-[#D49B5B] tracking-widest block mb-2 font-bold">
              HİSSEDECEĞİNİZ DOĞAL TAT VE KOKULAR
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedOrigin.flavorNotes.map((note) => (
                <span
                  key={note}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2E1F18] border border-[#D49B5B]/35 text-xs font-sans text-[#FAF4EB] tracking-wider"
                >
                  • {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Specs Matrix */}
        <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8 space-y-4 text-xs font-mono">
          <div>
            <div className="text-[#D49B5B] text-[10px] tracking-widest uppercase mb-1 font-bold flex items-center gap-1.5">
              <Mountain size={14} /> YAYLA YÜKSEKLİĞİ (RAKIM)
            </div>
            <div className="text-[#FAF4EB] font-semibold text-sm">{selectedOrigin.altitude}</div>
          </div>

          <div>
            <div className="text-[#D49B5B] text-[10px] tracking-widest uppercase mb-1 font-bold flex items-center gap-1.5">
              <Droplets size={14} /> ÇEKİRDEK İŞLEME ŞEKLİ
            </div>
            <div className="text-[#FAF4EB] font-semibold text-sm">{selectedOrigin.process}</div>
          </div>

          <div>
            <div className="text-[#D49B5B] text-[10px] tracking-widest uppercase mb-1 font-bold flex items-center gap-1.5">
              <Sun size={14} /> HASAT ZAMANI
            </div>
            <div className="text-[#FAF4EB] font-semibold text-sm">{selectedOrigin.harvest}</div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#D9C3B0]">
            <span>VARIŞ YERİ:</span>
            <span className="text-[#D49B5B] font-bold">İSTANBUL KAVURMA ATÖLYESİ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
