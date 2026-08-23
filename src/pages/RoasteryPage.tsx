import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Flame, Gauge, Zap, Award, ShieldCheck, Heart, Coffee } from 'lucide-react';
import { RoasterDrum3D } from '../components/canvas/RoasterDrum3D';

export const RoasteryPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 02</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            KAVURMA SANATI VE ATÖLYEMİZ
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
          2012'DEN BERİ <span className="italic font-editorial text-[#D49B5B]">İSTANBUL'DA.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans max-w-2xl mt-2 leading-relaxed">
          Geleneksel döküm tamburlarda kahve çekirdeğinin özündeki doğal lezzetleri ortaya çıkaran özenli ve taze kavurma anlayışımız.
        </p>
      </div>

      {/* 3D Roaster Drum Canvas Container */}
      <div className="max-w-6xl mx-auto h-[460px] sm:h-[520px] luxury-glass rounded-3xl relative overflow-hidden border border-[#D49B5B]/25 my-6">
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          <spotLight position={[5, 8, 5]} intensity={3} color="#FFE2C2" />
          <pointLight position={[-4, -3, -3]} intensity={1.5} color="#FF7A00" />
          <RoasterDrum3D intensity={1.2} scale={1.15} position={[0, 0, 0]} />
        </Canvas>

        <div className="absolute top-4 left-6 pointer-events-none text-xs font-mono text-[#D49B5B] tracking-widest uppercase flex items-center gap-2 font-bold">
          <Flame size={14} />
          <span>İNTERAKTİF DÖKÜM KAVURMA TAMBURU</span>
        </div>
      </div>

      {/* Philosophy & Craftsmanship Details */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div className="luxury-glass p-8 rounded-2xl space-y-3 border border-[#D49B5B]/30">
          <h2 className="text-xl font-normal font-display text-[#FAF4EB] flex items-center gap-2.5">
            <Flame size={20} className="text-[#D49B5B]" />
            Döküm Gövdeyle Dengeli Isı
          </h2>
          <p className="text-xs sm:text-sm text-[#D9C3B0]/85 leading-relaxed font-sans">
            Sıcak havayla hızlıca kavurup dışını yakan sistemler yerine, kalın döküm gövdeli makineler kullanıyoruz. Böylece çekirdeğin içi ve dışı eşit pişer, acılaşma olmadan doğal çikolata, fındık ve karamel tatları ortaya çıkar.
          </p>
        </div>

        <div className="luxury-glass p-8 rounded-2xl space-y-3 border border-[#D49B5B]/30">
          <h2 className="text-xl font-normal font-display text-[#FAF4EB] flex items-center gap-2.5">
            <Gauge size={20} className="text-[#D49B5B]" />
            Her Pakette Aynı Kusursuz Lezzet
          </h2>
          <p className="text-xs sm:text-sm text-[#D9C3B0]/85 leading-relaxed font-sans">
            Usta kavurucularımız her partinin sıcaklığını ve süresini hassasiyetle takip eder. Böylece bugün aldığınız Brema kahvesi ile aylar sonra alacağınız kahvenin lezzeti ve kokusu her zaman aynı kalitede kalır.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 luxury-glass rounded-2xl text-center font-mono border border-[#D49B5B]/30">
        <div>
          <div className="text-2xl sm:text-3xl text-[#D49B5B] font-bold">2012</div>
          <div className="text-[10px] text-[#D9C3B0]/75 uppercase tracking-widest mt-1 font-semibold">
            İSTANBUL'DA KURULUŞ
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl text-[#D49B5B] font-bold">TAZE</div>
          <div className="text-[10px] text-[#D9C3B0]/75 uppercase tracking-widest mt-1 font-semibold">
            GÜNLÜK KAVRUM
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl text-[#D49B5B] font-bold">%100</div>
          <div className="text-[10px] text-[#D9C3B0]/75 uppercase tracking-widest mt-1 font-semibold">
            ÖZENLE SEÇİLMİŞ ÇEKİRDEKLER
          </div>
        </div>

        <div>
          <div className="text-2xl sm:text-3xl text-[#D49B5B] font-bold">ÖZEL KİLİTLİ</div>
          <div className="text-[10px] text-[#D9C3B0]/75 uppercase tracking-widest mt-1 font-semibold">
            TAZE TUTAN AMBALAJ
          </div>
        </div>
      </div>
    </div>
  );
};
