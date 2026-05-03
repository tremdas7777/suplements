import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ShoppingBag } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import { useCart } from "../context/CartContext";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getOrders, clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      // Get the most recent order from localStorage (saved before redirect)
      const orders = getOrders();
      if (orders.length > 0) {
        setOrder(orders[0]);
      }
    }

    // Facebook Pixel - Purchase
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const orders = getOrders();
      if (orders.length > 0) {
        const lastOrder = orders[0];
        (window as any).fbq('track', 'Purchase', {
          content_ids: lastOrder.items?.map((i: any) => i.id) || [],
          content_type: 'product',
          value: lastOrder.total,
          currency: 'EUR',
          order_id: lastOrder.id,
        });
      }
    }

    // Google Analytics - purchase
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const orders = getOrders();
      if (orders.length > 0) {
        const lastOrder = orders[0];
        (window as any).gtag('event', 'purchase', {
          transaction_id: lastOrder.id,
          value: lastOrder.total,
          currency: 'EUR',
          items: lastOrder.items?.map((i: any) => ({
            item_id: i.id,
            item_name: i.title,
            price: i.price,
            quantity: i.quantity,
          })) || [],
        });
      }
    }

    clearCart();
  }, []);

  const F = (n: number) => "€" + (n || 0).toFixed(2).replace(".", ",");

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
      <HeaderESN />
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <Check size={36} color="#fff" strokeWidth={3} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Bestellung erfolgreich! 🎉</h1>
        <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
          {order?.customer?.firstName && <>Danke, <strong>{order.customer.firstName}</strong>!</>} Deine Bestellung <strong>{order?.id || "wurde aufgegeben"}</strong> wurde bestätigt.
        </p>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 32 }}>
          Bestätigung wird an <strong>{order?.customer?.email || "deine E-Mail"}</strong> gesendet.
        </p>

        {order && (
          <div style={{ background: "#f8f9fa", borderRadius: 16, padding: 24, border: "1.5px solid #edf1f2", textAlign: "left", marginBottom: 32 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Bestellübersicht · {order.id}</div>
            {order.items?.map((item: any) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span>{item.title} × {item.quantity}</span>
                <span style={{ fontWeight: 700 }}>{F(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #edf1f2", marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                <span>Versand ({order.shippingMethod})</span>
                <span>{order.shippingCost === 0 ? "Kostenlos" : F(order.shippingCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18 }}>
                <span>Gesamt</span><span>{F(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <button onClick={() => navigate("/")} style={{ padding: "16px", background: "#4ec3e0", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
            Weiter einkaufen
          </button>
          <button onClick={() => navigate("/admin")} style={{ padding: "16px", background: "transparent", color: "#232323", border: "1.5px solid #e5e7eb", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Bestellung im Admin-Panel ansehen →
          </button>
        </div>
      </div>
      <FooterESN />
    </div>
  );
}
