import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

// ─── NEW UNIFIED SCRIPT ────────────────────────────────────────────────────
// Replaces sys-cart-fix. No more MutationObserver on document.body.
// One-shot: waits for cnvs.product to be ready, then renders once.
// Also handles click interception and cart form submit.
const NEW_CART_FIX = `<script id="sys-cart-fix">
(function() {
    'use strict';

    // ── URL rewriter (iframe navigation) ──────────────────────────────────
    const fixUrl = (url) => {
        if (!url) return null;
        let p = url;
        if (url.startsWith('http')) {
            try {
                const u = new URL(url);
                if (u.hostname !== 'localhost' &&
                    u.hostname !== 'wwwesncomqedu.arktrix.com' &&
                    u.hostname !== 'www.esn.com') return null;
                p = u.pathname + u.search;
            } catch(e) { return null; }
        }
        if (p.startsWith('/') && !p.endsWith('.html') && !p.includes('.')) {
            const parts = p.split('?')[0].split('/').filter(Boolean);
            if (parts.length >= 2) {
                return '/store/' + parts[0] + '_' + parts.slice(1).join('_') + '.html';
            }
        }
        return null;
    };

    // ── Price display ─────────────────────────────────────────────────────
    function renderPrice(priceEl, variantPriceCents) {
        if (!priceEl) return;
        const orig = variantPriceCents / 100;
        const disc = (orig * 0.6).toFixed(2).replace('.', ',');
        const origFmt = orig.toFixed(2).replace('.', ',');
        priceEl.innerHTML =
            '<div style="display:flex;flex-direction:column;gap:4px">' +
              '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
                '<span style="font-size:24px;font-weight:900;color:#b70832">€' + disc + '</span>' +
                '<span style="text-decoration:line-through;color:#8d9093;font-size:16px">€' + origFmt + '</span>' +
                '<span style="background:#b70832;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">-40%</span>' +
              '</div>' +
              '<span style="font-size:12px;color:#6b7280">inkl. MwSt. zzgl. Versand</span>' +
            '</div>';
    }

    // ── Variant UI renderer ───────────────────────────────────────────────
    let selectedOptions = {};
    let rendered = false;

    function renderVariants(product) {
        const container = document.querySelector('.product-options');
        if (!container) return;
        // If already processed and not in loading state, skip completely
        if (rendered && !container.innerText.includes('Wird geladen')) return;

        const { options, variants } = product;

        if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
            options.forEach(opt => { selectedOptions[opt.name] = opt.values[0]; });
        }

        function applyVariant() {
            const variant = variants.find(v =>
                v.selectedOptions.every(so => selectedOptions[so.name] === so.value)
            ) || variants[0];
            if (!variant) return;

            const idInput = document.querySelector('input[name="id"]');
            if (idInput) idInput.value = variant.id;

            const priceEl = document.querySelector('.product-prices__price');
            renderPrice(priceEl, variant.price);

            if (variant.imageUrl) {
                const img = document.querySelector('.product-media__image') ||
                            document.querySelector('.product-media img');
                if (img) img.src = variant.imageUrl;
            }
        }

        function buildUI() {
            container.innerHTML = '';
            options.forEach(opt => {
                const optDiv = document.createElement('div');
                optDiv.className = 'product-options__option';
                optDiv.style.cssText = 'margin-bottom:20px';
                optDiv.innerHTML = '<h4 style="margin-bottom:12px;font-weight:800;text-transform:uppercase;font-size:14px">' + opt.name + '</h4>';

                const grid = document.createElement('div');
                // Mobile-friendly grid: 2 cols on small, auto on large
                grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:8px';

                opt.values.forEach(val => {
                    const isSelected = selectedOptions[opt.name] === val;
                    const btn = document.createElement('div');
                    btn.className = 'sys-variant-btn';
                    btn.style.cssText =
                        'border:' + (isSelected ? '2px solid #000' : '1px solid #e5e7eb') + ';' +
                        'padding:12px;border-radius:12px;cursor:pointer;' +
                        'background:' + (isSelected ? '#f9fafb' : '#fff') + ';' +
                        'display:flex;flex-direction:column;justify-content:center;' +
                        'min-height:44px;touch-action:manipulation'; // 44px min = Apple HIG touch target
                    btn.innerHTML = '<p style="margin:0;font-weight:' + (isSelected ? '700' : '500') + ';font-size:14px">' + val + '</p>';
                    btn.addEventListener('click', (e) => {
                        e.preventDefault(); e.stopPropagation();
                        selectedOptions[opt.name] = val;
                        buildUI();
                        applyVariant();
                    }, { passive: false });
                    grid.appendChild(btn);
                });

                optDiv.appendChild(grid);
                container.appendChild(optDiv);
            });
            container.setAttribute('data-sys-processed', 'true');
            rendered = true;
        }

        buildUI();
        applyVariant();
    }

    // ── Wait for cnvs.product then render ONCE ────────────────────────────
    function tryInit() {
        if (window.cnvs && window.cnvs.product) {
            renderVariants(window.cnvs.product);

            // Watch ONLY .product-options for the "Wird geladen" reset by ESN theme
            const container = document.querySelector('.product-options');
            if (container) {
                const obs = new MutationObserver(() => {
                    if (container.innerText.includes('Wird geladen') || !container.hasAttribute('data-sys-processed')) {
                        rendered = false;
                        renderVariants(window.cnvs.product);
                    }
                });
                obs.observe(container, { childList: true, subtree: true, characterData: true });
            }
        } else {
            setTimeout(tryInit, 200);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

    // ── Click interceptor (delegate to parent frame) ──────────────────────
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a,[href],[data-href],[data-url]');
        if (!target) return;
        const url = target.getAttribute('href') || target.getAttribute('data-href') || target.getAttribute('data-url');
        if (!url || url === '#' || url.startsWith('javascript:') || url.startsWith('mailto:')) return;
        const fixed = fixUrl(url);
        const finalUrl = fixed || url;
        if (finalUrl.includes('/checkout')) {
            window.parent.postMessage({ t: 'sys-checkout' }, '*');
            e.preventDefault(); e.stopPropagation(); return;
        }
        window.parent.postMessage({ t: 'sys-click', u: finalUrl }, '*');
        e.preventDefault(); e.stopPropagation();
    }, true);

    // ── Cart form interceptor ─────────────────────────────────────────────
    document.addEventListener('submit', (e) => {
        const form = e.target;
        if (!form) return;
        const isCartForm = form.action?.includes('/cart/add') ||
                           !!form.querySelector('.product-form__add-to-cart') ||
                           !!form.querySelector('[name="add"]');
        if (!isCartForm) return;
        e.preventDefault(); e.stopPropagation();
        const formData = new FormData(form);
        // Use price from our rendered element (already discounted)
        const priceEl = document.querySelector('.product-prices__price span');
        const priceText = priceEl?.innerText || '0';
        const item = {
            id: formData.get('id') || 'id-' + Math.random().toString(36).substr(2, 9),
            quantity: parseInt(formData.get('quantity')) || 1,
            title: document.querySelector('h1')?.innerText.trim() || document.title.split('|')[0].trim(),
            price: parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0
        };
        const img = document.querySelector('.product-media__image') || document.querySelector('.product-media img');
        if (img) item.image = img.src;
        window.parent.postMessage({ t: 'sys-add-to-cart', item }, '*');
    }, true);
})();
</script>`;

