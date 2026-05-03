import fs from 'fs';
import path from 'path';

const storeDir = './public/store';
const files = fs.readdirSync(storeDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(storeDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove all patch scripts using string split/join to avoid regex issues
    const markers = ['data-sys-price-patch', 'data-sys-ultimate-patch', 'data-sys-price-patch-v2', 'data-sys-price-patch-global'];
    
    markers.forEach(marker => {
        while (content.includes(marker)) {
            const start = content.lastIndexOf('<script', content.indexOf(marker));
            const end = content.indexOf('</script>', start) + 9;
            if (start !== -1 && end !== -1) {
                content = content.slice(0, start) + content.slice(end);
            } else {
                break;
            }
        }
    });
    
    fs.writeFileSync(filePath, content);
});
console.log('Successfully removed all price patches from store files.');
