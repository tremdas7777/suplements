import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const normalizeStorePath = (inputUrl: string) => {
    let targetPath = inputUrl;
    if (targetPath.startsWith("http")) {
      try {
        const parsed = new URL(targetPath);
        targetPath = parsed.pathname + parsed.search;
      } catch (err) {}
    }
    targetPath = targetPath.replace("/store/", "").replace(/^localhost:\d+_/, "");
    if (targetPath.endsWith(".html") || !targetPath.includes("/")) {
      targetPath = targetPath.replace(".html", "").replace(/^\//, "");
      if (targetPath.startsWith("products_")) targetPath = "/products/" + targetPath.replace("products_", "");
      else if (targetPath.startsWith("collections_")) targetPath = "/collections/" + targetPath.replace("collections_", "");
      else if (targetPath.startsWith("pages_")) targetPath = "/pages/" + targetPath.replace("pages_", "");
      else if (targetPath.startsWith("policies_")) targetPath = "/policies/" + targetPath.replace("policies_", "");
      else if (targetPath.startsWith("blogs_")) targetPath = "/blogs/" + targetPath.replace("blogs_", "");
      else if (targetPath === "index" || targetPath === "") targetPath = "/";
      else if (!targetPath.startsWith("/")) targetPath = "/products/" + targetPath;
    }
    return targetPath;
  };

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch(e) {}
    const handleOpenCart = () => {
      try {
        const saved = sessionStorage.getItem('cart');
        if (saved) setCartItems(JSON.parse(saved));
      } catch(e) {}
      setIsCartOpen(true);
    };
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || !e.data.t) return;
      if (e.data.t === "sys-add-to-cart" && e.data.item) {
        const item = {
          ...e.data.item,
          price: typeof e.data.item.price === 'string' 
            ? parseFloat(e.data.item.price.replace(/[^0-9,.]/g, '').replace(',', '.')) 
            : (Number(e.data.item.price) || 0),
          quantity: Number(e.data.item.quantity) || 1
        };
        setCartItems(prev => {
           const existing = prev.find(i => i.id === item.id);
           if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
           return [...prev, item];
        });
        setIsCartOpen(true);
        return;
      }
      if (e.data.t === "sys-checkout") { navigate('/checkout'); return; }
      if ((e.data.t === "sys-click" || e.data.t === "sys-nav") && e.data.u) {
        const targetPath = normalizeStorePath(e.data.u);
        if (targetPath !== location.pathname + location.search) navigate(targetPath);
        return;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [path, location.search, navigate]);

  if (window !== window.top) return null;

  const getMappedPath = () => {
    if (path === '' || path === '/' || path === '/store/') return 'index';
    let clean = path.replace(/^\/store\//, '').replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '');
    if (path.startsWith('/products/')) return 'products_' + clean.replace('products/', '');
    if (path.startsWith('/collections/')) return 'collections_' + clean.replace('collections/', '');
    if (path.startsWith('/pages/')) return 'pages_' + clean.replace('pages/', '');
    if (path.startsWith('/blogs/')) return 'blogs_' + clean.replace('blogs/', '');
    if (path.startsWith('/policies/')) return 'policies_' + clean.replace('policies/', '');
    return 'products_' + clean;
  };

  const mappedPath = getMappedPath();
  const iframeSrc = `/store/${mappedPath}.html${location.search}`;

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      <div id="store-loading-overlay" className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold animate-pulse">Shop wird geladen...</p>
      </div>

      {cartItems.length > 0 && !isCartOpen && (
        <button onClick={() => setIsCartOpen(true)} className="absolute bottom-6 right-6 z-20 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
          <ShoppingBag size={24} /><span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
        </button>
      )}

      {isCartOpen && (
        <div className="absolute inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag size={24} /> Warenkorb</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20 flex flex-col items-center gap-4"><ShoppingBag size={48} className="opacity-20" /><p>Der Warenkorb ist leer</p></div>
              ) : (
                cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 border-b border-border pb-6 last:border-0 mb-4">
                    {item.image && <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg border border-border" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{item.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-muted rounded px-2 py-1">
                          <button onClick={() => setCartItems(prev => prev.map(it => it.id === item.id ? { ...it, quantity: Math.max(0, it.quantity - 1) } : it).filter(it => it.quantity > 0))}><Minus size={12}/></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => setCartItems(prev => prev.map(it => it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it))}><Plus size={12}/></button>
                        </div>
                        <p className="font-bold text-sm">€{(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border bg-muted/30">
                <div className="flex justify-between mb-4 font-bold text-lg"><span>Total</span><span>{cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0).toFixed(2).replace('.', ',')}€</span></div>
                <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-[#b70832] text-white font-bold rounded-xl hover:bg-[#8d0628] transition-colors uppercase tracking-wider">Zur Kasse</button>
              </div>
            )}
          </div>
        </div>
      )}

      <iframe
        key={mappedPath}
        src={iframeSrc}
        title="Store"
        onLoad={(e) => {
          const overlay = document.getElementById("store-loading-overlay");
          if (overlay) { overlay.style.opacity = "0"; setTimeout(() => { overlay.style.display = "none"; }, 500); }
          try {
            const iframe = e.target as HTMLIFrameElement;
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;

            const script = doc.createElement('script');
            script.textContent = `
              (function() {
                if (window.__sys_nav_only) return;
                window.__sys_nav_only = true;

                // NAVIGATION ONLY - No price scripts to avoid flickering
                document.addEventListener('click', (e) => {
                  const target = e.target.closest('a, [data-href]');
                  if (!target) return;
                  let urlStr = target.getAttribute('href') || target.getAttribute('data-href');
                  if (!urlStr || urlStr.startsWith('javascript:') || urlStr.includes('#')) return;
                  try {
                    const url = new URL(urlStr, window.location.origin);
                    if (url.origin === window.location.origin) {
                      e.preventDefault();
                      window.parent.postMessage({ t: 'sys-click', u: url.pathname + url.search }, '*');
                    }
                  } catch (err) {}
                }, true);

                // Hide buggy combo products if they appear in search/home
                const style = document.createElement('style');
                style.textContent = "[href*='elite-leistung-combo'], [href*='elite-performance-paket'] { display: none !important; }";
                document.head.appendChild(style);
              })();
            `;
            doc.body.appendChild(script);
          } catch (err) {}
        }}
        style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};
export default Index;
