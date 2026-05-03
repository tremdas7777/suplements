import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import Checkout from "./pages/Checkout.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import CheckoutCancel from "./pages/CheckoutCancel.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <CartDrawer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/products/:slug" element={<Index />} />
            <Route path="/:slug" element={<Index />} />
            <Route path="/collections/:slug" element={<Index />} />
            <Route path="/pages/:slug" element={<Index />} />
            <Route path="/blogs/:slug" element={<Index />} />
            <Route path="/cart" element={<Index />} />
            <Route path="/policies/:slug" element={<Index />} />
            <Route path="/account" element={<Index />} />
            <Route path="/store/*" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
