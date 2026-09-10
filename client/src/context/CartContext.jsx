// ไฟล์: client/src/context/CartContext.jsx
// Context กลางสำหรับจัดการระบบตะกร้าสินค้า (เพิ่ม/ลด/ลบสินค้า และคำนวณยอดรวม)
// เรียกมาจาก: App.jsx (นำ CartProvider ไปครอบ root เพื่อให้ทุกหน้าแชร์ state ร่วมกันได้)
// แหล่งเก็บข้อมูล: localStorage (key: merchroom_cart) ซิงค์ข้อมูลข้ามแท็บและคงอยู่หลังรีเฟรช
// ส่งออก Hook: useCart() สำหรับหน้า Navbar, Product, ProductDetail, Cart, Checkout
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'merchroom_cart';

export function CartProvider({ children }) {
  // โหลดของในตะกร้าจาก localStorage ตอนเริ่มต้น ถ้าไม่มีหรือพังให้ fallback เป็น array ว่าง
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ซิงค์ข้อมูลตะกร้าลง localStorage ทุกครั้งที่ items มีการเปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ดักเคสเปิด incognito หรือ storage เต็ม
    }
  }, [items]);

  // เพิ่มสินค้าเข้าตะกร้า: ถ้ามีอยู่แล้วให้บวกจำนวนเพิ่ม ถ้ายังไม่มีให้แทรกเข้าไปใหม่
  const addToCart = useCallback((product, quantity = 1) => {
    // กันบั๊กคนส่ง onClick event เข้ามาตรงๆ (ต้องเป็น product object เท่านั้น)
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

  // ลบสินค้าชิ้นนั้นออกจากตะกร้าด้วย id
  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ปรับจำนวนชิ้น โดยล็อคขั้นต่ำไว้ที่ 1 ชิ้นเสมอ
  const updateQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }, []);

  // เคลียร์ตะกร้าว่างเปล่า (ใช้ตอน checkout สำเร็จ)
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // คำนวณสรุปจำนวนชิ้นและราคารวม พร้อมแพ็ก context value ด้วย useMemo กัน re-render พร่ำเพรื่อ
  const value = useMemo(() => {
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  }, [items, addToCart, removeFromCart, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook สะดวกๆ ให้ component อื่นเรียกใช้ context ได้เลย
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart ต้องใช้ภายใน <CartProvider> เท่านั้น');
  }

  return context;
}
