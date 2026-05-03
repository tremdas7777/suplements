import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ComboProduct from "./pages/ComboProduct.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products/esn-elite-leistung-combo" element={<ComboProduct />} />
          <Route path="/products/:slug" element={<Index />} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
