import fs from 'fs';

// Read the Isoclear page as template (clean product page, similar structure)
const template = fs.readFileSync('/Users/ulissescardoso/suplements/public/store/products_esn-isoclear-whey-isolate.html', 'utf8');

// ── Combo product data ───────────────────────────────────────────────────────
const COMBO_PRICE_CENTS = 6900; // €69.00
const ORIG_PRICE_CENTS  = 12990; // €129.90

// One "variant" per combo configuration — we use a single variant approach
const COMBO_VARIANT_ID = 99999000001;

const COMBO_ITEMS = [
  { key: 'designer_whey', name: 'Designer Whey Protein', size: '908g',
    image: 'https://www.esn.com/cdn/shop/files/DesignerWhey_908g_AlmondCoconutFlavor_2024x2024_shop-iCbreuNy_c640bbf7-d33b-4e04-9670-3ab420c5176d.jpg',
    flavors: ['Chocolate Fudge','Vanilla Milk','Strawberry Cream','Banana','Cookies & Cream','Cinnamon Roll','Hazelnut Nougat','Almond Coconut','Caramel','Neutral'] },
  { key: 'isoclear', name: 'Isoclear Whey Isolate', size: '908g',
    image: 'https://www.esn.com/cdn/shop/files/PDP_Flavor_IC_Royal_Candy_908g-G78RgZbq.jpg',
    flavors: ['Green Apple','Peach Iced Tea','Lemon Iced Tea','Tropical Punch','Rainbow Candy','Cherry Lemonade','Royal Candy','Watermelon'] },
  { key: 'crank', name: 'ESN Crank Pre-Workout', size: '380g',
    image: 'https://www.esn.com/cdn/shop/files/CrankPump_380g_BlackberryFlavor_dunkel-2SHtR4Vf.jpg',
    flavors: ['Mango Maui','Sour Apple','Cola','Blue Raspberry','Tropical','Blackberry','Lemon Lime'] },
  { key: 'creatine', name: 'Ultrapure Creatine', size: '500g',
    image: 'https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_Front-JjTmKxEV.jpg',
    flavors: ['Neutral','Fresh Cherry','Green Apple','Lemon'] },
  { key: 'eaa', name: 'ESN EAA', size: '500g',
    image: 'https://www.esn.com/cdn/shop/files/EAA__400g_LemonIcedTeaFlavor-pcMoiw3q.png',
    flavors: ['Iced Tea Peach','Lemon Iced Tea','Tropical','Watermelon'] },
  { key: 'vitamin_stack', name: 'Vitamin Stack', size: '120 Kaps.',
    image: 'https://www.esn.com/cdn/shop/files/VitaminStack_120Caps_dunkel-iVk2cLKB.jpg',
    flavors: ['Standard'] },
  { key: 'omega3', name: 'Omega-3 Kapseln', size: '300 Kaps.',
    image: 'https://www.esn.com/cdn/shop/files/Omega3_300Caps_dunkel-toQc9pOa.jpg',
    flavors: ['Standard'] },
];

const MAIN_IMAGE = COMBO_ITEMS[0].image;

// ── Build combo-specific HTML to inject into product section ─────────────────
// This replaces the variant selector area inside the ESN theme product form

const comboSelectorsHTML = COMBO_ITEMS.map(item => {
  if (item.flavors.length === 1) {
    return `
<div class="product-options__item" style="margin-bottom:16px">
  <div class="product-options__label" style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;margin-bottom:8px;display:flex;justify-content:space-between">
    <span>${item.name}</span>
    <span style="color:var(--color-grey-7);font-weight:500;text-transform:none">${item.size} · ${item.flavors[0]}</span>
  </div>
</div>`;
  }
  const options = item.flavors.map((f, i) =>
    `<option value="${f}"${i === 0 ? ' selected' : ''}>${f}</option>`
  ).join('');
  return `
<div class="product-options__item" style="margin-bottom:20px">
  <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
    <span>${item.name}</span>
    <span class="combo-sel-label-${item.key}" style="color:var(--color-grey-7);font-weight:500;text-transform:none;font-size:12px">${item.size} · ${item.flavors[0]}</span>
  </div>
  <div style="position:relative">
    <select
      class="combo-select"
      data-combo-key="${item.key}"
      style="width:100%;padding:14px 40px 14px 16px;border:1.5px solid var(--color-grey-2);border-radius:8px;background:#fff;font-family:var(--font-family-text);font-size:14px;font-weight:600;color:var(--color-grey-6);cursor:pointer;appearance:none;-webkit-appearance:none;outline:none;transition:border-color .15s"
    >${options}</select>
    <svg style="position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none;width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
  </div>
</div>`;
}).join('\n');

