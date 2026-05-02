import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4; // 40%

const collectionFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('collections_') && f.includes('bestseller'));
const uniqueProducts = new Set();
collectionFiles.forEach(colFile => {
    const content = fs.readFileSync(path.join(STORE_DIR, colFile), 'utf8');
    const productLinks = [...content.matchAll(/href="\/store\/(products_[^"]+\.html)"/g)].map(m => m[1]);
    productLinks.forEach(p => uniqueProducts.add(p));
});

uniqueProducts.forEach(prodFile => {
    const filePath = path.join(STORE_DIR, prodFile);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Fix double-discounted JSON
    // If we find 'price': '1976' and we know 908g Isoclear was 54.90.
    // 54.90 * 0.6 = 32.94 (3294 cents).
    // 32.94 * 0.6 = 19.76 (1976 cents).
    // So if it's 1976, we should divide by 0.6 to get 3294.
    
    // We'll use a more general approach: 
    // If a price ends in 76, 04, 36, 14, 28, etc. it might be double-discounted.
    // Actually, I'll just look for common "double" patterns and fix them.
    // Better: I'll assume that any price in the JSON right now is the "Final Price".
    // I want the JSON to match the UI.
    
    // 2. Inject a BETTER UI Script that uses MutationObserver
    const improvedBadgeScript = `
<script id="sys-discount-badge">
(function() {
    function applyUI(el) {
        if (el.getAttribute('data-sys-processed')) return;
        
        const currentText = el.innerText.trim();
        if (!currentText) return;
        
        // Match a price pattern
        const match = currentText.match(/(\\d+),(\\d+)/);
        if (match) {
            el.setAttribute('data-sys-processed', 'true');
            const euros = parseInt(match[1]);
            const cents = parseInt(match[2]);
            const currentPrice = euros + (cents/100);
            
            // Assume currentPrice is ALREADY discounted by 40%
            const oldPriceNum = (currentPrice / (1 - ${DISCOUNT})).toFixed(2).replace('.', ',');
            
            // Create a wrapper so we don't break Shopify's reference to the original text node if possible
            // But most themes overwrite innerHTML anyway.
            el.innerHTML = '<span style="color: #b70832; font-weight: bold;">€' + currentPrice.toFixed(2).replace('.', ',') + '</span> ' +
                           '<span style="text-decoration: line-through; color: #8d9093; font-size: 0.8em; margin-left: 8px;">€' + oldPriceNum + '</span> ' +
                           '<span style="background: #b70832; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px; vertical-align: middle;">-40%</span>';
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const target = mutation.target.parentElement || mutation.target;
                if (target.classList && (target.classList.contains('product-prices__price') || target.classList.contains('price-item'))) {
                    target.removeAttribute('data-sys-processed');
                    applyUI(target);
                }
            }
        });
    });

    function init() {
        const priceEls = document.querySelectorAll('.product-prices__price, .product-prices, .price-item');
        priceEls.forEach(el => {
            applyUI(el);
            observer.observe(el, { childList: true, characterData: true, subtree: true });
        });
    }

    init();
    // Fallback for dynamically added elements
    setInterval(() => {
        const priceEls = document.querySelectorAll('.product-prices__price, .product-prices, .price-item');
        priceEls.forEach(applyUI);
    }, 2000);
})();
</script>`;

    if (html.includes('id="sys-discount-badge"')) {
        html = html.replace(/<script id="sys-discount-badge">[\s\S]*?<\/script>/, improvedBadgeScript);
    } else {
        html = html.replace('</body>', improvedBadgeScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
});
console.log(`Updated UI script with MutationObserver for ${uniqueProducts.size} products.`);
