import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, ShoppingBag, CreditCard, MapPin, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import FooterESN from "../components/FooterESN";
import HeaderESN from "../components/HeaderESN";

type Step = "info" | "shipping" | "payment";

interface FormData {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; zip: string; city: string; country: string;
}

const EMPTY: FormData = {
  firstName: "", lastName: "", email: "", phone: "",
  address: "", zip: "", city: "", country: "Deutschland",
};

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard-Versand", sub: "2–4 Werktage", price: 4.95 },
  { id: "express",  label: "Express-Versand",  sub: "1–2 Werktage", price: 9.95 },
  { id: "free",     label: "Kostenloser Versand", sub: "3–5 Werktage", price: 0, minOrder: 75 },
];

const GERMAN_EMAIL_DOMAINS = [
  "gmail.com", "web.de", "gmx.de", "t-online.de", "outlook.de",
  "yahoo.de", "mail.de", "freenet.de", "gmx.net", "hotmail.de",
  "icloud.com", "arcor.de", "posteo.de", "protonmail.com",
];

const inp: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  fontSize: 14, outline: "none",
  fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif",
  boxSizing: "border-box", background: "#fff",
};

function applyZipMask(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.slice(0, 5);
}

function applyPhoneMask(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) {
    return "+" + cleaned.slice(1).replace(/\D/g, "").slice(0, 14);
  }
  return cleaned.slice(0, 15);
}

