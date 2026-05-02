import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4; // 40%

const collectionFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('collections_') && f.includes('bestseller'));

collectionFiles.forEach(colFile => {
    const filePath = path.join(STORE_DIR, colFile);
    let html = fs.readFileSync(filePath, 'utf8');

    const collectionDiscountScript = `
<script id="sys-collection-discount">
(function() {
    function applyDiscount() {
        const cards = document.querySelectorAll('.product-card, .product-card-sample');
        cards.forEach(card => {
            if (card.getAttribute('data-sys-processed')) return;
            
            const priceEl = card.querySelector('.product-prices__price') || card.querySelector('.product-card__prices');
            if (!priceEl) return;
            
            const text = priceEl.innerText.trim();
            if (!text) return;

            const match = text.match(/(\\d+),(\\d+)/);
            if (match) {
                card.setAttribute('data-sys-processed', 'true');
                const euros = parseInt(match[1]);
                const cents = parseInt(match[2]);
                const currentPrice = euros + (cents / 100);
                
                // We assume currentPrice is the DISCOUNTED one (because we hard-patched it)
                // and we calculate the OLD price back.
                const oldPriceNum = (currentPrice / (1 - ${DISCOUNT})).toFixed(2).replace('.', ',');
                const newPriceStr = currentPrice.toFixed(2).replace('.', ',');
                
                priceEl.innerHTML = '<span style="color: #b70832; font-weight: bold;">€' + newPriceStr + '</span> ' +
                                   '<span style="text-decoration: line-through; color: #8d9093; font-size: 0.8em; margin-left: 5px;">€' + oldPriceNum + '</span>' +
                                   '<div style="position: absolute; top: 10px; left: 10px; background: #b70832; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; z-index: 10;">-40%</div>';
            }
        });
    }
    applyDiscount();
    setInterval(applyDiscount, 2000);
})();
</script>`;

    if (html.includes('id="sys-collection-discount"')) {
        html = html.replace(/<script id="sys-collection-discount">[\s\S]*?<\/script>/, collectionDiscountScript);
    } else {
        html = html.replace('</body>', collectionDiscountScript + '</body>');
    }

    // Also need to fix any hard-patched prices in the collection HTML itself
    // if I double-patched them.
    // I'll leave them for now and see if the script fixes the UI.
    
    fs.writeFileSync(filePath, html);
    console.log(`Updated collection UI script: ${colFile}`);
});
