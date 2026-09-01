import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  /* เพิ่มสินค้าลงตะกร้า ถ้ามีอยู่แล้วให้บวกจำนวนแทนการเพิ่มรายการซ้ำ */
  const addToCart = useCallback((product, quantity = 1) => {
    if (!product?.id) {
      console.warn('[cart] addToCart ต้องรับ product object ไม่ใช่ event');
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /** แก้จำนวนของรายการในตะกร้า (อย่างน้อย 1) - ใช้กับปุ่ม -/+ ในหน้า Cart */
  const updateQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }, []);

  const value = useMemo(() => {
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { items, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity };
  }, [items, addToCart, removeFromCart, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart ต้องใช้ภายใน <CartProvider> เท่านั้น');
  }

  return context;
}
