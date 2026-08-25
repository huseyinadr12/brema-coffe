import React, { useState } from 'react';
import { Store, TrendingUp, Users, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';

export const FranchisePage: React.FC = () => {
  const { playClick, playDrip } = useAudio();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    locationType: 'Cadde Mağazası (Street Store)',
    budget: '2.000.000 ₺ - 4.000.000 ₺',
    experience: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playDrip();
    setSubmitted(true);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D49B5B', '#FAF4EB', '#8A4F2C'],
    });
  };

  return (
    <div className="theme-page relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 07</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            FRANCHISE & MAĞAZA ORTAKLIĞI
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
          BREMA DENEYİMİNİ <br />
          <span className="italic font-editorial text-[#D49B5B]">İNŞA EDİN.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans max-w-2xl mt-2 leading-relaxed">
          Mimari estetiği, doğrudan kahve atölyesi tedarik gücünü ve uluslararası nitelikli kahve kültürünü şehrinizle buluşturun.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="luxury-glass p-8 rounded-2xl space-y-3">
          <Store size={26} className="text-[#D49B5B]" />
          <h2 className="text-lg font-medium text-[#FAF4EB] font-display">
            Anahtar Teslim Mimari Konsept
          </h2>
          <p className="text-xs text-[#D9C3B0]/80 leading-relaxed font-sans">
            Koyu taş tezgahlar, pirinç metal detaylar ve baristanın sanatını sergilediği açık ada bar tasarımlarıyla mekana özel mimari projelendirme.
          </p>
        </div>

        <div className="luxury-glass p-8 rounded-2xl space-y-3">
          <TrendingUp size={26} className="text-[#D49B5B]" />
          <h2 className="text-lg font-medium text-[#FAF4EB] font-display">
            Doğrudan Atölye Tedariği
          </h2>
          <p className="text-xs text-[#D9C3B0]/80 leading-relaxed font-sans">
            Haftalık taze nitrojenli çekirdek sevkiyatı, çaylar, gurme sıcak içecekler ve avantajlı franchise kâr marjları.
          </p>
        </div>

        <div className="luxury-glass p-8 rounded-2xl space-y-3">
          <Users size={26} className="text-[#D49B5B]" />
          <h2 className="text-lg font-medium text-[#FAF4EB] font-display">
            Brema Barista Akademisi
          </h2>
          <p className="text-xs text-[#D9C3B0]/80 leading-relaxed font-sans">
            Ekip seçimi, SCA standartlarında teorik ve pratik demleme eğitimleri, düzenli şube denetimleri ve kalite yönetimi.
          </p>
        </div>
      </div>

      {/* Franchise Application Form Card */}
      <div className="max-w-4xl mx-auto luxury-glass rounded-3xl p-8 sm:p-12 my-8 border border-[#D49B5B]/35">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 size={54} className="text-[#D49B5B] mx-auto animate-bounce" />
            <h3 className="text-2xl sm:text-3xl font-light font-display text-[#FAF4EB]">
              FRANCHISE BAŞVURUNUZ ALINDI
            </h3>
            <p className="text-xs text-[#D9C3B0]/80 max-w-md mx-auto">
              Franchise ve kurumsal genişleme direktörümüz 2 iş günü içerisinde sizinle iletişime geçerek detaylı fizibilite sunumunu iletecektir.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-luxury cursor-pointer mt-4"
            >
              YENİ BAŞVURU OLUŞTUR
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl font-light font-display text-[#FAF4EB]">
                Franchise & Mağaza Ön Başvuru Formu
              </h2>
              <p className="text-xs text-[#D9C3B0]/70 font-sans mt-1">
                Türkiye, Avrupa ve Körfez Bölgesi için mağaza açılış başvuruları değerlendirilmektedir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Adınız ve Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  E-Posta Adresiniz *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ahmet@sirket.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+90 532 XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Hedef Şehir / İlçe *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: İstanbul / Kadıköy"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Lokasyon Türü
                </label>
                <select
                  value={formData.locationType}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                >
                  <option>Cadde Mağazası (Street Store)</option>
                  <option>AVM & Alışveriş Merkezi Konsepti</option>
                  <option>Havalimanı / Transit Noktası</option>
                  <option>Üniversite Kampüsü / Teknopark</option>
                  <option>Drive-Thru & Kiosk</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Yatırım Bütçesi Aralığı
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                >
                  <option>2.000.000 ₺ - 4.000.000 ₺</option>
                  <option>4.000.000 ₺ - 7.500.000 ₺</option>
                  <option>7.500.000 ₺ + (Flagship / Çoklu Şube)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                Ticari Tecrübeniz ve Hedef Lokasyon Bilgisi
              </label>
              <textarea
                rows={3}
                placeholder="Önceki gıda/perakende deneyimleriniz, düşündüğünüz cadde veya m² büyüklüğü..."
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#D9C3B0]/80">
              <ShieldCheck size={16} className="text-[#D49B5B]" />
              <span>Bilgileriniz KVKK kapsamında gizli tutulmakta ve yalnızca franchise yetkilimizce incelenmektedir.</span>
            </div>

            <button type="submit" className="w-full btn-luxury btn-luxury-primary cursor-pointer">
              FRANCHISE BAŞVURUSUNU İLET
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
