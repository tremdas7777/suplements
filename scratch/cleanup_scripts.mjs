import fs from 'fs';
import path from 'path';

const STORE_DIR = '/Users/ulissescardoso/suplements/public/store';

const files = fs.readdirSync(STORE_DIR).filter(f => f.endsWith('.html'));

const NEW_SCRIPT_BODY = `
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

        function fixVariants() {
            if (!window.cnvs || !window.cnvs.product) return;
            const product = window.cnvs.product;
            const options = product.options;
            const variants = product.variants;
            const container = document.querySelector('.product-options');
            if (!container) return;

            const isProcessed = container.hasAttribute('data-sys-processed');
            const isLoading = container.innerText.includes('Wird geladen') || container.children.length < 2;
            
            if (isProcessed && !isLoading) return;

            const selectedOptions = {};
            options.forEach(opt => {
                selectedOptions[opt.name] = opt.values[0];
            });

            function render() {
                container.innerHTML = '';
                options.forEach(opt => {
                    const optDiv = document.createElement('div');
                    optDiv.className = 'product-options__option';
                    optDiv.style.marginBottom = '20px';
                    optDiv.innerHTML = '<h4 style="margin-bottom: 12px; font-weight: 800; text-transform: uppercase; font-size: 14px;">' + opt.name + '</h4>';
                    
                    const grid = document.createElement('div');
                    grid.style.display = 'grid';
                    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    grid.style.gap = '8px';

                    opt.values.forEach(val => {
                        const isChecked = selectedOptions[opt.name] === val;
                        const item = document.createElement('div');
                        item.className = 'sys-variant-btn';
                        item.style.border = isChecked ? '2px solid black' : '1px solid #e5e7eb';
                        item.style.padding = '12px';
                        item.style.borderRadius = '12px';
                        item.style.cursor = 'pointer';
                        item.style.background = isChecked ? '#f9fafb' : 'white';
                        item.style.display = 'flex';
                        item.style.flexDirection = 'column';
                        item.style.justifyContent = 'center';
                        item.innerHTML = '<p style="margin:0; font-weight: ' + (isChecked ? '700' : '500') + '; font-size: 14px;">' + val + '</p>';
                        item.onclick = (e) => {
                            e.preventDefault(); e.stopPropagation();
                            selectedOptions[opt.name] = val;
                            update();
                        };
                        grid.appendChild(item);
                    });
                    optDiv.appendChild(grid);
                    container.appendChild(optDiv);
                });
                container.setAttribute('data-sys-processed', 'true');
            }

            function update() {
                const variant = variants.find(v => 
                    v.selectedOptions.every(so => selectedOptions[so.name] === so.value)
                );

                if (variant) {
                    let idInput = document.querySelector('input[name="id"]');
                    if (idInput) idInput.value = variant.id;

                    const priceEl = document.querySelector('.product-prices__price');
                    if (priceEl) {
                        const priceNum = parseFloat(variant.price) / 100;
                        const discountedPrice = (priceNum * 0.6).toFixed(2).replace('.', ',');
                        const originalPrice = priceNum.toFixed(2).replace('.', ',');
                        
                        priceEl.innerHTML = '<div style="display: flex; flex-direction: column; gap: 4px;">' +
                                '<div style="display: flex; align-items: center; gap: 10px;">' +
                                    '<span style="font-size: 24px; font-weight: 900; color: #b70832;">€' + discountedPrice + '</span>' +
                                    '<span style="text-decoration: line-through; color: #8d9093; font-size: 16px;">€' + originalPrice + '</span>' +
                                    '<span style="background: #b70832; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">-40%</span>' +
                                '</div>' +
                                '<span style="font-size: 12px; color: #6b7280;">inkl. MwSt. zzgl. Versand</span>' +
                            '</div>';
                    }

                    if (variant.imageUrl) {
                        const img = document.querySelector('.product-media__image') || document.querySelector('.product-media img');
                        if (img) img.src = variant.imageUrl;
                    }
                }
                render();
            }
            update();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixVariants);
        } else {
            fixVariants();
        }
        
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const container = document.querySelector('.product-options');
                    if (container && (!container.hasAttribute('data-sys-processed') || container.innerText.includes('Wird geladen'))) {
                        fixVariants();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

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
            if (form && (form.action?.includes('/cart/add') || form.querySelector('.product-form__add-to-cart') || form.querySelector('[name="add"]'))) {
                e.preventDefault(); e.stopPropagation();
                const formData = new FormData(form);
                const priceText = document.querySelector('.product-prices__price span')?.innerText || '12,00';
                const item = {
                    id: formData.get('id') || 'id-' + Math.random().toString(36).substr(2, 9),
                    quantity: parseInt(formData.get('quantity')) || 1,
                    title: document.querySelector('h1')?.innerText.trim() || document.title.split('|')[0].trim(),
                    price: parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.')) || 12.0
                };
                const imgEl = document.querySelector('.product-media__image') || document.querySelector('.product-media img');
                if (imgEl) item.image = imgEl.src;
                window.parent.postMessage({ t: 'sys-add-to-cart', item: item }, '*');
            }
        }, true);
    })();`;

files.forEach(file => {
    const filePath = path.join(STORE_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove data-store-link-fallback script
    const fallbackRegex = /<script data-store-link-fallback>[\s\S]*?<\/script>/g;
    if (fallbackRegex.test(html)) {
        html = html.replace(fallbackRegex, '');
        changed = true;
    }

    // 2. Change <base target="_top"> to target="_self"
    const baseRegex = /<base (.*?)target="_top"(.*?)>/g;
    if (baseRegex.test(html)) {
        html = html.replace(baseRegex, '<base $1target="_self"$2>');
        changed = true;
    }

    // 3. Update OR Add sys-cart-fix script
    const cartFixRegex = /<script id="sys-cart-fix">[\s\S]*?<\/script>/;
    const newScript = '<script id="sys-cart-fix">' + NEW_SCRIPT_BODY + '</script>';
    
    if (cartFixRegex.test(html)) {
        if (!html.includes('data-sys-processed')) {
            html = html.replace(cartFixRegex, newScript);
            changed = true;
        }
    } else {
        html = html.replace('</body>', newScript + '\\n</body>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html);
        console.log('Updated ' + file);
    }
});
console.log('Cleanup complete.');
