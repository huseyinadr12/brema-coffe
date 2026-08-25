import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  number: string;
  title: string;
  subtitle: string;
  path: string;
  previewBg: string;
  tag: string;
}

const MENU_ITEMS_TR: MenuItem[] = [
  {
    number: '01',
    title: 'ANA SAYFA',
    subtitle: 'Çekirdekten Fincana — İnteraktif 3D Deneyim ve Fotoğraflar',
    path: '/',
    previewBg: 'radial-gradient(circle at center, rgba(138,79,44,0.4) 0%, #1A120E 70%)',
    tag: 'Giriş',
  },
  {
    number: '02',
    title: 'DÜNYADAN KAHVELER',
    subtitle: 'İnteraktif 3D Küre ile Farklı Ülkelerin Kahve Çeşitleri',
    path: '/kokenler',
    previewBg: 'radial-gradient(circle at center, rgba(212,155,91,0.3) 0%, #1A120E 70%)',
    tag: '3D Küre',
  },
  {
    number: '03',
    title: 'KAVURMA SANATI & ATÖLYE',
    subtitle: 'Döküm Tamburda Taze ve Özenli Kahve Kavurma Ustalığı',
    path: '/kavurma-sanati',
    previewBg: 'radial-gradient(circle at center, rgba(212,155,91,0.35) 0%, #1A120E 70%)',
    tag: 'Atölyemiz',
  },
  {
    number: '04',
    title: 'KAVURMA REHBERİ',
    subtitle: 'Açık, Orta ve Koyu Kavrumda Kahvenin Lezzet Değişimi',
    path: '/kavurma-lab',
    previewBg: 'radial-gradient(circle at center, rgba(212,155,91,0.3) 0%, #1A120E 70%)',
    tag: 'Simülatör',
  },
  {
    number: '05',
    title: 'BREMA ÜRÜN ÇEŞİTLERİ',
    subtitle: 'Espresso, Türk Kahveleri, Filtre Kahveler ve Gurme İçecekler',
    path: '/urunler',
    previewBg: 'radial-gradient(circle at center, rgba(250,244,235,0.2) 0%, #1A120E 70%)',
    tag: 'Ürünlerimiz',
  },
  {
    number: '06',
    title: 'HASATTAN FİNCANA',
    subtitle: 'Kahve Ağacından Fincanınıza Gelen 7 Önemli Adım',
    path: '/hasattan-fincana',
    previewBg: 'radial-gradient(circle at center, rgba(90,110,45,0.3) 0%, #1A120E 70%)',
    tag: 'Yolculuk',
  },
  {
    number: '07',
    title: 'HİKAYEMİZ',
    subtitle: '2012’den Bu Yana İstanbul’da Kahve Tutkumuz',
    path: '/hikayemiz',
    previewBg: 'radial-gradient(circle at center, rgba(162,103,105,0.3) 0%, #1A120E 70%)',
    tag: 'Hakkımızda',
  },
  {
    number: '08',
    title: 'FRANCHISE VE BAYİLİK',
    subtitle: 'Brema Mağazası Açmak İsteyen Girişimciler İçin',
    path: '/franchise',
    previewBg: 'radial-gradient(circle at center, rgba(231,111,81,0.25) 0%, #1A120E 70%)',
    tag: 'Bayilik',
  },
  {
    number: '09',
    title: 'İLETİŞİM',
    subtitle: 'İstanbul Merkezimiz, İletişim Bilgileri ve Sipariş',
    path: '/iletisim',
    previewBg: 'radial-gradient(circle at center, rgba(46,31,24,0.6) 0%, #1A120E 70%)',
    tag: 'İletişim',
  },
];

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({ isOpen, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const { playClick } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#1A120E] text-[#FAF4EB] flex flex-col justify-between p-8 sm:p-16 overflow-y-auto animate-fade-in">
      {/* Background Preview Vignette */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 opacity-60"
        style={{
          background: hoveredItem?.previewBg || 'radial-gradient(circle at center, rgba(46,31,24,0.4) 0%, #1A120E 80%)',
        }}
      />

      {/* Top Header inside Menu */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6 mb-6">
        <div className="flex flex-col">
          <span className="text-2xl font-light tracking-[0.3em] font-display text-[#FAF4EB]">
            BREMA
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#D49B5B] font-mono font-bold">
            SAYFA DİZİNİ
          </span>
        </div>

        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#D49B5B]/40 bg-[#241812] text-xs tracking-[0.2em] font-mono hover:border-[#D49B5B] transition-colors cursor-pointer shadow-md font-semibold"
          data-cursor="KAPAT"
        >
          KAPAT ×
        </button>
      </div>

      {/* Main Menu Links Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4 my-auto py-4">
        {MENU_ITEMS_TR.map((item) => (
          <Link
            key={item.number}
            to={item.path}
            onMouseEnter={() => setHoveredItem(item)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => {
              playClick();
              onClose();
            }}
            className="group flex items-start gap-4 sm:gap-6 py-3.5 border-b border-white/5 hover:border-[#D49B5B]/50 cursor-pointer transition-all duration-300"
            data-cursor="GİT"
          >
            <span className="text-xs font-mono text-[#D49B5B] tracking-widest pt-1 font-bold">
              {item.number}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-light tracking-wide text-[#FAF4EB] group-hover:text-[#D49B5B] transition-colors font-display">
                  {item.title}
                </h2>
                <ArrowUpRight
                  size={16}
                  className="text-[#D49B5B] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                />
              </div>
              <p className="text-xs text-[#D9C3B0]/70 tracking-wider mt-0.5 font-sans">
                {item.subtitle}
              </p>
            </div>
            <span className="hidden sm:inline-block text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 text-[#D9C3B0] border border-white/10 group-hover:bg-[#D49B5B] group-hover:text-[#140C08] transition-colors font-mono font-medium">
              {item.tag}
            </span>
          </Link>
        ))}
      </div>

      {/* Bottom Footer Info inside Menu */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs text-[#D9C3B0]/75 font-sans">
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D49B5B] mb-1 font-bold font-mono">
            GENEL MERKEZ & KAVURMA ATÖLYESİ
          </h4>
          <p>İstanbul, Türkiye · 2012'den Beri</p>
          <p>brema.com.tr · iletisim@brema.com.tr</p>
        </div>

        <div>
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D49B5B] mb-1 font-bold font-mono">
            KALİTE VE TAZE KAVRUM
          </h4>
          <p>Uluslararası Kalite Standartları</p>
          <p>Hava Geçirmez Taze Kilitli Paketleme</p>
        </div>

        <div className="sm:text-right">
          <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D49B5B] mb-1 font-bold font-mono">
            KONSEPT FELSEFESİ
          </h4>
          <p>ÇEKİRDEKTEN FİNCANA</p>
          <p className="text-[#D49B5B] font-mono font-bold">© 2012 - 2026 BREMA COFFEE</p>
        </div>
      </div>
    </div>
  );
};
