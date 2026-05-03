import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import { useCart } from "../context/CartContext";

/* ── Product Data ── */
const PRODUCTS: Record<string, {
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number;
  rating: number;
  reviewCount: number;
  portions: number;
  proteinPerServing: string;
  flavors: string[];
  flavorImages: Record<string, string>;
  nutritionRows: { portion: string; protein: string; kcal: string }[];
}> = {
  "esn-isoclear-whey-isolate": {
    title: "Isoclear Whey Protein Isolate",
    subtitle: "908g",
    description: "Das Clear Whey aus Deutschland von ESN. Ohne Fett, Zucker und Laktose. Bis zu 25 g Protein pro Portion. Über 10 leckere Geschmacksrichtungen.",
    price: 54.90,
    compareAtPrice: 64.90,
    rating: 4.8,
    reviewCount: 12453,
    portions: 30,
    proteinPerServing: "25g",
    flavors: [
      "Green Apple", "Peach Iced Tea", "Lemon Iced Tea", "Tropical Punch",
      "Royal Candy", "Cherry Lemonade", "Strawberry Lime",
    ],
    flavorImages: {
      "Green Apple": "https://www.esn.com/cdn/shop/files/IsoClear_908g_GreenAppleFlavor_2024x2024_shop-PTedBm7D_9eafa0fc-ddc0-4a9a-9082-c5a24c2cd810_grande.jpg?v=1750793074",
      "Peach Iced Tea": "https://www.esn.com/cdn/shop/files/IsoClear_908g_PeachIcedTeaFlavor_2024x2024_shop-YaY8xvyE_d0bdad97-4b4a-48e2-b6cd-74880a53648c_grande.jpg?v=1750793075",
      "Lemon Iced Tea": "https://www.esn.com/cdn/shop/files/IsoClear_908g_LemonIcedTeaFlavor_2024x2024_shop-oesb3JOI_12638e5f-8923-47ca-99e3-8dcdb1be0e47_grande.jpg?v=1750793074",
      "Tropical Punch": "https://www.esn.com/cdn/shop/files/IsoClear_908g_TropicalPunchFlavor_2024x2024_shop-h_ENX4yh_58822942-a31d-46a1-aa8d-34151c02182d_grande.jpg?v=1769161832",
      "Royal Candy": "https://www.esn.com/cdn/shop/files/IsoClear_908g_RoyalCandyFlavor_2024x2024_shop-bPcaSXnC_b832db6a-040c-4214-8957-cec62c0f6245_grande.jpg?v=1775741941",
      "Cherry Lemonade": "https://www.esn.com/cdn/shop/files/IsoClear_908g_CherryLemonadeFlavor_2024x2024_shop-_7uaw3Tc_4902cd58-f92f-4bdc-b030-6b903b3d3465_grande.jpg?v=1750793072",
      "Strawberry Lime": "https://www.esn.com/cdn/shop/files/IsoClear_908g_StrawberryLimeFlavor_2024x2024_shop-CNT7rmQH_4371189c-ef25-4061-801e-d5f87defeec9_grande.jpg?v=1750793076",
    },
    nutritionRows: [
      { portion: "30g", protein: "25g", kcal: "106 kcal" },
    ],
  },
  "esn-designer-whey-protein": {
    title: "Designer Whey Protein",
    subtitle: "908g",
    description: "Der Whey-Protein-Bestseller in Deutschland. ESN Designer Whey Proteinpulver für Muskelaufbau, Fitness & Krafttraining. Ideal als Proteinshake rund ums Training.",
    price: 44.90,
    compareAtPrice: 54.90,
    rating: 4.7,
    reviewCount: 28934,
    portions: 27,
    proteinPerServing: "25g",
    flavors: [
      "Chocolate Fudge", "Vanilla Milk", "Strawberry Cream", "Banana",
      "Cookies & Cream", "Cinnamon Roll", "Hazelnut Nougat", "Almond Coconut",
      "Caramel", "Neutral",
    ],
    flavorImages: {
      "Chocolate Fudge": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_MilkChocolateFlavor_2024x2024_shop-rHcG0v3w_609c8915-2161-4548-9969-93857677536b_grande.jpg?v=1744207024",
      "Vanilla Milk": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_VanillaMilkFlavor_2024x2024_shop-6m4UKnvQ_d7f770e0-8cc4-464a-92cf-45c0ec1b4c8f_grande.jpg?v=1770125111",
      "Strawberry Cream": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_StrawberryCreamFlavor_2024x2024_shop-ACyKV-vb_8ba46feb-21f8-4752-89ec-09c7a5e8fce6_grande.jpg?v=1744207029",
      "Banana": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_BananaMilkFlavor_2024x2024_shop-JWA6s_XC_61ae5c68-a385-4524-aba7-fba0aa0a64bc_grande.jpg?v=1744207024",
      "Cookies & Cream": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_DarkCookies_CreamFlavor_2024x2024_shop-Hz8p4pvq_f50ebbb0-b4a5-48a5-8cd0-c65fe58b5503_grande.jpg?v=1744207026",
      "Cinnamon Roll": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_CinnamonCerealFlavor_2024x2024_shop-rDT1jzi2_76e58790-825e-4162-8a90-dab97fe6732d_grande.jpg?v=1744207029",
      "Hazelnut Nougat": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_MilkyHazelnutFlavor_2024x2024_shop-_CrSra0j_a43383b2-de83-4a2c-9c79-bcc60dd5a182_grande.jpg?v=1744207025",
      "Almond Coconut": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_AlmondCoconutFlavor_2024x2024_shop-iCbreuNy_c640bbf7-d33b-4e04-9670-3ab420c5176d_grande.jpg?v=1744207018",
      "Caramel": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_StroopwafelFlavor_2024x2024_shop-6SKtnm6Q_2058ab2f-6a1d-4e75-9294-503618c39aa9_grande.jpg?v=1760971147",
      "Neutral": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_NeutralFlavor_2024x2024_shop-fObg7Bqh_61341654-6b3c-4e34-89b4-e3647a506a6a_grande.jpg?v=1744207027",
    },
    nutritionRows: [
      { portion: "33g", protein: "25g", kcal: "128 kcal" },
    ],
  },
};

