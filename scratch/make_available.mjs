import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} files to make all products available...`);

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');

    const originalHtml = html;

    // 1. JSON and Script flags
    html = html.replace(/availableForSale:\s*false/g, 'availableForSale: true');
    html = html.replace(/"available":\s*false/g, '"available": true');
    html = html.replace(/available:\s*false/g, 'available: true');
    html = html.replace(/"inventory_quantity":\s*0/g, '"inventory_quantity": 100');
    html = html.replace(/inventory_quantity:\s*0/g, 'inventory_quantity: 100');
    html = html.replace(/"inventory_policy":\s*"deny"/g, '"inventory_policy": "continue"');

    // 2. CSS Classes
    html = html.replace(/\bis-sold-out\b/g, 'is-available');
    html = html.replace(/\bproduct-card--sold-out\b/g, '');
    html = html.replace(/\bvariant--sold-out\b/g, '');

    // 3. Button Texts and States
    // In German Shopify, "Ausverkauft" is the common term for Sold Out
    // We replace it with "In den Warenkorb" (Add to cart)
    html = html.replace(/>Ausverkauft</g, '>In den Warenkorb<');
    html = html.replace(/"Ausverkauft"/g, '"In den Warenkorb"');
    html = html.replace(/>Sold Out</g, '>Add to Cart<');
    
    // Remove 'disabled' attribute from add to cart buttons
    html = html.replace(/<button([^>]+)disabled([^>]*class="[^"]*add-to-cart[^"]*")/g, '<button$1$2');
    html = html.replace(/<button([^>]+)disabled([^>]*name="add")/g, '<button$1$2');

    if (html !== originalHtml) {
        fs.writeFileSync(filePath, html);
        // console.log(`Updated availability in ${file}`);
    }
});

console.log(`Finished making all products available.`);
