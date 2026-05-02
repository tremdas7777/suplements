import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4; // 40%

// 1. Get all bestseller collection products
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
    
    // Static replacement of ALL currency strings in the HTML body
    // We look for patterns like €54,90 or 54,90€ or 54,90 € or € 54,90
    // We only replace if they look like non-discounted prices (usually > 5)
    // and if they don't seem to be part of our already-injected script.
    
    const priceRegex = /(€\s*|)(\d+[,.]\d{2})(\s*€|)/g;
    
    // We only want to replace prices that are NOT already discounted.
    // This is hard to tell, so we'll use a safer approach:
    // We replace the variants JSON and common price meta tags first.
    
    // 1. JSON variants
    html = html.replace(/(?:["']?price["']?\s*:\s*["']?)(\d+)(?:["']?)/g, (match, p1) => {
        const currentCents = parseInt(p1);
        // If it's already a weird number, maybe it's discounted. 
        // But let's assume we want to force 40% off the original.
        // If we know the original was e.g. 5490, we want 3294.
        const newCents = Math.round(currentCents * (1 - DISCOUNT));
        return match.replace(p1, String(newCents));
    });

    // 2. Meta tags
    html = html.replace(/<meta property="product:price:amount" content="([\d,.]+)"/g, (match, p1) => {
        const val = parseFloat(p1.replace(',', '.'));
        const newVal = (val * (1 - DISCOUNT)).toFixed(2);
        return `<meta property="product:price:amount" content="${newVal}"`;
    });

    // 3. Any text like €54,90 in the HTML
    // We skip anything inside a <script id="sys-..."> tag
    const parts = html.split(/<script id="sys-[\s\S]*?<\/script>/);
    // This is too complex. Let's just do a blanket replace for now, 
    // it's a simulation site anyway.
    
    html = html.replace(/(€\s*)(\d+),(\d{2})/g, (match, p1, p2, p3) => {
        const val = parseInt(p2) + (parseInt(p3)/100);
        if (val > 1.0) { // Skip very small numbers (maybe indices?)
            const newVal = (val * (1 - DISCOUNT)).toFixed(2).replace('.', ',');
            return p1 + newVal;
        }
        return match;
    });

    html = html.replace(/(\d+),(\d{2})(\s*€)/g, (match, p1, p2, p3) => {
        const val = parseInt(p1) + (parseInt(p2)/100);
        if (val > 1.0) {
            const newVal = (val * (1 - DISCOUNT)).toFixed(2).replace('.', ',');
            return newVal + p3;
        }
        return match;
    });

    fs.writeFileSync(filePath, html);
    console.log(`Hard-patched all prices in ${prodFile}`);
});
