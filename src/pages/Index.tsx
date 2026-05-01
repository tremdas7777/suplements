import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PROXY_BASE = "https://wwwesncomqedu.arktrix.com";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const target = `${PROXY_BASE}${location.pathname}${location.search}`;
    window.location.replace(target);
  }, [location.pathname, location.search]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        color: "#111",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: "4px solid #e5e7eb",
          borderTopColor: "#111",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ marginTop: 16, fontWeight: 600 }}>Carregando loja...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Index;
