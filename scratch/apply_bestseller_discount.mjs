import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4; // 40%

// 1. Get products in bestseller collection
const bestsellerFile = path.join(STORE_DIR, 'collections_bestseller.html');
const content = fs.readFileSync(bestsellerFile, 'utf8');
const productLinks = [...content.matchAll(/href="\/store\/(products_[^"]+\.html)"/g)].map(m => m[1]);
const uniqueProducts = [...new Set(productLinks)];

console.log(`Found ${uniqueProducts.length} unique products in bestseller collection.`);

uniqueProducts.forEach(prodFile => {
    const filePath = path.join(STORE_DIR, prodFile);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');
    
    // Extract current price from meta tag
    const priceMatch = html.match(/<meta property="product:price:amount" content="([^"]+)"/);
    if (!priceMatch) {
        console.log(`Skipping ${prodFile}: No price meta tag found.`);
        return;
    }

    const oldPriceStr = priceMatch[1];
    const oldPriceNum = parseFloat(oldPriceStr.replace(',', '.'));
    
    if (isNaN(oldPriceNum)) return;

    const newPriceNum = (oldPriceNum * (1 - DISCOUNT)).toFixed(2);
    const newPriceDisplay = newPriceNum.replace('.', ',');

    console.log(`Updating ${prodFile}: ${oldPriceStr} -> ${newPriceDisplay}`);

    // Replace in meta tags
    html = html.replace(/<meta property="product:price:amount" content="[^"]+"/g, `<meta property="product:price:amount" content="${newPriceDisplay}"`);
    
    // Replace everywhere else the exact old price string appears
    // We escape it just in case
    const escapedOldPrice = oldPriceStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(escapedOldPrice, 'g'), newPriceDisplay);

    // Add a discount badge script to show the old price struck through
    if (!html.includes('id="sys-discount-badge"')) {
        const discountScript = `
<script id="sys-discount-badge">
(function() {
    function applyUI() {
        const priceEls = document.querySelectorAll('.product-prices__price, .product-prices, .price-item');
        priceEls.forEach(el => {
            if (el.getAttribute('data-discounted')) return;
            el.setAttribute('data-discounted', 'true');
            
            const currentText = el.innerText.trim();
            if (currentText.includes('€') || currentText.match(/\\d+,\\d+/)) {
                const oldPrice = (${oldPriceNum}).toFixed(2).replace('.', ',');
                const newPrice = el.innerText.trim();
                
                el.innerHTML = '<span style="color: #b70832; font-weight: bold;">' + newPrice + '</span> ' +
                               '<span style="text-decoration: line-through; color: #8d9093; font-size: 0.8em; margin-left: 8px;">€' + oldPrice + '</span> ' +
                               '<span style="background: #b70832; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px; vertical-align: middle;">-40%</span>';
            }
        });
    }
    applyUI();
    setInterval(applyUI, 1000);
})();
</script>`;
        html = html.replace('</body>', discountScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
});

// 2. Also inject a script into the collection page to handle all products there
let bestsellerHtml = fs.readFileSync(bestsellerFile, 'utf8');
if (!bestsellerHtml.includes('id="sys-collection-discount"')) {
    const collectionScript = `
<script id="sys-collection-discount">
(function() {
    function applyDiscount() {
        const cards = document.querySelectorAll('.product-card, .product-card-sample');
        cards.forEach(card => {
            if (card.getAttribute('data-discounted')) return;
            const priceEl = card.querySelector('.product-prices__price') || card.querySelector('.product-card__prices');
            if (!priceEl) return;
            
            const text = priceEl.innerText.trim();
            const match = text.match(/(\\d+),(\\d+)/);
            if (match) {
                card.setAttribute('data-discounted', 'true');
                const euros = parseInt(match[1]);
                const cents = parseInt(match[2]);
                const oldPriceNum = euros + (cents / 100);
                const newPriceNum = oldPriceNum * 0.6;
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
    bestsellerHtml = bestsellerHtml.replace('</body>', collectionScript + '</body>');
    fs.writeFileSync(bestsellerFile, bestsellerHtml);
}
