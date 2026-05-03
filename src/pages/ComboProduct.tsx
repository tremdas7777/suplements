import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronLeft, ChevronRight, Check } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";

// ── Combo Items Definition ──
const COMBO_ITEMS = [
  {
    key: "designer_whey",
    name: "Designer Whey Protein",
    image: "https://www.esn.com/cdn/shop/files/DesignerWhey_ChocolateFudge_750g_800x.png?v=1713358043",
    flavors: ["Chocolate Fudge", "Vanilla Milk", "Strawberry Cream", "Banana", "Cookies & Cream", "Cinnamon Roll", "Hazelnut Nougat"],
    qty: "908g",
  },
  {
    key: "isoclear_whey",
    name: "Isoclear Whey Isolate",
    image: "https://www.esn.com/cdn/shop/files/Isoclear_GreenApple_600g_800x.png?v=1713358043",
    flavors: ["Green Apple", "Peach Iced Tea", "Lemon Iced Tea", "Tropical Punch", "Rainbow Candy", "Cherry Lemonade"],
    qty: "600g",
  },
  {
    key: "crank",
    name: "Crank Pre-Workout",
    image: "https://www.esn.com/cdn/shop/files/Crank_MangoMaui_380g_800x.png?v=1713358043",
    flavors: ["Mango Maui", "Sour Apple", "Cola", "Blue Raspberry", "Tropical"],
    qty: "380g",
  },
  {
    key: "creatine",
    name: "Ultrapure Creatine",
    image: "https://www.esn.com/cdn/shop/files/Creatine_500g_800x.png?v=1713358043",
    flavors: ["Neutral", "Fresh Cherry", "Green Apple"],
    qty: "500g",
  },
  {
    key: "eaa",
    name: "EAA Aminosäuren",
    image: "https://www.esn.com/cdn/shop/files/EAA_IcedTea_500g_800x.png?v=1713358043",
    flavors: ["Iced Tea Peach", "Lemon Iced Tea", "Tropical"],
    qty: "500g",
  },
  {
    key: "vitamin_stack",
    name: "Vitamin Stack",
    image: "https://www.esn.com/cdn/shop/files/VitaminStack_120Kaps_800x.png?v=1713358043",
    flavors: ["Standard"],
    qty: "120 Kaps.",
  },
  {
    key: "omega3",
    name: "Omega-3 Kapseln",
    image: "https://www.esn.com/cdn/shop/files/Omega3_75Softgels_800x.png?v=1713358043",
    flavors: ["Standard"],
    qty: "75 Softgels",
  },
  {
    key: "shaker",
    name: "ESN Premium Shaker",
    image: "https://www.esn.com/cdn/shop/files/Shaker_Black_800x.png?v=1713358043",
    flavors: ["Black"],
    qty: "1 Stück",
  },
];

const GALLERY_IMAGES = [
  "https://www.esn.com/cdn/shop/files/DesignerWhey_ChocolateFudge_750g_800x.png?v=1713358043",
  "https://www.esn.com/cdn/shop/files/Isoclear_GreenApple_600g_800x.png?v=1713358043",
  "https://www.esn.com/cdn/shop/files/Crank_MangoMaui_380g_800x.png?v=1713358043",
  "https://www.esn.com/cdn/shop/files/Creatine_500g_800x.png?v=1713358043",
];

const COMBO_PRICE = 69.0;

