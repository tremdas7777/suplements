import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Very broad match for price:XXXX or "price":XXXX
    html = html.replace(/price["']?\s*:\s*["']?(\d+)/gi, (match, p1) => {
        const p = parseInt(p1);
        if (p < 10) return match;

        const origFromDouble = Math.round(p / 0.36);
        const remD = origFromDouble % 100;
        if (remD > 80 || remD < 20 || (remD > 40 && remD < 60)) {
            const corrected = Math.round(origFromDouble * 0.6);
            if (corrected !== p) {
                // Keep the prefix (everything before the digits)
                const prefix = match.substring(0, match.lastIndexOf(p1));
                return prefix + corrected;
            }
        }
        
        // Also discount if it looks original
        const rem = p % 100;
        if (rem > 80 || rem < 20 || (rem > 40 && rem < 60)) {
            const discounted = Math.round(p * 0.6);
            const prefix = match.substring(0, match.lastIndexOf(p1));
            return prefix + discounted;
        }

        return match;
    });

    fs.writeFileSync(filePath, html);
});
console.log('Final global price fix complete.');
