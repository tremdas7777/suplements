import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    html = html.replace(/(price\s*:\s*)(\d+)/gi, (match, p1, p2) => {
        const p = parseInt(p2);
        if (p < 10) return match;

        const origFromDouble = Math.round(p / 0.36);
        const remD = origFromDouble % 100;
        if (remD > 80 || remD < 20 || (remD > 40 && remD < 60)) {
            const corrected = Math.round(origFromDouble * 0.6);
            if (corrected !== p) {
                changed = true;
                return p1 + corrected;
            }
        }
        
        const rem = p % 100;
        if (rem > 80 || rem < 20 || (rem > 40 && rem < 60)) {
            const discounted = Math.round(p * 0.6);
            changed = true;
            return p1 + discounted;
        }

        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, html);
        console.log(`Updated prices in ${file}`);
    }
});