export default function ComboProduct() {
  const navigate = useNavigate();
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    COMBO_ITEMS.forEach((item) => {
      init[item.key] = item.flavors[0];
    });
    return init;
  });

  const handleSelect = useCallback((key: string, flavor: string) => {
    setSelections((prev) => ({ ...prev, [key]: flavor }));
  }, []);

  const handleAddToCart = useCallback(() => {
    const cartItem = {
      id: "esn-elite-leistung-combo",
      title: "ESN Elite Leistung Combo",
      price: COMBO_PRICE,
      quantity: 1,
      image: GALLERY_IMAGES[0],
      isCombo: true,
      comboSelections: { ...selections },
    };

    try {
      const saved = sessionStorage.getItem("cart");
      const cart = saved ? JSON.parse(saved) : [];
      const existing = cart.find((i: any) => i.id === cartItem.id);
      if (existing) {
        existing.quantity += 1;
        existing.comboSelections = cartItem.comboSelections;
      } else {
        cart.push(cartItem);
      }
      sessionStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Cart save error:", e);
    }

    navigate("/");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-cart"));
    }, 300);
  }, [selections, navigate]);

  const allSelected = COMBO_ITEMS.every((item) => selections[item.key]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif",
        color: "#232323",
      }}
    >
      {/* ── Announcement Bar ── */}
      <div
        style={{
          background: "#b70832",
          color: "#fff",
          padding: "8px 16px",
          textAlign: "center",
          fontSize: "11px",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        🔥 ELITE LEISTUNG COMBO – SPARE ÜBER 40% 🔥
      </div>

      <HeaderESN />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* ── Breadcrumbs ── */}
        <div style={{ padding: "20px 0", fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 8 }}>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</span>
          <span>/</span>
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Produkte</span>
          <span>/</span>
          <span style={{ color: "#232323", fontWeight: 700 }}>ESN Elite Leistung Combo</span>
        </div>

        <div className="combo-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, marginBottom: 64 }}>
          {/* ── Image Gallery ── */}
          <div style={{ position: "sticky", top: 120 }}>
            <div
              style={{
                position: "relative",
                background: "#f8f9fa",
                borderRadius: 24,
                overflow: "hidden",
                aspectRatio: "1/1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={GALLERY_IMAGES[galleryIdx]}
                alt="ESN Elite Leistung Combo"
                style={{
                  maxWidth: "85%",
                  maxHeight: "85%",
                  objectFit: "contain",
                }}
              />
              {GALLERY_IMAGES.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIdx((p) => (p > 0 ? p - 1 : GALLERY_IMAGES.length - 1))}
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => setGalleryIdx((p) => (p < GALLERY_IMAGES.length - 1 ? p + 1 : 0))}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: 44,
                      height: 44,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              {/* Sale badge */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  background: "#b70832",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 900,
                  boxShadow: "0 4px 10px rgba(183,8,50,0.3)"
                }}
              >
                SPARE 42%
              </div>
            </div>
            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 12,
                    border: i === galleryIdx ? "2px solid #000" : "1px solid #edf1f2",
                    background: "#f8f9fa",
                    cursor: "pointer",
                    overflow: "hidden",
                    padding: 4,
                    transition: "all 0.2s"
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div>
            <h1
              style={{
                fontSize: 36,
                fontWeight: 900,
                textTransform: "uppercase",
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              ESN Elite Leistung Combo
            </h1>

            {/* Reviews */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ color: "#fbbf24", fontSize: 20 }}>★★★★★</div>
              <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>4.8 (1.247 Bewertungen)</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #edf1f2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "#b70832" }}>
                  €{COMBO_PRICE.toFixed(2).replace(".", ",")}
                </span>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#8d9093",
                    fontSize: 20,
                  }}
                >
                  €119,90
                </span>
              </div>
              <span style={{ fontSize: 13, color: "#6b7280" }}>inkl. MwSt. zzgl. Versand</span>
            </div>

            {/* Trust USPs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                marginBottom: 40,
              }}
            >
              {[
                { icon: "https://www.esn.com/cdn/shop/files/Star_1.svg", text: "Top Qualität" },
                { icon: "https://www.esn.com/cdn/shop/files/TestTube.svg", text: "Laborgeprüft" },
                { icon: "https://www.esn.com/cdn/shop/files/Cherries_1.svg", text: "Bester Geschmack" },
              ].map((usp) => (
                <div
                  key={usp.text}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 8,
                  }}
                >
                  <img src={usp.icon} alt="" style={{ width: 32, height: 32 }} />
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {usp.text}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Flavor Selectors ── */}
            <div style={{ marginBottom: 40 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >
                <div style={{ width: 4, height: 20, background: "#000" }}></div>
                Konfiguriere dein Bundle
              </h3>

              {COMBO_ITEMS.map((item) => (
                <div key={item.key} style={{ marginBottom: 24 }}>
                  <h4
                    style={{
                      marginBottom: 12,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: 14,
                    }}
                  >
                    {item.name}:{" "}
                    <span style={{ color: "#6b7280", fontWeight: 400, marginLeft: 4 }}>
                      {selections[item.key]}
                    </span>
                  </h4>
                  {item.flavors.length > 1 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 10,
                      }}
                    >
                      {item.flavors.map((flavor) => {
                        const isSelected = selections[item.key] === flavor;
                        return (
                          <button
                            key={flavor}
                            onClick={() => handleSelect(item.key, flavor)}
                            style={{
                              padding: "14px 10px",
                              border: isSelected ? "2px solid #000" : "1px solid #edf1f2",
                              borderRadius: 14,
                              background: isSelected ? "#fff" : "#f8f9fa",
                              cursor: "pointer",
                              fontSize: 13,
                              fontWeight: 700,
                              textAlign: "center",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minHeight: 56,
                              boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                              position: "relative",
                            }}
                          >
                            {isSelected && (
                              <Check
                                size={16}
                                style={{ position: "absolute", top: 8, right: 8, color: "#000" }}
                              />
                            )}
                            {flavor}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "14px",
                        border: "1px solid #edf1f2",
                        borderRadius: 14,
                        background: "#f8f9fa",
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: "center",
                        color: "#6b7280"
                      }}
                    >
                      {item.flavors[0]} (Standard)
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Buy Button ── */}
            <div style={{ position: "sticky", bottom: 20, zIndex: 10 }}>
              <button
                id="combo-add-to-cart"
                onClick={handleAddToCart}
                disabled={!allSelected}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  background: allSelected ? "#4ec3e0" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 50,
                  fontSize: 18,
                  fontWeight: 900,
                  cursor: allSelected ? "pointer" : "not-allowed",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: allSelected ? "0 8px 30px rgba(78,195,224,0.4)" : "none",
                }}
              >
                <ShoppingBag size={22} />
                In den Warenkorb • €{COMBO_PRICE.toFixed(2).replace(".", ",")}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                marginTop: 20,
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 500
              }}
            >
              <span>✓ Schneller Versand</span>
              <span>•</span>
              <span>✓ 30 Tage Rückgaberecht</span>
              <span>•</span>
              <span>✓ Premium Support</span>
            </div>
          </div>
        </div>

        {/* ── What's Inside Section ── */}
        <section style={{ marginTop: 80, padding: "60px 0", borderTop: "1px solid #edf1f2" }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 900,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Was im Combo enthalten ist
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 24,
            }}
          >
            {COMBO_ITEMS.map((item) => (
              <div
                key={item.key}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: 24,
                  textAlign: "center",
                  border: "1px solid #edf1f2",
                  transition: "transform 0.2s",
                }}
                className="hover-lift"
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    margin: "0 auto 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6, textTransform: "uppercase" }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{item.qty}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Description ── */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto 80px",
            padding: "60px 0",
            borderTop: "1px solid #edf1f2",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 900,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Maximale Leistung im Bundle
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "#4b5563" }}>
              Das <strong>ESN Elite Leistung Combo</strong> ist die ultimative Lösung für Athleten, die keine Kompromisse eingehen. 
              Wir haben unsere Bestseller in ein unschlagbares Paket gepackt, damit du für jede Phase deines Trainings perfekt versorgt bist.
            </p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div>
              <h4 style={{ fontWeight: 800, textTransform: "uppercase", marginBottom: 12, fontSize: 15 }}>Training & Fokus</h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7280" }}>
                Mit dem Crank Pre-Workout und Ultrapure Creatine startest du mit maximaler Energie und Kraft in dein Workout.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, textTransform: "uppercase", marginBottom: 12, fontSize: 15 }}>Regeneration & Muskelaufbau</h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7280" }}>
                Designer Whey und Isoclear liefern hochwertiges Protein, während EAAs deine Muskeln während und nach dem Training schützen.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, textTransform: "uppercase", marginBottom: 12, fontSize: 15 }}>Health & Vitality</h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7280" }}>
                Vitamin Stack und Omega-3 decken deinen erhöhten Bedarf an Mikronährstoffen als aktiver Sportler ab.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, textTransform: "uppercase", marginBottom: 12, fontSize: 15 }}>Premium Zubehör</h4>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6b7280" }}>
                Der ESN Premium Shaker sorgt für klumpenfreie Shakes und ist dein treuer Begleiter im Gym.
              </p>
            </div>
          </div>
        </section>
      </div>

      <FooterESN />

      <style>{`
        @media (min-width: 1024px) {
          .combo-grid {
            grid-template-columns: 1.2fr 1fr !important;
          }
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
