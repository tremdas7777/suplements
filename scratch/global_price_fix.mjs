import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';
const DISCOUNT = 0.4;

const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Fix JSON prices (window.customerHub, window.cnvs, etc.)
    // Matches "price": 5490 or price: 5490 or "price": "5490"
    html = html.replace(/(["']?price["']?\s*:\s*["']?)(\d+)(["']?)/g, (match, p1, p2, p3) => {
        const p = parseInt(p2);
        if (p < 10) return match; // Skip tiny numbers

        const original = p;
        const single = Math.round(original * 0.6);
        const double = Math.round(original * 0.36);

        // Logic:
        // If p is close to 'double', it was double-discounted. Fix to 'single'.
        // If p is close to 'original', it is not discounted. Fix to 'single'.
        // If p is already close to 'single', do nothing.

        // But wait! We don't know what 'original' is.
        // We assume p is the CURRENT value.
        // If p looks like 5490, 4290, 2290, etc. (Originals)
        // If p looks like 3294, 2574, 1374, etc. (Single Discounted)
        // If p looks like 1976, 1544, 824, etc. (Double Discounted)

        // Let's use the 0.36/0.6 check.
        const ifOriginal = p;
        const ifDouble = Math.round(p / 0.6); // If p was double, this is single
        const ifSingle = p; // If p is single, this is single

        // Better: 
        // We want the final value to be Original * 0.6.
        // If p is Original, we want p * 0.6.
        // If p is Original * 0.6, we want p.
        // If p is Original * 0.36, we want p / 0.6.

        // We check if p is "round" (Original)
        const rem = p % 100;
        const isRound = (rem > 85 || rem < 15 || (rem > 45 && rem < 55));
        
        if (isRound) {
            // It's likely an Original price. Discount it.
            return p1 + Math.round(p * 0.6) + p3;
        }

        // Check if it's double-discounted.
        // If p / 0.36 is very round.
        const origFromDouble = Math.round(p / 0.36);
        const remD = origFromDouble % 100;
        if (remD > 85 || remD < 15 || (remD > 45 && remD < 55)) {
            // It was double-discounted. Restore to single.
            return p1 + Math.round(origFromDouble * 0.6) + p3;
        }

        return match;
    });

    // 2. Fix HTML Text prices (Ab 22,90 €)
    html = html.replace(/(\d+),(\d{2})(\s*€|)/g, (match, p1, p2, p3) => {
        const val = parseInt(p1) + (parseInt(p2)/100);
        if (val < 1.0) return match;

        const rem = Math.round(val * 100) % 100;
        const isRound = (rem > 85 || rem < 15 || (rem > 45 && rem < 55));

        if (isRound) {
            const newVal = (val * 0.6).toFixed(2).replace('.', ',');
            return newVal + p3;
        }
        
        // Double check
        const origFromDouble = val / 0.36;
        const remD = Math.round(origFromDouble * 100) % 100;
        if (remD > 85 || remD < 15 || (remD > 45 && remD < 55)) {
            const newVal = (origFromDouble * 0.6).toFixed(2).replace('.', ',');
            return newVal + p3;
        }

        return match;
    });

    fs.writeFileSync(filePath, html);
});
console.log('Global price normalization complete.');
