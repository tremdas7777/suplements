import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, total, closeCart, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex", justifyContent: "flex-end",
        fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeCart(); }}
    >
      <div style={{
        width: "100%", maxWidth: 420, height: "100%",
        background: "#fff",
        display: "flex", flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        animation: "slideInRight 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #edf1f2",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={22} />
            <span style={{ fontWeight: 800, fontSize: 18 }}>Warenkorb</span>
            {items.length > 0 && (
              <span style={{
                background: "#4ec3e0", color: "#fff",
                fontSize: 11, fontWeight: 700,
                padding: "2px 8px", borderRadius: 12,
              }}>{items.reduce((a, i) => a + i.quantity, 0)}</span>
            )}
          </div>
          <button onClick={closeCart} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex" }}>
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80, color: "#6b7280" }}>
              <ShoppingBag size={48} style={{ opacity: 0.2, margin: "0 auto 16px", display: "block" }} />
              <p style={{ fontWeight: 600 }}>Der Warenkorb ist leer</p>
              <p style={{ fontSize: 13, marginTop: 8 }}>Füge Produkte hinzu und starte deine Bestellung.</p>
              <button
                onClick={closeCart}
                style={{
                  marginTop: 24, padding: "12px 28px",
                  background: "#000", color: "#fff",
                  border: "none", borderRadius: 24,
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >Weiter einkaufen</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{
                display: "flex", gap: 16,
                paddingBottom: 20, marginBottom: 20,
                borderBottom: "1px solid #edf1f2",
              }}>
                <div style={{
                  width: 80, height: 80, flexShrink: 0,
                  background: "#f8f9fa", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden",
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <ShoppingBag size={24} style={{ color: "#d1d5db" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.3 }}>{item.title}</div>
                  {item.variant && <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{item.variant}</div>}
                  {item.isCombo && item.comboSelections && (
                    <div style={{ fontSize: 11, color: "#4ec3e0", fontWeight: 600, marginBottom: 4 }}>
                      ✓ Bundle konfiguriert
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 0,
                      border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden",
                    }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer", display: "flex" }}
                      ><Minus size={12} /></button>
                      <span style={{ padding: "6px 8px", fontSize: 13, fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{ padding: "6px 10px", background: "none", border: "none", cursor: "pointer", display: "flex" }}
                      ><Plus size={12} /></button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>
                        €{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}
                      ><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid #edf1f2" }}>
            {/* Free shipping bar */}
            {total < 50 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                  Noch <strong style={{ color: "#232323" }}>€{(50 - total).toFixed(2).replace(".", ",")}</strong> bis zum kostenlosen Versand
                </div>
                <div style={{ background: "#edf1f2", borderRadius: 4, height: 4, overflow: "hidden" }}>
                  <div style={{ background: "#4ec3e0", height: "100%", width: `${Math.min(100, (total / 50) * 100)}%`, transition: "width 0.3s" }} />
                </div>
              </div>
            )}
            {total >= 50 && (
              <div style={{ marginBottom: 16, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                ✓ Kostenloser Versand
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontWeight: 700 }}>Zwischensumme</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>€{total.toFixed(2).replace(".", ",")}</span>
            </div>
            <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>inkl. MwSt. · Versandkosten werden an der Kasse berechnet</p>
            <button
              onClick={handleCheckout}
              style={{
                width: "100%", padding: "18px 24px",
                background: "#4ec3e0", color: "#fff",
                border: "none", borderRadius: 50,
                fontSize: 16, fontWeight: 900,
                cursor: "pointer", textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Zur Kasse · €{total.toFixed(2).replace(".", ",")}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
