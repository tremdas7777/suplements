import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import NotFound from "./NotFound";
import { useCart } from "../context/CartContext";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const lastIframeUrl = useRef<string>("");
  const { addItem, openCart } = useCart();

  const normalizeStorePath = (inputUrl: string) => {
    let targetPath = inputUrl;
    if (targetPath.startsWith("http")) {
      try {
        const parsed = new URL(targetPath);
        let pathname = parsed.pathname.replace(/\/$/, "");
        targetPath = pathname + parsed.search;
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

    if (!targetPath.startsWith("/")) targetPath = "/" + targetPath;
    const [p, s] = targetPath.split("?");
    return p.replace(/\/$/, "") + (s ? "?" + s : "");
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || !e.data.t) return;

      if (e.data.t === "sys-add-to-cart" && e.data.item) {
        const item = e.data.item;
        addItem({
          id: item.id || "product-" + Math.random().toString(36).substr(2, 9),
          title: item.title || "Produkt",
          price: typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^0-9,.]/g, "").replace(",", "."))
            : Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image,
          variant: item.variant,
        });
        return;
      }

      if (e.data.t === "sys-checkout") {
        navigate("/checkout");
        return;
      }

      if (e.data.t === "sys-click" && e.data.u) {
        // Intentional user click → push new history entry
        const targetPath = normalizeStorePath(e.data.u);
        const currentPath = (location.pathname + location.search).replace(/\/$/, "");
        lastIframeUrl.current = e.data.u;
        if (targetPath !== currentPath) navigate(targetPath);
        return;
      }

      if (e.data.t === "sys-nav" && e.data.u) {
        // Iframe URL changed (e.g. variant selected) → replace, do NOT push history
        const targetPath = normalizeStorePath(e.data.u);
        const currentPath = (location.pathname + location.search).replace(/\/$/, "");

        // Only navigate if pathnames differ (ignore query params to prevent flicker loops)
        const targetPathname = targetPath.split("?")[0];
        const currentPathname = currentPath.split("?")[0];
        if (targetPathname !== currentPathname) {
          lastIframeUrl.current = e.data.u;
          navigate(targetPath, { replace: true });
        }
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [path, location.search, navigate, addItem, openCart]);

  if (window !== window.top) return null;

  const getMappedPath = () => {
    if (path === "" || path === "/" || path === "/store/") return "index";
    let clean = path.replace(/^\/store\//, "").replace(/^\//, "").replace(/\/$/, "").replace(/\.html$/, "");
    if (path.startsWith("/products/")) return "products_" + clean.replace("products/", "");
    if (path.startsWith("/collections/")) return "collections_" + clean.replace("collections/", "");
    if (path.startsWith("/pages/")) return "pages_" + clean.replace("pages/", "");
    if (path.startsWith("/blogs/")) return "blogs_" + clean.replace("blogs/", "");
    if (path.startsWith("/policies/")) return "policies_" + clean.replace("policies/", "");
    return "products_" + clean;
  };

  const mappedPath = getMappedPath();
  const iframeSrc = `/store/${mappedPath}.html${location.search}`;

  const removeLoader = () => {
    const overlay = document.getElementById("store-loading-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(() => { overlay.style.display = "none"; }, 500);
    }
  };

  useEffect(() => {
    const timer = setTimeout(removeLoader, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      <div id="store-loading-overlay" className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold animate-pulse">Shop wird geladen...</p>
      </div>

      <iframe
        src={iframeSrc}
        title="Store"
        onLoad={removeLoader}
        style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default Index;
