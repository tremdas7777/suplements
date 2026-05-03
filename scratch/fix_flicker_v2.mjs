import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

// Minimal script: NO variant rendering (let ESN theme do it)
// Only: price patch + click intercept + form intercept
const NEW_SCRIPT = `<script id="sys-cart-fix">
(function() {
    'use strict';
    var __pricePatched = false;

    // URL rewriter
    function fixUrl(url) {
        if (!url) return null;
        var p = url;
        if (url.indexOf('http') === 0) {
            try {
                var u = new URL(url);
                if (u.hostname !== 'localhost' && u.hostname !== 'wwwesncomqedu.arktrix.com' && u.hostname !== 'www.esn.com') return null;
                p = u.pathname + u.search;
            } catch(e) { return null; }
        }
        if (p.indexOf('/') === 0 && p.indexOf('.html') < 0 && p.indexOf('.') < 0) {
            var parts = p.split('?')[0].split('/').filter(Boolean);
            if (parts.length >= 2) return '/store/' + parts[0] + '_' + parts.slice(1).join('_') + '.html';
        }
        return null;
    }

    // Apply 40% discount to price element — reads from variant data, NOT from DOM
    function applyDiscount() {
        if (!window.cnvs || !window.cnvs.product) return;
        var variants = window.cnvs.product.variants;
        if (!variants || !variants.length) return;

        var idInput = document.querySelector('input[name="id"]');
        var selectedId = idInput ? parseInt(idInput.value) : null;
        var variant = (selectedId && variants.find(function(v){return v.id===selectedId;})) || variants[0];
        if (!variant) return;

        var priceEl = document.querySelector('.product-prices__price');
        if (!priceEl) return;
        // Prevent double-application
        if (priceEl.getAttribute('data-sys-v') === String(variant.id)) return;

        var orig = variant.price / 100;           // cents → euros (original)
        var disc = (orig * 0.6).toFixed(2).replace('.', ',');
        var origFmt = orig.toFixed(2).replace('.', ',');

        priceEl.setAttribute('data-sys-v', variant.id);
        priceEl.innerHTML =
            '<div style="display:flex;flex-direction:column;gap:4px">' +
              '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
                '<span style="font-size:24px;font-weight:900;color:#b70832">\\u20AC' + disc + '</span>' +
                '<span style="text-decoration:line-through;color:#8d9093;font-size:16px">\\u20AC' + origFmt + '</span>' +
                '<span style="background:#b70832;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">-40%</span>' +
              '</div>' +
              '<span style="font-size:12px;color:#6b7280">inkl. MwSt. zzgl. Versand</span>' +
            '</div>';
    }

    // Watch only the price element (not body!) for ESN theme resets
    function watchPrice() {
        var priceEl = document.querySelector('.product-prices__price');
        if (!priceEl) return;
        var obs = new MutationObserver(function() {
            // ESN reset our patch → re-apply, but only if data-sys-v is gone
            if (!priceEl.getAttribute('data-sys-v')) applyDiscount();
        });
        obs.observe(priceEl, { childList: true, characterData: true, subtree: true });
    }

    // Also re-patch when user selects a variant (ESN theme changes variant)
    function watchVariantChange() {
        document.addEventListener('change', function(e) {
            if (e.target && e.target.name === 'id') {
                var priceEl = document.querySelector('.product-prices__price');
                if (priceEl) priceEl.removeAttribute('data-sys-v');
                setTimeout(applyDiscount, 100);
            }
        });
        // ESN uses custom events too
        document.addEventListener('variant:change', function() {
            var priceEl = document.querySelector('.product-prices__price');
            if (priceEl) priceEl.removeAttribute('data-sys-v');
            setTimeout(applyDiscount, 100);
        });
    }

    function tryInit() {
        if (window.cnvs && window.cnvs.product) {
            // Wait for ESN theme to render first, THEN patch price
            setTimeout(function() { applyDiscount(); watchPrice(); watchVariantChange(); }, 800);
        } else {
            setTimeout(tryInit, 200);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

    // Click interceptor
    document.addEventListener('click', function(e) {
        var target = e.target.closest('a,[href],[data-href],[data-url]');
        if (!target) return;
        var url = target.getAttribute('href') || target.getAttribute('data-href') || target.getAttribute('data-url');
        if (!url || url === '#' || url.indexOf('javascript:') === 0 || url.indexOf('mailto:') === 0) return;
        var fixed = fixUrl(url);
        var finalUrl = fixed || url;
        if (finalUrl.indexOf('/checkout') >= 0) {
            window.parent.postMessage({ t: 'sys-checkout' }, '*');
            e.preventDefault(); e.stopPropagation(); return;
        }
        window.parent.postMessage({ t: 'sys-click', u: finalUrl }, '*');
        e.preventDefault(); e.stopPropagation();
    }, true);

    // Form submit interceptor
    document.addEventListener('submit', function(e) {
        var form = e.target;
        if (!form) return;
        var isCart = (form.action && form.action.indexOf('/cart/add') >= 0) ||
                     !!form.querySelector('.product-form__add-to-cart') ||
                     !!form.querySelector('[name="add"]');
        if (!isCart) return;
        e.preventDefault(); e.stopPropagation();
        var formData = new FormData(form);
        var price = 0;
        if (window.cnvs && window.cnvs.product) {
            var variants = window.cnvs.product.variants;
            var idInput = document.querySelector('input[name="id"]');
            var sid = idInput ? parseInt(idInput.value) : null;
            var v = (sid && variants.find(function(x){return x.id===sid;})) || variants[0];
            if (v) price = Math.round(v.price * 0.6) / 100;
        }
        var item = {
            id: formData.get('id') || 'id-' + Math.random().toString(36).substr(2,9),
            quantity: parseInt(formData.get('quantity')) || 1,
            title: (document.querySelector('h1') && document.querySelector('h1').innerText.trim()) || document.title.split('|')[0].trim(),
            price: price
        };
        var img = document.querySelector('.product-media__image') || document.querySelector('.product-media img');
        if (img) item.image = img.src;
        window.parent.postMessage({ t: 'sys-add-to-cart', item: item }, '*');
    }, true);
})();
</script>`;

const MOBILE_META = '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">';

let count = 0;
files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix viewport
    if (!html.includes('name="viewport"')) {
        html = html.replace('<head>', '<head>\n' + MOBILE_META);
        changed = true;
    }

    // Remove old competing scripts
    html = html.replace(/<script id="sys-select-cheapest">[\s\S]*?<\/script>/g, '');
    html = html.replace(/<script id="sys-json-v2-discounted"><\/script>/g, '');
    html = html.replace(/<script id="sys-discount-badge">[\s\S]*?<\/script>/g, '');

    // Replace sys-cart-fix
    const re = /<script id="sys-cart-fix">[\s\S]*?<\/script>/;
    if (re.test(html)) {
        html = html.replace(re, NEW_SCRIPT);
        changed = true;
    } else {
        html = html.replace('</html>', NEW_SCRIPT + '\n</html>');
        changed = true;
    }

    if (changed) { fs.writeFileSync(filePath, html); count++; }
});
console.log('Done: ' + count + ' files updated.');
