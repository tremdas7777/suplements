import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'public', 'store');

const OLD_SCRIPT = `        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, [href], [data-href], [data-url]');
            if (target) {
                const url = target.getAttribute('href') || target.getAttribute('data-href') || target.getAttribute('data-url');
                const fixed = fixUrl(url);
                if (fixed) {
                    window.location.href = fixed;
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true);`;

const NEW_SCRIPT = `        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, [href], [data-href], [data-url]');
            if (target) {
                const url = target.getAttribute('href') || target.getAttribute('data-href') || target.getAttribute('data-url');
                if (!url || url === '#' || url.startsWith('javascript:')) return;
                
                const fixed = fixUrl(url);
                const finalUrl = fixed || url;
                
                // Always tell the parent React app to navigate
                window.parent.postMessage({ t: 'sys-click', u: finalUrl }, '*');
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);`;

function processDirectory(dir) {
    let count = 0;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            count += processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes(OLD_SCRIPT)) {
                content = content.replace(OLD_SCRIPT, NEW_SCRIPT);
                fs.writeFileSync(fullPath, content, 'utf-8');
                count++;
            }
        }
    }
    return count;
}

console.log('Fixing click handlers...');
const count = processDirectory(STORE_DIR);
console.log(`Fixed ${count} HTML files.`);
