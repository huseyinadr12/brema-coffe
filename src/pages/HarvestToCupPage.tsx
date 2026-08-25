import React, { useState } from 'react';
import { Sun, CheckSquare, Wind, Flame, Eye, Cog, Coffee, ArrowRight } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const STEPS_TR = [
  {
    num: '01',
    title: 'ÖZENLİ EL HASATI',
    subtitle: 'Yüksek Dağlarda Olgun Meyveleri Elle Toplama',
    icon: Sun,
    description: 'Kahve ağaçlarındaki meyveler aynı anda olgunlaşmaz. Çiftçiler yalnızca tam kıvamında kıpkırmızı olan en tatlı meyveleri tek tek elleriyle toplar.',
    metric: 'EN TATLI KIRMIZI MEYVELER',
  },
  {
    num: '02',
    title: 'SU VE YOĞUNLUKLA AYIKLAMA',
    subtitle: 'Kusurlu Taneleri Tamamen Ayırma',
    icon: CheckSquare,
    description: 'Toplanan meyveler doğal kaynak sularında yüzdürülür. Hafif veya kusurlu olanlar suyun üstünde kalarak ayrılır, yalnızca en dolgun çekirdekler seçilir.',
    metric: '%100 KUSURSUZ KALİTE',
  },
  {
    num: '03',
    title: 'GÖLGELİKLERDE DOĞAL KURUTMA',
    subtitle: 'Temiz Havada Yavaşça Dinlendirerek Kurutma',
    icon: Wind,
    description: 'Çekirdekler yerden yüksek özel havalandırmalı tahta yataklara serilir. Güneş altında yavaşça ve eşit şekilde kuruyarak tatları içe hapsolur.',
    metric: 'İDEAL KURULUK VE TAZELİK',
  },
  {
    num: '04',
    title: 'İSTANBUL DÖKÜM KAVRUMU',
    subtitle: 'Ağır Döküm Tamburda Ustalıkla Pişirme',
    icon: Flame,
    description: 'İstanbul kavurma atölyemize gelen yeşil çekirdekler, döküm gövdeli fırınlarda tam kıvamında kavrulur. Doğal çikolata, fındık ve meyve tatları açığa çıkar.',
    metric: 'USTALIKLA KAVRULMUŞ',
  },
  {
    num: '05',
    title: 'LEZZET VE TADIM TESTİ',
    subtitle: 'Uzman Baristalar Tarafından Kalite Onayı',
    icon: Eye,
    description: 'Kavrulan her yeni parti, paketlenmeden önce kahve uzmanlarımız tarafından koklanır ve tadılır. Standartlara uymayan hiçbir parti satışa sunulmaz.',
    metric: 'UZMAN ONAYLI LEZZET',
  },
  {
    num: '06',
    title: 'ÖZEL KİLİTLİ AMBALAJ',
    subtitle: 'Hava Almayan Taze Korumalı Paketleme',
    icon: Cog,
    description: 'Kavrulan çekirdekler oksijenle temas etmeyen, tek yönlü valfe sahip koruyucu paketlere doldurulur. Paketi açtığınız ilk günkü mis gibi kokuyu aylarca korur.',
    metric: 'UZUN SÜRELİ TAZELİK',
  },
  {
    num: '07',
    title: 'KUSURSUZ BREMA FİNCANI',
    subtitle: 'Zengin Krema ve Yoğun Kahve Keyfi',
    icon: Coffee,
    description: 'Dünyanın en yüksek dağlarından İstanbul’daki fincanınıza uzanan yolculuk tamamlandı. Şimdi arkanıza yaslanıp taze kahvenizin tadını çıkarabilirsiniz.',
    metric: 'UNUTULMAZ BİR KAHVE KEYFİ',
  },
];

export const HarvestToCupPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { playClick } = useAudio();

  const current = STEPS_TR[activeStep];
  const IconComponent = current.icon;

  return (
    <div className="theme-page relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 05</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            KAHVENİN 7 YOLCULUK ADIMI
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
          HASATTAN <span className="italic font-editorial text-[#D49B5B]">FİNCANA.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans max-w-2xl mt-2 leading-relaxed">
          Kahvenin çiftlik dalından fincanınıza gelene kadar geçtiği 7 titiz kalite ve özen adımı.
        </p>
      </div>

      {/* 7-Step Stepper Bar */}
      <div className="max-w-6xl mx-auto my-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {STEPS_TR.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.num}
                onClick={() => {
                  playClick();
                  setActiveStep(idx);
                }}
                className={`py-3 px-3 rounded-xl border text-center transition-all duration-300 flex flex-col items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#D49B5B] text-[#140C08] border-[#FAF4EB] font-bold shadow-[0_0_20px_rgba(212,155,91,0.4)] scale-105'
                    : 'bg-[#241812]/90 text-[#D9C3B0] border-white/10 hover:border-white/30 hover:text-white'
                }`}
                data-cursor="ADIM"
              >
                <span className="text-xs font-mono">{step.num}</span>
                <span className="text-[10px] uppercase tracking-wider font-sans truncate max-w-full font-semibold">
                  {step.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Step Card */}
      <div className="max-w-6xl mx-auto luxury-glass rounded-3xl p-8 sm:p-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-[#D49B5B]/30">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#D49B5B]/20 text-[#D49B5B] text-xs font-mono font-bold tracking-widest border border-[#D49B5B]/40">
              ADIM {current.num} / 07
            </span>
            <span className="text-xs text-[#D9C3B0]/70 font-mono uppercase tracking-wider font-semibold">
              {current.subtitle}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-light text-[#FAF4EB] font-display">
            {current.title}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C3B0]/90 font-sans leading-relaxed">
            {current.description}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => {
                playClick();
                setActiveStep((prev) => (prev + 1) % STEPS_TR.length);
              }}
              className="btn-luxury text-xs flex items-center gap-2 cursor-pointer"
            >
              <span>SONRAKİ ADIM</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Metric Box */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-8 rounded-3xl bg-[#201510] border border-[#D49B5B]/35 text-center space-y-3 shadow-inner">
          <div className="w-16 h-16 rounded-full bg-[#D49B5B]/15 border border-[#D49B5B]/40 flex items-center justify-center text-[#D49B5B]">
            <IconComponent size={32} />
          </div>
          <div className="text-[10px] uppercase font-mono tracking-widest text-[#D9C3B0]/60 font-bold">
            ÖNEMLİ KRİTER
          </div>
          <div className="text-base font-mono text-[#FAF4EB] font-bold tracking-wider">
            {current.metric}
          </div>
        </div>
      </div>
    </div>
  );
};
