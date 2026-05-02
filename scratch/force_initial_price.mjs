import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const productFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('products_') && f.endsWith('.html'));

productFiles.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Find the cheapest price in the JSON for this product
    const variantMatches = [...html.matchAll(/price["']?\s*:\s*["']?(\d+)/gi)];
    let cheapestCents = Infinity;
    variantMatches.forEach(m => {
        const p = parseInt(m[1]);
        if (p < cheapestCents && p > 200) { // Ignore tiny sample/promo prices < 2€
            cheapestCents = p;
        }
    });

    if (cheapestCents === Infinity) return;

    const cheapestPriceStr = (cheapestCents / 100).toFixed(2).replace('.', ',');
    const oldPriceStr = (cheapestCents / 100 / 0.6).toFixed(2).replace('.', ',');

    // Inject a script that FORCES this price initially and until a variant change is detected
    const forcePriceScript = `
<script id="sys-force-price">
(function() {
    const CHEAPEST_PRICE = "${cheapestPriceStr}";
    const OLD_PRICE = "${oldPriceStr}";
    
    function forcePrice() {
        const urlParams = new URLSearchParams(window.location.search);
        // If we have a variant in the URL, let the other script handle it.
        // But if not, we force the "Starting from" price.
        if (urlParams.has('variant')) return;

        const priceEls = document.querySelectorAll('.product-prices__price, .price-item, .product-card__prices');
        priceEls.forEach(el => {
            if (el.getAttribute('data-sys-forced')) return;
            el.setAttribute('data-sys-forced', 'true');
            el.innerHTML = '<span style="color: #b70832; font-weight: bold;">Ab €' + CHEAPEST_PRICE + '</span> ' +
                           '<span style="text-decoration: line-through; color: #8d9093; font-size: 0.8em; margin-left: 8px;">€' + OLD_PRICE + '</span> ' +
                           '<span style="background: #b70832; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.7em; margin-left: 8px; vertical-align: middle;">-40%</span>';
        });
    }

    forcePrice();
    setTimeout(forcePrice, 1000);
    setTimeout(forcePrice, 2000);
    
    // Listen for variant clicks to remove the force
    document.addEventListener('click', (e) => {
        if (e.target.closest('input[type="radio"]')) {
            const priceEls = document.querySelectorAll('[data-sys-forced]');
            priceEls.forEach(el => el.removeAttribute('data-sys-forced'));
        }
    }, true);
})();
</script>`;

    if (html.includes('id="sys-force-price"')) {
        html = html.replace(/<script id="sys-force-price">[\s\S]*?<\/script>/, forcePriceScript);
    } else {
        html = html.replace('</body>', forcePriceScript + '</body>');
    }

    // Also hard-patch the skeleton HTML to show the cheapest price immediately
    // Look for empty price spans and fill them
    html = html.replace(/(<span[^>]*class="[^"]*product-prices__price[^"]*"[^>]*>)(\s*<\/span>)/g, (match, p1, p2) => {
        return p1 + 'Ab €' + cheapestPriceStr + p2;
    });

    fs.writeFileSync(filePath, html);
});
console.log('Force-price hard-patch complete.');