// Gallery thumbnails
const galleryThumbsHTML = COMBO_ITEMS.map((item, i) => `
<div class="product-media-modal__thumbnail-list-item" style="flex-shrink:0">
  <button type="button" class="product-media-modal__thumbnail${i === 0 ? ' is-active' : ''}"
    data-combo-thumb="${i}"
    style="width:60px;height:60px;border:${i === 0 ? '2px solid #000' : '1.5px solid var(--color-grey-2)'};border-radius:8px;background:var(--color-grey-1);cursor:pointer;overflow:hidden;padding:4px;transition:border-color .15s"
    title="${item.name}"
  >
    <img src="${item.image}?width=120" alt="${item.name}" style="width:100%;height:100%;object-fit:contain" loading="lazy">
  </button>
</div>`).join('\n');

// ── Product section HTML ─────────────────────────────────────────────────────
const PRODUCT_SECTION = `
<section id="combo-product-section" style="padding:0 0 60px">
  <div class="container">
    <!-- Breadcrumbs -->
    <nav style="padding:16px 0;font-size:12px;color:var(--color-grey-7);display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <a href="/" style="color:var(--color-grey-6);text-decoration:none">Home</a>
      <span>/</span>
      <a href="/collections/all" style="color:var(--color-grey-7);text-decoration:none">Produkte</a>
      <span>/</span>
      <span style="color:var(--color-grey-6);font-weight:600">ESN Elite Leistung Combo</span>
    </nav>

    <!-- Product grid -->
    <div class="combo-grid" style="display:grid;grid-template-columns:1fr;gap:48px;align-items:start">

      <!-- LEFT: Gallery -->
      <div style="position:sticky;top:100px">
        <!-- Main image -->
        <div id="combo-main-img" style="background:var(--color-grey-1);border-radius:16px;overflow:hidden;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:16px">
          <img id="combo-img-el" src="${MAIN_IMAGE}?width=900" alt="ESN Elite Leistung Combo"
            style="max-width:80%;max-height:80%;object-fit:contain;transition:opacity .2s">
          <!-- Sale badge -->
          <div style="position:absolute;top:16px;left:16px;background:var(--color-secondary-sales);color:#fff;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:900;letter-spacing:.5px">
            −47%
          </div>
        </div>
        <!-- Thumbnails -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          ${galleryThumbsHTML}
        </div>
      </div>

      <!-- RIGHT: Info -->
      <div>
        <!-- Title -->
        <h1 class="product-title" style="font-family:var(--font-family-display);font-size:2.5rem;font-weight:600;line-height:1.1;text-transform:uppercase;margin-bottom:8px;letter-spacing:-.5px">
          ESN Elite Leistung Combo
        </h1>

        <!-- Badge + reviews -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
          <span style="background:var(--color-grey-6);color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:4px;letter-spacing:.5px;text-transform:uppercase">BUNDLE</span>
          <span style="color:#f59e0b;font-size:16px">★★★★★</span>
          <span style="font-size:13px;color:var(--color-grey-7)">4.9 (2.847 Bewertungen)</span>
        </div>

        <!-- USPs -->
        <ul style="list-style:none;padding:0;margin-bottom:20px;display:flex;flex-direction:column;gap:6px">
          <li style="font-size:13px;color:var(--color-grey-5);font-weight:500">✓ 7 Premium-Produkte in einem Bundle</li>
          <li style="font-size:13px;color:var(--color-grey-5);font-weight:500">✓ Über 47% Ersparnis gegenüber Einzelkauf</li>
          <li style="font-size:13px;color:var(--color-grey-5);font-weight:500">✓ Laborgeprüfte Qualität · Made in Germany</li>
        </ul>

        <!-- Price block -->
        <div class="product-prices" style="margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid var(--color-grey-2)">
          <div class="product-prices__price" id="combo-price-display">
            <div style="display:flex;align-items:baseline;gap:14px;flex-wrap:wrap">
              <span style="font-size:2rem;font-weight:900;color:var(--color-secondary-sales)">€69,00</span>
              <span style="text-decoration:line-through;color:var(--color-grey-4);font-size:1.25rem">€129,90</span>
              <span style="background:var(--color-secondary-sales);color:#fff;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700">-47%</span>
            </div>
            <p style="font-size:12px;color:var(--color-grey-7);margin-top:4px">inkl. MwSt. zzgl. Versand</p>
          </div>
        </div>

        <!-- Flavor selectors (combo) -->
        <div style="margin-bottom:32px">
          <h3 style="font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
            <span style="display:inline-block;width:3px;height:16px;background:var(--color-grey-6);border-radius:2px"></span>
            Konfiguriere dein Bundle
          </h3>
          <div class="product-options" id="combo-options">
            ${comboSelectorsHTML}
          </div>
        </div>

        <!-- Add to cart button — uses ESN theme CTA style -->
        <form id="combo-form" method="post" action="/cart/add" novalidate>
          <input type="hidden" name="id" value="${COMBO_VARIANT_ID}">
          <input type="hidden" name="quantity" value="1">
          <input type="hidden" id="combo-props-input" name="properties[Bundle-Konfiguration]" value="">

          <button type="submit" id="combo-add-to-cart"
            class="product-form__add-to-cart button button--primary button--large"
            style="width:100%;padding:18px 24px;background:var(--color-conversion-primary-cta);color:#fff;border:none;border-radius:50px;font-size:1.125rem;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;justify-content:center;gap:12px;transition:opacity .2s;font-family:var(--font-family-text)"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            In den Warenkorb · €69,00
          </button>
        </form>

        <!-- Trust signals -->
        <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;font-size:12px;color:var(--color-grey-7);flex-wrap:wrap">
          <span>✓ Kostenloser Versand ab €75</span>
          <span>✓ 30 Tage Rückgabe</span>
          <span>✓ Lieferzeit 2-4 Werktage</span>
        </div>
      </div>
    </div>

    <!-- What's inside section -->
    <section style="margin-top:80px;padding-top:60px;border-top:1px solid var(--color-grey-2)">
      <h2 style="font-family:var(--font-family-display);font-size:1.75rem;font-weight:600;text-transform:uppercase;text-align:center;margin-bottom:40px;letter-spacing:-.3px">
        Was im Bundle enthalten ist
      </h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px">
        ${COMBO_ITEMS.map(item => `
        <div style="background:#fff;border-radius:16px;padding:20px 16px;text-align:center;border:1.5px solid var(--color-grey-2);transition:all .2s;cursor:pointer"
          onmouseenter="this.style.borderColor='#000';this.style.transform='translateY(-3px)'"
          onmouseleave="this.style.borderColor='var(--color-grey-2)';this.style.transform='none'"
        >
          <div style="width:80px;height:80px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center">
            <img src="${item.image}?width=200" alt="${item.name}" style="max-width:100%;max-height:100%;object-fit:contain" loading="lazy">
          </div>
          <div style="font-size:11px;font-weight:800;margin-bottom:4px;text-transform:uppercase;line-height:1.3;color:var(--color-grey-6)">${item.name}</div>
          <div style="font-size:11px;color:var(--color-grey-7)">${item.size}</div>
        </div>`).join('\n')}
      </div>
    </section>

    <!-- Description -->
    <section style="max-width:800px;margin:80px auto 0;padding-top:60px;border-top:1px solid var(--color-grey-2)">
      <h2 style="font-family:var(--font-family-display);font-size:1.5rem;font-weight:600;text-transform:uppercase;margin-bottom:20px">Maximale Leistung im Bundle</h2>
      <p style="font-size:15px;line-height:1.8;color:var(--color-grey-5);margin-bottom:32px">
        Das <strong>ESN Elite Leistung Combo</strong> ist das ultimative Paket für Athleten, die keine Kompromisse eingehen.
        Alle 7 Produkte sind laborgeprüft, made in Germany und aufeinander abgestimmt —
        für optimale Leistung vor, während und nach dem Training.
      </p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div>
          <h4 style="font-weight:800;text-transform:uppercase;font-size:13px;margin-bottom:8px">Pre-Workout &amp; Fokus</h4>
          <p style="font-size:13px;color:var(--color-grey-7);line-height:1.6">ESN Crank + Ultrapure Creatine für maximale Energie und Kraft im Training.</p>
        </div>
        <div>
          <h4 style="font-weight:800;text-transform:uppercase;font-size:13px;margin-bottom:8px">Muskelaufbau &amp; Recovery</h4>
          <p style="font-size:13px;color:var(--color-grey-7);line-height:1.6">Designer Whey + Isoclear + EAA für optimale Proteinversorgung und schnelle Regeneration.</p>
        </div>
        <div>
          <h4 style="font-weight:800;text-transform:uppercase;font-size:13px;margin-bottom:8px">Mikronährstoffe</h4>
          <p style="font-size:13px;color:var(--color-grey-7);line-height:1.6">Vitamin Stack + Omega-3 decken den erhöhten Bedarf aktiver Sportler.</p>
        </div>
        <div>
          <h4 style="font-weight:800;text-transform:uppercase;font-size:13px;margin-bottom:8px">Individuelle Konfiguration</h4>
          <p style="font-size:13px;color:var(--color-grey-7);line-height:1.6">Wähle für jedes Produkt deinen Lieblingsgeschmack — ganz individuell.</p>
        </div>
      </div>
    </section>
  </div>
</section>

<style>
@media (min-width:900px) {
  .combo-grid { grid-template-columns: 1.1fr 1fr !important; }
}
.combo-select:focus { border-color: var(--color-grey-6) !important; }
.combo-select:hover { border-color: var(--color-grey-4) !important; }
</style>

<script>
(function() {
  // Gallery switching
  document.querySelectorAll('[data-combo-thumb]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var idx = parseInt(this.getAttribute('data-combo-thumb'));
      var imgs = ${JSON.stringify(COMBO_ITEMS.map(i => i.image))};
      var el = document.getElementById('combo-img-el');
      if (el) { el.style.opacity = '0'; setTimeout(function() { el.src = imgs[idx] + '?width=900'; el.style.opacity = '1'; }, 150); }
      document.querySelectorAll('[data-combo-thumb]').forEach(function(b) {
        b.style.border = '1.5px solid var(--color-grey-2)';
      });
      this.style.border = '2px solid #000';
    });
  });

  // Select change → update label + gallery
  document.querySelectorAll('.combo-select').forEach(function(sel, idx) {
    sel.addEventListener('change', function() {
      var key = this.getAttribute('data-combo-key');
      var labelEl = document.querySelector('.combo-sel-label-' + key);
      var itemIdx = ${JSON.stringify(COMBO_ITEMS.map(i => i.key))}.indexOf(key);
      var imgs = ${JSON.stringify(COMBO_ITEMS.map(i => i.image))};
      var sizes = ${JSON.stringify(COMBO_ITEMS.map(i => i.size))};
      if (labelEl) labelEl.textContent = sizes[itemIdx] + ' · ' + this.value;
      // Switch gallery to selected product
      if (itemIdx >= 0) {
        var el = document.getElementById('combo-img-el');
        if (el) { el.style.opacity = '0'; setTimeout(function() { el.src = imgs[itemIdx] + '?width=900'; el.style.opacity = '1'; }, 150); }
        document.querySelectorAll('[data-combo-thumb]').forEach(function(b) { b.style.border = '1.5px solid var(--color-grey-2)'; });
        var activeThumb = document.querySelector('[data-combo-thumb="' + itemIdx + '"]');
        if (activeThumb) activeThumb.style.border = '2px solid #000';
      }
      updateProps();
    });
  });

  function updateProps() {
    var parts = [];
    document.querySelectorAll('.combo-select').forEach(function(sel) {
      var key = sel.getAttribute('data-combo-key');
      var names = ${JSON.stringify(COMBO_ITEMS.reduce((acc, i) => { acc[i.key] = i.name; return acc; }, {}))};
      parts.push(names[key] + ': ' + sel.value);
    });
    var inp = document.getElementById('combo-props-input');
    if (inp) inp.value = parts.join(' | ');
  }
  updateProps();
})();
</script>
`;

