import fs from 'fs';
import path from 'path';

const storeDir = '/Users/ulissescardoso/suplements/public/store';
const files = fs.readdirSync(storeDir).filter(f => f.endsWith('.html'));

const newScript = `
<script id="sys-cart-fix">
    (function() {
        const fixUrl = (url) => {
            if (!url) return null;
            let path = url;
            if (url.startsWith('http')) {
                try {
                    const parsed = new URL(url);
                    if (parsed.hostname !== 'localhost' && parsed.hostname !== 'wwwesncomqedu.arktrix.com' && parsed.hostname !== 'www.esn.com') return null;
                    path = parsed.pathname;
                } catch(e) { return null; }
            }
            if (path.startsWith('/') && !path.endsWith('.html') && !path.includes('.')) {
                const parts = path.split('/').filter(Boolean);
                if (parts.length >= 2) {
                    return '/store/' + parts[0] + '_' + parts.slice(1).join('_') + '.html';
                }
            }
            return null;
        };

        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, [href], [data-href], [data-url]');
            if (target) {
                const url = target.getAttribute('href') || target.getAttribute('data-href') || target.getAttribute('data-url');
                if (!url || url === '#' || url.startsWith('javascript:')) return;
                const fixed = fixUrl(url);
                const finalUrl = fixed || url;
                if (finalUrl.includes('/checkout')) {
                    window.parent.postMessage({ t: 'sys-checkout' }, '*');
                    e.preventDefault(); e.stopPropagation(); return;
                }
                window.parent.postMessage({ t: 'sys-click', u: finalUrl }, '*');
                e.preventDefault(); e.stopPropagation();
            }
        }, true);

        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form && (form.action && form.action.includes('/cart/add') || form.querySelector('.product-form__add-to-cart') || form.querySelector('[name="add"]'))) {
                e.preventDefault(); e.stopPropagation();
                
                try {
                    const formData = new FormData(form);
                    const item = {
                        id: formData.get('id') || 'id-' + Math.random().toString(36).substr(2, 9),
                        quantity: parseInt(formData.get('quantity')) || 1,
                        product_id: formData.get('product-id')
                    };
                    
                    // Improved title extraction
                    const titleEl = document.querySelector('.product-title') || document.querySelector('h1') || document.querySelector('meta[property="og:title"]');
                    item.title = titleEl ? (titleEl.tagName === 'META' ? titleEl.content : titleEl.innerText.trim()) : (document.title.split('|')[0].trim());

                    // Improved price extraction
                    let price = 12.00;
                    const priceSelectors = [
                        '.product-form .product-prices__price',
                        '.product-prices__price',
                        '.price__regular',
                        '.price-item',
                        'meta[property="product:price:amount"]'
                    ];
                    
                    for (const sel of priceSelectors) {
                        const el = document.querySelector(sel);
                        if (el) {
                            let text = el.tagName === 'META' ? el.content : el.innerText;
                            if (text) {
                                const clean = text.replace(/[^0-9,.]/g, '').replace(',', '.');
                                const num = parseFloat(clean);
                                if (!isNaN(num) && num > 0) {
                                    price = num;
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (price === 12.00 && window.cnvs && window.cnvs.product && window.cnvs.product.price) {
                        price = parseFloat(String(window.cnvs.product.price).replace(',', '.')) || 12.00;
                    }
                    item.price = price;
                    
                    // Improved image extraction
                    const imgEl = document.querySelector('.product-media__image') || document.querySelector('.product-media img') || document.querySelector('meta[property="og:image"]');
                    if (imgEl) item.image = imgEl.tagName === 'META' ? imgEl.content : imgEl.src;
                    
                    window.parent.postMessage({ t: 'sys-add-to-cart', item: item }, '*');
                } catch(err) {
                    window.parent.postMessage({ t: 'sys-add-to-cart', item: { id: 'error-id', title: 'ESN Produto', price: 12.00, quantity: 1 } }, '*');
                }
            }
        }, true);
    })();
</script>
`;

files.forEach(file => {
    const filePath = path.join(storeDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*?sys-add-to-cart[\s\S]*?<\/script>/g, '');
    content = content.replace(/<script id="sys-cart-fix">[\s\S]*?<\/script>/g, '');
    if (/<\/body>/i.test(content)) {
        content = content.replace(/<\/body>/i, newScript + '</body>');
    } else if (/<\/html>/i.test(content)) {
        content = content.replace(/<\/html>/i, newScript + '</html>');
    } else {
        content += newScript;
    }
    fs.writeFileSync(filePath, content);
    console.log(`Finalized ${file}`);
});
