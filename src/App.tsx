import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Checkout from "./pages/Checkout.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import ObrigadoFinal from "./pages/ObrigadoFinal.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/upsell" element={<ThankYou />} />
          <Route path="/obrigado" element={<ObrigadoFinal />} />
          <Route path="/admin" element={<AdminPanel />} />
          
          <Route path="/products/:slug" element={<Index />} />
          <Route path="/collections/:slug" element={<Index />} />
          <Route path="/pages/:slug" element={<Index />} />
          <Route path="/blogs/:slug" element={<Index />} />
          <Route path="/cart" element={<Index />} />
          <Route path="/policies/:slug" element={<Index />} />
          <Route path="/account" element={<Index />} />
          <Route path="/store/*" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