// ── Inject into template ─────────────────────────────────────────────────────
let html = template;

// 1. Update title
html = html.replace(/<title>[^<]*<\/title>/, '<title>ESN Elite Leistung Combo | 7 Premium Produkte im Bundle</title>');

// 2. Update canonical & og:url
html = html.replace(/rel="canonical"[^>]*>/g, 'rel="canonical">');
html = html.replace(/<link href="\/store\/products_esn-isoclear-whey-isolate\.html" rel="canonical">/, '<link href="/store/products_esn-elite-leistung-combo.html" rel="canonical">');

// 3. Update page handle in cnvs
html = html.replace(/handle: "esn-isoclear-whey-isolate"/, 'handle: "esn-elite-leistung-combo"');
html = html.replace(/path: "\/products\/esn-isoclear-whey-isolate"/, 'path: "/products/esn-elite-leistung-combo"');

// 4. Update main product image preload (first img tag)
html = html.replace(
  /imagesrcset="[^"]*Isoclear[^"]*"/,
  `imagesrcset="${MAIN_IMAGE}?width=360 360w, ${MAIN_IMAGE}?width=720 720w"`
);

// 5. Find main content area and replace with combo product section
// Look for the main shopify-section with product content
const mainSectionStart = html.indexOf('<div id="shopify-section-main-product"');
const mainSectionEnd = html.indexOf('</main>', mainSectionStart);

