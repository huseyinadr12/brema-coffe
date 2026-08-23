import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

export const SampleModal: React.FC = () => {
  const { sampleModalOpen, closeSampleModal } = useCart();
  const { playClick, playDrip } = useAudio();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'Nitelikli Kahve Dükkanı (Specialty Cafe)',
    monthlyVolume: '20 - 50 kg / ay',
    preferredRoast: 'Brema İmza Espresso Gold',
    city: 'İstanbul',
    notes: '',
  });

  if (!sampleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playDrip();
    setSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#D49B5B', '#FAF4EB', '#8A4F2C'],
    });
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClick();
          closeSampleModal();
        }}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-xl bg-[#201510] border border-[#D49B5B]/35 rounded-3xl p-6 sm:p-10 text-[#FAF4EB] shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <Sparkles size={20} className="text-[#D49B5B]" />
            <h3 className="text-lg font-light tracking-[0.25em] font-display text-[#FAF4EB]">
              ATÖLYE NUMUNE KUTUSU
            </h3>
          </div>
          <button
            onClick={() => {
              playClick();
              closeSampleModal();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-[#D9C3B0] hover:text-white cursor-pointer bg-[#2A1C16]"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 size={54} className="text-[#D49B5B] mx-auto animate-bounce" />
            <h4 className="text-2xl font-light tracking-widest font-display">
              NUMUNE TALEBİNİZ ALINDI
            </h4>
            <p className="text-xs text-[#D9C3B0] max-w-md mx-auto leading-relaxed">
              İstanbul kahve atölyemiz, işletmenize özel 4 farklı mikro-lot tadım setini (4 × 100g) taze kavurup nitrojen ambalajında kargolayacaktır.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                closeSampleModal();
              }}
              className="btn-luxury cursor-pointer mt-2"
            >
              KAPAT
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-[#D9C3B0] font-sans leading-relaxed mb-4">
              Kafeler, oteller, restoranlar ve kurumsal ofisler için ücretsiz taze kavrulmuş numune seti.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                  İşletme / Kafe Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Atelier Coffee"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                  Yetkili Kişi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Adınız Soyadınız"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                  E-Posta Adresi *
                </label>
                <input
                  type="email"
                  required
                  placeholder="info@sirketiniz.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                  Telefon / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+90 5XX XXX XX XX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                  İşletme Türü
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                >
                  <option>Nitelikli Kahve Dükkanı (Specialty Cafe)</option>
                  <option>Butik Otel / Lüks Konaklama</option>
                  <option>Restoran / Gastronomi Mekanı</option>
                  <option>Kurumsal Ofis / Teknoloji Kampüsü</option>
                  <option>Pastane / Fırın</option>
                  <option>Uluslararası Dağıtıcı / Bayi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                  Tahmini Aylık Tüketim
                </label>
                <select
                  value={formData.monthlyVolume}
                  onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                  className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                >
                  <option>10 - 30 kg / ay</option>
                  <option>30 - 75 kg / ay</option>
                  <option>75 - 200 kg / ay</option>
                  <option>200+ kg / ay (Palet Sevkiyatı)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] mb-1 font-mono font-bold">
                Kullandığınız Ekipman & Özel Notlar
              </label>
              <textarea
                rows={2}
                placeholder="Örn: 2 Gruplu La Marzocco Linea PB, Mazzer değirmen..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#2A1C16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#D9C3B0] pt-1">
              <ShieldCheck size={16} className="text-[#D49B5B]" />
              <span>4 x 100g Taze Kavrulmuş Mikro-lot ve SCA Tadım Matrisi İçerir</span>
            </div>

            <button type="submit" className="w-full btn-luxury btn-luxury-primary mt-3 cursor-pointer">
              ÜCRETSİZ NUMUNE KUTUSU TALEP ET
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
