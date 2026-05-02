import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isIframe404, setIsIframe404] = useState(false);

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
      if (e.data && e.data.t === "sys-click" && e.data.u) {
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl font-bold mb-4">ESN Store</h1>
        <p className="text-muted-foreground mb-6">
          Bem-vindo. Acesse a loja para ver produtos e coleções.
        </p>
        <a
          href="/store/index.html"
          className="inline-block px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold"
        >
          Entrar na loja
        </a>
      </div>
    </div>
  );
};

export default Index;
