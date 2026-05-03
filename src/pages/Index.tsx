import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import { X, ShoppingBag, Minus, Plus } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isIframe404, setIsIframe404] = useState(false);
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

    targetPath = targetPath.replace("/store/", "");
    targetPath = targetPath.replace(/^localhost:\d+_/, "");

    if (targetPath.endsWith(".html") || !targetPath.includes("/")) {
      targetPath = targetPath.replace(".html", "");
      if (targetPath.startsWith("products_")) targetPath = "/products/" + targetPath.replace("products_", "");
      else if (targetPath.startsWith("collections_")) targetPath = "/collections/" + targetPath.replace("collections_", "");
      else if (targetPath.startsWith("pages_")) targetPath = "/pages/" + targetPath.replace("pages_", "");
      else if (targetPath.startsWith("policies_")) targetPath = "/policies/" + targetPath.replace("policies_", "");
      else if (targetPath.startsWith("blogs_")) targetPath = "/blogs/" + targetPath.replace("blogs_", "");
      else if (targetPath === "index") targetPath = "/";
      else if (!targetPath.startsWith("/")) targetPath = "/" + targetPath;
    }

    return targetPath;
  };

  // Load cart from session storage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch(e) {}
  }, []);

  // Save cart to session storage when it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      sessionStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    // If we are inside an iframe
    if (window !== window.top) {
      if (path.startsWith("/store/")) {
        const isBrokenPath = path.includes("localhost:") || !path.endsWith(".html");
        
        if (isBrokenPath) {
          let cleaned = path.replace("/store/", "").replace(".html", "").replace(/^localhost:\d+_/, "");
          let intendedPath = "/";
          
          if (cleaned.startsWith("products_")) intendedPath = "/products/" + cleaned.replace("products_", "");
          else if (cleaned.startsWith("collections_")) intendedPath = "/collections/" + cleaned.replace("collections_", "");
          else if (cleaned.startsWith("pages_")) intendedPath = "/pages/" + cleaned.replace("pages_", "");
          else if (cleaned.startsWith("blogs_")) intendedPath = "/blogs/" + cleaned.replace("blogs_", "");
          
          const cleanSearch = location.search.replace(".html", "");
          window.top.location.href = intendedPath + cleanSearch;
          return;
        }
      }
      return;
    }

    // We are in the TOP window - listen for sys-click from iframe
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
           if (existing) {
             return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
           }
           return [...prev, item];
        });
        setIsCartOpen(true);
        return;
      }
      
      if (e.data.t === "sys-checkout") {
        navigate('/checkout');
        return;
      }

      if ((e.data.t === "sys-click" || e.data.t === "sys-nav") && e.data.u) {
        const targetPath = normalizeStorePath(e.data.u);
        if (targetPath !== location.pathname + location.search) {
          navigate(targetPath);
        }
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [path, location.search, navigate]);

  if (window !== window.top) {
    if (isIframe404) return <NotFound />;
    return null; // Do not render anything in iframe while redirecting top window
  }

  const mappedPath = (path === '' || path === '/' || path === '/store/') 
    ? 'index' 
    : path.replace(/^\/store\//, '').replace(/^\//, '').replace(/\/$/, '').replace(/\.html$/, '').replace(/\//g, '_');
  const iframeSrc = `/store/${mappedPath}.html${location.search}`;

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      {/* Loading overlay that shows until iframe loads */}
      <div 
        id="store-loading-overlay"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500"
      >
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold animate-pulse">Shop wird geladen...</p>
      </div>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="absolute bottom-6 right-6 z-20 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
            {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          </span>
        </button>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="absolute inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag size={24} /> Warenkorb
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length > 0 && (
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Versandkostenfrei ab 75€</span>
                  <span>{Math.max(0, 75 - cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2).replace('.', ',')}€ verbleibend</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#b70832] transition-all duration-500"
                    style={{ width: `${Math.min(100, (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) / 75) * 100)}%` }}
                  />
                </div>
                {cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) >= 75 && (
                  <p className="text-xs text-green-600 font-bold mt-2">🎉 Du hast kostenlosen Versand erhalten!</p>
                )}
              </div>
            )}
            {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20 flex flex-col items-center gap-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Der Warenkorb ist leer</p>
                </div>
              ) : (
                cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 border-b border-border pb-6 last:border-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl shadow-sm border border-border/50" />
                    ) : (
                      <div className="w-24 h-24 bg-muted rounded-xl flex items-center justify-center border border-border/50">
                        <ShoppingBag className="text-muted-foreground" size={32} />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-sm leading-tight text-foreground">{item.title}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                          <button 
                            onClick={() => {
                              setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0));
                            }}
                            className="p-1 hover:bg-background rounded-md transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => {
                              setCartItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                            }}
                            className="p-1 hover:bg-background rounded-md transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-black text-lg">€ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
              <div className="mb-6">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Rabattcode" 
                    className="flex-1 px-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button className="px-6 py-3 bg-black text-white font-bold rounded-xl text-sm hover:bg-black/80 transition-colors">
                    ANWENDEN
                  </button>
                </div>
              </div>

              <div className="flex justify-between mb-4 font-black text-2xl text-foreground">
                <span>Total</span>
                <span>
                  {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2).replace('.', ',')}€
                </span>
              </div>

              {/* Recommendations in Cart */}
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <h4 className="text-xs font-black uppercase mb-4 text-gray-500 tracking-widest">Oft zusammen gekauft</h4>
                <div className="space-y-3">
                  {[
                    { title: 'Designer Whey', price: 19.14, image: 'https://www.esn.com/cdn/shop/files/DesignerWhey_ChocolateFudge_750g_800x.png?v=1713358043' },
                    { title: 'Isoclear Whey', price: 16.14, image: 'https://www.esn.com/cdn/shop/files/Isoclear_GreenApple_600g_800x.png?v=1713358043' }
                  ].map((rec, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                      <img src={rec.image} className="w-12 h-12 object-contain" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold truncate">{rec.title}</div>
                        <div className="text-[11px] font-black">{rec.price.toFixed(2).replace('.', ',')}€</div>
                      </div>
                      <button 
                        onClick={() => {
                          const item = {
                            id: 'rec-' + i,
                            title: rec.title,
                            price: rec.price,
                            quantity: 1,
                            image: rec.image
                          };
                          setCartItems(prev => {
                            const existing = prev.find(i => i.id === item.id);
                            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
                            return [...prev, item];
                          });
                        }}
                        className="bg-black text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-black/80"
                      >
                        HINZUFÜGEN
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                disabled={cartItems.length === 0}
                onClick={() => {
                  sessionStorage.setItem('cart', JSON.stringify(cartItems));
                  navigate('/checkout');
                }}
                className="w-full py-5 bg-[#b70832] hover:bg-[#8d0628] text-white font-black text-xl rounded-2xl disabled:opacity-50 shadow-xl shadow-[#b70832]/20 transition-all hover:scale-[1.02] uppercase tracking-wider"
              >
                JETZT SICHER KAUFEN
              </button>
              
              <div className="mt-6 flex justify-center items-center gap-4 opacity-50 grayscale">
                <img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/dhl_logo.png?v=1620300000" alt="DHL" className="h-4" />
                <img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/visa_logo.png?v=1620300000" alt="Visa" className="h-4" />
                <img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/mastercard_logo.png?v=1620300000" alt="Mastercard" className="h-4" />
                <img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/paypal_logo.png?v=1620300000" alt="Paypal" className="h-4" />
              </div>
            </div>
          </div>
      )}

      <iframe
        key={mappedPath}
        src={iframeSrc}
        title="Store"
        onLoad={(e) => {
          const overlay = document.getElementById("store-loading-overlay");
          if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => { overlay.style.display = "none"; }, 500);
          }

        }}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default Index;
