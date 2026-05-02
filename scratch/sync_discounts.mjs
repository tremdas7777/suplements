import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4; // 40%

// 1. Get all bestseller collection files
const collectionFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('collections_') && f.includes('bestseller'));

const uniqueProducts = new Set();
collectionFiles.forEach(colFile => {
    const content = fs.readFileSync(path.join(STORE_DIR, colFile), 'utf8');
    const productLinks = [...content.matchAll(/href="\/store\/(products_[^"]+\.html)"/g)].map(m => m[1]);
    productLinks.forEach(p => uniqueProducts.add(p));
});

console.log(`Found ${uniqueProducts.size} unique products in all bestseller collections.`);

// 2. Patch Collection Files with Injected Script to synchronize prices
collectionFiles.forEach(colFile => {
    const filePath = path.join(STORE_DIR, colFile);
    let html = fs.readFileSync(filePath, 'utf8');

    const discountScript = `
<script id="sys-collection-discount">
(function() {
    function applyDiscount() {
        // Target BOTH standard product cards and sample cards
        const cards = document.querySelectorAll('.product-card, .product-card-sample');
        cards.forEach(card => {
            if (card.getAttribute('data-discounted')) return;
            
            // Look for price elements
            const priceEl = card.querySelector('.product-prices__price') || card.querySelector('.product-card__prices');
            if (!priceEl) return;
            
            const text = priceEl.innerText.trim();
            if (!text) return;

            const match = text.match(/(\\d+),(\\d+)/);
            if (match) {
                card.setAttribute('data-discounted', 'true');
                const euros = parseInt(match[1]);
                const cents = parseInt(match[2]);
                const oldPriceNum = euros + (cents / 100);
                
                // If the price is already suspiciously low/high or if we want to be sure it matches the product page:
                // We apply 40% discount to whatever was scraped originally.
                const newPriceNum = oldPriceNum * (1 - ${DISCOUNT});
                const newPriceStr = newPriceNum.toFixed(2).replace('.', ',');
                const oldPriceStr = oldPriceNum.toFixed(2).replace('.', ',');
                
                priceEl.innerHTML = '<span style="color: #b70832; font-weight: bold;">€' + newPriceStr + '</span> ' +
                                   '<span style="text-decoration: line-through; color: #8d9093; font-size: 0.8em; margin-left: 5px;">€' + oldPriceStr + '</span>' +
                                   '<div style="position: absolute; top: 10px; left: 10px; background: #b70832; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 10;">-40%</div>';
            }
        });
    }
    applyDiscount();
    setInterval(applyDiscount, 1000);
})();
</script>`;

    if (html.includes('id="sys-collection-discount"')) {
        html = html.replace(/<script id="sys-collection-discount">[\s\S]*?<\/script>/, discountScript);
    } else {
        html = html.replace('</body>', discountScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
    console.log(`Updated collection: ${colFile}`);
});

// 3. Re-run Product Patching to ensure consistency
uniqueProducts.forEach(prodFile => {
    const filePath = path.join(STORE_DIR, prodFile);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');
    
    // Ensure all disabled elements are gone
    html = html.replace(/(<input[^>]+)\bdisabled\b([^>]*>)/g, '$1$2');
    html = html.replace(/(<button[^>]+)\bdisabled\b([^>]*>)/g, '$1$2');
    html = html.replace(/\bis-loading\b/g, '');
    html = html.replace(/\bopacity-50\b/g, '');
    html = html.replace(/\bselection-tab--disabled\b/g, '');

    // Ensure JSON is discounted
    if (!html.includes('id="sys-json-v2-discounted"')) {
        html = html.replace(/"price":\s*(\d+)/g, (match, p1) => {
            const newCents = Math.round(parseInt(p1) * (1 - DISCOUNT));
            return `"price":${newCents}`;
        });
        html = html.replace('</body>', '<script id="sys-json-v2-discounted"></script></body>');
    }

    // Ensure Product UI Script is latest and matches Collection logic
    const productUiScript = `
<script id="sys-discount-badge">
(function() {
    function applyUI() {
        const priceEls = document.querySelectorAll('.product-prices__price, .product-prices, .price-item');
        priceEls.forEach(el => {
            const currentText = el.innerText.trim();
            if (!currentText || el.getAttribute('data-last-text') === currentText) return;
            el.setAttribute('data-last-text', currentText);
            
            const match = currentText.match(/(\\d+),(\\d+)/);
            if (match) {
                const euros = parseInt(match[1]);
                const cents = parseInt(match[2]);
                const currentPrice = euros + (cents/100);
                
                // IMPORTANT: In product page, the HTML text might ALREADY be discounted by our static replace
                // or Shopify JS might have overwritten it with raw prices.
                // To be safe and consistent with collection, we assume the price shown is the DISCOUNTED one
                // and we calculate the OLD price back to show it.
                const oldPriceNum = (currentPrice / (1 - ${DISCOUNT})).toFixed(2).replace('.', ',');
                
                el.innerHTML = '<span style="color: #b70832; font-weight: bold;">€' + currentPrice.toFixed(2).replace('.', ',') + '</span> ' +
                               '<span style="text-decoration: line-through; color: #8d9093; font-size: 0.8em; margin-left: 8px;">€' + oldPriceNum + '</span> ' +
                               '<span style="background: #b70832; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px; vertical-align: middle;">-40%</span>';
            }
        });
    }
    applyUI();
    setInterval(applyUI, 1000);
})();
</script>`;

    if (html.includes('id="sys-discount-badge"')) {
        html = html.replace(/<script id="sys-discount-badge">[\s\S]*?<\/script>/, productUiScript);
    } else {
        html = html.replace('</body>', productUiScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
});

console.log(`Finished synchronizing discounts across collections and products.`);
