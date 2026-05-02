import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} files to remove all disabled states...`);

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');

    const originalHtml = html;

    // 1. Remove 'disabled' attribute from inputs and buttons
    // We target inputs with 'disabled' specifically, but also general buttons
    html = html.replace(/<input([^>]+)disabled([^>]*)>/g, '<input$1$2>');
    html = html.replace(/<button([^>]+)disabled([^>]*)>/g, '<button$1$2>');
    
    // Sometimes 'disabled' is just a standalone attribute in the middle of a tag
    // We need to be careful not to break the HTML.
    // Let's use a more targeted approach for the common Shopify pattern:
    // <input ... disabled ... >
    html = html.replace(/(<input[^>]+)\bdisabled\b([^>]*>)/g, '$1$2');
    html = html.replace(/(<button[^>]+)\bdisabled\b([^>]*>)/g, '$1$2');

    // 2. Remove 'is-loading' class which often grays out elements or prevents interaction
    html = html.replace(/\bis-loading\b/g, '');
    
    // 3. Remove CSS classes that might gray out elements
    html = html.replace(/\bopacity-50\b/g, '');
    html = html.replace(/\bgrayscale\b/g, '');
    html = html.replace(/\bis-disabled\b/g, '');
    html = html.replace(/\bselection-tab--disabled\b/g, '');

    // 4. Update JSON availability flags (again, to be sure)
    html = html.replace(/availableForSale:\s*false/g, 'availableForSale: true');
    html = html.replace(/"available":\s*false/g, '"available": true');

    if (html !== originalHtml) {
        fs.writeFileSync(filePath, html);
    }
});

console.log(`Finished removing all disabled states.`);
