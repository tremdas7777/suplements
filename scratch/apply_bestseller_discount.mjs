import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4; // 40%

// 1. Get all bestseller collection files
const collectionFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('collections_') && f.includes('bestseller'));

console.log(`Found ${collectionFiles.length} bestseller collection files.`);

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
    
    // Extract current price from meta tag (always comma version in ESN meta tags usually)
    const priceMatch = html.match(/<meta property="product:price:amount" content="([^"]+)"/);
    if (!priceMatch) {
        console.log(`Skipping ${prodFile}: No price meta tag found.`);
        return;
    }

    const priceStr = priceMatch[1]; // e.g. "20,94" or "34,90"
    
    // We need to know the ORIGINAL price to calculate the discount correctly.
    // Since we might have already updated it, let's find the old price from the badge script if it exists.
    let oldPriceNum;
    const badgeMatch = html.match(/const oldPrice = \((\d+\.?\d*)\)\.toFixed\(2\)/);
    if (badgeMatch) {
        oldPriceNum = parseFloat(badgeMatch[1]);
    } else {
        oldPriceNum = parseFloat(priceStr.replace(',', '.'));
    }

    if (isNaN(oldPriceNum)) return;

    const newPriceNum = (oldPriceNum * (1 - DISCOUNT)).toFixed(2);
    const newPriceComma = newPriceNum.replace('.', ',');
    const newPriceDot = newPriceNum;

    const oldPriceComma = oldPriceNum.toFixed(2).replace('.', ',');
    const oldPriceDot = oldPriceNum.toFixed(2);

    console.log(`Updating ${prodFile}: ${oldPriceDot} -> ${newPriceDot}`);

    // Replace all occurrences of old prices (both comma and dot versions)
    // We replace the dot version first to avoid partial replacements if they overlap (though they usually don't)
    
    // Comma version: "34,90"
    const escapedOldComma = oldPriceComma.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(escapedOldComma, 'g'), newPriceComma);

    // Dot version: "34.90"
    const escapedOldDot = oldPriceDot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(escapedOldDot, 'g'), newPriceDot);

    // Update or Add the discount badge script
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

    if (html.includes('id="sys-discount-badge"')) {
        html = html.replace(/<script id="sys-discount-badge">[\s\S]*?<\/script>/, discountScript);
    } else {
        html = html.replace('</body>', discountScript + '</body>');
    }

    fs.writeFileSync(filePath, html);
});

// 2. Collection pages handled by the script injected previously (it calculates dynamically)
console.log("Finished updating product files.");
