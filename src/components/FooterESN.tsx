export default function FooterESN() {
  return (
    <footer style={{
      background: "#fff",
      borderTop: "1px solid #edf1f2",
      padding: "60px 24px",
      marginTop: 40,
      fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: 1400,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 40
      }}>
        {/* Column 1 */}
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 20, textTransform: "uppercase", fontSize: 14 }}>Produkte</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Proteine</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Supplements</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Riegel & Snacks</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Zubehör</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 20, textTransform: "uppercase", fontSize: 14 }}>Support</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Hilfe-Center</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Versand & Lieferung</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Retouren</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Kontakt</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 20, textTransform: "uppercase", fontSize: 14 }}>Über ESN</h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Unsere Geschichte</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Qualität</a></li>
            <li><a href="#" style={{ color: "#232323", textDecoration: "none", fontSize: 14 }}>Nachhaltigkeit</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h4 style={{ fontWeight: 800, marginBottom: 20, textTransform: "uppercase", fontSize: 14 }}>Newsletter</h4>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Sichere dir 10% Rabatt auf deine erste Bestellung.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input 
              type="email" 
              placeholder="E-Mail Adresse" 
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #edf1f2",
                background: "#f8f9fa",
                fontSize: 14
              }}
            />
            <button style={{
              background: "#000",
              color: "#fff",
              border: "none",
              padding: "0 20px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer"
            }}>ABONNIEREN</button>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 1400,
        margin: "60px auto 0",
        paddingTop: 30,
        borderTop: "1px solid #edf1f2",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20
      }}>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          © {new Date().getFullYear()} ESN. Alle Preise inkl. MwSt.
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", opacity: 0.5 }}>
          <img src="https://cdn.shopify.com/static/images/flags/de.svg" alt="DE" style={{ width: 24 }} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>DEUTSCHLAND</span>
        </div>
      </div>
    </footer>
  );
}
