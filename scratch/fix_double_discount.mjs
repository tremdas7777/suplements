import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.startsWith('products_') && f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Regex to find "price": "1976" or price: "1976" or "price": 1976
    html = html.replace(/(["']?price["']?\s*:\s*["']?)(\d+)(["']?)/g, (match, p1, p2, p3) => {
        const currentCents = parseInt(p2);
        if (currentCents === 0) return match;

        // Check if it was double-discounted (Original * 0.36)
        const presumedOriginal = Math.round(currentCents / 0.36);
        
        // If the presumed original ends in something close to 90, 00, 49, 50, etc.
        const rem = presumedOriginal % 100;
        if (rem > 85 || rem < 5 || (rem > 45 && rem < 55)) {
            // It was likely double-discounted. Fix it to Original * 0.6
            const correctedCents = Math.round(presumedOriginal * 0.6);
            console.log(`Fixing double-discount in ${file}: ${p2} -> ${correctedCents} (Original ~${presumedOriginal})`);
            return p1 + correctedCents + p3;
        }
        return match;
    });

    fs.writeFileSync(filePath, html);
});