if (mainSectionStart !== -1 && mainSectionEnd !== -1) {
  html = html.substring(0, mainSectionStart) + PRODUCT_SECTION + html.substring(mainSectionEnd);
} else {
  // Fallback: inject before closing body
  const bodyClose = html.lastIndexOf('</body>');
  if (bodyClose !== -1) {
    html = html.substring(0, bodyClose) + PRODUCT_SECTION + html.substring(bodyClose);
  }
}

// 6. Update window.cnvs.product with combo variant data
const cnvsProductReplacement = `
  window.cnvs.product = {
    clothingSizeOptions: ["größe","size"],
    colorOptions: ["farbe","color"],
    defaultSizeValue: "Bundle",
    deliveryTime: "2-4",
    immediateDelivery: ["1-3","2-4"],
    excludedInitialSelectOptions: [],
    flavourOptions: ["geschmack","taste"],
    imageRatio: "1:1",
    lowInventoryThreshold: 90,
    optionSorting: [],
    sampleSizeValue: [],
    sizeOptions: [],
    sizeOptionSorting: [],
    datalayerCategoryTags: ["bundle"],
    unitPriceLink: null,
    variantSorting: [],
    depositProductID: null,
    maxCartProducts: 400,
    maxLineItems: 60,
    overlayProductOptionsTile: [],
    variants: [{
      id: ${COMBO_VARIANT_ID},
      title: "Bundle",
      price: ${COMBO_PRICE_CENTS},
      compare_at_price: ${ORIG_PRICE_CENTS},
      available: true,
      inventory_management: null,
      inventory_policy: "continue",
      options: ["Bundle"],
    }],
  }`;

// Replace existing window.cnvs.product block
html = html.replace(/window\.cnvs\.product = \{[\s\S]*?\}(?=\s*window\.cnvs\.settings)/, cnvsProductReplacement);

fs.writeFileSync('/Users/ulissescardoso/suplements/public/store/products_esn-elite-leistung-combo.html', html);
console.log('Done! File created: products_esn-elite-leistung-combo.html');
console.log('Size:', Math.round(fs.statSync('/Users/ulissescardoso/suplements/public/store/products_esn-elite-leistung-combo.html').size / 1024) + 'KB');
