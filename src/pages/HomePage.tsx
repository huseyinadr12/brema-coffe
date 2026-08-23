import React from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ArrowRight, Sparkles, Flame, Globe, Sliders, ShoppingBag, Award, ShieldCheck, Heart, Coffee } from 'lucide-react';
import { CoffeeBean3D } from '../components/canvas/CoffeeBean3D';
import { EspressoCup3D } from '../components/canvas/EspressoCup3D';
import { useAudio } from '../context/AudioContext';

export const HomePage: React.FC = () => {
  const { playClick, playDrip } = useAudio();

  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* Ambient warm glow lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#D49B5B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-3/4 right-10 w-[450px] h-[450px] bg-[#8A4F2C]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto min-h-[75vh] flex flex-col justify-center items-center text-center relative z-10 my-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#241812] border border-[#D49B5B]/35 text-xs font-mono tracking-widest text-[#D49B5B] mb-6 shadow-lg font-semibold">
          <Sparkles size={14} />
          <span>İSTANBUL KAHVE ATÖLYESİ · 2012'DEN BERİ</span>
        </div>

        {/* 3D Interactive Floating Bean Canvas */}
        <div className="w-full h-72 sm:h-96 relative my-2">
          <Canvas
            camera={{ position: [0, 0, 3.6], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.75} />
            <spotLight position={[5, 6, 5]} intensity={3} color="#FFE2C2" />
            <pointLight position={[-4, -3, -2]} intensity={1.5} color="#D49B5B" />
            <CoffeeBean3D
              scale={1.55}
              position={[0, 0, 0]}
              roastColor="#3D2518"
              roughness={0.35}
              metalness={0.12}
              interactive={true}
              floating={true}
            />
          </Canvas>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-light font-display text-[#FAF4EB] tracking-tight leading-[1.08] max-w-5xl">
          ÇEKİRDEKTEN <br />
          <span className="italic font-editorial text-[#D49B5B] gold-glow">FİNCANA.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#D9C3B0]/90 font-sans max-w-2xl mt-4 leading-relaxed">
          Gerçek kahve lezzeti topraktan başlar. Dünyanın en iyi çiftliklerinden özenle seçtiğimiz taze çekirdekleri, İstanbul'daki atölyemizde döküm tamburlarda taze taze kavuruyoruz.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            to="/urunler"
            onClick={playDrip}
            className="btn-luxury btn-luxury-primary cursor-pointer"
            data-cursor="ÜRÜNLER"
          >
            <ShoppingBag size={16} />
            <span>KAHVELERİ İNCELE</span>
          </Link>

          <Link
            to="/kavurma-lab"
            onClick={playClick}
            className="btn-luxury cursor-pointer"
            data-cursor="REHBER"
          >
            <Sliders size={16} />
            <span>KAVURMA REHBERİ</span>
          </Link>
        </div>
      </div>

      {/* 3 BRAND PILLARS / KEY ATTRIBUTES */}
      <div className="max-w-6xl mx-auto my-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="luxury-glass p-8 rounded-3xl space-y-3 border border-[#D49B5B]/30">
          <div className="w-12 h-12 rounded-2xl bg-[#D49B5B]/15 border border-[#D49B5B]/30 flex items-center justify-center text-[#D49B5B]">
            <Flame size={24} />
          </div>
          <h3 className="text-xl font-normal font-display text-[#FAF4EB]">
            Döküm Fırınlarda Taze Kavrum
          </h3>
          <p className="text-xs sm:text-sm text-[#D9C3B0]/80 leading-relaxed font-sans">
            Kahvelerimiz döküm makinelerde ağır ateşte kavrulur. Çekirdekler yanmaz, içindeki doğal çikolata ve fındık aromaları tam kıvamında açığa çıkar.
          </p>
        </div>

        <div className="luxury-glass p-8 rounded-3xl space-y-3 border border-[#D49B5B]/30">
          <div className="w-12 h-12 rounded-2xl bg-[#D49B5B]/15 border border-[#D49B5B]/30 flex items-center justify-center text-[#D49B5B]">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-normal font-display text-[#FAF4EB]">
            Sadece Olgun Kırmızı Meyveler
          </h3>
          <p className="text-xs sm:text-sm text-[#D9C3B0]/80 leading-relaxed font-sans">
            Kahve meyveleri ağaçta kiraz gibi yetişir. Ham yeşil meyveler yerine yalnızca dalında tam kızarmış, şeker oranı en yüksek olan tatlı meyveler elle toplanır.
          </p>
        </div>

        <div className="luxury-glass p-8 rounded-3xl space-y-3 border border-[#D49B5B]/30">
          <div className="w-12 h-12 rounded-2xl bg-[#D49B5B]/15 border border-[#D49B5B]/30 flex items-center justify-center text-[#D49B5B]">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-normal font-display text-[#FAF4EB]">
            Hava Geçirmez Kilitli Paket
          </h3>
          <p className="text-xs sm:text-sm text-[#D9C3B0]/80 leading-relaxed font-sans">
            Taze kavrulup tek yönlü hava valfli koruyucu paketlere doldurulan çekirdekler, ilk günkü yoğun kokusunu ve zengin kremasını aylarca muhafaza eder.
          </p>
        </div>
      </div>

      {/* 4 DEDICATED CHAPTER PREVIEW CARDS */}
      <div className="max-w-6xl mx-auto my-16">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#D49B5B] font-bold block mb-2">
            DENEYİM VE BİLGİ SAYFALARI
          </span>
          <h2 className="text-2xl sm:text-4xl font-light font-display text-[#FAF4EB]">
            KAHVE DÜNYASINI KEŞFEDİN
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <Link
            to="/kokenler"
            onClick={playClick}
            className="luxury-glass p-6 rounded-2xl flex flex-col justify-between h-72 border border-[#D49B5B]/25 hover:border-[#D49B5B] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            data-cursor="KÖKENLER"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#D49B5B]/15 flex items-center justify-center text-[#D49B5B] mb-4">
                <Globe size={20} />
              </div>
              <span className="text-[10px] font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 01</span>
              <h3 className="text-xl font-normal font-display text-[#FAF4EB] mt-1 group-hover:text-[#D49B5B] transition-colors">
                Dünyadan Kahveler
              </h3>
              <p className="text-xs text-[#D9C3B0]/75 font-sans mt-2 leading-relaxed">
                3D Dünya küresi üzerinde Brezilya, Kolombiya, Etiyopya ve Kenya kahvelerinin lezzet farklarını keşfedin.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D49B5B] pt-4 border-t border-white/10 font-bold">
              <span>3D KÜREYİ AÇ</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to="/kavurma-sanati"
            onClick={playClick}
            className="luxury-glass p-6 rounded-2xl flex flex-col justify-between h-72 border border-[#D49B5B]/25 hover:border-[#D49B5B] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            data-cursor="ATÖLYE"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#D49B5B]/15 flex items-center justify-center text-[#D49B5B] mb-4">
                <Flame size={20} />
              </div>
              <span className="text-[10px] font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 02</span>
              <h3 className="text-xl font-normal font-display text-[#FAF4EB] mt-1 group-hover:text-[#D49B5B] transition-colors">
                Kavurma Atölyemiz
              </h3>
              <p className="text-xs text-[#D9C3B0]/75 font-sans mt-2 leading-relaxed">
                2012'den beri İstanbul'da döküm tamburlarla uyguladığımız lezzet ve ustalık anlayışımız.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D49B5B] pt-4 border-t border-white/10 font-bold">
              <span>ATÖLYEYİ GÖR</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to="/kavurma-lab"
            onClick={playClick}
            className="luxury-glass p-6 rounded-2xl flex flex-col justify-between h-72 border border-[#D49B5B]/25 hover:border-[#D49B5B] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            data-cursor="LAB"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#D49B5B]/15 flex items-center justify-center text-[#D49B5B] mb-4">
                <Sliders size={20} />
              </div>
              <span className="text-[10px] font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 03</span>
              <h3 className="text-xl font-normal font-display text-[#FAF4EB] mt-1 group-hover:text-[#D49B5B] transition-colors">
                Kavurma Rehberi
              </h3>
              <p className="text-xs text-[#D9C3B0]/75 font-sans mt-2 leading-relaxed">
                Açık, orta ve koyu kavrumda kahvenin renginin, asiditesinin ve gövdesinin nasıl değiştiğini interaktif görün.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D49B5B] pt-4 border-t border-white/10 font-bold">
              <span>REHBERİ BAŞLAT</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            to="/urunler"
            onClick={playClick}
            className="luxury-glass p-6 rounded-2xl flex flex-col justify-between h-72 border border-[#D49B5B]/25 hover:border-[#D49B5B] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            data-cursor="ÜRÜNLER"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#D49B5B]/15 flex items-center justify-center text-[#D49B5B] mb-4">
                <ShoppingBag size={20} />
              </div>
              <span className="text-[10px] font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 04</span>
              <h3 className="text-xl font-normal font-display text-[#FAF4EB] mt-1 group-hover:text-[#D49B5B] transition-colors">
                Brema Ürünleri
              </h3>
              <p className="text-xs text-[#D9C3B0]/75 font-sans mt-2 leading-relaxed">
                360° dönebilen 3D paketimiz ile espresso çekirdekleri, geleneksel Türk kahveleri ve taze filtre kahveler.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D49B5B] pt-4 border-t border-white/10 font-bold">
              <span>ÜRÜNLERİ İNCELE</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* FINALE SECTION: 3D CUP & STATEMENT */}
      <div className="max-w-6xl mx-auto luxury-glass rounded-3xl p-8 sm:p-14 my-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#D49B5B]/30">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">HER ZAMAN TAZE · KUSURSUZ FİNCAN</span>
          <h2 className="text-3xl sm:text-5xl font-light font-display text-[#FAF4EB]">
            HER YUDUMDA <br />
            <span className="italic font-editorial text-[#D49B5B]">TAZE KAVRUM TAZELİĞİ.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#D9C3B0]/85 leading-relaxed font-sans max-w-lg">
            Sipariş verdiğiniz an atölyemizde taze kavrulup özel kilitli hava geçirmez paketlerde size ulaşır. İlk günden son yuduma kadar zengin krema ve kalıcı lezzet.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/urunler"
              onClick={playDrip}
              className="btn-luxury btn-luxury-primary cursor-pointer text-xs"
            >
              <span>TAZE KAHVE SİPARİŞİ VER</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 3D Espresso Cup Area */}
        <div className="lg:col-span-5 h-64 sm:h-72 relative">
          <Canvas
            camera={{ position: [0, 0.8, 3.4], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.8} />
            <spotLight position={[4, 6, 4]} intensity={3} color="#FFE2C2" />
            <pointLight position={[-3, -2, -2]} intensity={1.2} color="#D49B5B" />
            <EspressoCup3D scale={1.15} position={[0, -0.3, 0]} />
          </Canvas>
        </div>
      </div>
    </div>
  );
};
