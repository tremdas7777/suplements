import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;           // discounted price in euros (e.g. 32.94)
  originalPrice?: number;  // original price before discount
  quantity: number;
  image?: string;
  variant?: string;
  sku?: string;
  isCombo?: boolean;
  comboSelections?: Record<string, string>;
}

export interface Order {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    zip: string;
    city: string;
    country: string;
  };
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
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
  saveOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string;
  getOrders: () => Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "esn_cart_v3";
const ORDERS_KEY = "esn_orders_v1";

function loadCart(): CartItem[] {
  try {
    // Try localStorage first (persistent), fallback to sessionStorage (legacy)
    const raw = localStorage.getItem(CART_KEY) || sessionStorage.getItem("esn_cart_v2") || sessionStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCart(items: CartItem[]) {
  try {
    const json = JSON.stringify(items);
    localStorage.setItem(CART_KEY, json);
    // Keep sessionStorage in sync for iframe pages
    sessionStorage.setItem("cart", json);
    sessionStorage.setItem("esn_cart_v2", json);
  } catch {}
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveOrders(orders: Order[]) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch {}
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist cart on every change
  useEffect(() => {
    saveCart(items);
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: { count: items.reduce((a, i) => a + i.quantity, 0) } }));
  }, [items]);

  // Listen to open-cart events from iframe pages
  useEffect(() => {
    const onOpen = () => {
      setItems(loadCart()); // re-sync from storage
      setIsOpen(true);
    };
    window.addEventListener("open-cart", onOpen);
    return () => window.removeEventListener("open-cart", onOpen);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    // Normalize price: always store as a positive float in euros
    const price = typeof item.price === "string"
      ? parseFloat((item.price as string).replace(/[^0-9.,]/g, "").replace(",", "."))
      : Number(item.price) || 0;

    const normalized: CartItem = { ...item, price: Math.round(price * 100) / 100 };

    setItems(prev => {
      const existing = prev.find(i => i.id === normalized.id);
      if (existing) {
        return prev.map(i => i.id === normalized.id
          ? { ...i, quantity: i.quantity + normalized.quantity }
          : i);
      }
      return [...prev, normalized];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, Math.round(qty)) } : i)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("esn_cart_v2");
  }, []);

  const saveOrder = useCallback((orderData: Omit<Order, "id" | "createdAt" | "status">): string => {
    const id = "ESN-" + Date.now().toString(36).toUpperCase();
    const order: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    const orders = loadOrders();
    orders.unshift(order); // newest first
    saveOrders(orders);
    return id;
  }, []);

  const getOrders = useCallback((): Order[] => loadOrders(), []);

  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
    const orders = loadOrders();
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    saveOrders(updated);
  }, []);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const total = Math.round(items.reduce((acc, i) => acc + i.price * i.quantity, 0) * 100) / 100;

  return (
    <CartContext.Provider value={{
      items, isOpen, count, total,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, updateQty, removeItem, clearCart,
      saveOrder, getOrders, updateOrderStatus,
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
