import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Lock, HelpCircle, ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { fetchPaymentGatewayConfig } from '@/lib/paymentGateway';
import { trackEvent } from '@/lib/pixelManager';

const ESN_LOGO = "https://www.esn.com/cdn/shop/files/esn_logo_rounded_black.png?v=1718111319&width=200";

const StoreCheckout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Info, 2: Payment
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    // Load cart
    try {
      const saved = sessionStorage.getItem('cart');
      if (saved) {
        const items = JSON.parse(saved).map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 0
        }));
        setCartItems(items);
      }
    } catch (e) {}

    // Init Stripe Config
    fetchPaymentGatewayConfig().then((cfg) => {
      if (cfg.stripe?.publicKey) {
        setStripePromise(loadStripe(cfg.stripe.publicKey));
      }
    });
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !address || !city || !zipCode) {
      toast({
        title: "Fehlende Informationen",
        description: "Bitte füllen Sie alle erforderlichen Felder aus.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const cfg = await fetchPaymentGatewayConfig();
      const itemsDesc = cartItems.map(i => `${i.quantity}x ${i.title}`).join(', ');
      
      const { data, error } = await supabase.functions.invoke('criar-payment-intent', {
        body: {
          secretKey: cfg.stripe.secretKey,
          amount: totalAmount,
          buyerName: `${firstName} ${lastName}`,
          buyerEmail: email,
          itemsDescription: itemsDesc,
          metadata: {
            address: `${address}, ${zipCode} ${city}`,
            itemsDescription: itemsDesc
          }
        }
      });

      if (error) throw error;
      setClientSecret(data.clientSecret);
      setStep(2); // Move to payment
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message || "Fehler beim Initialisieren der Zahlung.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-black py-6 px-4 flex justify-center items-center relative">
        <button 
          onClick={() => navigate(-1)} 
          className="absolute left-4 text-white hover:opacity-70 flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft size={18} /> <span className="hidden sm:inline">Zurück zum Shop</span>
        </button>
        <div className="h-10 sm:h-12 text-white flex items-center">
          <svg className="h-full w-auto" viewBox="104.15 203.03 985.29 435.63" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="m403.06 422.17 13.81-85.65h-184.5l7.23-44.72h184.5l14.34-88.75-232.49-.02c-58.43 0-62.56 61.63-66.95 88.75l-34.16 211.53c-4.68 29.07 15.07 52.61 44.11 52.61h232.5l14.36-89.04h-184.5l7.21-44.72h184.52Zm613.89-219.11H784.63l-14.33 88.75h168.98l-42.67 264.12h115.98l48.48-300.26c4.71-29.04-15.04-52.61-44.11-52.61ZM727.89 555.93h113.48l35.43-219.4H763.33l-35.43 219.4Zm11.89-264.12 14.34-88.75-232.47-.02c-58.43 0-62.56 61.63-66.95 88.75s0 .01 0 .01h285.08Zm-58.27 44.72h-233.7l-5.65 35.23a43.49 43.49 0 0 0 9.82 35.12 43.48 43.48 0 0 0 32.97 15.29h133.26l-7.25 44.72H426.45l-14.39 89.04h232.48c29.04 0 56.4-23.54 61.1-52.61l18.8-116.38a43.482 43.482 0 0 0-42.93-50.41m382.23 170.69c-14.19 0-25.72 11.53-25.72 25.72s11.53 25.7 25.72 25.7 25.7-11.53 25.7-25.7-11.53-25.72-25.7-25.72m0 45.73c-11 0-20.04-9.04-20.04-20.02s9.04-20.04 20.04-20.04 20.02 9.04 20.02 20.04-9.04 20.02-20.02 20.02m11.69-24.1c0-9.39-7.8-9.39-9.91-9.39h-11.35v26.05h6.38v-7.27h2.84l4.43 7.27h7.09l-5.32-8.15c2.84-1.07 5.85-3.56 5.85-8.51Zm-11.51 4.26h-3.38v-8.16h3.38c3.36 0 4.78.89 4.78 3.91s-1.42 4.26-4.78 4.26Zm-862.27 87.75H186.9v13.73h25.53v3.22h-29.12v-35.02h27.94v3.22H186.9v11.69h14.75zm25.1-18.08v31.8h22.52v3.22h-26.12v-35.02h3.59Zm31.91 35.03v-35.02h3.59v35.02zm13.52-35.03h30.62V606h-13.51v31.8h-3.59V606h-13.51v-3.22Zm58.88 18.08h-14.75v13.73h25.53v3.22h-29.12v-35.02h27.94v3.22h-24.35v11.69h14.75zm73.32-11.32c-2.15-1.99-6.7-4.51-13.19-4.51-4.72 0-10.08 1.77-10.08 6.76s6.27 5.25 12.23 5.58c6.06.38 15.87.97 15.87 10.03 0 7.88-7.35 11.26-15.77 11.26s-14.16-3.7-17.86-7.13l2.2-2.47c3.06 2.84 7.94 6.49 15.71 6.49 6.54 0 12.12-2.41 12.12-7.72 0-5.9-6.38-6.6-12.28-6.97-7.4-.43-15.82-.96-15.82-8.79s7.67-10.08 13.84-10.08c7.08 0 12.6 2.89 15.23 5.09l-2.2 2.47Zm16.25 28.27v-35.02h18.56c4.34 0 7.35 1.13 9.6 3.49 1.72 1.82 2.63 4.07 2.63 6.54 0 2.73-1.13 5.15-3 6.97-2.14 2.09-5.09 3.11-9.22 3.11h-14.96v14.91h-3.59Zm3.59-31.81v13.73h14.96c2.36 0 4.72-.38 6.6-2.2 1.34-1.23 2.04-2.95 2.04-4.72 0-1.67-.64-3.17-1.82-4.45-1.72-1.83-4.02-2.36-6.81-2.36h-14.96Zm53.79-4.02c10.78 0 19.36 8.15 19.36 18.23s-8.58 18.45-19.36 18.45-19.2-8.21-19.2-18.45 8.47-18.23 19.2-18.23m0 33.46c8.74 0 15.61-6.81 15.61-15.23s-6.86-15.07-15.61-15.07-15.39 6.76-15.39 15.07 6.76 15.23 15.39 15.23m31.21 2.37v-35.02h19.25c4.4 0 7.45 1.18 9.55 3.43 1.66 1.77 2.63 4.08 2.63 6.7 0 4.72-3.27 8.58-8.47 9.55l8.8 15.34h-4.08l-8.37-14.91h-15.71v14.91h-3.59Zm3.6-31.81v13.73h16.95c4.4 0 7.29-3.16 7.29-6.86 0-1.77-.64-3.32-1.82-4.56-1.66-1.71-3.92-2.3-6.76-2.3h-15.66Zm35.18-3.22h30.62V606h-13.51v31.8h-3.59V606h-13.51v-3.22Zm65.53 6.76c-2.15-1.99-6.7-4.51-13.19-4.51-4.72 0-10.08 1.77-10.08 6.76s6.27 5.25 12.23 5.58c6.06.38 15.87.97 15.87 10.03 0 7.88-7.35 11.26-15.77 11.26s-14.16-3.7-17.86-7.13l2.2-2.47c3.06 2.84 7.94 6.49 15.71 6.49 6.54 0 12.12-2.41 12.12-7.72 0-5.9-6.38-6.6-12.28-6.97-7.4-.43-15.82-.96-15.82-8.79s7.67-10.08 13.84-10.08c7.08 0 12.6 2.89 15.23 5.09l-2.2 2.47Zm73.9-6.76v35.02h-3.38l-23.81-28.85h-.05v28.85h-3.59v-35.02h3.38l23.81 28.85h.05v-28.85zm44.89 0v22.58c0 8.47-6.54 13.3-15.34 13.3s-15.23-4.83-15.23-13.3v-22.58h3.59v22.58c0 6.49 5.04 10.08 11.64 10.08s11.74-3.59 11.74-10.08v-22.58h3.59Zm9.17 0h30.62V606H758.6v31.8h-3.59V606H741.5v-3.22Zm40.55 35.03v-35.02h19.25c4.4 0 7.45 1.18 9.55 3.43 1.66 1.77 2.63 4.08 2.63 6.7 0 4.72-3.27 8.58-8.47 9.55l8.8 15.34h-4.08l-8.37-14.91h-15.71v14.91h-3.59Zm3.59-31.81v13.73h16.95c4.4 0 7.29-3.16 7.29-6.86 0-1.77-.64-3.32-1.82-4.56-1.66-1.71-3.92-2.3-6.76-2.3h-15.66Zm40.33 31.81v-35.02h3.59v35.02zm13.52-35.03h30.62V606h-13.51v31.8H853V606h-13.51v-3.22Zm40.54 35.03v-35.02h3.59v35.02zm34.65-35.83c10.78 0 19.36 8.15 19.36 18.23s-8.58 18.45-19.36 18.45-19.2-8.21-19.2-18.45 8.47-18.23 19.2-18.23m0 33.46c8.74 0 15.61-6.81 15.61-15.23s-6.86-15.07-15.61-15.07-15.39 6.76-15.39 15.07 6.76 15.23 15.39 15.23m62.05-32.66v35.02h-3.38l-23.81-28.85h-.05v28.85h-3.59v-35.02h3.38l23.81 28.85h.05v-28.85z" />
          </svg>
        </div>
        <div className="absolute right-6 text-white hidden sm:block">
           <ShoppingBag size={24} />
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Side: Forms */}
        <div className="flex-1 p-6 sm:p-10 lg:pr-16 order-2 lg:order-1">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs mb-8 text-gray-500 uppercase tracking-wider font-semibold">
            <span className="text-black">Informationen</span>
            <ChevronRight size={14} />
            <span className={step >= 2 ? "text-black" : ""}>Zahlung</span>
          </nav>

          {step === 1 ? (
            <form onSubmit={handleCreatePaymentIntent} className="space-y-8 animate-in fade-in duration-500">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Kontakt</h2>
                  <span className="text-sm">Schon ein Konto? <a href="#" className="underline font-bold">Anmelden</a></span>
                </div>
                <input 
                  type="email" 
                  placeholder="E-Mail" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                />
              </section>

              <section>
                <h2 className="text-xl font-bold mb-4">Lieferung</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Vorname" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Nachname" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                </div>
                <div className="mt-4">
                  <input 
                    type="text" 
                    placeholder="Adresse" 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input 
                    type="text" 
                    placeholder="PLZ" 
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Stadt" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none"
                  />
                </div>
              </section>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                {loading ? "Wird geladen..." : "Weiter zur Zahlung"}
              </button>
            </form>
          ) : (
            <div className="animate-in slide-in-from-right-10 duration-500">
               <h2 className="text-xl font-bold mb-6">Zahlung</h2>
               <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-6 flex flex-col gap-2 text-sm">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500">Kontakt</span>
                    <span className="font-medium">{email}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-500">Versand an</span>
                    <span className="font-medium text-right">{address}, {zipCode} {city}</span>
                  </div>
               </div>

               {stripePromise && clientSecret ? (
                 <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                   <StripePaymentForm total={totalAmount} />
                 </Elements>
               ) : (
                 <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div></div>
               )}
            </div>
          )}

          <footer className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-[10px] text-gray-400 uppercase font-semibold">
            <a href="#" className="hover:underline">Rückgaberecht</a>
            <a href="#" className="hover:underline">Versandbedingungen</a>
            <a href="#" className="hover:underline">Datenschutz</a>
            <a href="#" className="hover:underline">Impressum</a>
          </footer>
        </div>

        {/* Right Side: Summary */}
        <div className="w-full lg:w-[450px] bg-[#f5f5f5] p-6 sm:p-10 lg:border-l border-gray-200 order-1 lg:order-2">
          <div className="sticky top-10 space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2">Bestellübersicht ({cartItems.length})</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden p-1 shadow-sm">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{item.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded p-0.5 scale-90 origin-left">
                        {step === 1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newItems = cartItems.map((it, i) => 
                                i === idx ? { ...it, quantity: Math.max(0, it.quantity - 1) } : it
                              ).filter(it => it.quantity > 0);
                              setCartItems(newItems);
                              sessionStorage.setItem('cart', JSON.stringify(newItems));
                            }}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                        )}
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        {step === 1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newItems = cartItems.map((it, i) => 
                                i === idx ? { ...it, quantity: it.quantity + 1 } : it
                              );
                              setCartItems(newItems);
                              sessionStorage.setItem('cart', JSON.stringify(newItems));
                            }}
                            className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        )}
                      </div>
                      <span className="font-bold text-sm">€ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 py-6 border-t border-b border-gray-200">
               <input 
                 type="text" 
                 placeholder="Rabattcode" 
                 className="flex-1 p-3.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black outline-none bg-white text-sm"
               />
               <button className="bg-gray-200 px-6 font-bold rounded-md text-gray-600 text-sm hover:bg-gray-300 transition-colors">Anwenden</button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Zwischensumme</span>
                <span className="font-medium text-black">€ {totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">Versand <HelpCircle size={14} /></span>
                <span className="font-medium text-green-600 font-bold uppercase tracking-tight">Kostenlos</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4">
                <span>Gesamt</span>
                <span>€ {totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-right uppercase font-bold tracking-wider">inkl. MwSt.</p>
            </div>

            {/* Security Badges */}
            <div className="pt-8 flex justify-center gap-6 opacity-40">
               <Lock size={20} />
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                 Safe & Secure
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StripePaymentForm = ({ total }: { total: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/obrigado',
      },
    });

    if (error) {
      toast({
        title: "Zahlungsfehler",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
        <PaymentElement />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full py-4 bg-black text-white font-black rounded-md hover:bg-gray-800 transition-colors uppercase tracking-widest text-lg shadow-lg"
      >
        {loading ? "Wird verarbeitet..." : `Jetzt bezahlen € ${total.toFixed(2)}`}
      </button>
      <p className="text-[10px] text-gray-400 text-center uppercase font-bold">
        Mit Klick auf "Jetzt bezahlen" akzeptieren Sie unsere AGB.
      </p>
    </form>
  );
};

export default StoreCheckout;