function ZipField({ label, name, value, onChange }: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyZipMask(e.target.value);
    onChange(name, masked);
    setError("");

    if (masked.length === 5) {
      setLoading(true);
      fetch(`https://api.zippopotam.de/de/${masked}`)
        .then(res => {
          if (!res.ok) throw new Error("invalid");
          return res.json();
        })
        .then(data => {
          if (data.places && data.places.length > 0) {
            const city = data.places[0]["place name"];
            if (city) {
              onChange("city", city);
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Ungültige PLZ in Deutschland");
          setLoading(false);
        });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="text" inputMode="numeric" value={value} placeholder="12345"
          onChange={handleChange} maxLength={5}
          style={{ ...inp, paddingRight: loading ? 40 : 16, borderColor: error ? "#ef4444" : undefined }}
          onFocus={e => (e.target.style.borderColor = error ? "#ef4444" : "#232323")}
          onBlur={e => (e.target.style.borderColor = error ? "#ef4444" : "#e5e7eb")}
        />
        {loading && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
        {!loading && value.length === 5 && !error && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            <MapPin size={14} style={{ color: "#22c55e" }} />
          </div>
        )}
      </div>
      {error && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

function PhoneField({ label, name, value, onChange }: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, applyPhoneMask(e.target.value));
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151" }}>{label}</label>
      <input
        type="tel" value={value} placeholder="+49 123 4567890"
        onChange={handleChange}
        style={inp}
        onFocus={e => (e.target.style.borderColor = "#232323")}
        onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
      />
    </div>
  );
}

function EmailField({ label, name, value, onChange }: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const atIdx = value.indexOf("@");
  const localPart = atIdx >= 0 ? value.slice(0, atIdx) : value;
  const hasAt = atIdx >= 0;
  const hasDot = value.includes(".");

  const suggestions = (() => {
    if (!value || (hasAt && hasDot && localPart.length < 1)) return [];
    if (hasAt) {
      const domainInput = value.slice(atIdx + 1);
      if (!domainInput) {
        return GERMAN_EMAIL_DOMAINS.map(d => `${localPart}@${d}`);
      }
      return GERMAN_EMAIL_DOMAINS
        .filter(d => d.startsWith(domainInput))
        .map(d => `${localPart}@${d}`);
    }
    return GERMAN_EMAIL_DOMAINS.map(d => `${value}@${d}`);
  })().slice(0, 6);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    if (showSuggestions) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSuggestions]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }} ref={ref}>
      <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="email" value={value} placeholder="deine@email.de"
          onChange={e => { onChange(name, e.target.value); setShowSuggestions(true); }}
          onFocus={() => { if (value.length > 0) setShowSuggestions(true); }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
          style={{ ...inp, paddingRight: 40 }}
        />
        {value.includes("@") && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 50,
            overflow: "hidden",
          }}>
            {suggestions.map(s => (
              <button
                key={s}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onChange(name, s); setShowSuggestions(false); }}
                style={{
                  display: "block", width: "100%", padding: "10px 16px", background: "none",
                  border: "none", borderBottom: "1px solid #f3f4f6", textAlign: "left",
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit", color: "#232323",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8f9fa")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const [error, setError] = useState("");

  const up = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }));

  const selectedShipping = SHIPPING_OPTIONS.find(o => o.id === shipping)!;
  const shippingCost = selectedShipping.price;
  const orderTotal = Math.round((total + shippingCost) * 100) / 100;

  const canInfo = !!(form.firstName && form.email && form.address && form.zip && form.city);

  const handleStripeCheckout = useCallback(async () => {
    setProcessing(true);
    setError("");

    try {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_ids: items.map(i => i.id),
          content_type: 'product',
          value: orderTotal,
          currency: 'EUR',
        });
      }

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'begin_checkout', {
          currency: 'EUR',
          value: orderTotal,
          items: items.map(i => ({
            item_id: i.id,
            item_name: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
        });
      }

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            variant: i.variant || '',
          })),
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          shippingCost,
          shippingMethod: selectedShipping.label,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erro ao criar sessão de pagamento" }));
        throw new Error(err.error);
      }

      const { url } = await res.json();

      saveOrder({
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

      clearCart();

      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento");
      setProcessing(false);
    }
  }, [items, form, shippingCost, orderTotal, selectedShipping, total, clearCart, saveOrder]);

  if (items.length === 0) {
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
        <FooterESN />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif", color: "#232323" }}>
      <HeaderESN />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 80px", display: "grid", gridTemplateColumns: "1fr", gap: 32 }} className="checkout-grid">

        <div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 24px", border: "1.5px solid #edf1f2", marginBottom: 24, display: "flex", alignItems: "center" }}>
            {(["info", "shipping", "payment"] as Step[]).map((s, i) => {
              const done = ["info", "shipping", "payment"].indexOf(step) > i;
              const active = step === s;
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: done ? "#16a34a" : active ? "#232323" : "#e5e7eb", color: done || active ? "#fff" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, transition: "all .3s" }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#232323" : "#9ca3af", whiteSpace: "nowrap" }}>
                      {["Kontaktdaten", "Versand", "Zahlung"][i]}
                    </span>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: done ? "#16a34a" : "#e5e7eb", margin: "0 6px", marginBottom: 18, transition: "all .3s" }} />}
                </div>
              );
            })}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1.5px solid #edf1f2" }}>

            {step === "info" && (
              <>
                <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Kontaktinformationen</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <Field label="Vorname *" name="firstName" value={form.firstName} onChange={up} />
                  <Field label="Nachname" name="lastName" value={form.lastName} onChange={up} />
                </div>
                <div style={{ display: "grid", gap: 14, position: "relative" }}>
                  <EmailField label="E-Mail *" name="email" value={form.email} onChange={up} />
                  <PhoneField label="Telefon (optional)" name="phone" value={form.phone} onChange={up} />
                  <Field label="Straße & Hausnummer *" name="address" value={form.address} onChange={up} placeholder="Musterstraße 1" />
                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 14 }}>
                    <ZipField label="PLZ *" name="zip" value={form.zip} onChange={up} />
                    <Field label="Stadt *" name="city" value={form.city} onChange={up} placeholder="Berlin" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px", color: "#374151" }}>Land</label>
                    <select value={form.country} onChange={e => up("country", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                      {["Deutschland","Österreich","Schweiz","Niederlande","Belgien","Frankreich","Spanien","Italien"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button disabled={!canInfo} onClick={() => setStep("shipping")}
                  style={{ width: "100%", marginTop: 28, padding: "16px", background: canInfo ? "#4ec3e0" : "#d1d5db", color: "#fff", border: "none", borderRadius: 50, fontSize: 15, fontWeight: 900, cursor: canInfo ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 1 }}
                >Weiter zur Lieferung</button>
              </>
            )}

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

            {step === "payment" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                  <button onClick={() => setStep("shipping")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}><ChevronLeft size={20} /></button>
                  <h2 style={{ fontSize: 18, fontWeight: 900 }}>Zahlungsmethode</h2>
                </div>

                <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
                  <Lock size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>256-bit SSL-Verschlüsselung · Sichere Zahlung via Stripe Checkout</span>
                </div>

                <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <CreditCard size={20} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Kreditkarte / Debitkarte</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {["VISA","MC","AMEX","Google Pay","Apple Pay"].map(b => (
                      <span key={b} style={{ fontSize: 10, fontWeight: 800, background: "#f8f9fa", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 10px", color: "#374151" }}>{b}</span>
                    ))}
                  </div>
                  <div style={{ background: "#f8f9fa", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>
                    <strong style={{ color: "#232323" }}>So funktioniert es:</strong>
                    <br />
                    Nach dem Klick auf "Jetzt kaufen" wirst du zur sicheren Bezahlung auf <strong>Stripe</strong> weitergeleitet. Dort gibst du deine Kartendaten ein (Nummer, Ablaufdatum, CVV).
                  </div>
                </div>

                {error && (
                  <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#991b1b", fontWeight: 600 }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleStripeCheckout}
                  disabled={processing}
                  style={{ width: "100%", padding: "18px", background: processing ? "#d1d5db" : "#b70832", color: "#fff", border: "none", borderRadius: 50, fontSize: 16, fontWeight: 900, cursor: processing ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .2s" }}
                >
                  {processing ? (
                    <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Weiterleitung zu Stripe...</>
                  ) : (
                    <><Lock size={16} /> Jetzt kaufen · {F(orderTotal)}</>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: 11, color: "#6b7280", marginTop: 12 }}>
                  Du wirst zur sicheren Bezahlung auf Stripe weitergeleitet.
                </p>
              </>
            )}
          </div>
        </div>

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

      <FooterESN />

      <style>{`
        @media (min-width:860px) { .checkout-grid { grid-template-columns: 1fr 380px !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
