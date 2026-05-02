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
        src={iframeSrc}
        title="Store"
        onLoad={(e) => {
          const overlay = document.getElementById("store-loading-overlay");
          if (overlay) {
            overlay.style.opacity = "0";
            setTimeout(() => { overlay.style.display = "none"; }, 500);
          }

          try {
            const iframe = e.target as HTMLIFrameElement;
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) return;

            const script = doc.createElement('script');
            script.textContent = `
              (function() {
                function fixVariants() {
                  if (!window.cnvs || !window.cnvs.product) return;
                  const product = window.cnvs.product;
                  const options = product.options;
                  const variants = product.variants;
                  const container = document.querySelector('.product-options');
                  if (!container) return;
                  if (!container.innerText.includes('Wird geladen') && container.children.length > 5) return;

                  const selectedOptions = {};
                  options.forEach(opt => { selectedOptions[opt.name] = opt.values[0]; });

                  function render() {
                    container.innerHTML = '';
                    options.forEach(opt => {
                      const optDiv = document.createElement('div');
                      optDiv.className = 'product-options__option';
                      optDiv.style.marginBottom = '20px';
                      optDiv.innerHTML = '<h4 style="margin-bottom: 12px; font-weight: 800; text-transform: uppercase; font-size: 14px;">' + opt.name + ': <span style="color: #6b7280; font-weight: 400;">' + selectedOptions[opt.name] + '</span></h4>';
                      
                      const grid = document.createElement('div');
                      grid.style.display = 'grid';
                      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                      grid.style.gap = '10px';

                      opt.values.forEach(val => {
                        const isSelected = selectedOptions[opt.name] === val;
                        const btn = document.createElement('div');
                        btn.style.padding = '12px 8px';
                        btn.style.border = isSelected ? '2px solid #000' : '1px solid #e5e7eb';
                        btn.style.borderRadius = '12px';
                        btn.style.background = isSelected ? '#f9fafb' : '#fff';
                        btn.style.cursor = 'pointer';
                        btn.style.fontSize = '12px';
                        btn.style.fontWeight = '700';
                        btn.style.textAlign = 'center';
                        btn.style.transition = 'all 0.2s';
                        btn.style.display = 'flex';
                        btn.style.alignItems = 'center';
                        btn.style.justifyContent = 'center';
                        btn.style.minHeight = '50px';
                        btn.innerText = val;
                        if (isSelected) btn.style.boxShadow = '0 0 0 1px #000';
                        btn.onclick = () => { selectedOptions[opt.name] = val; update(); };
                        grid.appendChild(btn);
                      });
                      optDiv.appendChild(grid);
                      container.appendChild(optDiv);
                    });
                  }

                  function update() {
                    const variant = variants.find(v => v.selectedOptions.every(so => selectedOptions[so.name] === so.value));
                    if (variant) {
                      let idInput = document.querySelector('input[name="id"]');
                      if (!idInput) {
                        idInput = document.createElement('input');
                        idInput.type = 'hidden';
                        idInput.name = 'id';
                        document.querySelector('form[action*="/cart/add"]')?.appendChild(idInput);
                      }
                      idInput.value = variant.id;

                      const priceEl = document.querySelector('.product-prices__price');
                      if (priceEl) {
                        const priceNum = parseFloat(variant.price) / 100;
                        const discountedPrice = (priceNum * 0.6).toFixed(2).replace('.', ',');
                        const originalPrice = priceNum.toFixed(2).replace('.', ',');
                        priceEl.innerHTML = '<div style="display: flex; flex-direction: column; gap: 4px;"><div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 24px; font-weight: 900; color: #b70832;">€' + discountedPrice + '</span><span style="text-decoration: line-through; color: #8d9093; font-size: 16px;">€' + originalPrice + '</span><span style="background: #b70832; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">-40%</span></div><span style="font-size: 12px; color: #6b7280;">inkl. MwSt. zzgl. Versand</span></div>';
                        priceEl.setAttribute('data-sys-processed', 'true');
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

                function renderUpsells() {
                  if (!window.cnvs || !window.cnvs.product || !window.cnvs.product.quickUpsell) return;
                  const upsells = window.cnvs.product.quickUpsell.slice(0, 3);
                  const target = document.querySelector('.product-form');
                  if (!target || document.getElementById('sys-upsells')) return;

                  let itemsHtml = '';
                  upsells.forEach(item => {
                    const price = (parseFloat(item.price) / 100 * 0.6).toFixed(2).replace('.', ',');
                    itemsHtml += '<div style="display: flex; align-items: center; gap: 12px; background: white; padding: 12px; border-radius: 12px; border: 1px solid #e5e7eb;"><img src="' + item.imageUrl + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"><div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">' + item.title + '</div><div style="color: #b70832; font-weight: 900; font-size: 14px;">€' + price + '</div></div><button style="background: #000; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer;">HINZUFÜGEN</button></div>';
                  });

                  const div = document.createElement('div');
                  div.id = 'sys-upsells';
                  div.style.marginTop = '40px';
                  div.style.padding = '20px';
                  div.style.background = '#f9fafb';
                  div.style.borderRadius = '16px';
                  div.innerHTML = '<h3 style="font-size: 18px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase;">Oft zusammen gekauft</h3><div style="display: flex; flex-direction: column; gap: 16px;">' + itemsHtml + '</div>';
                  target.after(div);
                }

                function renderTrustShield() {
                  const target = document.querySelector('.product-prices');
                  if (!target || document.getElementById('sys-trust-shield')) return;
                  const div = document.createElement('div');
                  div.id = 'sys-trust-shield';
                  div.style.display = 'grid';
                  div.style.gridTemplateColumns = 'repeat(3, 1fr)';
                  div.style.gap = '10px';
                  div.style.marginTop = '20px';
                  div.style.marginBottom = '20px';
                  const items = [{ icon: 'https://www.esn.com/cdn/shop/files/Star_1.svg', text: 'Top Qualität' }, { icon: 'https://www.esn.com/cdn/shop/files/TestTube.svg', text: 'Laborgeprüft' }, { icon: 'https://www.esn.com/cdn/shop/files/Cherries_1.svg', text: 'Bester Geschmack' }];
                  div.innerHTML = items.map(i => '<div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;"><img src="' + i.icon + '" style="width: 24px; height: 24px;"><span style="font-size: 10px; font-weight: 700; text-transform: uppercase;">' + i.text + '</span></div>').join('');
                  target.after(div);
                }

                function renderReviews() {
                  if (!window.cnvs || !window.cnvs.product || !window.cnvs.product.reviews) return;
                  const reviews = window.cnvs.product.reviews;
                  const target = document.querySelector('.main-product');
                  if (!target || document.getElementById('sys-reviews')) return;
                  const div = document.createElement('div');
                  div.id = 'sys-reviews';
                  div.style.padding = '40px 20px';
                  div.style.borderTop = '1px solid #e5e7eb';
                  div.style.marginTop = '40px';
                  div.innerHTML = '<div style="max-width: 1200px; margin: 0 auto;"><h2 style="font-size: 24px; font-weight: 900; margin-bottom: 30px; text-transform: uppercase;">Bewertungen</h2><div style="display: flex; gap: 40px; margin-bottom: 40px; flex-wrap: wrap;"><div style="text-align: center; background: #f9fafb; padding: 30px; border-radius: 20px; min-width: 200px;"><div style="font-size: 48px; font-weight: 900; color: #b70832;">' + reviews.rating + '</div><div style="color: #fbbf24; font-size: 24px;">★★★★★</div><div style="font-size: 14px; color: #6b7280; margin-top: 8px;">' + reviews.count.toLocaleString() + ' Bewertungen</div></div><div style="flex: 1; display: flex; flex-direction: column; gap: 12px; justify-content: center;">' + [5,4,3,2,1].map(s => '<div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 12px; font-weight: 700; width: 20px;">' + s + '</span><div style="flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;"><div style="width: ' + (s === 5 ? '85' : s === 4 ? '10' : '2') + '%; height: 100%; background: #b70832;"></div></div></div>').join('') + '</div></div><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;"><div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 16px;"><div style="color: #fbbf24; margin-bottom: 10px;">★★★★★</div><p style="font-weight: 700; margin-bottom: 8px;">Top Produkt!</p><p style="font-size: 14px; color: #4b5563; line-height: 1.6;">Ich bin absolut begeistert von dem Geschmack und der Löslichkeit. ESN ist einfach die beste Marke.</p><p style="font-size: 12px; color: #9ca3af; margin-top: 12px;">– Verified Buyer</p></div></div></div>';
                  target.after(div);
                }

                function fixCollectionPrices() {
                  const cards = document.querySelectorAll('.product-card, .product-card-sample, [data-component="product-card"]');
                  cards.forEach(card => {
                    if (card.getAttribute('data-sys-processed')) return;
                    const priceEl = card.querySelector('.product-prices__price, .product-card__prices, .price__regular');
                    if (!priceEl) return;
                    const text = priceEl.innerText.trim();
                    const match = text.match(/(\\d+)[,.](\\d+)/);
                    if (match) {
                      card.setAttribute('data-sys-processed', 'true');
                      const currentPrice = parseInt(match[1]) + (parseInt(match[2]) / 100);
                      const discountedPrice = currentPrice * 0.6; 
                      const oldPriceStr = currentPrice.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                      const newPriceStr = discountedPrice.toLocaleString('de-DE', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                      priceEl.innerHTML = '<span style="color: #b70832; font-weight: 900; font-size: 1.1em;">€' + newPriceStr + '</span><span style="text-decoration: line-through; color: #9ca3af; font-size: 0.85em; margin-left: 8px;">€' + oldPriceStr + '</span><div style="position: absolute; top: 12px; left: 12px; background: #b70832; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 900; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">SPARE 40%</div>';
                      card.style.position = 'relative';
                    }
                  });
                }

                function hideBuggyProducts() {
                  const cards = document.querySelectorAll('.product-card, .product-card-sample, [data-component="product-card"], a[href*="elite-leistung-combo"], a[href*="elite-performance-paket"]');
                  cards.forEach(card => {
                    const text = card.innerText || "";
                    if (text.includes('Elite Leistungs-Paket') || text.includes('Elite Performance Pack') || (card.querySelector && card.querySelector('img[src*="Elite_Leistungs-Paket"]')) || (card.href && (card.href.includes('elite-leistung-combo') || card.href.includes('elite-performance-paket')))) {
                      card.style.display = 'none';
                      card.setAttribute('data-sys-hidden', 'true');
                    }
                  });
                  const titles = document.querySelectorAll('.product-card__title, .product-card__subtitle');
                  titles.forEach(t => { if (t.innerText.includes('Elite Leistungs-Paket')) { t.closest('.product-card')?.style.setProperty('display', 'none', 'important'); } });
                }

                function renderFooterUSPs() {
                  const target = document.querySelector('footer');
                  if (!target || document.getElementById('sys-footer-usp')) return;
                  const div = document.createElement('div');
                  div.id = 'sys-footer-usp';
                  div.style.padding = '40px 20px';
                  div.style.background = '#000';
                  div.style.color = '#fff';
                  div.style.textAlign = 'center';
                  div.style.marginTop = '40px';
                  div.innerHTML = '<div style="max-width: 1200px; margin: 0 auto;"><div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-bottom: 30px; font-weight: 700; font-size: 14px; text-transform: uppercase;"><div style="display: flex; align-items: center; gap: 8px;"><span style="color: #b70832; font-size: 20px;">✓</span> Kostenloser Versand ab 75€</div><div style="display: flex; align-items: center; gap: 8px;"><span style="color: #b70832; font-size: 20px;">✓</span> Schnelle Lieferung (24h)</div><div style="display: flex; align-items: center; gap: 8px;"><span style="color: #b70832; font-size: 20px;">✓</span> Premium Qualität</div></div><div style="opacity: 0.5; display: flex; justify-content: center; gap: 30px; align-items: center; border-top: 1px solid #333; margin-top: 20px; padding-top: 20px;"><img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/dhl_logo.png" style="height: 12px; filter: invert(1);"><img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/paypal_logo.png" style="height: 12px; filter: invert(1);"><img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/visa_logo.png" style="height: 12px; filter: invert(1);"><img src="https://cdn.shopify.com/s/files/1/0550/2032/2995/files/mastercard_logo.png" style="height: 12px; filter: invert(1);"></div></div>';
                  target.prepend(div);
                }

                function renderAnnouncementBar() {
                  const target = document.body;
                  if (!target || document.getElementById('sys-announcement')) return;
                  const div = document.createElement('div');
                  div.id = 'sys-announcement';
                  div.style.background = '#b70832';
                  div.style.color = '#fff';
                  div.style.padding = '8px';
                  div.style.textAlign = 'center';
                  div.style.fontSize = '11px';
                  div.style.fontWeight = '900';
                  div.style.textTransform = 'uppercase';
                  div.style.letterSpacing = '0.5px';
                  div.style.zIndex = '1000';
                  div.style.position = 'relative';
                  div.innerHTML = '🔥 CODE: ESN - JETZT 40% RABATT AUF ALLES SICHERN! 🔥';
                  target.prepend(div);
                }

                const style = document.createElement('style');
                style.textContent = '[href*="elite-leistung-combo"], [href*="elite-performance-paket"], [data-track*="Elite Leistungs-Paket"], img[src*="Elite_Leistungs-Paket"] { display: none !important; }';
                document.head.appendChild(style);

                function runAll() {
                  renderAnnouncementBar(); hideBuggyProducts(); fixVariants(); renderUpsells(); renderTrustShield(); renderReviews(); fixCollectionPrices(); renderFooterUSPs();
                }

                runAll();
                const obs = new MutationObserver(() => { runAll(); });
                obs.observe(document.body, { childList: true, subtree: true });
                setInterval(runAll, 2000);
              })();
            `;
            doc.body.appendChild(script);
          } catch (err) {
            console.error("Failed to inject variant fixer:", err);
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
