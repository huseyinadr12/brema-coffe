import React, { useState } from 'react';
import { Building2, Coffee, Shield, CheckCircle, Sliders, ArrowRight, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAudio } from '../context/AudioContext';

export const HorecaPage: React.FC = () => {
  const { openSampleModal } = useCart();
  const { playClick } = useAudio();

  const [arabicaRatio, setArabicaRatio] = useState(80);
  const [monthlyKg, setMonthlyKg] = useState(60);

  const costPerKg = (arabicaRatio * 7.5 + (100 - arabicaRatio) * 4.2).toFixed(0);
  const cupsPerMonth = monthlyKg * 55; // ~18g per double dose
  const costPerCup = ((Number(costPerKg) / 55)).toFixed(2);

  return (
    <div className="relative min-h-screen w-full bg-[#080706] text-[#F4EFE8] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">BÖLÜM 07</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            KURUMSAL VE TOPTAN İŞ BİRLİĞİ
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#F4EFE8]">
          PROFESYONELLER İÇİN <span className="italic font-editorial text-[#C6955B]">KAHVE.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#E8D8C0]/70 font-sans max-w-2xl mt-2">
          Nitelikli kahve dükkanları, lüks oteller, restoranlar ve kurumsal ofisler için özel kavrum ve anahtar teslim kahve çözümleri.
        </p>
      </div>

      {/* Wholesale Calculator & Support Guarantee Card */}
      <div className="max-w-6xl mx-auto luxury-glass rounded-3xl p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-6">
        {/* Left: Interactive Blend & Cost Calculator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-[#C6955B]" />
            <h2 className="text-base font-medium tracking-[0.2em] text-[#F4EFE8] uppercase font-mono">
              İnteraktif Toptan Harman Hesaplayıcı
            </h2>
          </div>

          {/* Arabica / Robusta Blend Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[#E8D8C0]/70">Harman Oranı:</span>
              <span className="text-[#C6955B] font-bold">
                %{arabicaRatio} Nitelikli Arabica / %{100 - arabicaRatio} İnce Robusta
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
              <span>Geleneksel Bar Krema (50/50)</span>
              <span>%100 Tek Köken Nitelikli</span>
            </div>
          </div>

          {/* Monthly Volume Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[#E8D8C0]/70">Tahmini Aylık Tüketim:</span>
              <span className="text-[#F4EFE8] font-bold">{monthlyKg} kg / ay</span>
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
              <span>Butik Kafe (10 kg)</span>
              <span>Çok Şubeli Zincir (300+ kg)</span>
            </div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
            <div className="p-4 rounded-2xl bg-[#1D140F] border border-white/5">
              <div className="text-[10px] text-[#E8D8C0]/50 uppercase">AYLIK FİNCAN</div>
              <div className="text-lg text-[#F4EFE8] font-bold mt-1">~{cupsPerMonth.toLocaleString()}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1D140F] border border-white/5">
              <div className="text-[10px] text-[#E8D8C0]/50 uppercase">TAHMİNİ KG FİYATI</div>
              <div className="text-lg text-[#C6955B] font-bold mt-1">{costPerKg} ₺</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1D140F] border border-white/5">
              <div className="text-[10px] text-[#E8D8C0]/50 uppercase">DOUBLE SHOT MALİYETİ</div>
              <div className="text-lg text-green-400 font-bold mt-1">{costPerCup} ₺</div>
            </div>
          </div>
        </div>

        {/* Right: HORECA Support Package & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10 space-y-6">
          <h3 className="text-base font-semibold tracking-wider font-display text-[#F4EFE8]">
            Brema Profesyonel Ortaklık Garantisi
          </h3>

          <ul className="space-y-3 text-xs text-[#E8D8C0]/85 font-sans">
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[#C6955B] shrink-0" />
              <span>İşletmenize özel reçeteli private label harman kavrumu</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[#C6955B] shrink-0" />
              <span>Ticari espresso makinesi kiralama ve teknik servis desteği</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[#C6955B] shrink-0" />
              <span>SCA standartlarında yerinde barista ve kalibrasyon eğitimi</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={16} className="text-[#C6955B] shrink-0" />
              <span>İstanbul içinde 24 saatte hızlı kavurmahane teslimatı</span>
            </li>
          </ul>

          <button
            onClick={() => {
              playClick();
              openSampleModal();
            }}
            className="w-full btn-luxury btn-luxury-primary cursor-pointer"
            data-cursor="TEKLİF"
          >
            <span>TOPTAN NUMUNE KUTUSU & TEKLİF İSTE</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
