import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useCart } from '../../context/CartContext';

interface NavigationProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

const NAV_LINKS = [
  { path: '/urunler', label: 'ÜRÜNLER' },
  { path: '/kokenler', label: 'KÖKENLER' },
  { path: '/kavurma-sanati', label: 'KAVURMA SANATI' },
  { path: '/kavurma-lab', label: 'KAVURMA LAB' },
  { path: '/hasattan-fincana', label: 'HASATTAN FİNCANA' },
  { path: '/hikayemiz', label: 'HİKAYEMİZ' },
  { path: '/franchise', label: 'FRANCHISE' },
  { path: '/iletisim', label: 'İLETİŞİM' },
];

export const Navigation: React.FC<NavigationProps> = ({ menuOpen, onToggleMenu }) => {
  const { playClick } = useAudio();
  const { totalItems, openCart } = useCart();
  const location = useLocation();

  return (
    <header className="site-header fixed left-0 top-0 z-50 flex w-full items-center justify-between px-4 py-4 pointer-events-none transition-all duration-500 sm:px-8 lg:px-12">
      {/* Brand Logo (Left) */}
      <Link
        to="/"
        onClick={playClick}
        className="group flex flex-col items-start text-left pointer-events-auto cursor-pointer focus:outline-none"
        data-cursor="BREMA"
      >
        <span className="text-2xl sm:text-3xl font-semibold tracking-[0.28em] text-[#FAF4EB] font-display transition-colors group-hover:text-[#D49B5B]">
          BREMA
        </span>
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#D49B5B] font-mono -mt-0.5 font-bold">
          KAVURMA ATÖLYESİ · 2012
        </span>
      </Link>

      {/* Direct Page Navigation Links (Center Desktop) */}
      <nav className="site-nav hidden xl:flex items-center gap-3 px-5 py-3 rounded-full pointer-events-auto">
        {NAV_LINKS.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={playClick}
              className={`whitespace-nowrap text-[11px] tracking-[0.08em] font-mono transition-all duration-300 relative py-1 focus:outline-none cursor-pointer ${
                isActive
                  ? 'text-[#FAF4EB] font-bold'
                  : 'text-[#D9C3B0]/70 hover:text-[#FAF4EB]'
              }`}
              data-cursor="SAYFA"
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#D49B5B] to-[#FAF4EB] rounded-full shadow-[0_0_8px_#D49B5B]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Action Controls (Right) */}
      <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
        {/* Cart Button */}
        <button
          onClick={() => {
            playClick();
            openCart();
          }}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#241812]/90 border border-white/10 text-[#FAF4EB] transition-all duration-300 hover:border-[#D49B5B] backdrop-blur-md shadow-lg cursor-pointer"
          title="Sepeti Aç"
          data-cursor="SEPET"
        >
          <ShoppingBag size={16} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#D49B5B] text-[#140C08] text-[9px] font-bold">
              {totalItems}
            </span>
          )}
        </button>

        {/* Menu Toggle */}
        <button
          onClick={() => {
            playClick();
            onToggleMenu();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#241812]/95 border border-[#D49B5B]/35 text-[#FAF4EB] text-xs tracking-[0.22em] font-mono hover:border-[#D49B5B] transition-all duration-300 backdrop-blur-md shadow-xl cursor-pointer font-semibold"
          data-cursor="MENÜ"
        >
          {menuOpen ? (
            <>
              <X size={14} className="text-[#D49B5B]" />
              <span className="hidden sm:inline">KAPAT</span>
            </>
          ) : (
            <>
              <Menu size={14} className="text-[#D49B5B]" />
              <span className="hidden sm:inline">MENÜ +</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
