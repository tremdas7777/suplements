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

uniqueProducts.forEach(prodFile => {
    const filePath = path.join(STORE_DIR, prodFile);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');
    
    // Check if we already discounted JSON
    if (html.includes('id="sys-json-discounted"')) {
        console.log(`Skipping ${prodFile}: JSON already discounted.`);
        return;
    }

    // Discount JSON prices (e.g., "price":3490)
    html = html.replace(/"price":\s*(\d+)/g, (match, p1) => {
        const currentCents = parseInt(p1);
        const newCents = Math.round(currentCents * (1 - DISCOUNT));
        return `"price":${newCents}`;
    });

    // Mark as JSON discounted
    html = html.replace('</body>', '<script id="sys-json-discounted"></script></body>');

    // Also update the dynamic UI script to be the latest version
    const newBadgeScript = `
<script id="sys-discount-badge">
(function() {
    function applyUI() {
        const priceEls = document.querySelectorAll('.product-prices__price, .product-prices, .price-item');
        priceEls.forEach(el => {
            const currentText = el.innerText.trim();
            if (!currentText) return;
            
            if (el.getAttribute('data-last-text') === currentText) return;
            el.setAttribute('data-last-text', currentText);
            
            const match = currentText.match(/(\\d+),(\\d+)/);
            if (match) {
                const euros = parseInt(match[1]);
                const cents = parseInt(match[2]);
                const currentPrice = euros + (cents/100);
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
        html = html.replace(/<script id="sys-discount-badge">[\s\S]*?<\/script>/, newBadgeScript);
    } else {
        html = html.replace('</body>', newBadgeScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
    console.log(`Updated JSON and script for ${prodFile}`);
});