function getFlavorImage(flavorImages: Record<string, string>, flavor: string, fallback: string): string {
  return flavorImages[flavor] || fallback;
}

/* ── Dropdown flavor selector ── */
function FlavorDropdown({
  flavorImageMap,
  flavors,
  selected,
  onSelect,
}: {
  flavorImageMap: Record<string, string>;
  flavors: string[];
  selected: string;
  onSelect: (f: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flavor-dropdown" ref={ref}>
      <button
        type="button"
        className="flavor-dropdown__trigger"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flavor-dropdown__trigger-content">
          <img src={flavorImageMap[selected]} alt={selected} className="flavor-dropdown__trigger-img" />
          <span>{selected}</span>
        </span>
        <svg className={`flavor-dropdown__chevron ${open ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="flavor-dropdown__list">
          {flavors.map(f => (
            <button
              key={f}
              type="button"
              className={`flavor-dropdown__option ${f === selected ? "active" : ""}`}
              onClick={() => { onSelect(f); setOpen(false); }}
            >
              <img src={flavorImageMap[f]} alt={f} className="flavor-dropdown__option-img" />
              <span className="flavor-dropdown__option-name">{f}</span>
              {f === selected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Accordion ── */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pdp-accordion-item">
      <button type="button" className="pdp-accordion-btn" onClick={() => setOpen(o => !o)}>
        <span className="pdp-accordion-label">{title}</span>
        <svg viewBox="0 0 24 24" style={{
          width: 20, height: 20, transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "none",
          color: "#757575",
        }}>
          <path d="M2.75 12a1 1 0 011-1h16.5a1 1 0 110 2H3.75a1 1 0 01-1-1Z" fill="currentColor" />
          <path d="M12 2.75a1 1 0 011 1v16.5a1 1 0 11-2 0V3.75a1 1 0 011-1Z" fill="currentColor" />
        </svg>
      </button>
      <div style={{
        maxHeight: open ? "4000px" : "0",
        opacity: open ? 1 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s ease, opacity 0.3s ease",
      }}>
        <div className="pdp-accordion-content">{children}</div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const product = slug ? PRODUCTS[slug] : null;
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedFlavor(product.flavors[0]);
      setGalleryIdx(0);
      setQuantity(1);
    }
  }, [product]);

  const handleSelectFlavor = useCallback((flavor: string) => {
    setSelectedFlavor(flavor);
  }, []);

  const galleryImages = product ? [
    getFlavorImage(product.flavorImages, selectedFlavor, product.flavorImages[product.flavors[0]]),
    ...Object.values(product.flavorImages).slice(0, 5),
  ] : [];

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem({
      id: `${slug}-${selectedFlavor}`,
      title: `${product.title} - ${selectedFlavor}`,
      price: product.price,
      quantity,
      image: product.flavorImages[selectedFlavor],
      flavor: selectedFlavor,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  }, [product, slug, selectedFlavor, quantity, addItem, openCart]);

  if (!product) {
    return (
      <div className="pdp-page">
        <HeaderESN />
        <div className="pdp-not-found">
          <h2>Produkt nicht gefunden</h2>
          <button onClick={() => navigate("/")} className="pdp-back-btn">
            Zurück zur Startseite
          </button>
        </div>
        <FooterESN />
      </div>
    );
  }

  const discountPct = Math.round((1 - product.price / product.compareAtPrice) * 100);
  const pricePerPortion = (product.price / product.portions).toFixed(2).replace(".", ",");

  return (
    <div className="pdp-page">
      <div className="pdp-announcement">
        ESN WEEK · SPARE BIS ZU 47% MIT DEM ELITE LEISTUNGSPAKET
      </div>

      <HeaderESN />

      {/* Breadcrumb */}
      <div className="pdp-wrapper">
        <nav className="pdp-breadcrumb">
          <button onClick={() => navigate("/")}>Home</button>
          <span>/</span>
          <span className="pdp-breadcrumb__current">{product.title}</span>
        </nav>
      </div>

      <section className="pdp-main">
        <div className="pdp-wrapper">
          <div className="pdp-layout">
            {/* Gallery */}
            <div className="pdp-gallery">
              <div className="pdp-gallery__main">
                <div className="pdp-gallery__ratio">
                  <img
                    src={galleryImages[galleryIdx]}
                    alt={`${product.title} - ${selectedFlavor}`}
                    className="pdp-gallery__img"
                  />
                </div>
                {galleryImages.length > 1 && (
                  <>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--prev" onClick={() => setGalleryIdx(p => (p > 0 ? p - 1 : galleryImages.length - 1))}>
                      <ChevronLeft size={20} />
                    </button>
                    <button className="pdp-gallery__arrow pdp-gallery__arrow--next" onClick={() => setGalleryIdx(p => (p < galleryImages.length - 1 ? p + 1 : 0))}>
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="pdp-gallery__thumbs-side">
                {galleryImages.map((img, i) => (
                  <button key={i} className={`pdp-gallery__thumb ${i === galleryIdx ? "is-active" : ""}`} onClick={() => setGalleryIdx(i)}>
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>

              <div className="pdp-gallery__thumbs-mobile">
                {galleryImages.map((img, i) => (
                  <button key={i} className={`pdp-gallery__thumb ${i === galleryIdx ? "is-active" : ""}`} onClick={() => setGalleryIdx(i)}>
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Buy box */}
            <div className="pdp-buybox">
              <h1 className="pdp-title">{product.title}</h1>
              <div className="pdp-subtitle">{product.subtitle}</div>

              {/* Stars */}
              <a href="#pdp-reviews" className="pdp-stars">
                <div className="pdp-stars__row">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="pdp-stars__star" viewBox="0 0 20 20">
                      <path d="m10.002 14.774 4.275 2.629a.656.656 0 0 0 .978-.717l-1.163-4.905 3.805-3.282a.662.662 0 0 0-.374-1.154l-4.993-.406-1.923-4.657a.654.654 0 0 0-1.21 0L7.474 6.94l-4.993.406a.661.661 0 0 0-.375 1.158l3.805 3.282-1.162 4.901a.656.656 0 0 0 .978.717z" fill="#f59e0b" />
                    </svg>
                  ))}
                  <span className="pdp-stars__count">({product.reviewCount.toLocaleString("de-DE")})</span>
                </div>
              </a>

              {/* Price */}
              <div className="pdp-price">
                <span className="pdp-price__current">€{product.price.toFixed(2).replace(".", ",")}</span>
                <span className="pdp-price__original">€{product.compareAtPrice.toFixed(2).replace(".", ",")}</span>
                <span className="pdp-price__badge">-{discountPct}%</span>
                <span className="pdp-price__note">inkl. MwSt. zzgl. Versand.</span>
                <span className="pdp-price__portion">({pricePerPortion}€ / Portion)</span>
              </div>

              {/* Flavor selector */}
              <div className="pdp-option-group">
                <label className="pdp-option__label">Geschmack</label>
                <FlavorDropdown
                  flavorImageMap={product.flavorImages}
                  flavors={product.flavors}
                  selected={selectedFlavor}
                  onSelect={handleSelectFlavor}
                />
              </div>

              {/* Quantity */}
              <div className="pdp-option-group">
                <label className="pdp-option__label">Menge</label>
                <div className="pdp-qty">
                  <button className="pdp-qty__btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="pdp-qty__value">{quantity}</span>
                  <button className="pdp-qty__btn" onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                className={`pdp-atc ${addedToCart ? "pdp-atc--success" : ""}`}
                type="button"
                onClick={handleAddToCart}
              >
                {addedToCart ? "✓ Hinzugefügt" : "In den Warenkorb"}
              </button>

              {/* Delivery */}
              <div className="pdp-delivery">
                <svg className="pdp-delivery__icon" viewBox="0 0 24 17" fill="#1C6C3C">
                  <path d="M15.5 2.5a1 1 0 011-1h3.992a1.75 1.75 0 011.625 1.1l-.928.371.928-.37 1.311 3.278A1 1 0 0122.5 7.25h-6a1 1 0 01-1-1zm2 1v1.75h3.523l-.7-1.75zM.5 8.5a1 1 0 011-1h15a1 1 0 110 2h-15a1 1 0 01-1-1M17.625 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5M14.375 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0M6.375 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5M3.125 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0" />
                  <path d="M7.625 13a1 1 0 011-1h6.75a1 1 0 110 2h-6.75a1 1 0 01-1-1" />
                  <path d="M2.5 2v10h1.625a1 1 0 110 2H2.25A1.75 1.75 0 01.5 12.25V1.75A1.75 1.75 0 012.25 0H16.5a1 1 0 011 1v10.051a1 1 0 11-2 0V2z" />
                </svg>
                <span>Lieferzeit: 5-7 Werktage</span>
              </div>

              {/* USPs */}
              <ul className="pdp-usp-list">
                <li>
                  <svg className="pdp-usp__check" viewBox="0 0 24 24"><path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="currentColor" /></svg>
                  <span>Bis zu {product.proteinPerServing} Protein pro Portion</span>
                </li>
                <li>
                  <svg className="pdp-usp__check" viewBox="0 0 24 24"><path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="currentColor" /></svg>
                  <span>{product.portions} Portionen pro Packung</span>
                </li>
                <li>
                  <svg className="pdp-usp__check" viewBox="0 0 24 24"><path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="currentColor" /></svg>
                  <span>Laborgeprüfte Qualität · Made in Germany</span>
                </li>
              </ul>

              {/* Accordion */}
              <div className="pdp-accordion">
                <AccordionSection title="Beschreibung">
                  <p>{product.description}</p>
                  <h3>Produktdetails</h3>
                  <ul>
                    <li>Gewicht: {product.subtitle}</li>
                    <li>Portionen: {product.portions}</li>
                    <li>Protein pro Portion: {product.proteinPerServing}</li>
                    <li>Geschmacksrichtungen: {product.flavors.join(", ")}</li>
                  </ul>
                </AccordionSection>
                <AccordionSection title="Nährwerte">
                  <table className="pdp-nutrition">
                    <thead>
                      <tr><th>pro Portion</th><th>Energie</th><th>Protein</th></tr>
                    </thead>
                    <tbody>
                      {product.nutritionRows.map((row, i) => (
                        <tr key={i}>
                          <td>{row.portion}</td>
                          <td>{row.kcal}</td>
                          <td>{row.protein}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AccordionSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterESN />

      <style>{`
        .pdp-page {
          min-height: 100vh;
          background: #fff;
          color: #000;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
        }
        .pdp-wrapper {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .pdp-announcement {
          background: #b70832;
          color: #fff;
          padding: 10px 12px;
          text-align: center;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .pdp-breadcrumb {
          padding: 12px 0;
          font-size: 12px;
          color: #757575;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pdp-breadcrumb button {
          background: none;
          border: none;
          color: #757575;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
          padding: 0;
        }
        .pdp-breadcrumb button:hover { color: #000; }
        .pdp-breadcrumb__current { color: #000; font-weight: 600; }

        .pdp-main { padding: 16px 0 48px; }
        .pdp-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .pdp-main { padding: 32px 0 80px; }
          .pdp-layout {
            display: grid;
            grid-template-columns: minmax(0, 58%) minmax(0, 42%);
            gap: 48px;
          }
        }

        /* Gallery */
        .pdp-gallery { position: relative; }
        .pdp-gallery__main {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
          background: #f5f5f5;
        }
        .pdp-gallery__ratio { position: relative; width: 100%; padding-bottom: 100%; }
        .pdp-gallery__img {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: contain;
          display: block;
        }
        .pdp-gallery__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 36px; height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          padding: 0;
        }
        .pdp-gallery__arrow:hover { background: rgba(0, 0, 0, 0.85); }
        .pdp-gallery__arrow--prev { left: 8px; }
        .pdp-gallery__arrow--next { right: 8px; }

        .pdp-gallery__thumbs-side { display: none; }
        .pdp-gallery__thumbs-mobile {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .pdp-gallery__thumbs-mobile::-webkit-scrollbar { display: none; }

        @media (min-width: 1024px) {
          .pdp-gallery {
            display: grid;
            grid-template-columns: 70px 1fr;
            gap: 16px;
            align-items: start;
          }
          .pdp-gallery__main { grid-column: 2; border-radius: 16px; }
          .pdp-gallery__thumbs-side {
            display: flex;
            flex-direction: column;
            gap: 10px;
            grid-column: 1;
            grid-row: 1;
            align-self: start;
            max-height: 500px;
            overflow-y: auto;
          }
          .pdp-gallery__thumbs-mobile { display: none; }
        }

        .pdp-gallery__thumb {
          width: 56px; height: 56px;
          min-width: 56px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.15s;
          padding: 0;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdp-gallery__thumb img { width: 100%; height: 100%; object-fit: contain; }
        .pdp-gallery__thumb.is-active { opacity: 1; border-color: #000; }

        /* Buy box */
        .pdp-buybox { background: #fff; width: 100%; }
        @media (min-width: 1024px) {
          .pdp-buybox { position: sticky; top: 100px; }
        }

        .pdp-title {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 4px;
        }
        .pdp-subtitle { font-size: 13px; color: #757575; margin-bottom: 10px; }
        @media (min-width: 768px) { .pdp-title { font-size: 28px; } }

        .pdp-stars { text-decoration: none; color: inherit; display: inline-block; margin-bottom: 14px; }
        .pdp-stars__row { display: flex; align-items: center; gap: 2px; }
        .pdp-stars__star { width: 14px; height: 14px; }
        .pdp-stars__count { font-size: 12px; color: #757575; margin-left: 6px; }
        @media (min-width: 768px) { .pdp-stars__star { width: 16px; height: 16px; } }

        .pdp-price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 20px;
        }
        .pdp-price__current { font-size: 22px; font-weight: 700; }
        .pdp-price__original { color: #b3b3b3; text-decoration: line-through; font-size: 14px; }
        .pdp-price__badge {
          background: #b70832;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .pdp-price__note { width: 100%; font-size: 11px; color: #757575; }
        .pdp-price__portion { width: 100%; font-size: 11px; color: #757575; }
        @media (min-width: 768px) {
          .pdp-price__current { font-size: 24px; }
          .pdp-price__original { font-size: 16px; }
        }

        .pdp-option-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .pdp-option__label { font-size: 12px; font-weight: 700; }
        @media (min-width: 768px) {
          .pdp-option-group { gap: 8px; margin-bottom: 20px; }
          .pdp-option__label { font-size: 13px; }
        }

        /* Quantity */
        .pdp-qty {
          display: flex;
          align-items: center;
          border: 1.5px solid #dedede;
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
        }
        .pdp-qty__btn {
          width: 40px; height: 40px;
          background: #fff;
          border: none;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-family: inherit;
          transition: background 0.15s;
        }
        .pdp-qty__btn:hover { background: #f5f5f5; }
        .pdp-qty__value {
          width: 48px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          border-left: 1.5px solid #dedede;
          border-right: 1.5px solid #dedede;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ATC */
        .pdp-atc {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 50px;
          background: #4ec3e0;
          color: #000;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(78,195,224,0.3);
          transition: all 0.2s;
          min-height: 52px;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          font-family: inherit;
        }
        .pdp-atc:hover { opacity: 0.9; }
        .pdp-atc:active { transform: scale(0.98); }
        .pdp-atc--success { background: #2db463; box-shadow: 0 4px 16px rgba(45,180,99,0.3); color: #fff; }
        @media (min-width: 768px) {
          .pdp-atc { min-height: 56px; font-size: 15px; padding: 16px 24px; }
        }

        /* Delivery */
        .pdp-delivery {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #e8f5ee;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 20px;
        }
        .pdp-delivery__icon { width: 20px; height: 20px; flex-shrink: 0; }
        @media (min-width: 768px) {
          .pdp-delivery { font-size: 13px; margin-bottom: 24px; }
          .pdp-delivery__icon { width: 24px; height: 24px; }
        }

        /* USPs */
        .pdp-usp-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pdp-usp-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; line-height: 1.3; }
        .pdp-usp__check { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
        @media (min-width: 768px) {
          .pdp-usp-list { gap: 8px; margin-bottom: 24px; }
          .pdp-usp-list li { font-size: 14px; }
          .pdp-usp__check { width: 16px; height: 16px; }
        }

        /* Flavor dropdown (reuse from combo) */
        .flavor-dropdown { position: relative; }
        .flavor-dropdown__trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border: 1.5px solid #dedede;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: border-color 0.2s;
          color: #000;
          font-family: inherit;
          text-align: left;
        }
        .flavor-dropdown__trigger:hover { border-color: #000; }
        .flavor-dropdown__trigger-content { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .flavor-dropdown__trigger-img { width: 28px; height: 28px; min-width: 28px; object-fit: contain; border-radius: 4px; }
        .flavor-dropdown__chevron { transition: transform 0.2s; color: #757575; flex-shrink: 0; margin-left: 8px; }
        .flavor-dropdown__chevron.open { transform: rotate(180deg); }
        .flavor-dropdown__list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0; right: 0;
          background: #fff;
          border: 1.5px solid #dedede;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          z-index: 50;
          overflow: hidden;
          max-height: 240px;
          overflow-y: auto;
        }
        .flavor-dropdown__option {
          width: 100%;
          padding: 8px 12px;
          background: #fff;
          border: none;
          border-bottom: 1px solid #edf1f2;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #000;
          transition: background 0.15s;
          font-family: inherit;
        }
        .flavor-dropdown__option-img { width: 32px; height: 32px; min-width: 32px; object-fit: contain; border-radius: 4px; }
        .flavor-dropdown__option-name { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .flavor-dropdown__option:hover { background: #edf1f2; }
        .flavor-dropdown__option.active { background: #edf1f2; font-weight: 700; }

        /* Accordion */
        .pdp-accordion { border-top: 2px solid #dedede; }
        .pdp-accordion-item { border-bottom: 2px solid #dedede; }
        .pdp-accordion-btn {
          appearance: none;
          background: transparent;
          border: none;
          cursor: pointer;
          font: inherit;
          outline: none;
          padding: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
        }
        .pdp-accordion-label {
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pdp-accordion-content { padding: 0 0 20px; font-size: 13px; line-height: 1.6; color: #333; }
        .pdp-accordion-content p { margin: 0 0 10px; }
        .pdp-accordion-content h3 {
          margin: 14px 0 10px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .pdp-accordion-content ul { padding-left: 18px; margin: 0; }
        .pdp-accordion-content li { margin-bottom: 4px; }
        @media (min-width: 768px) {
          .pdp-accordion-btn { padding: 16px 0; }
          .pdp-accordion-label { font-size: 14px; }
          .pdp-accordion-content { padding: 0 0 24px; font-size: 14px; }
        }

        /* Nutrition */
        .pdp-nutrition { width: 100%; border-collapse: collapse; font-size: 12px; }
        .pdp-nutrition th {
          text-align: left;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          padding: 6px 8px;
          border-bottom: 2px solid #000;
        }
        .pdp-nutrition td { padding: 6px 8px; border-bottom: 1px solid #edf1f2; }
        @media (min-width: 768px) {
          .pdp-nutrition { font-size: 13px; }
          .pdp-nutrition th { font-size: 11px; padding: 8px 12px; }
          .pdp-nutrition td { padding: 8px 12px; }
        }

        .pdp-not-found {
          text-align: center;
          padding: 80px 16px;
        }
        .pdp-not-found h2 { margin: 0 0 16px; }
        .pdp-back-btn {
          padding: 10px 24px;
          background: #4ec3e0;
          border: none;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
