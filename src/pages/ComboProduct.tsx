import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import { useCart } from "../context/CartContext";

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
    name: "Crank Pre-Workout",
    subtitle: "380g",
    slug: "esn-crank",
    image: "https://www.esn.com/cdn/shop/files/CrankPump_380g_BlackberryFlavor_dunkel-2SHtR4Vf.jpg?width=800",
    flavors: [
      "Mango Maui", "Sour Apple", "Cola", "Blue Raspberry",
      "Tropical", "Blackberry", "Lemon Lime",
    ],
  },
  {
    key: "designer_bar",
    name: "Designer Protein Bar",
    subtitle: "12x45g",
    slug: "designer-bar",
    image: "https://www.esn.com/cdn/shop/files/DesignerBar_RoyalChocolate_12x45gFront_2024x2024_shop-1_01d346b7-42b6-4635-a216-9c3a25719296.jpg?width=800",
    flavors: [
      "Royal Chocolate", "Strawberry Cream", "Salted Caramel", "Cookies & Cream",
      "Coconut", "Peanut Butter Cup", "Vanilla Crunch",
    ],
  },
  {
    key: "daily",
    name: "ESN Daily",
    subtitle: "30 Sachets",
    slug: "esn-daily",
    image: "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_StrawberryCreamFlavor_2024x2024_shop-4bFh8F4I_c7e7c5e3-9e63-46a0-a63e-3f0b5b9e0c00.jpg?width=800",
    flavors: ["Lemon", "Orange", "Mixed"],
  },
  {
    key: "creatine",
    name: "Ultrapure Kreatin Pulver",
    subtitle: "500g",
    slug: "esn-ultrapure-creatine-monohydrate",
    image: "https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_Front-JjTmKxEV.jpg?width=800",
    flavors: ["Neutral", "Fresh Cherry", "Green Apple", "Lemon"],
  },
  {
    key: "ashwa",
    name: "Ashwa+ Kapseln",
    subtitle: "90 Kaps.",
    slug: "esn-ashwa-pro",
    image: "https://www.esn.com/cdn/shop/files/AshwaPro_90Caps_dunkel.jpg?width=800",
    flavors: ["Standard"],
  },
  {
    key: "magnesium",
    name: "Magnesium Complex",
    subtitle: "120 Kaps.",
    slug: "magnesium-complex",
    image: "https://www.esn.com/cdn/shop/files/MagnesiumComplex_120Caps_dunkel.jpg?width=800",
    flavors: ["Standard"],
  },
];

const GALLERY_IMAGES = COMBO_ITEMS.map(i => ({ src: i.image, label: i.name }));
const COMBO_PRICE = 69.0;
const ORIGINAL_PRICE = 129.9;
const DISCOUNT_PCT = Math.round((1 - COMBO_PRICE / ORIGINAL_PRICE) * 100);

/* ── Selection tile (ESN selection-tab style) ── */
function SelectionTile({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`selection-tab ${selected ? "selection-tab--active" : ""}`}>
      <input
        type="radio"
        name="flavor"
        className="selection-tab__input visually-hidden"
        checked={selected}
        onChange={onClick}
        tabIndex={0}
      />
      <label className="selection-tab__label" onClick={onClick}>
        <p className="selection-tab__name">{label}</p>
      </label>
    </div>
  );
}

