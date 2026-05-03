import fs from 'fs';
import path from 'path';

const storeDir = './public/store';
const files = fs.readdirSync(storeDir).filter(f => f.endsWith('.html'));

const patchScript = `
<script data-sys-price-patch>
(function() {
  if (window.__sys_price_patched_global) return;
  window.__sys_price_patched_global = true;

  function patch(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.__sys_patched) return;
    
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) patch(obj[i]);
    } else {
      // If it has a price property that looks like a Shopify price (integer or string integer)
      if (obj.price !== undefined && obj.price !== null && !obj.__sys_price_patched) {
        var p = parseFloat(obj.price);
        if (!isNaN(p) && p > 0) {
          // If it's a string, keep it as string
          if (typeof obj.price === 'string') {
            obj.price = String(Math.round(p * 0.6));
          } else {
            obj.price = Math.round(p * 0.6);
          }
          obj.__sys_price_patched = true;
        }
      }
      // Also patch compare_at_price if exists to keep it consistent
      if (obj.compare_at_price) {
          // Keep it as original so it shows the strikethrough correctly?
          // Actually, if we discount the main price, the compare_at_price should stay original
      }

      for (var k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null && k !== '__sys_patched') {
          patch(obj[k]);
        }
      }
    }
  }

  // Intercept window.cnvs (Product Page)
  var _cnvs = window.cnvs;
  Object.defineProperty(window, 'cnvs', {
    get: function() { return _cnvs; },
    set: function(v) { 
        _cnvs = v; 
        if (v) {
            patch(v);
            // Extra safety for variants
            if (v.product && v.product.variants) patch(v.product.variants);
        }
    },
    configurable: true
  });
  if (_cnvs) patch(_cnvs);

  // Intercept window.meta (Collection Pages)
  var _meta = window.meta;
  Object.defineProperty(window, 'meta', {
    get: function() { return _meta; },
    set: function(v) { 
        _meta = v; 
        if (v) patch(v);
    },
    configurable: true
  });
  if (_meta) patch(_meta);

  // Periodic check as a safety net
  setInterval(function() {
      if (window.cnvs) patch(window.cnvs);
      if (window.meta) patch(window.meta);
  }, 1000);
})();
</script>
`;

files.forEach(file => {
    const filePath = path.join(storeDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('data-sys-price-patch')) return;

    // Inject right after <head>
    content = content.replace('<head>', '<head>' + patchScript);
    
    fs.writeFileSync(filePath, content);
    console.log(`Patched ${file}`);
});
