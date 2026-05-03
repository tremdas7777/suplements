import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
      <HeaderESN />
      <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: "#f59e0b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <X size={36} color="#fff" strokeWidth={3} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Zahlung abgebrochen</h1>
        <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          Deine Zahlung wurde nicht abgeschlossen. Dein Warenkorb ist noch gespeichert.
        </p>

        <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
          <button onClick={() => navigate("/checkout")} style={{ padding: "16px", background: "#4ec3e0", color: "#fff", border: "none", borderRadius: 50, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
            Zurück zum Checkout
          </button>
          <button onClick={() => navigate("/")} style={{ padding: "16px", background: "transparent", color: "#232323", border: "1.5px solid #e5e7eb", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Weiter einkaufen
          </button>
        </div>
      </div>
      <FooterESN />
    </div>
  );
}
