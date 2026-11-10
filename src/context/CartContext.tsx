import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductColor, CartItem, CartItemCustomization } from '../types';
import { sounds } from '../utils/soundEffects';

export interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface FlyingItem {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  imageUrl: string;
  isFlying: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    color: ProductColor,
    size: string,
    quantity?: number,
    originElement?: HTMLElement | null,
    customization?: CartItemCustomization
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isCartBouncing: boolean;
  flyingItems: FlyingItem[];
  triggerFlyToCart: (originRect: DOMRect, imageUrl: string) => void;
  
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  isFitFinderOpen: boolean;
  openFitFinder: () => void;
  closeFitFinder: () => void;

  soundEnabled: boolean;
  toggleSound: () => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  promoCode: string;
  discountPercent: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;
  
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  hasFreeShipping: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD_AUD = 150.00;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('so_beau_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist persisted to localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('so_beau_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Promo code
  const [promoCode, setPromoCode] = useState<string>(() => {
    try {
      return localStorage.getItem('so_beau_promo') || '';
    } catch {
      return '';
    }
  });

  const [discountPercent, setDiscountPercent] = useState<number>(() => {
    try {
      return localStorage.getItem('so_beau_promo') === 'BEAU10' ? 0.1 : 0;
    } catch {
      return 0;
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFitFinderOpen, setIsFitFinderOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.isEnabled());
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const openFitFinder = () => setIsFitFinderOpen(true);
  const closeFitFinder = () => setIsFitFinderOpen(false);

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
    showToast(newState ? 'Tactile sound FX enabled.' : 'Sound FX muted.', 'info');
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('so_beau_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('so_beau_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Flying microinteraction state
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  const triggerFlyToCart = (originRect: DOMRect, imageUrl: string) => {
    const cartBtn = document.getElementById('navbar-cart-btn') || document.querySelector('.header-actions .cart-btn');
    let targetX = window.innerWidth - 65;
    let targetY = 32;

    if (cartBtn) {
      const targetRect = cartBtn.getBoundingClientRect();
      targetX = targetRect.left + targetRect.width / 2 - 34;
      targetY = targetRect.top + targetRect.height / 2 - 34;
    }

    const startX = originRect.left + originRect.width / 2 - 34;
    const startY = originRect.top + originRect.height / 2 - 34;
    const id = Date.now() + Math.random();

    setFlyingItems((prev) => [
      ...prev,
      { id, startX, startY, targetX, targetY, imageUrl, isFlying: true }
    ]);

    // When flight reaches target:
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== id));
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 700);
      setIsCartOpen(true);
    }, 720);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    color: ProductColor,
    size: string,
    quantity = 1,
    originElement?: HTMLElement | null,
    customization?: CartItemCustomization
  ) => {
    const customSuffix = customization ? `-${encodeURIComponent(customization.text)}-${customization.placement}` : '';
    const cartItemId = `${product.id}-${color.code}-${size}${customSuffix}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity,
          customization,
        },
      ];
    });

    const customMsg = customization ? ` with custom embroidery "${customization.text}"` : '';
    showToast(`Added ${product.name} (${color.name}, ${size})${customMsg} to your bag.`);
    sounds.playAddToCartChime();

    if (originElement) {
      const rect = originElement.getBoundingClientRect();
      triggerFlyToCart(rect, color.modelImage || product.images[0]);
    } else {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from shopping bag.', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your saved pieces.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wardrobe.', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BEAU10') {
      setPromoCode('BEAU10');
      setDiscountPercent(0.1);
      localStorage.setItem('so_beau_promo', 'BEAU10');
      showToast('Welcome code BEAU10 applied (10% off entire order)!', 'success');
      return { success: true, message: '10% discount applied.' };
    }
    return { success: false, message: 'Invalid promotional code. Try BEAU10.' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    localStorage.removeItem('so_beau_promo');
    showToast('Promo code removed.', 'info');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.customization ? item.customization.price : 0);
    return sum + itemPrice * item.quantity;
  }, 0);
  const discountAmount = Number((subtotal * discountPercent).toFixed(2));
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_AUD;
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_AUD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        isCartBouncing,
        flyingItems,
        triggerFlyToCart,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSearchOpen,
        openSearch,
        closeSearch,
        isFitFinderOpen,
        openFitFinder,
        closeFitFinder,
        soundEnabled,
        toggleSound,
        wishlist,
        toggleWishlist,
        isInWishlist,
        promoCode,
        discountPercent,
        applyPromoCode,
        removePromoCode,
        toasts,
        showToast,
        removeToast,
        totalItems,
        subtotal,
        discountAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD_AUD,
        amountUntilFreeShipping,
        hasFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
