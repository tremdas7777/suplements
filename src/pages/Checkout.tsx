import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, ShoppingBag, Check, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import HeaderESN from "../components/HeaderESN";

type Step = "info" | "shipping" | "payment" | "done";

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; zip: string; city: string; country: string;
  cardNumber: string; cardName: string; cardExpiry: string; cardCvv: string;
}

const EMPTY: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", zip: "", city: "", country: "Deutschland",
  cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
};

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard-Versand", sub: "2–4 Werktage", price: 4.95 },
  { id: "express",  label: "Express-Versand",  sub: "1–2 Werktage", price: 9.95 },
  { id: "free",     label: "Kostenloser Versand", sub: "3–5 Werktage", price: 0, minOrder: 75 },
];

const inp: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 14, outline: "none",
  fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif",
  boxSizing: "border-box", background: "#fff",
};

function Field({ label, name, value, onChange, type = "text", placeholder = "" }: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151" }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(name, e.target.value)}
        style={inp}
        onFocus={e => (e.target.style.borderColor = "#232323")}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  );
}

const fmt = (n: number) => n.toFixed(2).replace(".", ",");
const F = (n: number) => "€" + fmt(n);

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart, saveOrder } = useCart();

  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState<FormData>(EMPTY);
  const [shipping, setShipping] = useState("standard");
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  const up = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping)!;
  const shippingCost = selectedShipping.price;
  const orderTotal = Math.round((total + shippingCost) * 100) / 100;

  const canInfo = !!(form.firstName && form.email && form.address && form.zip && form.city);
  const canPay  = !!(form.cardName && form.cardNumber.replace(/\s/g, "").length >= 15 && form.cardExpiry && form.cardCvv);

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1600));
    const id = saveOrder({
      customer: {
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, phone: form.phone,
        address: form.address, zip: form.zip,
        city: form.city, country: form.country,
      },
      items: [...items],
      subtotal: total,
      shippingCost,
      total: orderTotal,
      shippingMethod: selectedShipping.label,
      paymentMethod: "Kreditkarte",
    });
    setOrderId(id);
    clearCart();
    setStep("done");
    setProcessing(false);
  };

  const STEPS = ["info", "shipping", "payment"] as Step[];
  const LABELS = ["Kontaktdaten", "Versand", "Zahlung"];

  if (items.length === 0 && step !== "done") {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
        <HeaderESN />
        <div style={{ maxWidth: 520, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <ShoppingBag size={56} style={{ color: "#d1d5db", margin: "0 auto 20px", display: "block" }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Warenkorb ist leer</h2>
          <button onClick={() => navigate("/")} style={{ padding: "14px 32px", background: "#4ec3e0", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
            Weiter einkaufen
          </button>
        </div>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif", background: "#fff" }}>
        <HeaderESN />
        <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, background: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <Check size={36} color="#fff" strokeWidth={3} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Bestellung erfolgreich! 🎉</h1>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
            Danke, <strong>{form.firstName}</strong>! Deine Bestellung <strong>{orderId}</strong> wurde aufgegeben.
          </p>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 32 }}>
            Bestätigung wird an <strong>{form.email}</strong> gesendet.
          </p>

          <div style={{ background: "#f8f9fa", borderRadius: 16, padding: 24, border: "1.5px solid #edf1f2", textAlign: "left", marginBottom: 32 }}>
            <div style={{ fontWeight: 700, marginBottom: 16 }}>Bestellübersicht · {orderId}</div>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span>{item.title} × {item.quantity}</span>
                <span style={{ fontWeight: 700 }}>{F(item.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #edf1f2", marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                <span>Versand ({selectedShipping.label})</span>
                <span>{shippingCost === 0 ? "Kostenlos" : F(shippingCost)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18 }}>
                <span>Gesamt</span><span>{F(orderTotal)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            <button onClick={() => navigate("/")} style={{ padding: "16px", background: "#4ec3e0", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
              Weiter einkaufen
            </button>
            <button onClick={() => navigate("/admin")} style={{ padding: "16px", background: "transparent", color: "#232323", border: "1.5px solid #e5e7eb", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Bestellung im Admin-Panel ansehen →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif", color: "#232323" }}>
      <HeaderESN />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px", display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="checkout-grid">

        {/* LEFT */}
        <div>
          {/* Steps */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 24px", border: "1.5px solid #edf1f2", marginBottom: 24, display: "flex", alignItems: "center" }}>
            {STEPS.map((s, i) => {
              const done = STEPS.indexOf(step) > i;
              const active = step === s;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: done ? "#16a34a" : active ? "#232323" : "#e5e7eb", color: done || active ? "#fff" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, transition: "all .3s" }}>
                      {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#232323" : "#9ca3af", whiteSpace: "nowrap" }}>{LABELS[i]}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? "#16a34a" : "#e5e7eb", margin: "0 6px", marginBottom: 18, transition: "all .3s" }} />}
                </div>
              );
            })}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1.5px solid #edf1f2" }}>

            {/* STEP 1: Info */}
            {step === "info" && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Kontaktinformationen</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <Field label="Vorname *" name="firstName" value={form.firstName} onChange={up} />
                  <Field label="Nachname" name="lastName" value={form.lastName} onChange={up} />
                </div>
                <div style={{ display: "grid", gap: 14 }}>
                  <Field label="E-Mail *" name="email" value={form.email} onChange={up} type="email" placeholder="deine@email.de" />
                  <Field label="Telefon (optional)" name="phone" value={form.phone} onChange={up} type="tel" />
                  <Field label="Straße & Hausnummer *" name="address" value={form.address} onChange={up} placeholder="Musterstraße 1" />
                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 14 }}>
                    <Field label="PLZ *" name="zip" value={form.zip} onChange={up} placeholder="12345" />
                    <Field label="Stadt *" name="city" value={form.city} onChange={up} placeholder="Berlin" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151" }}>Land</label>
                    <select value={form.country} onChange={e => up("country", e.target.value)}
                      style={{ ...inp, cursor: "pointer" }}
                    >
                      {["Deutschland","Österreich","Schweiz","Niederlande","Belgien","Frankreich","Spanien","Italien"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button disabled={!canInfo} onClick={() => setStep("shipping")}
                  style={{ width: "100%", marginTop: 28, padding: "16px", background: canInfo ? "#4ec3e0" : "#d1d5db", color: "#fff", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 900, cursor: canInfo ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 1 }}
                >Weiter zur Lieferung</button>
              </>
            )}

            {/* STEP 2: Shipping */}
            {step === "shipping" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <button onClick={() => setStep("info")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}><ChevronLeft size={20} /></button>
                  <h2 style={{ fontSize: 18, fontWeight: 900 }}>Versandmethode</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {SHIPPING_OPTIONS.filter(o => !o.minOrder || total >= o.minOrder).map(opt => (
                    <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${shipping === opt.id ? "#232323" : "#e5e7eb"}`, background: shipping === opt.id ? "#f8f9fa" : "#fff", transition: "all .15s" }}>
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} style={{ accentColor: "#232323" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{opt.sub}</div>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: opt.price === 0 ? "#16a34a" : "inherit" }}>
                        {opt.price === 0 ? "Kostenlos" : F(opt.price)}
                      </span>
                    </label>
                  ))}
                </div>
                <button onClick={() => setStep("payment")} style={{ width: "100%", padding: "16px", background: "#4ec3e0", color: "#fff", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 900, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
                  Weiter zur Zahlung
                </button>
              </>
            )}

            {/* STEP 3: Payment */}
            {step === "payment" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <button onClick={() => setStep("shipping")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}><ChevronLeft size={20} /></button>
                  <h2 style={{ fontSize: 18, fontWeight: 900 }}>Zahlungsmethode</h2>
                </div>

                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
                  <Lock size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>256-bit SSL-Verschlüsselung · Sichere Zahlung</span>
                </div>

                <div style={{ background: "#f8f9fa", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                  <CreditCard size={20} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Kreditkarte / Debitkarte</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {["VISA","MC","AMEX"].map(b => <span key={b} style={{ fontSize: 9, fontWeight: 800, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2px 6px" }}>{b}</span>)}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
                  <Field label="Karteninhaber *" name="cardName" value={form.cardName} onChange={up} placeholder="Max Mustermann" />
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151", display: "block", marginBottom: 6 }}>Kartennummer *</label>
                    <input
                      value={form.cardNumber}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      onChange={e => {
                        const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        up("cardNumber", v);
                      }}
                      style={inp}
                      onFocus={e => (e.target.style.borderColor = "#232323")}
                      onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151", display: "block", marginBottom: 6 }}>Ablaufdatum *</label>
                      <input
                        value={form.cardExpiry}
                        placeholder="MM/JJ"
                        maxLength={5}
                        onChange={e => {
                          let v = e.target.value.replace(/\D/g, "");
                          if (v.length >= 3) v = v.slice(0,2) + "/" + v.slice(2,4);
                          up("cardExpiry", v);
                        }}
                        style={inp}
                        onFocus={e => (e.target.style.borderColor = "#232323")}
                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151", display: "block", marginBottom: 6 }}>CVV *</label>
                      <input
                        value={form.cardCvv}
                        placeholder="123"
                        maxLength={4}
                        onChange={e => up("cardCvv", e.target.value.replace(/\D/g, ""))}
                        style={inp}
                        onFocus={e => (e.target.style.borderColor = "#232323")}
                        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing || !canPay}
                  style={{ width: "100%", padding: "18px", background: (processing || !canPay) ? "#d1d5db" : "#b70832", color: "#fff", border: "none", borderRadius: 50, fontSize: 16, fontWeight: 900, cursor: (processing || !canPay) ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .2s" }}
                >
                  {processing ? (
                    <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Wird verarbeitet...</>
                  ) : (
                    <><Lock size={16} /> Jetzt kaufen · {F(orderTotal)}</>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Order summary */}
        <div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1.5px solid #edf1f2", position: "sticky", top: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Bestellübersicht</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 60, height: 60, flexShrink: 0, background: "#f8f9fa", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                    {item.image
                      ? <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <ShoppingBag size={20} style={{ color: "#d1d5db" }} />
                    }
                    <span style={{ position: "absolute", top: -5, right: -5, background: "#4ec3e0", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</div>
                    {item.variant && <div style={{ fontSize: 11, color: "#6b7280" }}>{item.variant}</div>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{F(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #edf1f2", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "#6b7280" }}>
                <span>Zwischensumme</span><span>{F(total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13, color: "#6b7280" }}>
                <span>Versand</span>
                <span style={{ color: shippingCost === 0 ? "#16a34a" : "inherit" }}>
                  {shippingCost === 0 ? "Kostenlos" : F(shippingCost)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, borderTop: "1.5px solid #232323", paddingTop: 16 }}>
                <span>Gesamt</span><span>{F(orderTotal)}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>inkl. MwSt.</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width:860px) { .checkout-grid { grid-template-columns: 1fr 380px !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