/* ── Custom select dropdown (ESN product-custom-select) ── */
function CustomSelect({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
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
    <div className="product-options__option" ref={ref}>
      <label className="product-options__label-text">{label}</label>
      <div className="product-custom-select">
        <button
          type="button"
          className="product-custom-select__trigger"
          onClick={() => setOpen(o => !o)}
        >
          <div className="product-custom-select__content">
            <div className="product-custom-select__title-row">
              <span>{selected}</span>
            </div>
            <div className="product-custom-select__option-count">
              {options.length} Varianten
            </div>
          </div>
          <svg
            className={`product-custom-select__chevron ${open ? "open" : ""}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && (
          <div className="product-custom-select__dropdown">
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                className={`product-custom-select__option ${opt === selected ? "active" : ""}`}
                onClick={() => { onSelect(opt); setOpen(false); }}
              >
                <span>{opt}</span>
                {opt === selected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Flavor selector: tiles for ≤6, dropdown for more ── */
function FlavorSelector({
  name,
  flavors,
  selected,
  onSelect,
}: {
  name: string;
  flavors: string[];
  selected: string;
  onSelect: (f: string) => void;
}) {
  if (flavors.length <= 1) {
    return (
      <div className="product-options__option">
        <label className="product-options__label-text">{name}</label>
        <div className="flavor-single">{selected}</div>
      </div>
    );
  }

  if (flavors.length <= 6) {
    return (
      <div className="product-options__option">
        <label className="product-options__label-text">{name}</label>
        <div className="product-options__values product-options__grid">
          {flavors.map(f => (
            <SelectionTile
              key={f}
              label={f}
              selected={f === selected}
              onClick={() => onSelect(f)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <CustomSelect
      label={name}
      options={flavors}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

/* ── Accordion (ESN product-info-overlay style) ── */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="product-info-overlay__accordion-item button button--text button--medium"
        onClick={() => setOpen(o => !o)}
      >
        <span className="button__icon">
          <span className="button__default-icon">
            <svg className="icon icon__plus" viewBox="0 0 24 24" style={{
              width: 20, height: 20, transition: "transform 0.2s",
              transform: open ? "rotate(45deg)" : "none",
            }}>
              <path d="M2.75 12a1 1 0 011-1h16.5a1 1 0 110 2H3.75a1 1 0 01-1-1Z" fill="currentColor" />
              <path d="M12 2.75a1 1 0 011 1v16.5a1 1 0 11-2 0V3.75a1 1 0 011-1Z" fill="currentColor" />
            </svg>
          </span>
        </span>
        <span className="button__label">
          <span className="text-desktop">{title}</span>
        </span>
      </button>
      <div
        className="product-info-overlay__content-wrapper"
        style={{
          maxHeight: open ? "2000px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, opacity 0.25s ease",
        }}
      >
        <div className="product-info-overlay__content">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ComboProduct() {
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();

  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    COMBO_ITEMS.forEach(i => { init[i.key] = i.flavors[0]; });
    return init;
  });
  const [addedToCart, setAddedToCart] = useState(false);

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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  }, [selections, addItem, openCart]);

  return (
    <div className="esn-page esn-combo-page">
      {/* Announcement bar */}
      <div className="announcement-bar">
        FIBO WEEK · SPARE {DISCOUNT_PCT}% MIT DEM ELITE LEISTUNG COMBO
      </div>

      <HeaderESN />

      <main className="main-product combo-main-product">
        <div className="grid">
          {/* ── Gallery ── */}
          <div className="product-gallery-wrapper col xs-span l7">
            <div className="product-gallery product-gallery--vertical-desktop">
              <div className="product-gallery__thumbnails-container col l1">
                <div className="product-gallery__thumbnails">
                  {GALLERY_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      className={`gallery-thumb ${i === galleryIdx ? "is-active" : ""}`}
                      onClick={() => setGalleryIdx(i)}
                    >
                      <img src={img.src} alt={img.label} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="product-gallery__main-container">
                <div className="product-gallery-carousel">
                  <div className="product-gallery-carousel__media-container">
                    <div
                      className="product-gallery-carousel__image-container"
                      style={{ paddingBottom: "100%" }}
                    >
                      <span className="images preload-image" style={{ paddingBottom: "100%" }}>
                        <img
                          src={GALLERY_IMAGES[galleryIdx].src}
                          alt={GALLERY_IMAGES[galleryIdx].label}
                          className="preload-image"
                          style={{ objectPosition: "50% 50%" }}
                        />
                      </span>
                    </div>
                    {/* Navigation arrows */}
                    <div className="splide__arrows">
                      <button
                        className="splide__arrow splide__arrow--prev"
                        onClick={() => setGalleryIdx(p => (p > 0 ? p - 1 : GALLERY_IMAGES.length - 1))}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        className="splide__arrow splide__arrow--next"
                        onClick={() => setGalleryIdx(p => (p < GALLERY_IMAGES.length - 1 ? p + 1 : 0))}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product info (buy box) ── */}
          <div className="main-product__main col xs-span l5">
            <div className="main-product__buy-box">
              <div className="main-product__details">
                <h1
                  id="template-title"
                  className="title-mobile-m-bold title-desktop-m-bold main-product__title"
                >
                  ESN Elite Leistung Combo
                </h1>

                {/* Star rating */}
                <a className="star-rating-link main-product__reviews" href="#reviews">
                  <div className="star-rating">
                    <div className="star-rating__stars">
                      {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} className="icon icon__star-filled" viewBox="0 0 20 20">
                          <path d="m10.002 14.774 4.275 2.629a.656.656 0 0 0 .978-.717l-1.163-4.905 3.805-3.282a.662.662 0 0 0-.374-1.154l-4.993-.406-1.923-4.657a.654.654 0 0 0-1.21 0L7.474 6.94l-4.993.406a.661.661 0 0 0-.375 1.158l3.805 3.282-1.162 4.901a.656.656 0 0 0 .978.717z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </a>

                {/* USP list */}
                <ul className="main-product__usp">
                  <li>
                    <svg className="icon icon__check-outline" viewBox="0 0 24 24">
                      <path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="#FFF" />
                    </svg>
                    <span>8 Premium-Produkte in einem Bundle</span>
                  </li>
                  <li>
                    <svg className="icon icon__check-outline" viewBox="0 0 24 24">
                      <path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="#FFF" />
                    </svg>
                    <span>Über {DISCOUNT_PCT}% Ersparnis gegenüber Einzelkauf</span>
                  </li>
                  <li>
                    <svg className="icon icon__check-outline" viewBox="0 0 24 24">
                      <path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="#FFF" />
                    </svg>
                    <span>Laborgeprüfte Qualität · Made in Germany</span>
                  </li>
                </ul>
              </div>

              {/* ── Product form ── */}
              <div id="product-form" className="product-form main-product__form">
                <div className="product-form__form">
                  {/* Price */}
                  <div className="product-prices product-prices--form product-form__prices-container">
                    <span className="product-prices__price">
                      <span className="title-mobile-m-bold">
                        €{COMBO_PRICE.toFixed(2).replace(".", ",")}
                      </span>
                    </span>
                    <span className="product-prices__compare-at-price title-mobile-m-bold">
                      €{ORIGINAL_PRICE.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="product-prices__unit-price text-mobile-paragraph-xs-regular text-desktop-paragraph-xs-regular">
                      inkl. MwSt. zzgl. Versand.
                    </span>
                  </div>

                  {/* Options / Flavor selectors */}
                  <div className="product-options">
                    {COMBO_ITEMS.map(item => (
                      <FlavorSelector
                        key={item.key}
                        name={item.name}
                        flavors={item.flavors}
                        selected={selections[item.key]}
                        onSelect={f => handleSelect(item.key, f)}
                      />
                    ))}
                  </div>

                  {/* Add to cart */}
                  <div className="product-form__add-to-cart-container">
                    <button
                      id="combo-add-to-cart"
                      className={`button product-form__add-to-cart button--semimedium ${addedToCart ? "button--success" : ""}`}
                      type="button"
                      onClick={handleAddToCart}
                    >
                      <span className="button__label text-button-semimedium">
                        <span className="text-desktop">
                          {addedToCart ? "✓ Hinzugefügt" : "In den Warenkorb"}
                        </span>
                        <span className="text-mobile">
                          {addedToCart ? "✓" : "In den Warenkorb"}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Delivery time */}
                <div className="delivery-time product-form__delivery">
                  <span className="delivery-time__icon">
                    <svg className="icon icon__truck-order" viewBox="0 0 24 17">
                      <g fill="#1C6C3C" fillRule="evenodd" clipRule="evenodd">
                        <path d="M15.5 2.5a1 1 0 011-1h3.992a1.75 1.75 0 011.625 1.1l-.928.371.928-.37 1.311 3.278A1 1 0 0122.5 7.25h-6a1 1 0 01-1-1zm2 1v1.75h3.523l-.7-1.75zM.5 8.5a1 1 0 011-1h15a1 1 0 110 2h-15a1 1 0 01-1-1M17.625 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5M14.375 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0M6.375 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5M3.125 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0" />
                        <path d="M7.625 13a1 1 0 011-1h6.75a1 1 0 110 2h-6.75a1 1 0 01-1-1" />
                        <path d="M2.5 2v10h1.625a1 1 0 110 2H2.25A1.75 1.75 0 01.5 12.25V1.75A1.75 1.75 0 012.25 0H16.5a1 1 0 011 1v10.051a1 1 0 11-2 0V2z" />
                        <path d="M15.5 6.25a1 1 0 011-1h6a1 1 0 011 1v6A1.75 1.75 0 0121.75 14h-1.875a1 1 0 110-2H21.5V7.25h-4v3.801a1 1 0 11-2 0z" />
                      </g>
                    </svg>
                  </span>
                  <span className="delivery-time__text text-mobile-paragraph-s-regular text-desktop-paragraph-xs-regular">
                    Lieferzeit: 5-7 Werktage
                  </span>
                </div>
              </div>

              {/* Accordion */}
              <div className="product-info-overlay">
                <div className="product-info-overlay__accordion">
                  <AccordionSection title="Beschreibung">
                    <div className="combo-description">
                      <p className="combo-desc-intro">
                        Das <strong>ESN Elite Leistung Combo</strong> ist das ultimative Paket für ambitionierte Athleten.
                        8 Premium-Produkte, perfekt aufeinander abgestimmt, um dich beim Muskelaufbau,
                        der Regeneration und der täglichen Vitalität zu unterstützen.
                      </p>

                      <h3 className="combo-desc-heading">Inhalt des Combos</h3>

                      {COMBO_ITEMS.map((item, i) => (
                        <div key={item.key} className="combo-product-row">
                          <div className="combo-product-thumb">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="combo-product-details">
                            <div className="combo-product-number">{i + 1}</div>
                            <div>
                              <div className="combo-product-name">{item.name}</div>
                              <div className="combo-product-size">{item.subtitle}</div>
                              <div className="combo-product-flavors">
                                {item.flavors.length > 1
                                  ? `Geschmack wählbar: ${item.flavors.join(", ")}`
                                  : item.flavors[0] !== "Standard"
                                  ? `Geschmack: ${item.flavors[0]}`
                                  : "Standardvariante"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="combo-highlight-box">
                        <strong>Dein Vorteil:</strong> Spare über {DISCOUNT_PCT}% gegenüber dem Einzelkauf –
                        alle Produkte laborgeprüft und Made in Germany.
                      </div>
                    </div>
                  </AccordionSection>
                  <AccordionSection title="Nährwerte">
                    <div className="nutrition-info">
                      <table className="nutrition-table">
                        <thead>
                          <tr>
                            <th>Produkt</th>
                            <th>Portion</th>
                            <th>Protein</th>
                            <th>Portionen</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Designer Whey</td><td>33g</td><td>25g</td><td>27</td></tr>
                          <tr><td>Isoclear</td><td>30g</td><td>23g</td><td>30</td></tr>
                          <tr><td>Crank</td><td>9,5g</td><td>–</td><td>40</td></tr>
                          <tr><td>Designer Bar</td><td>45g</td><td>18g</td><td>12</td></tr>
                          <tr><td>ESN Daily</td><td>1 Sachet</td><td>–</td><td>30</td></tr>
                          <tr><td>Kreatin</td><td>5g</td><td>–</td><td>100</td></tr>
                          <tr><td>Ashwa+</td><td>3 Kaps.</td><td>–</td><td>30</td></tr>
                          <tr><td>Magnesium</td><td>4 Kaps.</td><td>–</td><td>30</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionSection>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── What's inside ── */}
      <section className="whats-inside">
        <div className="max-width-container">
          <h2 className="whats-inside__title">Was im Bundle enthalten ist</h2>
          <div className="whats-inside__grid">
            {COMBO_ITEMS.map(item => (
              <div
                key={item.key}
                className="whats-inside__card"
                onClick={() => navigate(`/products/${item.slug}`)}
              >
                <div className="whats-inside__img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="whats-inside__name">{item.name}</div>
                <div className="whats-inside__sub">{item.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterESN />

      {/* ── ESN-matching CSS ── */}
      <style>{`
        /* ── ESN Design Tokens ── */
        :root {
          --color-primary-black: #000;
          --color-primary-white: #fff;
          --color-grey-2: #edf1f2;
          --color-grey-3: #dedede;
          --color-grey-4: #b3b3b3;
          --color-grey-5: #333;
          --color-grey-8: #757575;
          --color-background: #fff;
          --color-background-product-usps: #000;
          --color-text-product-usps: #fff;
          --color-conversion-primary-cta: #4ec3e0;
          --color-background-custom: #4ec3e0;
          --color-text-custom: #fff;
          --color-secondary-isoclear: #4ec3e0;
          --color-auxiliary-success-1: #2db463;
          --color-auxiliary-success-3: #e8f5ee;
          --color-arrow-background: #000;
          --color-arrow-icon: #fff;
          --color-skeleton-background: #edf1f2;
          --color-skeleton-gradient: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          --spacing-3xs: 0.25rem;
          --spacing-2xs: 0.375rem;
          --spacing-xs: 0.5rem;
          --spacing-s: 0.75rem;
          --spacing-m: 1rem;
          --spacing-l: 1.5rem;
          --spacing-xl: 2rem;
          --spacing-2xl: 3rem;
          --spacing-3xl: 4rem;
          --spacing-7xl: 8rem;
          --icon-2xs: 1rem;
          --icon-xs: 1.25rem;
          --icon-m: 1.5rem;
          --icon-l: 2rem;
          --icon-xl: 3rem;
          --font-size-xs: 0.75rem;
          --font-size-s: 0.875rem;
          --font-size-m: 1rem;
          --font-size-l: 1.125rem;
          --font-size-xl: 1.25rem;
          --font-weight-regular: 400;
          --font-weight-bold: 700;
          --font-weight-extrabold: 800;
          --timing-normal: 0.2s;
          --timing-quick: 0.15s;
          --easing-normal: ease;
          --layer-raised: 10;
          --layer-heightened: 20;
          --layout-margin: 1rem;
          --layout-gutter: 1rem;
          --layout-desktop-column: 12;
          --max-content-width-l: 1440px;
          --header-visible-height: 80px;
          --font-family-text: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
        }

        /* ── Typography ── */
        .title-mobile-m-bold {
          font-family: var(--font-family-text);
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 120%;
          letter-spacing: -0.02rem;
        }
        .title-desktop-m-bold {
          font-family: var(--font-family-text);
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 120%;
          letter-spacing: -0.02rem;
        }
        .text-mobile-paragraph-xs-regular,
        .text-desktop-paragraph-xs-regular {
          font-family: var(--font-family-text);
          font-size: 0.75rem;
          font-weight: 400;
          line-height: 133.333%;
          color: var(--color-grey-8);
        }
        .text-mobile-paragraph-s-regular,
        .text-desktop-paragraph-xs-regular {
          font-family: var(--font-family-text);
          font-size: 0.8125rem;
          font-weight: 400;
          line-height: 130%;
        }
        .text-mobile-paragraph-m-bold {
          font-family: var(--font-family-text);
          font-size: 1rem;
          font-weight: 700;
          line-height: 130%;
        }
        .text-button-semimedium {
          font-family: var(--font-family-text);
          font-size: 0.9375rem;
          font-weight: 800;
          line-height: 130%;
          text-transform: uppercase;
        }

        @media (min-width: 64em) {
          .title-desktop-m-bold { font-size: 1.75rem; }
          .text-desktop-paragraph-xs-regular { font-size: 0.8125rem; }
        }

        /* ── Page ── */
        .esn-page {
          min-height: 100vh;
          background: var(--color-background);
          color: var(--color-primary-black);
          font-family: var(--font-family-text);
        }
        .announcement-bar {
          background: #b70832;
          color: #fff;
          padding: 10px 16px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        /* ── Main product ── */
        .main-product {
          background-color: var(--color-background);
          margin-inline: auto;
          padding-block-start: var(--spacing-2xl);
          padding-inline-end: var(--layout-margin);
          padding-inline-start: var(--layout-margin);
          width: 100%;
        }
        @media (min-width: 64em) {
          .main-product { max-width: var(--max-content-width-l); }
          .main-product > .grid { padding-block-end: var(--spacing-2xl); }
        }

        .grid { display: flex; flex-wrap: wrap; margin: 0 calc(var(--layout-gutter) * -0.5); }
        .col { padding: 0 calc(var(--layout-gutter) * 0.5); }
        .xs-span { width: 100%; }
        @media (min-width: 64em) {
          .l7 { width: calc(7 / 12 * 100%); }
          .l5 { width: calc(5 / 12 * 100%); }
        }

        /* ── Gallery ── */
        .product-gallery-wrapper { position: relative; }
        .product-gallery {
          position: sticky;
          top: calc(var(--header-visible-height) + var(--layout-margin));
        }
        .product-gallery.product-gallery--vertical-desktop {
          display: grid;
          gap: var(--layout-gutter);
          grid-template-columns: 70px auto;
        }
        .product-gallery__thumbnails-container {
          display: flex;
          flex-direction: column;
        }
        .product-gallery__thumbnails {
          display: grid;
          gap: var(--spacing-l);
          grid-template-columns: 1fr;
        }
        .gallery-thumb {
          width: 60px;
          height: 60px;
          border: 1px solid transparent;
          border-radius: var(--spacing-m);
          cursor: pointer;
          opacity: 0.5;
          transition: border-color var(--timing-quick) var(--easing-normal), opacity var(--timing-quick) var(--easing-normal);
          padding: 0;
          overflow: hidden;
          background: var(--color-grey-2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gallery-thumb img { width: 100%; height: 100%; object-fit: contain; }
        .gallery-thumb.is-active { opacity: 1; border-color: var(--color-primary-black); }

        .product-gallery__main-container { padding-block-start: 0; position: relative; }
        .product-gallery-carousel { position: relative; width: 100%; }
        .product-gallery-carousel__media-container { position: relative; }
        .product-gallery-carousel__image-container { background: var(--color-background); border-radius: var(--spacing-m); overflow: hidden; position: relative; }
        .images.preload-image { display: block; position: relative; }
        .images.preload-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: absolute;
          top: 0;
          left: 0;
        }

        .splide__arrows {
          display: flex;
          justify-content: space-between;
          padding: 0 var(--spacing-l);
          pointer-events: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          z-index: var(--layer-raised);
        }
        .splide__arrow {
          align-items: center;
          appearance: none;
          background-color: var(--color-arrow-background);
          border: 0;
          border-radius: 2px;
          color: var(--color-arrow-icon);
          cursor: pointer;
          padding: var(--spacing-m);
          pointer-events: auto;
          display: flex;
        }
        .splide__arrow svg { height: var(--icon-2xs); width: var(--icon-2xs); }

        /* ── Buy box ── */
        .main-product__buy-box {
          background-color: var(--color-primary-white);
          border-radius: 1rem;
          padding: var(--spacing-l);
          position: relative;
        }
        @media (min-width: 64em) {
          .main-product__buy-box { padding: var(--spacing-xl); }
        }

        .main-product__details {
          display: grid;
          gap: var(--spacing-s);
          margin-block-end: var(--spacing-m);
        }
        @media (min-width: 64em) {
          .main-product__details { margin-block-end: var(--spacing-l); }
        }
        .main-product__title {
          padding-inline-end: var(--spacing-xl);
          margin: 0;
        }

        /* Star rating */
        .star-rating__stars { display: flex; gap: 2px; }
        .star-rating__stars .icon__star-filled { width: 16px; height: 16px; fill: #f59e0b; }
        .main-product__reviews { text-decoration: none; color: inherit; display: inline-block; margin-block-start: var(--spacing-xs); }
        .main-product__reviews:hover { opacity: 0.8; }

        /* USP */
        .main-product__usp {
          list-style: none;
          padding: 0;
          margin: var(--spacing-m) 0 0;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2xs);
        }
        .main-product__usp li {
          display: flex;
          align-items: flex-start;
          align-self: stretch;
          gap: var(--spacing-xs);
        }
        .main-product__usp li .icon__check-outline {
          width: var(--icon-2xs);
          height: var(--icon-2xs);
          margin-block-start: var(--spacing-3xs);
          flex-shrink: 0;
        }
        .main-product__usp li .icon__check-outline path { fill: var(--color-primary-black); }
        .main-product__usp li span {
          font-size: var(--font-size-m);
          font-style: normal;
          font-weight: 400;
          letter-spacing: -0.02rem;
          line-height: 130%;
        }

        /* ── Product form ── */
        .product-form { padding-block-end: var(--spacing-l); }
        .product-form__form {
          display: grid;
          gap: var(--spacing-s);
        }
        @media (min-width: 64em) {
          .main-product__form { gap: var(--spacing-m); }
        }

        /* Price */
        .product-prices { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--spacing-xs); }
        .product-prices__price { font-weight: 700; color: var(--color-primary-black); }
        .product-prices__compare-at-price {
          color: var(--color-grey-4);
          text-decoration: line-through;
          font-size: var(--font-size-m);
          font-weight: 400;
        }
        .product-prices__unit-price { color: var(--color-grey-8); font-size: 0.75rem; }

        /* ── Product options (ESN style) ── */
        .product-options { display: flex; flex-direction: column; gap: var(--spacing-s); }
        .product-options__option { display: flex; flex-direction: column; gap: var(--spacing-xs); }
        .product-options__label-text {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--color-primary-black);
        }

        /* Single flavor (1 option) */
        .flavor-single {
          padding: var(--spacing-s) var(--spacing-m);
          border: 1.5px solid var(--color-grey-2);
          border-radius: var(--spacing-s);
          background: var(--color-grey-2);
          font-size: var(--font-size-s);
          color: var(--color-grey-8);
          font-weight: 500;
        }

        /* Selection tiles (ESN selection-tab) */
        .product-options__values { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }
        .product-options__grid { gap: var(--spacing-xs); }
        .selection-tab {
          border: 1.5px solid var(--color-grey-3);
          border-radius: var(--spacing-s);
          background: var(--color-primary-white);
          cursor: pointer;
          transition: border-color var(--timing-normal) var(--easing-normal), background var(--timing-normal);
          position: relative;
        }
        .selection-tab:hover { border-color: var(--color-primary-black); }
        .selection-tab--active {
          border-color: var(--color-primary-black);
          background: var(--color-grey-2);
        }
        .selection-tab__input { position: absolute; opacity: 0; pointer-events: none; }
        .selection-tab__label {
          display: block;
          padding: var(--spacing-s) var(--spacing-m);
          cursor: pointer;
          text-align: center;
          min-width: 0;
        }
        .selection-tab__name {
          font-size: var(--font-size-s);
          font-weight: 600;
          color: var(--color-primary-black);
          white-space: nowrap;
          margin: 0;
        }
        .selection-tab--active .selection-tab__name { font-weight: 700; }

        /* Custom select dropdown */
        .product-custom-select { position: relative; }
        .product-custom-select__trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-s) var(--spacing-m);
          border: 1.5px solid var(--color-grey-3);
          border-radius: var(--spacing-s);
          background: var(--color-primary-white);
          cursor: pointer;
          font-size: var(--font-size-s);
          font-weight: 600;
          transition: border-color var(--timing-normal);
          color: var(--color-primary-black);
          appearance: none;
        }
        .product-custom-select__trigger:hover { border-color: var(--color-primary-black); }
        .product-custom-select__content { display: flex; flex-direction: column; gap: 2px; text-align: left; }
        .product-custom-select__title-row { font-weight: 600; }
        .product-custom-select__option-count { font-size: 0.6875rem; color: var(--color-grey-8); font-weight: 400; }
        .product-custom-select__chevron { transition: transform 0.2s; color: var(--color-grey-8); }
        .product-custom-select__chevron.open { transform: rotate(180deg); }
        .product-custom-select__dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--color-primary-white);
          border: 1.5px solid var(--color-grey-3);
          border-radius: var(--spacing-s);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          z-index: 50;
          overflow: hidden;
          max-height: 240px;
          overflow-y: auto;
        }
        .product-custom-select__option {
          width: 100%;
          padding: var(--spacing-s) var(--spacing-m);
          background: var(--color-primary-white);
          border: none;
          border-bottom: 1px solid var(--color-grey-2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--font-size-s);
          font-weight: 500;
          color: var(--color-primary-black);
          transition: background var(--timing-quick);
        }
        .product-custom-select__option:hover { background: var(--color-grey-2); }
        .product-custom-select__option.active { background: var(--color-grey-2); font-weight: 700; }

        /* ── Add to cart button ── */
        .product-form__add-to-cart-container {
          display: flex;
          gap: var(--spacing-m);
          min-height: 3.8125rem;
        }
        .button {
          appearance: none;
          border: 0;
          border-radius: var(--spacing-s);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-xs);
          font: inherit;
          text-decoration: none;
          transition: opacity var(--timing-normal) var(--easing-normal), background-color var(--timing-normal) var(--easing-normal);
        }
        .button--semimedium {
          padding: var(--spacing-m) var(--spacing-l);
          font-size: 0.9375rem;
          min-height: 3.125rem;
          border-radius: 50px;
        }
        .product-form__add-to-cart {
          background-color: var(--color-background-custom);
          color: var(--color-text-custom);
          font-weight: var(--font-weight-extrabold);
          text-transform: uppercase;
          width: 100%;
          box-shadow: 0 6px 24px rgba(78,195,224,0.35);
        }
        .product-form__add-to-cart:hover { opacity: 0.9; }
        .product-form__add-to-cart.button--success {
          background-color: var(--color-auxiliary-success-1);
          box-shadow: 0 6px 24px rgba(45,180,99,0.35);
        }

        /* ── Delivery time ── */
        .delivery-time {
          align-items: center;
          color: var(--color-primary-black);
          display: flex;
          gap: var(--spacing-xs);
          margin-block-start: var(--spacing-xs);
          padding: var(--spacing-s) var(--spacing-m);
          background: var(--color-auxiliary-success-3);
          border-radius: var(--spacing-s);
        }
        .delivery-time .icon { height: var(--icon-m); min-width: var(--icon-m); width: var(--icon-m); }
        .delivery-time__text { line-height: 130%; font-size: 0.8125rem; }

        /* ── Accordion ── */
        .product-info-overlay { margin-block-start: var(--spacing-l); }
        .product-info-overlay__accordion {
          display: flex;
          flex-direction: column;
          border-top: 2px solid var(--color-grey-3);
        }
        .product-info-overlay__accordion-item {
          appearance: none;
          background: transparent;
          border: none;
          box-shadow: none;
          color: inherit;
          cursor: pointer;
          font: inherit;
          outline: none;
          padding: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--color-grey-3);
          padding-block: var(--spacing-s);
        }
        .product-info-overlay__accordion-item .button__label {
          text-align: left;
          font-size: var(--font-size-m);
          font-weight: 700;
          text-transform: uppercase;
        }
        .product-info-overlay__accordion-item .button__icon { order: 1; }
        .product-info-overlay__accordion-item .button__default-icon .icon {
          height: var(--icon-2xs);
          width: var(--icon-2xs);
          color: var(--color-grey-8);
        }

        /* ── What's inside ── */
        .whats-inside {
          margin-block-start: var(--spacing-7xl);
          padding-block-start: var(--spacing-2xl);
          border-top: 1px solid var(--color-grey-2);
          background: var(--color-background);
        }
        .max-width-container {
          max-width: var(--max-content-width-l);
          margin: 0 auto;
          padding-inline: var(--layout-margin);
        }
        .whats-inside__title {
          font-size: 1.375rem;
          font-weight: 800;
          text-transform: uppercase;
          text-align: center;
          margin: 0 0 var(--spacing-2xl);
          letter-spacing: 0.5px;
        }
        .whats-inside__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--spacing-m);
        }
        .whats-inside__card {
          background: var(--color-primary-white);
          border-radius: var(--spacing-m);
          padding: var(--spacing-m);
          text-align: center;
          border: 1.5px solid var(--color-grey-2);
          cursor: pointer;
          transition: all var(--timing-normal);
        }
        .whats-inside__card:hover {
          border-color: var(--color-primary-black);
          transform: translateY(-3px);
        }
        .whats-inside__img {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--spacing-s);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .whats-inside__img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .whats-inside__name {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.3;
          margin-bottom: 4px;
        }
        .whats-inside__sub { font-size: 0.6875rem; color: var(--color-grey-8); }

        /* ── Visually hidden ── */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .product-info-overlay__content-wrapper {
          transition: max-height 0.35s ease, opacity 0.25s ease;
        }
        .product-info-overlay__content {
          padding: var(--spacing-m) 0 var(--spacing-l);
          font-size: var(--font-size-s);
          line-height: 1.6;
          color: var(--color-grey-5);
        }
        .product-info-overlay__content p { margin: 0 0 var(--spacing-s); }
        .product-info-overlay__content a { color: var(--color-secondary-isoclear); text-decoration: underline; }
        .product-info-overlay__content strong { color: var(--color-primary-black); }
        .product-info-overlay__content h3, .product-info-overlay__content h4 {
          margin: var(--spacing-l) 0 var(--spacing-s);
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--color-primary-black);
        }
        .product-info-overlay__content ul {
          margin: 0 0 var(--spacing-s);
          padding-left: var(--spacing-l);
        }
        .product-info-overlay__content li {
          margin-bottom: var(--spacing-2xs);
        }

        /* ── Combo Description ── */
        .combo-desc-intro {
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: var(--spacing-m);
        }
        .combo-desc-heading {
          font-size: 0.9375rem;
          font-weight: 700;
          text-transform: uppercase;
          margin: var(--spacing-m) 0 var(--spacing-s);
          color: var(--color-primary-black);
        }
        .combo-product-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-s);
          padding: var(--spacing-s) 0;
          border-bottom: 1px solid var(--color-grey-2);
        }
        .combo-product-row:last-of-type { border-bottom: none; }
        .combo-product-thumb {
          width: 48px;
          height: 48px;
          background: var(--color-grey-2);
          border-radius: var(--spacing-s);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .combo-product-thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .combo-product-details {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-s);
          flex: 1;
          min-width: 0;
        }
        .combo-product-number {
          width: 24px;
          height: 24px;
          background: var(--color-primary-black);
          color: var(--color-primary-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 800;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .combo-product-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--color-primary-black);
          line-height: 1.3;
        }
        .combo-product-size {
          font-size: 0.6875rem;
          color: var(--color-grey-8);
          margin-top: 1px;
        }
        .combo-product-flavors {
          font-size: 0.6875rem;
          color: var(--color-grey-8);
          margin-top: 2px;
          line-height: 1.4;
        }
        .combo-highlight-box {
          margin-top: var(--spacing-m);
          padding: var(--spacing-m);
          background: var(--color-auxiliary-success-3);
          border-radius: var(--spacing-s);
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--color-primary-black);
        }
        .combo-highlight-box strong {
          color: var(--color-auxiliary-success-1);
        }

        /* ── Nutrition Table ── */
        .nutrition-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.75rem;
        }
        .nutrition-table th {
          text-align: left;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.6875rem;
          padding: var(--spacing-xs) var(--spacing-s);
          border-bottom: 2px solid var(--color-primary-black);
          color: var(--color-primary-black);
        }
        .nutrition-table td {
          padding: var(--spacing-xs) var(--spacing-s);
          border-bottom: 1px solid var(--color-grey-2);
          color: var(--color-grey-5);
        }
        .nutrition-table tr:last-child td { border-bottom: none; }

        /* ── Responsive ── */
        @media (max-width: 63.99em) {
          .product-gallery.product-gallery--vertical-desktop {
            grid-template-columns: 1fr;
          }
          .product-gallery__thumbnails-container {
            display: none;
          }
          .product-gallery__thumbnails {
            flex-direction: row;
            display: flex;
            gap: var(--spacing-xs);
            overflow-x: auto;
            margin-block-start: var(--spacing-xs);
          }
          .gallery-thumb {
            width: 60px;
            height: 60px;
            flex-shrink: 0;
          }
        }

        /* ── Mobile thumbs ── */
        @media (max-width: 63.99em) {
          .product-gallery { position: static; }
          .product-gallery__main-container .splide__track { overflow: visible; }
        }
      `}</style>
    </div>
  );
}
