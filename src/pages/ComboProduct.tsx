import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Check, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import { useCart } from "../context/CartContext";

// ── Real product images from ESN CDN ──────────────────────────────────────
const COMBO_ITEMS = [
  {
    key: "designer_whey",
    name: "Designer Whey Protein",
    subtitle: "908g",
    slug: "esn-designer-whey-protein",
    image: "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_AlmondCoconutFlavor_2024x2024_shop-iCbreuNy_c640bbf7-d33b-4e04-9670-3ab420c5176d.jpg?width=800",
    flavors: [
      "Chocolate Fudge", "Vanilla Milk", "Strawberry Cream", "Banana",
      "Cookies & Cream", "Cinnamon Roll", "Hazelnut Nougat", "Almond Coconut",
      "Caramel", "Neutral",
    ],
  },
  {
    key: "isoclear",
    name: "Isoclear Whey Isolate",
    subtitle: "908g",
    slug: "esn-isoclear-whey-isolate",
    image: "https://www.esn.com/cdn/shop/files/PDP_Flavor_IC_Royal_Candy_908g-G78RgZbq.jpg?width=800",
    flavors: [
      "Green Apple", "Peach Iced Tea", "Lemon Iced Tea", "Tropical Punch",
      "Rainbow Candy", "Cherry Lemonade", "Royal Candy", "Watermelon",
    ],
  },
  {
    key: "crank",
    name: "ESN Crank Pre-Workout",
    subtitle: "380g",
    slug: "esn-crank",
    image: "https://www.esn.com/cdn/shop/files/CrankPump_380g_BlackberryFlavor_dunkel-2SHtR4Vf.jpg?width=800",
    flavors: [
      "Mango Maui", "Sour Apple", "Cola", "Blue Raspberry",
      "Tropical", "Blackberry", "Lemon Lime",
    ],
  },
  {
    key: "creatine",
    name: "Ultrapure Creatine",
    subtitle: "500g",
    slug: "esn-ultrapure-creatine-monohydrate",
    image: "https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_Front-JjTmKxEV.jpg?width=800",
    flavors: ["Neutral", "Fresh Cherry", "Green Apple", "Lemon"],
  },
  {
    key: "eaa",
    name: "ESN EAA",
    subtitle: "500g",
    slug: "esn-eaa-500g",
    image: "https://www.esn.com/cdn/shop/files/EAA__400g_LemonIcedTeaFlavor-pcMoiw3q.png?width=800",
    flavors: ["Iced Tea Peach", "Lemon Iced Tea", "Tropical", "Watermelon"],
  },
  {
    key: "vitamin_stack",
    name: "Vitamin Stack",
    subtitle: "120 Kaps.",
    slug: "esn-vitamin-stack-120-kaps",
    image: "https://www.esn.com/cdn/shop/files/VitaminStack_120Caps_dunkel-iVk2cLKB.jpg?width=800",
    flavors: ["Standard"],
  },
  {
    key: "omega3",
    name: "Omega-3 Kapseln",
    subtitle: "300 Kaps.",
    slug: "esn-omega-3",
    image: "https://www.esn.com/cdn/shop/files/Omega3_300Caps_dunkel-toQc9pOa.jpg?width=800",
    flavors: ["Standard"],
  },
];

const GALLERY_IMAGES = COMBO_ITEMS.map(i => ({ src: i.image, label: i.name }));
const COMBO_PRICE = 69.0;
const ORIGINAL_PRICE = 129.9;

