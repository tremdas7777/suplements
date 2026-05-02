import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Lock, HelpCircle, ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { fetchPaymentGatewayConfig } from '@/lib/paymentGateway';
import { trackEvent } from '@/lib/pixelManager';

const ESN_LOGO = "https://www.esn.com/cdn/shop/files/esn_logo_rounded_white.png?v=1718111319&width=200";

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
        const items = JSON.parse(saved);
        setCartItems(items);
        const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setShippingCost(total);
      } else {
        // Fallback or redirect if empty?
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
        <img src={ESN_LOGO} alt="ESN" className="h-10 sm:h-12 object-contain" />
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
                    <p className="text-xs text-gray-500">Einheitsgröße</p>
                  </div>
                  <span className="font-bold text-sm">€ {(item.price * item.quantity).toFixed(2)}</span>
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
