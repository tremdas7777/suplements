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
    
    // Check if we already discounted JSON with the NEW aggressive logic
    if (html.includes('id="sys-json-v2-discounted"')) {
        console.log(`Skipping ${prodFile}: JSON v2 already discounted.`);
        return;
    }

    // Agressive replacement for various price formats in JS/JSON
    // 1. "price": "4290" or price: "4290" or "price": 4290
    html = html.replace(/(?:["']?price["']?\s*:\s*["']?)(\d+)(?:["']?)/g, (match, p1) => {
        // Only treat as cents if it's a long enough number (usually > 100) 
        // OR if it's clearly a price field.
        const currentCents = parseInt(p1);
        if (currentCents > 0) {
            const newCents = Math.round(currentCents * (1 - DISCOUNT));
            // We need to preserve the surrounding quotes/structure
            return match.replace(p1, String(newCents));
        }
        return match;
    });

    // 2. "Value": "34,90" or Value: "34,90"
    html = html.replace(/(?:["']?Value["']?\s*:\s*["']?)([\d,.]+)(?:["']?)/g, (match, p1) => {
        const val = parseFloat(p1.replace(',', '.'));
        if (!isNaN(val) && val > 0) {
            const newVal = (val * (1 - DISCOUNT)).toFixed(2).replace('.', ',');
            return match.replace(p1, newVal);
        }
        return match;
    });

    // 3. "Price": "€34,90"
    html = html.replace(/(?:["']?Price["']?\s*:\s*["']?)(€[\d,.]+)(?:["']?)/g, (match, p1) => {
        const val = parseFloat(p1.replace('€', '').replace(',', '.'));
        if (!isNaN(val) && val > 0) {
            const newVal = '€' + (val * (1 - DISCOUNT)).toFixed(2).replace('.', ',');
            return match.replace(p1, newVal);
        }
        return match;
    });

    // Mark as JSON v2 discounted
    if (html.includes('id="sys-json-discounted"')) {
        html = html.replace('id="sys-json-discounted"', 'id="sys-json-v2-discounted"');
    } else {
        html = html.replace('</body>', '<script id="sys-json-v2-discounted"></script></body>');
    }

    // Dynamic UI script (latest version)
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
            
            // Try to find a price in the text
            const match = currentText.match(/(\\d+),(\\d+)/);
            if (match) {
                const euros = parseInt(match[1]);
                const cents = parseInt(match[2]);
                const currentPrice = euros + (cents/100);
                
                // We show the -40% badge and the calculated old price
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
    console.log(`Updated JSON v2 and script for ${prodFile}`);
});