// ── Flavor Selector (identical look to ESN product pages) ─────────────────
function FlavorSelector({
  item,
  selected,
  onSelect,
}: {
  item: typeof COMBO_ITEMS[0];
  selected: string;
  onSelect: (flavor: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (item.flavors.length === 1) {
    return (
      <div style={{
        border: "1px solid #e5e7eb", borderRadius: 12,
        padding: "14px 18px", background: "#f8f9fa",
        fontSize: 14, color: "#6b7280", fontWeight: 500,
      }}>
        {item.flavors[0]}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", border: "1.5px solid #e5e7eb", borderRadius: 12,
          background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
          transition: "border-color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#232323")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = open ? "#232323" : "#e5e7eb")}
      >
        <span>{selected}</span>
        <ChevronDown size={16} style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)", zIndex: 50,
          overflow: "hidden",
        }}>
          {item.flavors.map(flavor => (
            <button
              key={flavor}
              onClick={() => { onSelect(flavor); setOpen(false); }}
              style={{
                width: "100%", padding: "12px 18px",
                background: flavor === selected ? "#f8f9fa" : "#fff",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: 14, fontWeight: flavor === selected ? 700 : 500,
                borderBottom: "1px solid #f3f4f6",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => { if (flavor !== selected) e.currentTarget.style.background = "#f8f9fa"; }}
              onMouseLeave={e => { if (flavor !== selected) e.currentTarget.style.background = "#fff"; }}
            >
              <span>{flavor}</span>
              {flavor === selected && <Check size={14} strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ComboProduct() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    COMBO_ITEMS.forEach(i => { init[i.key] = i.flavors[0]; });
    return init;
  });

  const handleSelect = useCallback((key: string, flavor: string) => {
    setSelections(prev => ({ ...prev, [key]: flavor }));
    const idx = COMBO_ITEMS.findIndex(i => i.key === key);
    if (idx >= 0) setGalleryIdx(idx);
  }, []);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: "esn-elite-leistung-combo",
      title: "ESN Elite Leistung Combo",
      price: COMBO_PRICE,
      quantity: 1,
      image: GALLERY_IMAGES[0].src,
      isCombo: true,
      comboSelections: { ...selections },
    });
  }, [selections, addItem]);

  return (
    <div style={{
      minHeight: "100vh", background: "#fff",
      fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif",
      color: "#232323",
    }}>
      {/* Announcement bar — same as store pages */}
      <div style={{
        background: "#b70832", color: "#fff",
        padding: "10px 16px", textAlign: "center",
        fontSize: 12, fontWeight: 700, letterSpacing: "0.5px",
      }}>
        AKTION · SPARE ÜBER 40% MIT DEM ELITE LEISTUNG COMBO
      </div>

      <HeaderESN />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 80px" }}>
        {/* Breadcrumbs */}
        <nav style={{ padding: "16px 0", fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#232323" }}>Home</span>
          <span>/</span>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Produkte</span>
          <span>/</span>
          <span style={{ color: "#232323", fontWeight: 600 }}>ESN Elite Leistung Combo</span>
        </nav>

        {/* ── Main product grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 48,
        }} className="esn-product-grid">

          {/* LEFT: Gallery */}
          <div style={{ position: "sticky", top: 90, alignSelf: "start" }}>
            {/* Thumbnails vertical (desktop) / horizontal (mobile) */}
            <div style={{ display: "flex", gap: 12, flexDirection: "row", flexWrap: "wrap" }} className="esn-gallery-wrap">
              {/* Thumbs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }} className="esn-thumbs">
                {GALLERY_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    title={img.label}
                    style={{
                      width: 60, height: 60, flexShrink: 0,
                      border: i === galleryIdx ? "2px solid #232323" : "1.5px solid #e5e7eb",
                      borderRadius: 10, background: "#f8f9fa",
                      cursor: "pointer", overflow: "hidden", padding: 4,
                      transition: "all 0.15s",
                    }}
                  >
                    <img src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div style={{
                flex: 1, minWidth: 280,
                background: "#f8f9fa", borderRadius: 20,
                overflow: "hidden", position: "relative",
                aspectRatio: "1/1",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img
                  src={GALLERY_IMAGES[galleryIdx].src}
                  alt="ESN Elite Leistung Combo"
                  style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain", transition: "opacity 0.2s" }}
                  key={galleryIdx}
                />

                {/* Sale badge */}
                <div style={{
                  position: "absolute", top: 16, left: 16,
                  background: "#b70832", color: "#fff",
                  padding: "6px 14px", borderRadius: 8,
                  fontSize: 12, fontWeight: 900, letterSpacing: "0.5px",
                }}>
                  −{Math.round((1 - COMBO_PRICE / ORIGINAL_PRICE) * 100)}%
                </div>

                {/* Arrows */}
                <button onClick={() => setGalleryIdx(p => (p > 0 ? p - 1 : GALLERY_IMAGES.length - 1))}
                  style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setGalleryIdx(p => (p < GALLERY_IMAGES.length - 1 ? p + 1 : 0))}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Info */}
          <div>
            {/* Title */}
            <h1 style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.15, marginBottom: 8 }}>
              ESN Elite Leistung Combo
            </h1>

            {/* Badge + reviews */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ background: "#000", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4, letterSpacing: "0.5px" }}>
                BUNDLE
              </span>
              <span style={{ color: "#f59e0b", fontSize: 16 }}>★★★★★</span>
              <span style={{ fontSize: 13, color: "#6b7280" }}>4.9 (2.847 Bewertungen)</span>
            </div>

            {/* USP bullets */}
            <div style={{ marginBottom: 20 }}>
              {[
                "✓ 7 Premium-Produkte in einem Bundle",
                "✓ Über 40% Ersparnis gegenüber Einzelkauf",
                "✓ Laborgeprüfte Qualität · Made in Germany",
              ].map(t => (
                <div key={t} style={{ fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: 500 }}>{t}</div>
              ))}
            </div>

            {/* Price */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid #edf1f2" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#b70832" }}>
                  €{COMBO_PRICE.toFixed(2).replace(".", ",")}
                </span>
                <span style={{ textDecoration: "line-through", color: "#9ca3af", fontSize: 18 }}>
                  €{ORIGINAL_PRICE.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>inkl. MwSt. zzgl. Versand</div>
            </div>

            {/* ── Flavor Selectors — same style as ESN product pages ── */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>
                Konfiguriere dein Bundle
              </h3>

              {COMBO_ITEMS.map(item => (
                <div key={item.key} style={{ marginBottom: 20 }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 8,
                  }}>
                    <label style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3px" }}>
                      {item.name}
                      <span style={{ color: "#6b7280", fontWeight: 500, marginLeft: 6, textTransform: "none" }}>
                        {item.subtitle}
                      </span>
                    </label>
                    {selections[item.key] && item.flavors.length > 1 && (
                      <span style={{ fontSize: 12, color: "#6b7280" }}>{selections[item.key]}</span>
                    )}
                  </div>
                  <FlavorSelector
                    item={item}
                    selected={selections[item.key]}
                    onSelect={flavor => handleSelect(item.key, flavor)}
                  />
                </div>
              ))}
            </div>

            {/* Add to cart */}
            <button
              id="combo-add-to-cart"
              onClick={handleAddToCart}
              style={{
                width: "100%", padding: "18px 24px",
                background: "#4ec3e0", color: "#fff",
                border: "none", borderRadius: 50,
                fontSize: 16, fontWeight: 900,
                cursor: "pointer", textTransform: "uppercase",
                letterSpacing: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                boxShadow: "0 6px 24px rgba(78,195,224,0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#35b5d8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#4ec3e0"; e.currentTarget.style.transform = "none"; }}
            >
              <ShoppingBag size={20} />
              In den Warenkorb · €{COMBO_PRICE.toFixed(2).replace(".", ",")}
            </button>

            {/* Trust signals */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, fontSize: 12, color: "#6b7280", flexWrap: "wrap" }}>
              <span>✓ Kostenloser Versand ab €50</span>
              <span>✓ 30 Tage Rückgabe</span>
              <span>✓ Lieferzeit 2-4 Werktage</span>
            </div>
          </div>
        </div>

        {/* ── What's inside section ── */}
        <section style={{ marginTop: 80, paddingTop: 60, borderTop: "1px solid #edf1f2" }}>
          <h2 style={{
            fontSize: 22, fontWeight: 900, textTransform: "uppercase",
            textAlign: "center", marginBottom: 40, letterSpacing: "0.5px",
          }}>
            Was im Bundle enthalten ist
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 16,
          }}>
            {COMBO_ITEMS.map(item => (
              <div
                key={item.key}
                onClick={() => navigate(`/products/${item.slug}`)}
                style={{
                  background: "#fff", borderRadius: 16,
                  padding: 20, textAlign: "center",
                  border: "1.5px solid #edf1f2",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#232323"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#edf1f2"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ width: 80, height: 80, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={item.image} alt={item.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{item.subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Description ── */}
        <section style={{ maxWidth: 800, margin: "80px auto 0", paddingTop: 60, borderTop: "1px solid #edf1f2" }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: "uppercase", marginBottom: 20 }}>
            Maximale Leistung im Bundle
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#4b5563", marginBottom: 32 }}>
            Das <strong>ESN Elite Leistung Combo</strong> ist das ultimative Paket für Athleten, die keine Kompromisse eingehen.
            Alle 7 Produkte sind laborgeprüft, made in Germany und aufeinander abgestimmt —
            für optimale Leistung vor, während und nach dem Training.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { title: "Pre-Workout & Fokus", text: "ESN Crank + Ultrapure Creatine für maximale Energie und Kraft im Training." },
              { title: "Muskelaufbau & Recovery", text: "Designer Whey + Isoclear + EAA für optimale Proteinversorgung und schnelle Regeneration." },
              { title: "Mikronährstoffe", text: "Vitamin Stack + Omega-3 decken den erhöhten Bedarf aktiver Sportler." },
              { title: "Flexible Konfiguration", text: "Wähle für jedes Produkt deinen Lieblingsgeschmack — ganz individuell." },
            ].map(({ title, text }) => (
              <div key={title}>
                <h4 style={{ fontWeight: 800, textTransform: "uppercase", fontSize: 13, marginBottom: 8 }}>{title}</h4>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FooterESN />

      <style>{`
        @media (min-width: 900px) {
          .esn-product-grid {
            grid-template-columns: 1.1fr 1fr !important;
          }
          .esn-thumbs {
            flex-direction: column !important;
          }
        }
        @media (max-width: 899px) {
          .esn-thumbs {
            flex-direction: row !important;
            overflow-x: auto;
            max-width: 100%;
          }
          .esn-gallery-wrap {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
