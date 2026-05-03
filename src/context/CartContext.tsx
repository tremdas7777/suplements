import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  isCombo?: boolean;
  comboSelections?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "esn_cart_v2";

function load(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
    // Keep legacy key in sync so iframe pages can also read it
    sessionStorage.setItem("cart", JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    save(items);
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }, [items]);

  // Listen to open-cart events dispatched from combo page or legacy code
  useEffect(() => {
    const onOpen = () => {
      const fresh = load();
      setItems(fresh);
      setIsOpen(true);
    };
    window.addEventListener("open-cart", onOpen);
    return () => window.removeEventListener("open-cart", onOpen);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems(prev => qty <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, count, total,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, updateQty, removeItem, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
