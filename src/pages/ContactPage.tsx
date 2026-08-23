import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Instagram, Linkedin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';

export const ContactPage: React.FC = () => {
  const { playDrip } = useAudio();
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playDrip();
    setSent(true);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#D49B5B', '#FAF4EB'],
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 08</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            İSTANBUL MERKEZ & KAVURMA ATÖLYESİ
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
          BİZE <span className="italic font-editorial text-[#D49B5B]">ULAŞIN.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans max-w-2xl mt-2 leading-relaxed">
          Kahve tedariği, kafe danışmanlığı, barista eğitimleri veya atölye ziyareti için bizimle iletişime geçin.
        </p>
      </div>

      {/* Grid: Contact Info + Contact Form */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
        {/* Left: Headquarters Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="luxury-glass p-8 rounded-3xl space-y-6">
            <h2 className="text-xl font-light font-display text-[#FAF4EB] border-b border-white/10 pb-4">
              Kahve Atölyesi & Merkez
            </h2>

            <div className="space-y-4 text-xs font-sans text-[#D9C3B0]/80">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D49B5B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#FAF4EB] font-display text-sm">Adres</div>
                  <p>Brema Kahve Kavurma Atölyesi</p>
                  <p>İstanbul, Türkiye (41.0082° K, 28.9784° D)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-[#D49B5B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#FAF4EB] font-display text-sm">Telefon & WhatsApp</div>
                  <p>+90 (212) BREMA-CO</p>
                  <p className="text-[11px] text-[#A89080] font-mono">Hafta içi 08:30 - 18:00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="text-[#D49B5B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#FAF4EB] font-display text-sm">E-Posta</div>
                  <p>info@brema.com.tr</p>
                  <p>siparis@brema.com.tr</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#D49B5B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#FAF4EB] font-display text-sm">Kavurma & Sevkiyat</div>
                  <p>Pazartesi - Cuma: 08:00 - 18:00</p>
                  <p>Cumartesi: 09:00 - 14:00 (Tadım Seansları)</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#241812] border border-white/10 flex items-center justify-center text-[#D9C3B0] hover:text-white hover:border-[#D49B5B] transition-colors shadow-xs"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#241812] border border-white/10 flex items-center justify-center text-[#D9C3B0] hover:text-white hover:border-[#D49B5B] transition-colors shadow-xs"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 luxury-glass p-8 sm:p-12 rounded-3xl">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <CheckCircle2 size={54} className="text-[#D49B5B] animate-bounce" />
              <h3 className="text-2xl font-light font-display text-[#FAF4EB]">
                MESAJINIZ İLETİLDİ
              </h3>
              <p className="text-xs text-[#D9C3B0] max-w-md">
                Talebiniz ekibimize ulaştı. En kısa süre içerisinde sizinle iletişime geçeceğiz.
              </p>
              <button
                onClick={() => setSent(false)}
                className="btn-luxury cursor-pointer"
              >
                YENİ MESAJ GÖNDER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-light font-display text-[#FAF4EB]">
                Bize Mesaj Gönderin
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                    Adınız ve Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adınız"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    placeholder="ornek@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Konu
                </label>
                <input
                  type="text"
                  placeholder="Sipariş / Tadım Ziyareti / Diğer"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-[#D49B5B] mb-2 font-bold">
                  Mesajınız *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mesajınızı detaylıca yazabilirsiniz..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#241812] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#FAF4EB] focus:border-[#D49B5B] focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full btn-luxury btn-luxury-primary cursor-pointer">
                <span>MESAJI İLET</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
