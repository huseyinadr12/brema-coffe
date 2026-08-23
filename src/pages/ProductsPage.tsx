import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ShoppingBag, Sparkles, Check, RotateCw } from 'lucide-react';
import { ProductPouch3D } from '../components/canvas/ProductPouch3D';
import { PRODUCTS_DATA } from '../data/products';
import { ProductItem, CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAudio } from '../context/AudioContext';

export const ProductsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(PRODUCTS_DATA[0]);
  const [selectedSize, setSelectedSize] = useState<'250g' | '500g' | '1000g'>('250g');
  const [selectedGrind, setSelectedGrind] = useState<CartItem['grind']>('Whole Bean');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart, openSampleModal } = useCart();
  const { playClick, playDrip } = useAudio();

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS_DATA
    : PRODUCTS_DATA.filter((p) => p.category === activeCategory);

  const handleAddToCart = () => {
    playDrip();
    addToCart(selectedProduct, selectedSize, selectedGrind, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleSelectProduct = (prod: ProductItem) => {
    playClick();
    setSelectedProduct(prod);
  };

  const currentPrice = selectedProduct.prices[selectedSize] || 280;

  return (
    <div className="relative min-h-screen w-full bg-[#1A120E] text-[#FAF4EB] pt-24 pb-20 px-6 sm:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-[#D49B5B] tracking-widest font-bold">BÖLÜM 04</span>
          <span className="w-12 h-[1px] bg-[#D49B5B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9C3B0]/80 font-sans font-semibold">
            BREMA KAHVE VE İÇECEK ÇEŞİTLERİ
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light font-display text-[#FAF4EB]">
              KAHVE <span className="italic font-editorial text-[#D49B5B]">ÇEŞİTLERİMİZ.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#D9C3B0]/80 font-sans mt-2 max-w-xl leading-relaxed">
              Espresso çekirdekleri, geleneksel taş değirmen Türk kahveleri, taze filtre kahveler ve gurme sıcak içecekler.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'all', label: 'TÜMÜ' },
              { id: 'espresso', label: 'ESPRESSO ÇEKİRDEK' },
              { id: 'turkish', label: 'TÜRK KAHVESİ' },
              { id: 'filter', label: 'FİLTRE KAHVE' },
              { id: 'specialty', label: 'ÇAYLAR & GURME' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#D49B5B] text-[#140C08] border-[#FAF4EB] font-bold shadow-[0_0_15px_rgba(212,155,91,0.4)]'
                    : 'bg-[#241812]/90 text-[#D9C3B0] border-white/10 hover:border-[#D49B5B]/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Product Pouch Canvas Container */}
      <div className="max-w-6xl mx-auto h-[420px] sm:h-[480px] luxury-glass rounded-3xl relative overflow-hidden border border-[#D49B5B]/25 my-6">
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.75} />
          <spotLight position={[5, 8, 5]} intensity={3} color="#FFE2C2" />
          <pointLight position={[-4, -3, -3]} intensity={1.2} color="#D49B5B" />
          <ProductPouch3D
            product={selectedProduct}
            scale={1.15}
            position={[0, 0, 0]}
            interactive={true}
          />
        </Canvas>

        <div className="absolute top-4 left-6 pointer-events-none text-xs font-mono text-[#D49B5B] tracking-widest uppercase flex items-center gap-2 font-bold">
          <RotateCw size={14} />
          <span>3D AMBALAJI DÖNDÜRMEK İÇİN SÜRÜKLEYİN · {selectedProduct.name.toUpperCase()}</span>
        </div>
      </div>

      {/* Horizontal Product Picker Strip */}
      <div className="max-w-6xl mx-auto my-6">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {filteredProducts.map((prod) => {
            const isSelected = selectedProduct.id === prod.id;

            return (
              <button
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className={`px-5 py-3 rounded-xl border text-left whitespace-nowrap transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2E1F18] border-[#D49B5B] text-[#FAF4EB] shadow-[0_0_20px_rgba(212,155,91,0.35)] scale-105 font-bold'
                    : 'bg-[#201510]/90 border-white/10 text-[#D9C3B0]/70 hover:text-white hover:border-white/25'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: prod.accentColor }}
                />
                <div>
                  <div className="text-xs font-semibold font-display">{prod.name}</div>
                  <div className="text-[10px] font-mono text-[#D49B5B] mt-0.5 font-bold">
                    {prod.roastLevel} · {prod.prices['250g']} ₺
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Product Inspector & Purchase Console */}
      <div className="max-w-6xl mx-auto luxury-glass rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Information */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-3">
            {selectedProduct.badge && (
              <span className="px-3 py-1 rounded-full bg-[#D49B5B]/20 text-[#D49B5B] text-[10px] font-mono uppercase tracking-widest border border-[#D49B5B]/40 font-bold">
                {selectedProduct.badge}
              </span>
            )}
            <span className="text-xs font-mono text-[#D9C3B0]/70 uppercase tracking-wider font-semibold">
              {selectedProduct.category.toUpperCase()} KATEGORİSİ
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#FAF4EB] font-display">
            {selectedProduct.name}
          </h2>

          <p className="text-xs sm:text-sm text-[#D49B5B] italic font-editorial tracking-wide font-medium">
            {selectedProduct.tagline}
          </p>

          <p className="text-xs sm:text-sm text-[#D9C3B0]/90 font-sans leading-relaxed pt-1">
            {selectedProduct.description}
          </p>

          {/* Tasting Notes */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase text-[#D49B5B] tracking-widest block mb-2 font-bold">
              HİSSEDECEĞİNİZ LEZZET NOTALARI
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-3.5 py-1.5 rounded-lg bg-[#2A1C16] border border-[#D49B5B]/35 text-xs font-mono text-[#FAF4EB]"
                >
                  • {note}
                </span>
              ))}
            </div>
          </div>

          {/* Sensory Metric Scales */}
          <div className="grid grid-cols-4 gap-3 pt-3 font-mono text-[10px]">
            <div>
              <div className="text-[#D9C3B0]/80 mb-1 font-semibold">KAHVE YOĞUNLUĞU</div>
              <div className="w-full h-2 bg-[#2E1F18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D49B5B]"
                  style={{ width: `${selectedProduct.intensity * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-[#D9C3B0]/80 mb-1 font-semibold">MEYVEMSİ CANLILIK</div>
              <div className="w-full h-2 bg-[#2E1F18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E76F51]"
                  style={{ width: `${selectedProduct.acidity * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-[#D9C3B0]/80 mb-1 font-semibold">DOLGUNLUK</div>
              <div className="w-full h-2 bg-[#2E1F18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#BA8A59]"
                  style={{ width: `${selectedProduct.body * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-[#D9C3B0]/80 mb-1 font-semibold">DOĞAL TATLILIK</div>
              <div className="w-full h-2 bg-[#2E1F18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FAF4EB]"
                  style={{ width: `${selectedProduct.sweetness * 10}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Add to Cart */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8 space-y-6">
          {/* Bag Size Selector */}
          <div>
            <span className="text-[10px] font-mono uppercase text-[#D49B5B] tracking-widest block mb-2 font-bold">
              PAKET BOYUTU SEÇİN
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['250g', '500g', '1000g'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    playClick();
                    setSelectedSize(size);
                  }}
                  className={`py-2 px-3 rounded-lg border text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#D49B5B] text-[#140C08] border-[#FAF4EB] font-bold shadow-xs'
                      : 'bg-[#241812] text-[#D9C3B0] border-white/10 hover:border-[#D49B5B]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Grind Size Selector */}
          <div>
            <span className="text-[10px] font-mono uppercase text-[#D49B5B] tracking-widest block mb-2 font-bold">
              NASIL DEMLEYECEKSİNİZ? (ÖĞÜTME TÜRÜ)
            </span>
            <select
              value={selectedGrind}
              onChange={(e) => {
                playClick();
                setSelectedGrind(e.target.value as CartItem['grind']);
              }}
              className="w-full bg-[#241812] border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-[#FAF4EB] font-mono focus:border-[#D49B5B] focus:outline-none"
            >
              <option value="Whole Bean">Çekirdek Olarak (Öğütülmemiş)</option>
              <option value="Espresso">Espresso Makinesi İçin (İnce)</option>
              <option value="Moka Pot">Moka Pot / Ocak Üstü Cezvemsi</option>
              <option value="Filter / V60">Filtre Kahve Makinesi & V60 İçin</option>
              <option value="French Press">French Press & Soğuk Demleme (Kalın)</option>
              <option value="Turkish">Türk Kahvesi İçin (İnce Taş Öğütüm)</option>
            </select>
          </div>

          {/* Price & Action Button */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-mono uppercase text-[#D9C3B0]/70">FİYAT</span>
              <span className="text-2xl font-bold font-mono text-[#FAF4EB]">
                {currentPrice.toFixed(2)} ₺
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full btn-luxury cursor-pointer ${
                addedAnimation ? 'bg-green-800 border-green-400 text-white' : 'btn-luxury-primary'
              }`}
              data-cursor="EKLE"
            >
              {addedAnimation ? (
                <>
                  <Check size={16} />
                  <span>SEPETE EKLENDİ</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>SEPETE EKLE · {selectedSize}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                playClick();
                openSampleModal();
              }}
              className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-[#D49B5B] hover:text-[#FAF4EB] transition-colors pt-1 cursor-pointer font-bold"
            >
              Kafe veya İşletmeniz İçin Ücretsiz Numune İsteyin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
