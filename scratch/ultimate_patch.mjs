import fs from 'fs';
import path from 'path';

const storeDir = './public/store';
const files = fs.readdirSync(storeDir).filter(f => f.endsWith('.html'));

const patchScript = `
<script data-sys-ultimate-patch>
(function() {
  if (window.__sys_ultimate_installed) return;
  window.__sys_ultimate_installed = true;

  function deepPatch(obj) {
    if (!obj || typeof obj !== 'object' || obj.__sys_patched_root) return;
    obj.__sys_patched_root = true;

    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) deepPatch(obj[i]);
    } else {
      if (Object.prototype.hasOwnProperty.call(obj, 'price') && !obj.__sys_price_hooked) {
        (function() {
          var _raw = obj.price;
          var _id = obj.id || Math.random();
          
          Object.defineProperty(obj, 'price', {
            get: function() {
              var val = parseFloat(_raw);
              if (isNaN(val)) return _raw;
              // ALWAYS return the 40% discounted version of the CURRENT raw value
              return typeof _raw === 'string' ? String(Math.round(val * 0.6)) : Math.round(val * 0.6);
            },
            set: function(v) {
              _raw = v;
            },
            configurable: true,
            enumerable: true
          });
          obj.__sys_price_hooked = true;
        })();
      }
      for (var k in obj) {
        if (obj[k] && typeof obj[k] === 'object' && k !== '__sys_patched_root') {
          deepPatch(obj[k]);
        }
      }
    }
  }

  function setupProxy(prop) {
    var _val = window[prop];
    Object.defineProperty(window, prop, {
      get: function() { return _val; },
      set: function(v) { 
        _val = v; 
        if (v) deepPatch(v); 
      },
      configurable: true
    });
    if (_val) deepPatch(_val);
  }

  setupProxy('cnvs');
  setupProxy('meta');
  
  // Also try to catch Shopify global product object
  if (window.Shopify && window.Shopify.product) deepPatch(window.Shopify.product);

  setInterval(function() {
    if (window.cnvs) deepPatch(window.cnvs);
    if (window.meta) deepPatch(window.meta);
  }, 500);
})();
</script>
`;

files.forEach(file => {
    const filePath = path.join(storeDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove old patch scripts if any
    content = content.replace(/<script data-sys-price-patch>[\\s\\S]*?<\\/script>/g, '');
    content = content.replace(/<script data-sys-ultimate-patch>[\\s\\S]*?<\\/script>/g, '');

    // Inject right after <head>
    content = content.replace('<head>', '<head>' + patchScript);
    
    fs.writeFileSync(filePath, content);
});
console.log('Successfully applied the ultimate unbreakable patch to all store files.');