// ─── MOBILE META TAG ──────────────────────────────────────────────────────
// Ensure proper viewport for mobile
const MOBILE_META = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">';

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Fix mobile viewport meta
    if (!html.includes('name="viewport"')) {
        html = html.replace('<head>', '<head>\n' + MOBILE_META);
        changed = true;
    } else if (!html.includes('width=device-width')) {
        // Fix incorrect viewport
        html = html.replace(/<meta[^>]+name="viewport"[^>]*>/i, MOBILE_META);
        changed = true;
    }

    // 2. Remove the broken sys-select-cheapest script (causes extra clicks → flickering)
    const selectCheapestRe = /<script id="sys-select-cheapest">[\s\S]*?<\/script>/;
    if (selectCheapestRe.test(html)) {
        html = html.replace(selectCheapestRe, '<!-- sys-select-cheapest removed -->');
        changed = true;
    }

    // 3. Remove the empty sys-json-v2-discounted (dead code)
    html = html.replace(/<script id="sys-json-v2-discounted"><\/script>/g, '');

    // 4. Replace sys-cart-fix with the new stable version
    const cartFixRe = /<script id="sys-cart-fix">[\s\S]*?<\/script>/;
    if (cartFixRe.test(html)) {
        html = html.replace(cartFixRe, NEW_CART_FIX);
        changed = true;
    } else {
        // Add before </html> if missing
        html = html.replace('</html>', NEW_CART_FIX + '\n</html>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html);
        updatedCount++;
    }
});

console.log(`✅ Fixed ${updatedCount} files: flickering resolved + mobile viewport added.`);
