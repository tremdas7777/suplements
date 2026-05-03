import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname, location.search);
    console.error("Window top:", window === window.top ? "yes" : "no");
  }, [location.pathname, location.search]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
      <HeaderESN />
      <div style={{ maxWidth: 520, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: 72, fontWeight: 900, color: "#4ec3e0", margin: "0 0 16px" }}>404</h1>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Seite nicht gefunden</h2>
        <p style={{ color: "#6b7280", fontSize: 15, marginBottom: 32 }}>
          Die gesuchte Seite existiert nicht oder wurde verschoben: {location.pathname}
        </p>
        <a href="/" style={{ display: "inline-block", padding: "14px 32px", background: "#4ec3e0", color: "#fff", textDecoration: "none", borderRadius: 50, fontWeight: 800, fontSize: 15 }}>
          Zur Startseite
        </a>
      </div>
      <FooterESN />
    </div>
  );
};

export default NotFound;
