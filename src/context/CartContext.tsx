import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ProductItem } from '../types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: ProductItem, size: '250g' | '500g' | '1000g', grind: CartItem['grind'], quantity?: number) => void;
  removeFromCart: (productId: string, size: string, grind: string) => void;
  updateQuantity: (productId: string, size: string, grind: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  sampleModalOpen: boolean;
  openSampleModal: () => void;
  closeSampleModal: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
  sampleModalOpen: false,
  openSampleModal: () => {},
  closeSampleModal: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('brema_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('brema_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const openSampleModal = () => setSampleModalOpen(true);
  const closeSampleModal = () => setSampleModalOpen(false);

  const addToCart = (
    product: ProductItem,
    size: '250g' | '500g' | '1000g',
    grind: CartItem['grind'],
    quantity = 1
  ) => {
    setItems((prev) => {
      const index = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size && i.grind === grind
      );
      if (index > -1) {
        const next = [...prev];
        next[index].quantity += quantity;
        return next;
      }
      return [...prev, { product, size, grind, quantity }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string, size: string, grind: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.size === size && i.grind === grind)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, grind: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((i) => {
          if (i.product.id === productId && i.size === size && i.grind === grind) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => {
    const price = curr.product.prices[curr.size] || 0;
    return acc + price * curr.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        sampleModalOpen,
        openSampleModal,
        closeSampleModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
