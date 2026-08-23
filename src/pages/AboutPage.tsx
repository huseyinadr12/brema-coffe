import React from 'react';
import { Compass, Award, ShieldCheck, Heart, Coffee, Flame } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 06</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            HİKAYEMİZ VE TUTKUMUZ
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB] leading-tight">
          KAHVE YALNIZCA BİR İÇECEK DEĞİL, <br />
          <span className="italic font-editorial text-[#D49B5B]">BİR ZANAATTIR.</span>
        </h1>
      </div>

      {/* Storytelling Article */}
      <div className="max-w-5xl mx-auto space-y-8 my-8 text-sm sm:text-base text-[#D9C3B0]/90 font-sans leading-relaxed">
        <div className="luxury-glass p-8 sm:p-12 rounded-3xl space-y-6 border border-[#D49B5B]/30">
          <p className="border-l-2 border-[#D49B5B] pl-6 text-[#FAF4EB] font-medium text-base sm:text-xl leading-relaxed font-display">
            Brema, 2012 yılında İstanbul’da kuruldu. Amacımız; kahveseverlerin fincanında her zaman taze, lezzetli ve kaliteli kahveler bulmasını sağlamaktı.
          </p>

          <p>
            Kahve kavurmak bizim için sadece bir iş değil; dünyanın dört bir yanındaki özenli çiftçilerin emeğini fincanınıza en lezzetli haliyle taşımaktır. Güney Amerika, Doğu Afrika ve Asya'nın en iyi çiftliklerinden doğrudan seçtiğimiz çekirdekleri temin ediyoruz.
          </p>

          <p>
            İstanbul'daki atölyemizde döküm tamburlu makinelerle yavaş ve dengeli kavuruyoruz. Kahvenin içindeki doğal aromaları yakmadan ortaya çıkarıyor, kilitli özel paketlerde ilk günkü tazeliğinde sizlere ulaştırıyoruz.
          </p>
        </div>

        {/* 4 Brand Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-6 rounded-2xl bg-[#241812]/90 border border-white/5">
            <Compass size={24} className="text-[#D49B5B] mb-3" />
            <h2 className="text-sm font-semibold text-[#FAF4EB] font-display">Doğrudan Çiftlikten</h2>
            <p className="text-[11px] text-[#D9C3B0]/70 mt-1">Özenle yetiştirilen kaliteli hasatlar</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#241812]/90 border border-white/5">
            <Award size={24} className="text-[#D49B5B] mb-3" />
            <h2 className="text-sm font-semibold text-[#FAF4EB] font-display">İstanbul Ustalığı</h2>
            <p className="text-[11px] text-[#D9C3B0]/70 mt-1">2012'den beri döküm tamburda taze kavrum</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#241812]/90 border border-white/5">
            <ShieldCheck size={24} className="text-[#D49B5B] mb-3" />
            <h2 className="text-sm font-semibold text-[#FAF4EB] font-display">Kilitli Taze Paket</h2>
            <p className="text-[11px] text-[#D9C3B0]/70 mt-1">Hava almayan özel ambalajla uzun süreli tazelik</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#241812]/90 border border-white/5">
            <Heart size={24} className="text-[#D49B5B] mb-3" />
            <h2 className="text-sm font-semibold text-[#FAF4EB] font-display">Kusursuz Lezzet</h2>
            <p className="text-[11px] text-[#D9C3B0]/70 mt-1">Her partide test edilen lezzet garantisi</p>
          </div>
        </div>
      </div>
    </div>
  );
};
