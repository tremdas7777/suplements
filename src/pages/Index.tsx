import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";
import { X, ShoppingBag } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isIframe404, setIsIframe404] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
        const hasLocalhost = path.includes("localhost:");
        const searchHasHtml = location.search.includes(".html");
        const missingHtml = !path.endsWith(".html");
        
        if (hasLocalhost || searchHasHtml || missingHtml) {
          let cleaned = path.replace("/store/", "").replace(".html", "").replace(/^localhost:\d+_/, "");
          let intendedPath = "/";
          
          if (cleaned.startsWith("products_")) intendedPath = "/products/" + cleaned.replace("products_", "");
          else if (cleaned.startsWith("collections_")) intendedPath = "/collections/" + cleaned.replace("collections_", "");
          else if (cleaned.startsWith("pages_")) intendedPath = "/pages/" + cleaned.replace("pages_", "");
          else if (cleaned.startsWith("blogs_")) intendedPath = "/blogs/" + cleaned.replace("blogs_", "");
          
          const cleanSearch = location.search.replace(".html", "");
          window.top.location.href = intendedPath + cleanSearch;
          return;
        } else {
          setIsIframe404(true);
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

      if (e.data.t === "sys-click" && e.data.u) {
        let url = e.data.u;
        let targetPath = url;
        
        if (url.startsWith("http")) {
          try {
            const parsed = new URL(url);
            targetPath = parsed.pathname + parsed.search;
          } catch (err) {}
        }

        // Convert localized static paths back to React paths
        targetPath = targetPath.replace("/store/", "");
        targetPath = targetPath.replace(/^localhost:\d+_/, "");
        
        if (targetPath.endsWith(".html") || !targetPath.includes("/")) {
          targetPath = targetPath.replace(".html", "");
          if (targetPath.startsWith("products_")) targetPath = "/products/" + targetPath.replace("products_", "");
          else if (targetPath.startsWith("collections_")) targetPath = "/collections/" + targetPath.replace("collections_", "");
          else if (targetPath.startsWith("pages_")) targetPath = "/pages/" + targetPath.replace("pages_", "");
          else if (targetPath.startsWith("policies_")) targetPath = "/policies/" + targetPath.replace("policies_", "");
          else if (targetPath.startsWith("blogs_")) targetPath = "/blogs/" + targetPath.replace("blogs_", "");
          else targetPath = "/" + targetPath;
        }

        if (targetPath !== location.pathname + location.search) {
          navigate(targetPath);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [path, location.search, navigate]);

  if (window !== window.top) {
    if (isIframe404) return <NotFound />;
    return null; // Do not render anything in iframe while redirecting top window
  }

  // We are in the TOP window.
  let iframeSrc = "/store/index.html";

  if (path !== "/") {
    const mappedPath = path.substring(1).replace(/\//g, "_");
    iframeSrc = `/store/${mappedPath}.html${location.search}`;
  }

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      {/* Loading overlay that shows until iframe loads */}
      <div 
        id="store-loading-overlay"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500"
      >
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold animate-pulse">Carregando loja...</p>
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
                <ShoppingBag size={24} /> Seu Carrinho
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground mt-20 flex flex-col items-center gap-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>O carrinho está vazio</p>
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
                        <p className="text-sm font-medium px-2 py-1 bg-muted rounded-md text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="font-black text-lg">€ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-5 border-t border-border bg-card/50">
              <div className="flex justify-between mb-4 font-black text-2xl text-foreground">
                <span>Total</span>
                <span>
                  € {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                </span>
              </div>
              <button 
                disabled={cartItems.length === 0}
                onClick={() => {
                  sessionStorage.setItem('cart', JSON.stringify(cartItems));
                  navigate('/checkout');
                }}
                className="w-full py-4 bg-[#00A859] hover:bg-[#00904B] text-white font-black text-lg rounded-xl disabled:opacity-50 shadow-lg shadow-[#00A859]/30 transition-all hover:scale-[1.02]"
              >
                ZUR KASSE
              </button>
            </div>
          </div>
        </div>
      )}

      <iframe
        src={iframeSrc}
        title="Store"
        onLoad={(e) => {
          // Hide loading overlay when iframe loads
          const overlay = document.getElementById("store-loading-overlay");
          if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => {
              overlay.style.display = "none";
            }, 500);
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
