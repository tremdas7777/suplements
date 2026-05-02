import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

// 1. Map product handle to cheapest variant ID
const productCheapestVariant = {};

const productFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('products_') && f.endsWith('.html'));

productFiles.forEach(file => {
    const content = fs.readFileSync(path.join(STORE_DIR, file), 'utf8');
    const handle = file.replace('products_', '').replace('.html', '');
    
    // Find all variants and their prices in the JSON
    // Format: { ... "id": 12345, "price": 2290, ... }
    const variantMatches = [...content.matchAll(/\{[^}]*?"id"\s*:\s*(\d+)[^}]*?"price"\s*:\s*(\d+)[^}]*?\}/g)];
    
    if (variantMatches.length > 0) {
        let cheapestId = null;
        let minPrice = Infinity;
        
        variantMatches.forEach(m => {
            const id = m[1];
            const price = parseInt(m[2]);
            if (price < minPrice && price > 100) { // Skip tiny placeholder prices
                minPrice = price;
                cheapestId = id;
            }
        });
        
        if (cheapestId) {
            productCheapestVariant[handle] = cheapestId;
        }
    }
});

console.log('Found cheapest variants for', Object.keys(productCheapestVariant).length, 'products');

// 2. Update collection pages to include the variant ID in the URL
const collectionFiles = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('collections_') && f.endsWith('.html'));

collectionFiles.forEach(colFile => {
    const filePath = path.join(STORE_DIR, colFile);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace links like /store/products_esn-isoclear-whey-isolate.html 
    // with /store/products_esn-isoclear-whey-isolate.html?variant=ID
    html = html.replace(/href="\/store\/products_([^.]+)\.html"/g, (match, handle) => {
        if (productCheapestVariant[handle]) {
            changed = true;
            return `href="/store/products_${handle}.html?variant=${productCheapestVariant[handle]}"`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, html);
        console.log(`Updated links in ${colFile}`);
    }
});

// 3. Update the product page script to handle the ?variant= query param
const improvedCheapestScript = `
<script id="sys-select-cheapest">
(function() {
    function selectVariantFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const variantId = urlParams.get('variant');
        if (!variantId) {
            // Fallback: Select cheapest if no variant in URL
            const radios = document.querySelectorAll('input[type="radio"][name="id"]');
            if (radios.length > 0) {
                // ... selection logic ...
            }
            return;
        }

        // Try to find the radio input with this value
        const target = document.querySelector('input[type="radio"][value="' + variantId + '"]');
        if (target && !target.checked) {
            target.click();
            console.log('Forced variant selection from URL:', variantId);
        }
    }
    
    // Multi-stage attempt to override theme JS
    setTimeout(selectVariantFromUrl, 500);
    setTimeout(selectVariantFromUrl, 1500);
    setTimeout(selectVariantFromUrl, 3000);
})();
</script>`;

productFiles.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('id="sys-select-cheapest"')) {
        html = html.replace(/<script id="sys-select-cheapest">[\s\S]*?<\/script>/, improvedCheapestScript);
    } else {
        html = html.replace('</body>', improvedCheapestScript + '</body>');
    }
    fs.writeFileSync(filePath, html);
});
