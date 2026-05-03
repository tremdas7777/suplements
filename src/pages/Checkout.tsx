import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, ShoppingBag, Check, CreditCard } from "lucide-react";
import { useCart } from "../context/CartContext";
import HeaderESN from "../components/HeaderESN";

type Step = "info" | "shipping" | "payment" | "done";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

const EMPTY_FORM: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", zip: "", city: "", country: "Deutschland",
  cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
};

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard-Versand", sub: "2–4 Werktage", price: 4.95 },
  { id: "express", label: "Express-Versand", sub: "1–2 Werktage", price: 9.95 },
  { id: "free", label: "Kostenloser Versand", sub: "3–5 Werktage (ab €50)", price: 0, minOrder: 50 },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "14px 16px",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 14, outline: "none",
  fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

function Input({ label, name, value, onChange, type = "text", placeholder = "" }: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", color: "#374151" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(name, e.target.value)}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = "#232323")}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [shipping, setShipping] = useState("standard");
  const [processing, setProcessing] = useState(false);

  const update = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping) ?? SHIPPING_OPTIONS[0];
  const shippingCost = selectedShipping.price;
  const orderTotal = total + shippingCost;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    clearCart();
    setStep("done");
    setProcessing(false);
  };

  if (items.length === 0 && step !== "done") {
    return (
      <div style={{ minHeight: "100vh", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
        <HeaderESN />
        <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <ShoppingBag size={56} style={{ color: "#d1d5db", margin: "0 auto 20px", display: "block" }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Dein Warenkorb ist leer</h2>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>Füge Produkte hinzu, bevor du zur Kasse gehst.</p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "14px 32px", background: "#4ec3e0", color: "#fff",
              border: "none", borderRadius: 50, fontWeight: 800,
              fontSize: 15, cursor: "pointer",
            }}
          >
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
        <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{
            width: 80, height: 80, background: "#16a34a", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
          }}>
            <Check size={36} color="#fff" strokeWidth={3} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 12 }}>Bestellung erfolgreich! 🎉</h1>
          <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
            Vielen Dank, <strong>{form.firstName || "Kunde"}</strong>! Deine Bestellung wurde erfolgreich aufgegeben.
          </p>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>
            Du erhältst in Kürze eine Bestätigungs-E-Mail an <strong>{form.email || "deine E-Mail"}</strong>.
          </p>
          <div style={{
            background: "#f8f9fa", borderRadius: 16, padding: 24,
            border: "1.5px solid #edf1f2", marginBottom: 32, textAlign: "left",
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Bestellübersicht</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
              <span>Produkte</span><span>€{total.toFixed(2).replace(".", ",")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280", marginBottom: 12 }}>
              <span>Versand</span><span>{shippingCost === 0 ? "Kostenlos" : `€${shippingCost.toFixed(2).replace(".", ",")}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, borderTop: "1px solid #edf1f2", paddingTop: 12 }}>
              <span>Gesamt</span><span>€{orderTotal.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "16px 40px", background: "#4ec3e0", color: "#fff",
              border: "none", borderRadius: 50, fontWeight: 800,
              fontSize: 15, cursor: "pointer", width: "100%",
            }}
          >
            Weiter einkaufen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif", color: "#232323" }}>
      <HeaderESN />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px", display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="checkout-grid">

        {/* ── LEFT: Steps ── */}
        <div>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, background: "#fff", borderRadius: 16, padding: "16px 20px", border: "1.5px solid #edf1f2" }}>
            {(["info", "shipping", "payment"] as Step[]).map((s, i) => {
              const labels = ["Kontaktdaten", "Versand", "Zahlung"];
              const isDone = (step === "shipping" && i < 1) || (step === "payment" && i < 2) || step === "done";
              const isActive = step === s;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isDone ? "#16a34a" : isActive ? "#232323" : "#e5e7eb",
                      color: isDone || isActive ? "#fff" : "#6b7280",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, transition: "all 0.3s",
                    }}>
                      {isDone ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? "#232323" : "#6b7280", whiteSpace: "nowrap" }}>{labels[i]}</span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: isDone ? "#16a34a" : "#e5e7eb", margin: "0 8px", marginBottom: 20, transition: "all 0.3s" }} />}
                </div>
              );
            })}
          </div>

          {/* Step content */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1.5px solid #edf1f2" }}>
            {step === "info" && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Kontaktinformationen</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <Input label="Vorname" name="firstName" value={form.firstName} onChange={update} />
                  <Input label="Nachname" name="lastName" value={form.lastName} onChange={update} />
                </div>
                <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
                  <Input label="E-Mail" name="email" value={form.email} onChange={update} type="email" placeholder="deine@email.de" />
                  <Input label="Telefon (optional)" name="phone" value={form.phone} onChange={update} type="tel" placeholder="+49 ..." />
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  <Input label="Straße und Hausnummer" name="address" value={form.address} onChange={update} placeholder="Musterstraße 1" />
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16 }}>
                    <Input label="PLZ" name="zip" value={form.zip} onChange={update} placeholder="12345" />
                    <Input label="Stadt" name="city" value={form.city} onChange={update} placeholder="Berlin" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px", color: "#374151" }}>Land</label>
                    <select
                      value={form.country}
                      onChange={e => update("country", e.target.value)}
                      style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}
                    >
                      {["Deutschland", "Österreich", "Schweiz", "Niederlande", "Belgien", "Frankreich", "Spanien", "Italien"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep("shipping")}
                  disabled={!form.firstName || !form.email || !form.address || !form.zip || !form.city}
                  style={{
                    width: "100%", marginTop: 28, padding: "16px",
                    background: (!form.firstName || !form.email || !form.address) ? "#d1d5db" : "#4ec3e0",
                    color: "#fff", border: "none", borderRadius: 50,
                    fontSize: 15, fontWeight: 900, cursor: (!form.firstName || !form.email) ? "not-allowed" : "pointer",
                    textTransform: "uppercase", letterSpacing: 1,
                  }}
                >
                  Weiter zur Lieferung
                </button>
              </>
            )}

            {step === "shipping" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <button onClick={() => setStep("info")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
                    <ChevronLeft size={20} />
                  </button>
                  <h2 style={{ fontSize: 18, fontWeight: 900 }}>Versandmethode</h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {SHIPPING_OPTIONS.filter(o => !o.minOrder || total >= o.minOrder).map(opt => (
                    <label
                      key={opt.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "16px 20px", borderRadius: 12, cursor: "pointer",
                        border: `1.5px solid ${shipping === opt.id ? "#232323" : "#e5e7eb"}`,
                        background: shipping === opt.id ? "#f8f9fa" : "#fff",
                        transition: "all 0.15s",
                      }}
                    >
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} style={{ accentColor: "#232323" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{opt.sub}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>
                        {opt.price === 0 ? <span style={{ color: "#16a34a" }}>Kostenlos</span> : `€${opt.price.toFixed(2).replace(".", ",")}`}
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => setStep("payment")}
                  style={{
                    width: "100%", padding: "16px",
                    background: "#4ec3e0", color: "#fff",
                    border: "none", borderRadius: 50,
                    fontSize: 15, fontWeight: 900, cursor: "pointer",
                    textTransform: "uppercase", letterSpacing: 1,
                  }}
                >
                  Weiter zur Zahlung
                </button>
              </>
            )}

            {step === "payment" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <button onClick={() => setStep("shipping")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
                    <ChevronLeft size={20} />
                  </button>
                  <h2 style={{ fontSize: 18, fontWeight: 900 }}>Zahlungsmethode</h2>
                </div>

                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                  <Lock size={16} style={{ color: "#16a34a", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>Sichere SSL-Verschlüsselung · Deine Daten sind geschützt</span>
                </div>

                {/* Credit card form */}
                <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                  <CreditCard size={20} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Kreditkarte / Debitkarte</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                    {["VISA", "MC", "AMEX"].map(b => (
                      <span key={b} style={{ fontSize: 10, fontWeight: 800, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2px 6px", color: "#374151" }}>{b}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                  <Input label="Karteninhaber" name="cardName" value={form.cardName} onChange={update} placeholder="Max Mustermann" />
                  <Input label="Kartennummer" name="cardNumber" value={form.cardNumber} onChange={update} placeholder="1234 5678 9012 3456" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Input label="Ablaufdatum" name="cardExpiry" value={form.cardExpiry} onChange={update} placeholder="MM/JJ" />
                    <Input label="CVV" name="cardCvv" value={form.cardCvv} onChange={update} placeholder="123" />
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing || !form.cardNumber || !form.cardName || !form.cardExpiry || !form.cardCvv}
                  style={{
                    width: "100%", padding: "18px",
                    background: (processing || !form.cardNumber) ? "#d1d5db" : "#b70832",
                    color: "#fff", border: "none", borderRadius: 50,
                    fontSize: 16, fontWeight: 900, cursor: (processing || !form.cardNumber) ? "not-allowed" : "pointer",
                    textTransform: "uppercase", letterSpacing: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.2s",
                  }}
                >
                  {processing ? (
                    <>
                      <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Wird verarbeitet...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Jetzt kaufen · €{orderTotal.toFixed(2).replace(".", ",")}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Order summary ── */}
        <div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1.5px solid #edf1f2", position: "sticky", top: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Bestellübersicht</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 56, height: 56, flexShrink: 0,
                    background: "#f8f9fa", borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                    position: "relative",
                  }}>
                    {item.image
                      ? <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <ShoppingBag size={20} style={{ color: "#d1d5db" }} />
                    }
                    <span style={{
                      position: "absolute", top: -6, right: -6,
                      background: "#4ec3e0", color: "#fff",
                      fontSize: 10, fontWeight: 800, width: 18, height: 18,
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</div>
                    {item.variant && <div style={{ fontSize: 11, color: "#6b7280" }}>{item.variant}</div>}
                    {item.isCombo && <div style={{ fontSize: 11, color: "#4ec3e0", fontWeight: 600 }}>Bundle konfiguriert</div>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, flexShrink: 0 }}>€{(item.price * item.quantity).toFixed(2).replace(".", ",")}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #edf1f2", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "#6b7280" }}>
                <span>Zwischensumme</span>
                <span>€{total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 13, color: "#6b7280" }}>
                <span>Versand</span>
                <span style={{ color: shippingCost === 0 ? "#16a34a" : "inherit" }}>
                  {shippingCost === 0 ? "Kostenlos" : `€${shippingCost.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, borderTop: "1.5px solid #232323", paddingTop: 16 }}>
                <span>Gesamt</span>
                <span>€{orderTotal.toFixed(2).replace(".", ",")}</span>
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>inkl. MwSt.</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .checkout-grid {
            grid-template-columns: 1fr 380px !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
