import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'public', 'store');

const OLD_SCRIPT = `        document.addEventListener('click', (e) => {
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

const NEW_SCRIPT = `        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, [href], [data-href], [data-url]');
            if (target) {
                const url = target.getAttribute('href') || target.getAttribute('data-href') || target.getAttribute('data-url');
                if (!url || url === '#' || url.startsWith('javascript:')) return;
                
                const fixed = fixUrl(url);
                const finalUrl = fixed || url;
                
                // Check if checkout
                if (finalUrl.includes('/checkout')) {
                    window.parent.postMessage({ t: 'sys-checkout' }, '*');
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                
                // Always tell the parent React app to navigate
                window.parent.postMessage({ t: 'sys-click', u: finalUrl }, '*');
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
        
        // Add listener for Add to Cart
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form && (form.action && form.action.includes('/cart/add') || form.querySelector('.product-form__add-to-cart'))) {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    const formData = new FormData(form);
                    const item = {
                        id: formData.get('id') || 'default-id',
                        quantity: parseInt(formData.get('quantity')) || 1,
                        product_id: formData.get('product-id')
                    };
                    
                    const productTitleEl = document.querySelector('h1') || document.querySelector('.product-title');
                    const productPriceEl = document.querySelector('.product-prices__price') || document.querySelector('.price__regular') || document.querySelector('.price-item');
                    
                    item.title = productTitleEl ? productTitleEl.innerText.trim() : 'ESN Produto';
                    
                    if (productPriceEl) {
                        const priceText = productPriceEl.innerText.replace(/[^0-9,]/g, '').replace(',', '.');
                        item.price = parseFloat(priceText) || 12.00;
                    } else {
                        item.price = 12.00;
                    }
                    
                    // Look for image
                    const imgEl = document.querySelector('img.preload-image') || document.querySelector('.product-media img') || document.querySelector('img');
                    if (imgEl) item.image = imgEl.src;
                    
                    window.parent.postMessage({ t: 'sys-add-to-cart', item: item }, '*');
                    
                    // Show a local success message? 
                    // Optional: let the parent handle the notification.
                } catch(err) {
                    window.parent.postMessage({ t: 'sys-add-to-cart', item: { id: 'default-id', title: 'ESN Produto', price: 12.00, quantity: 1 } }, '*');
                }
            }
        }, true);
        
        // Intercept native fetch/xhr to cart
        const origFetch = window.fetch;
        window.fetch = async function() {
            if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('/cart/add.js')) {
                // If the shopify JS tries to use fetch to add to cart
                const bodyStr = arguments[1] ? arguments[1].body : null;
                try {
                    if (bodyStr) {
                        const data = JSON.parse(bodyStr);
                        const items = data.items || [data];
                        for(const it of items) {
                            window.parent.postMessage({ 
                                t: 'sys-add-to-cart', 
                                item: { id: it.id, quantity: it.quantity || 1, title: 'ESN Produto', price: 12.00 } 
                            }, '*');
                        }
                    }
                } catch(e) {}
                // Mock success
                return new Response(JSON.stringify({items: []}), {status: 200, headers: {'Content-Type':'application/json'}});
            }
            return origFetch.apply(this, arguments);
        };`;

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

console.log('Fixing cart handlers...');
const count = processDirectory(STORE_DIR);
console.log(`Fixed ${count} HTML files.`);
