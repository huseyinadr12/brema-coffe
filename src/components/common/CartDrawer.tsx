import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, CheckCircle2, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    clearCart,
    openSampleModal,
  } = useCart();
  const { playClick, playDrip } = useAudio();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    playDrip();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D49B5B', '#FAF4EB', '#8A4F2C'],
      });
      clearCart();
    }, 1400);
  };

  const getGrindLabel = (grind: string) => {
    switch (grind) {
      case 'Whole Bean': return 'Çekirdek';
      case 'Espresso': return 'Espresso';
      case 'Moka Pot': return 'Moka Pot';
      case 'Filter / V60': return 'Filtre / V60';
      case 'French Press': return 'French Press';
      case 'Turkish': return 'Türk Kahvesi';
      default: return grind;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          playClick();
          closeCart();
        }}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-md bg-[#201510] text-[#FAF4EB] h-full flex flex-col justify-between p-6 sm:p-8 shadow-2xl border-l border-[#D49B5B]/30 animate-slide-left overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <Coffee size={20} className="text-[#D49B5B]" />
            <h2 className="text-lg font-light tracking-[0.25em] font-display text-[#FAF4EB]">
              BREMA SEPETİ
            </h2>
          </div>
          <button
            onClick={() => {
              playClick();
              closeCart();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-[#D9C3B0] hover:text-white hover:border-[#D49B5B] transition-colors cursor-pointer bg-[#2A1C16]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 my-6 overflow-y-auto pr-1">
          {orderComplete ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <CheckCircle2 size={52} className="text-[#D49B5B] animate-bounce" />
              <h3 className="text-2xl font-light tracking-widest text-[#FAF4EB] font-display">
                SİPARİŞİNİZ ALINDI
              </h3>
              <p className="text-xs text-[#D9C3B0] tracking-wider max-w-xs leading-relaxed">
                Brema tek köken kahveleriniz İstanbul kavurma atölyemizde taze kavrulup nitrojen korumalı ambalajında kargoya hazırlanacaktır.
              </p>
              <button
                onClick={() => {
                  setOrderComplete(false);
                  closeCart();
                }}
                className="btn-luxury cursor-pointer mt-2"
              >
                ALIŞVERİŞE DEVAM ET
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#A89080]">
              <Coffee size={38} className="text-[#D49B5B]/50 mb-3" />
              <p className="text-sm tracking-widest uppercase font-mono font-bold text-[#FAF4EB]">Sepetiniz Henüz Boş</p>
              <p className="text-xs text-[#D9C3B0] mt-1.5 max-w-xs leading-relaxed">
                İmza espresso harmanlarımızı ve taze tek köken mikro-lotlarımızı inceleyin.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  openSampleModal();
                }}
                className="mt-6 text-xs uppercase tracking-[0.2em] text-[#D49B5B] underline hover:text-[#FAF4EB] transition-colors cursor-pointer font-mono font-bold"
              >
                Kurumsal Numune Kutusu İste
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = item.product.prices[item.size] || 0;
                return (
                  <div
                    key={`${item.product.id}-${item.size}-${item.grind}`}
                    className="p-4 rounded-xl bg-[#2A1C16] border border-white/10 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-[#FAF4EB] tracking-wide font-display">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#D49B5B] tracking-wider font-mono mt-0.5 font-bold">
                          {item.size} · {getGrindLabel(item.grind)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size, item.grind)}
                        className="text-[#A89080] hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Ürünü Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center gap-3 bg-[#1A120E] px-3 py-1 rounded-full border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.grind, -1)}
                          className="text-[#D9C3B0] hover:text-white cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.grind, 1)}
                          className="text-[#D9C3B0] hover:text-white cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="text-sm font-mono text-[#FAF4EB] font-bold">
                        {(itemPrice * item.quantity).toFixed(2)} ₺
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Checkout */}
        {items.length > 0 && !orderComplete && (
          <div className="border-t border-white/10 pt-5 space-y-4">
            <div className="flex justify-between items-center text-xs tracking-wider text-[#D9C3B0] font-mono font-medium">
              <span>TAZELİK MÜHRÜ</span>
              <span className="text-[#D49B5B] font-bold">NİTROJEN KORUMALI</span>
            </div>

            <div className="flex justify-between items-center text-base tracking-widest font-mono">
              <span>ARA TOPLAM</span>
              <span className="text-[#FAF4EB] font-bold text-lg">{subtotal.toFixed(2)} ₺</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full btn-luxury btn-luxury-primary cursor-pointer"
            >
              {isCheckingOut ? (
                <span>SİPARİŞ OLUŞTURULUYOR...</span>
              ) : (
                <>
                  <span>ATÖLYEDEN TAZE SEVK ET</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#A89080] tracking-wider font-mono">
              İstanbul içi 750 ₺ üzeri siparişlerde aynı gün hızlı kargo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
