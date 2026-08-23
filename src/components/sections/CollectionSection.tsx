import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Check, ChevronRight, RotateCw, Eye } from 'lucide-react';
import { PRODUCTS_DATA } from '../../data/products';
import { ProductItem, CartItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

interface CollectionSectionProps {
  activeProduct: ProductItem;
  onSelectProduct: (product: ProductItem) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  activeProduct,
  onSelectProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
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
    addToCart(activeProduct, selectedSize, selectedGrind, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleSelectProduct = (prod: ProductItem) => {
    playClick();
    onSelectProduct(prod);
  };

  const currentPrice = activeProduct.prices[selectedSize] || 280;

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between p-6 sm:p-12 lg:p-20 pointer-events-none z-10 select-none">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-mono text-[#C6955B] tracking-widest">CHAPTER 07</span>
          <span className="w-12 h-[1px] bg-[#C6955B]/40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E8D8C0]/70 font-sans">
            CURATED CATALOGUE
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#F4EFE8] font-display">
              THE BREMA <span className="italic font-editorial text-[#C6955B]">COLLECTION.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#E8D8C0]/70 font-sans mt-1">
              Select products to inspect in real-time 3D, customize roast packaging & grind specification.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'all', label: 'ALL' },
              { id: 'espresso', label: 'ESPRESSO' },
              { id: 'turkish', label: 'TURKISH COFFEE' },
              { id: 'filter', label: 'SINGLE ORIGIN / FILTER' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-[#C6955B] text-[#080706] border-[#F4EFE8] font-bold shadow-[0_0_15px_rgba(198,149,91,0.4)]'
                    : 'bg-[#16100C]/80 text-[#E8D8C0]/60 border-white/10 hover:border-[#C6955B]/40 hover:text-white'
                }`}
                data-cursor="FILTER"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Workspace (Horizontal Product List + Detail Inspector Card) */}
      <div className="max-w-6xl mx-auto w-full my-auto pointer-events-auto py-6">
        {/* Horizontal Product Picker Strip */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-3 mb-6">
          {filteredProducts.map((prod) => {
            const isSelected = activeProduct.id === prod.id;

            return (
              <button
                key={prod.id}
                onClick={() => handleSelectProduct(prod)}
                className={`px-4 py-3 rounded-xl border text-left whitespace-nowrap transition-all duration-300 flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#1E1510] border-[#C6955B] text-[#F4EFE8] shadow-[0_0_20px_rgba(198,149,91,0.3)] scale-105'
                    : 'bg-[#120D0A]/80 border-white/10 text-[#E8D8C0]/60 hover:text-white hover:border-white/20'
                }`}
                data-cursor="INSPECT"
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: prod.accentColor }}
                />
                <div>
                  <div className="text-xs font-semibold font-display">{prod.name}</div>
                  <div className="text-[9px] font-mono text-[#C6955B] mt-0.5">
                    {prod.roastLevel} · {prod.prices['250g']} ₺
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Product Inspector & Purchase Console */}
        <div className="luxury-glass rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Information */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              {activeProduct.badge && (
                <span className="px-3 py-1 rounded-full bg-[#C6955B]/20 text-[#C6955B] text-[10px] font-mono uppercase tracking-widest border border-[#C6955B]/40 font-bold">
                  {activeProduct.badge}
                </span>
              )}
              <span className="text-xs font-mono text-[#E8D8C0]/60 uppercase tracking-wider">
                {activeProduct.category.toUpperCase()} ROAST
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-light text-[#F4EFE8] font-display">
              {activeProduct.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#C6955B] italic font-editorial tracking-wide">
              {activeProduct.tagline}
            </p>

            <p className="text-xs sm:text-sm text-[#E8D8C0]/80 font-sans leading-relaxed pt-1">
              {activeProduct.description}
            </p>

            {/* Tasting Notes */}
            <div className="pt-2">
              <span className="text-[10px] font-mono uppercase text-[#E8D8C0]/50 tracking-widest block mb-2">
                CUP TASTING PROFILE
              </span>
              <div className="flex flex-wrap gap-2">
                {activeProduct.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-md bg-[#221611] border border-[#C6955B]/30 text-xs font-mono text-[#E8D8C0]"
                  >
                    • {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sensory Metric Scales */}
            <div className="grid grid-cols-4 gap-3 pt-3 font-mono text-[10px]">
              <div>
                <div className="text-[#E8D8C0]/50 mb-1">INTENSITY</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C6955B]"
                    style={{ width: `${activeProduct.intensity * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-[#E8D8C0]/50 mb-1">ACIDITY</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E76F51]"
                    style={{ width: `${activeProduct.acidity * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-[#E8D8C0]/50 mb-1">BODY</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8A5A34]"
                    style={{ width: `${activeProduct.body * 10}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-[#E8D8C0]/50 mb-1">SWEETNESS</div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E8D8C0]"
                    style={{ width: `${activeProduct.sweetness * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Add to Cart */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8 space-y-6">
            {/* Bag Size Selector */}
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C6955B] tracking-widest block mb-2">
                SELECT BAG VOLUME
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['250g', '500g', '1000g'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      playClick();
                      setSelectedSize(size);
                    }}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono tracking-wider transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-[#C6955B] text-[#080706] border-[#F4EFE8] font-bold'
                        : 'bg-[#1A130F] text-[#E8D8C0]/70 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Grind Size Selector */}
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C6955B] tracking-widest block mb-2">
                SELECT GRIND DEGREE
              </span>
              <select
                value={selectedGrind}
                onChange={(e) => {
                  playClick();
                  setSelectedGrind(e.target.value as CartItem['grind']);
                }}
                className="w-full bg-[#1A130F] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#F4EFE8] font-mono focus:border-[#C6955B] focus:outline-none"
              >
                <option>Whole Bean</option>
                <option>Espresso</option>
                <option>Moka Pot</option>
                <option>Filter / V60</option>
                <option>French Press</option>
                <option>Turkish</option>
              </select>
            </div>

            {/* Price & Action Button */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono uppercase text-[#E8D8C0]/60">PRICE</span>
                <span className="text-2xl font-bold font-mono text-[#F4EFE8]">
                  {currentPrice.toFixed(2)} ₺
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full btn-luxury ${
                  addedAnimation ? 'bg-green-800 border-green-400 text-white' : 'btn-luxury-primary'
                }`}
                data-cursor="ADD"
              >
                {addedAnimation ? (
                  <>
                    <Check size={16} />
                    <span>ADDED TO CART</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>ADD TO CART · {selectedSize}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  playClick();
                  openSampleModal();
                }}
                className="w-full text-center text-[10px] uppercase tracking-[0.2em] text-[#C6955B] hover:text-[#E8D8C0] transition-colors pt-1"
              >
                Request Wholesale / Cafe Sample
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-center text-[10px] tracking-[0.3em] uppercase text-[#E8D8C0]/40 font-mono">
        CLICK & DRAG 3D POUCH TO ROTATE 360° · NITROGEN FLUSHED FRESHNESS
      </div>
    </section>
  );
};
