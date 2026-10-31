import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export const getEffectiveUnitPrice = (product: Product, quantity: number): number => {
  if (!product.priceTiers || product.priceTiers.length === 0) {
    return product.basePrice;
  }
  // Find highest tier matched
  const matchedTier = [...product.priceTiers]
    .sort((a, b) => b.minQty - a.minQty)
    .find((tier) => quantity >= tier.minQty);

  return matchedTier ? matchedTier.unitPrice : product.basePrice;
};

interface CartContextValue {
  items: CartItem[];
  itemCount: number; // total units
  lineCount: number; // unique line items
  subtotal: number;
  discountSavings: number;
  tax: number;
  shipping: number;
  total: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  quickAddBySkus: (skuEntries: { sku: string; quantity: number }[]) => { added: number; notFound: string[] };
}

const STORAGE_KEY_CART = 'medsupply_cart_items';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    // Initial pre-filled sample items for procurement experience
    const initialProd1 = MOCK_PRODUCTS.find((p) => p.sku === 'GLV-NIT-M-100');
    const initialProd2 = MOCK_PRODUCTS.find((p) => p.sku === 'SYR-3ML-LL-100');
    const defaultItems: CartItem[] = [];

    if (initialProd1) {
      const qty = 50;
      const unit = getEffectiveUnitPrice(initialProd1, qty);
      defaultItems.push({
        product: initialProd1,
        quantity: qty,
        effectiveUnitPrice: unit,
        lineTotal: qty * unit,
        tierDiscount: qty * (initialProd1.basePrice - unit),
      });
    }

    if (initialProd2) {
      const qty = 20;
      const unit = getEffectiveUnitPrice(initialProd2, qty);
      defaultItems.push({
        product: initialProd2,
        quantity: qty,
        effectiveUnitPrice: unit,
        lineTotal: qty * unit,
        tierDiscount: qty * (initialProd2.basePrice - unit),
      });
    }

    return defaultItems;
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (quantity <= 0) return;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newQty = prev[existingIndex].quantity + quantity;
        const effectiveUnit = getEffectiveUnitPrice(product, newQty);
        const updated = [...prev];
        updated[existingIndex] = {
          product,
          quantity: newQty,
          effectiveUnitPrice: effectiveUnit,
          lineTotal: Number((newQty * effectiveUnit).toFixed(2)),
          tierDiscount: Number((newQty * (product.basePrice - effectiveUnit)).toFixed(2)),
        };
        return updated;
      } else {
        const effectiveUnit = getEffectiveUnitPrice(product, quantity);
        return [
          ...prev,
          {
            product,
            quantity,
            effectiveUnitPrice: effectiveUnit,
            lineTotal: Number((quantity * effectiveUnit).toFixed(2)),
            tierDiscount: Number((quantity * (product.basePrice - effectiveUnit)).toFixed(2)),
          },
        ];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const effectiveUnit = getEffectiveUnitPrice(item.product, quantity);
          return {
            ...item,
            quantity,
            effectiveUnitPrice: effectiveUnit,
            lineTotal: Number((quantity * effectiveUnit).toFixed(2)),
            tierDiscount: Number((quantity * (item.product.basePrice - effectiveUnit)).toFixed(2)),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const quickAddBySkus = (skuEntries: { sku: string; quantity: number }[]) => {
    let added = 0;
    const notFound: string[] = [];

    skuEntries.forEach(({ sku, quantity }) => {
      const cleanSku = sku.trim().toUpperCase();
      const product = MOCK_PRODUCTS.find((p) => p.sku.toUpperCase() === cleanSku);
      if (product && quantity > 0) {
        addToCart(product, quantity);
        added++;
      } else {
        notFound.push(sku);
      }
    });

    return { added, notFound };
  };

  // Calculations
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const lineCount = items.length;
  const subtotal = Number(
    items.reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0).toFixed(2)
  );
  const discountSavings = Number(
    items.reduce((acc, item) => acc + item.tierDiscount, 0).toFixed(2)
  );
  const netSubtotal = Number(items.reduce((acc, item) => acc + item.lineTotal, 0).toFixed(2));
  // Standard freight $25, free for orders above $500
  const shipping = netSubtotal > 500 || netSubtotal === 0 ? 0 : 25;
  // Tax: 0 for healthcare institution exemption, or can be calculated
  const tax = 0;
  const total = Number((netSubtotal + shipping + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        lineCount,
        subtotal,
        discountSavings,
        tax,
        shipping,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        quickAddBySkus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
