import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isNavigatingRef = useRef(false);
  const { addItem } = useCart();

  // iframe src is FIXED at mount — only changes on popstate
  const [iframeSrc, setIframeSrc] = useState(() => {
    const mappedPath = getMappedPathStatic(location.pathname);
    return `/store/${mappedPath}.html${location.search}`;
  });
  const [showLoader, setShowLoader] = useState(true);

  // Ref to always have latest path without re-creating handler
  const currentPathRef = useRef(location.pathname + location.search);
  useEffect(() => {
    currentPathRef.current = location.pathname + location.search;
  }, [location.pathname, location.search]);

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

  const handleMessage = useCallback((e: MessageEvent) => {
    if (!e.data || !e.data.t) return;
    const currentPath = currentPathRef.current.replace(/\/$/, "");

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
      const targetPath = normalizeStorePath(e.data.u);
      isNavigatingRef.current = true;
      if (targetPath !== currentPath) navigate(targetPath);
      return;
    }

    if (e.data.t === "sys-nav" && e.data.u) {
      const targetPath = normalizeStorePath(e.data.u);
      const targetPathname = targetPath.split("?")[0];
      const currentPathname = currentPath.split("?")[0];
      if (targetPathname !== currentPathname) {
        isNavigatingRef.current = true;
        navigate(targetPath, { replace: true });
      }
      return;
    }
  }, [navigate, addItem]);

  // Register message handler ONCE — never re-registers
  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle back/forward buttons — only time we reload iframe
  useEffect(() => {
    const handlePopState = () => {
      setShowLoader(true);
      const mappedPath = getMappedPathStatic(location.pathname);
      setIframeSrc(`/store/${mappedPath}.html${location.search}`);
      const timer = setTimeout(() => setShowLoader(false), 5000);
      return () => clearTimeout(timer);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // React to ALL route changes — update iframe src
  useEffect(() => {
    setShowLoader(true);
    const mappedPath = getMappedPathStatic(location.pathname);
    setIframeSrc(`/store/${mappedPath}.html${location.search}`);
    const timer = setTimeout(() => setShowLoader(false), 5000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (window !== window.top) return null;

  return (
    <div className="relative h-screen w-screen bg-background overflow-hidden">
      {showLoader && (
        <div id="store-loading-overlay" className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold animate-pulse">Shop wird geladen...</p>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        title="Store"
        onLoad={() => setShowLoader(false)}
        style={{ width: "100%", height: "100%", border: "none", position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

function getMappedPathStatic(pathname: string): string {
  if (pathname === "" || pathname === "/" || pathname === "/store/") return "index";
  let clean = pathname.replace(/^\/store\//, "").replace(/^\//, "").replace(/\/$/, "").replace(/\.html$/, "");
  if (pathname.startsWith("/products/")) return "products_" + clean.replace("products/", "");
  if (pathname.startsWith("/collections/")) return "collections_" + clean.replace("collections/", "");
  if (pathname.startsWith("/pages/")) return "pages_" + clean.replace("pages/", "");
  if (pathname.startsWith("/blogs/")) return "blogs_" + clean.replace("blogs/", "");
  if (pathname.startsWith("/policies/")) return "policies_" + clean.replace("policies/", "");
  return "products_" + clean;
}

export default Index;
