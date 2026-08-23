import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Linkedin, ArrowUp, Check } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const Footer: React.FC = () => {
  const { playClick, playDrip } = useAudio();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playDrip();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#120B07] text-[#FAF4EB] border-t border-[#D49B5B]/20 px-6 sm:px-12 lg:px-20 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" onClick={playClick} className="block">
              <span className="text-2xl font-light tracking-[0.3em] font-display text-[#FAF4EB]">
                BREMA
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#D49B5B] font-mono block mt-0.5 font-bold">
                KAVURMA ATÖLYESİ · İSTANBUL
              </span>
            </Link>
            <p className="text-xs text-[#D9C3B0]/80 font-sans leading-relaxed">
              2012 yılında İstanbul’da kurulan nitelikli kahve kavurma atölyesi. Çiftlikten fincana uzanan lezzet ve döküm tambur ustalığı.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#241812] border border-white/10 flex items-center justify-center text-[#D9C3B0] hover:text-white hover:border-[#D49B5B] transition-colors shadow-sm"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#241812] border border-white/10 flex items-center justify-center text-[#D9C3B0] hover:text-white hover:border-[#D49B5B] transition-colors shadow-sm"
              >
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Sayfalar */}
          <div className="space-y-2 text-xs font-sans text-[#D9C3B0]/80">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#D49B5B] font-bold mb-3">
              DENEYİM SAYFALARI
            </h4>
            <div>
              <Link to="/kokenler" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Küresel Terroir & 3D Küre
              </Link>
            </div>
            <div>
              <Link to="/kavurma-sanati" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Kavurma Sanatı & Atölye
              </Link>
            </div>
            <div>
              <Link to="/kavurma-lab" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Dijital Kavurma Laboratuvarı
              </Link>
            </div>
            <div>
              <Link to="/urunler" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Brema Ürün Koleksiyonu
              </Link>
            </div>
            <div>
              <Link to="/hasattan-fincana" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Hasattan Fincana 7 Adım
              </Link>
            </div>
          </div>

          {/* Kurumsal */}
          <div className="space-y-2 text-xs font-sans text-[#D9C3B0]/80">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#D49B5B] font-bold mb-3">
              KURUMSAL & ORTAKLIK
            </h4>
            <div>
              <Link to="/hikayemiz" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Hakkımızda & Hikayemiz
              </Link>
            </div>
            <div>
              <Link to="/franchise" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                Franchise Başvurusu
              </Link>
            </div>
            <div>
              <Link to="/iletisim" onClick={playClick} className="hover:text-[#D49B5B] transition-colors">
                İletişim & Lokasyon
              </Link>
            </div>
            <div className="pt-2 text-[11px] text-[#A89080] font-mono">
              <div>İstanbul, Türkiye</div>
              <div>info@brema.com.tr</div>
            </div>
          </div>

          {/* Bülten */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#D49B5B] font-bold mb-2">
              MİKRO-LOT BÜLTENİ
            </h4>
            <p className="text-xs text-[#D9C3B0]/75 font-sans leading-relaxed">
              Sınırlı sayıda kavrulan taze tek köken hasat duyurularından ilk siz haberdar olun.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="eposta@adresiniz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#241812] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#FAF4EB] font-mono focus:border-[#D49B5B] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#D49B5B] text-[#140C08] text-xs font-bold rounded-lg font-mono hover:bg-[#FAF4EB] transition-colors cursor-pointer"
              >
                {subscribed ? <Check size={14} /> : 'KATIL'}
              </button>
            </form>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 text-[11px] text-[#A89080] font-mono">
          <div>© 2012 - 2026 BREMA COFFEE ATELIER. TÜM HAKLARI SAKLIDIR.</div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>SCA STANDART</span>
            <span>NİTROJEN TAZE MÜHÜR</span>
            <button
              onClick={() => {
                playClick();
                scrollToTop();
              }}
              className="flex items-center gap-1.5 text-[#D49B5B] hover:text-[#FAF4EB] transition-colors cursor-pointer font-bold"
            >
              <span>YUKARI</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
