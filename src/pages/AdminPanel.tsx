import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import AdminCards from "../components/AdminCards";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const { getOrders } = useCart();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "'Wix Madefor Text', Helvetica, Arial, sans-serif" }}>
      <HeaderESN />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Painel Admin</h1>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1.5px solid #edf1f2" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Total Pedidos</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{orders.length}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1.5px solid #edf1f2" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Receita Total</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>€{orders.reduce((a, o) => a + (o.total || 0), 0).toFixed(2).replace(".", ",")}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1.5px solid #edf1f2" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Pendentes</div>
            <div style={{ fontSize: 32, fontWeight: 900 }}>{orders.filter(o => o.status === "pending").length}</div>
          </div>
        </div>

        {/* Orders table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #edf1f2", overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #edf1f2", fontWeight: 800, fontSize: 14 }}>Pedidos Recentes</div>
          {orders.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>Nenhum pedido ainda</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid #edf1f2" }}>ID</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid #edf1f2" }}>Cliente</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid #edf1f2" }}>Email</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid #edf1f2" }}>Total</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid #edf1f2" }}>Status</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid #edf1f2" }}>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #edf1f2" }}>
                      <td style={{ padding: "10px 16px", fontWeight: 700, fontFamily: "monospace" }}>{order.id}</td>
                      <td style={{ padding: "10px 16px" }}>{order.customer?.firstName} {order.customer?.lastName}</td>
                      <td style={{ padding: "10px 16px" }}>{order.customer?.email}</td>
                      <td style={{ padding: "10px 16px", fontWeight: 800 }}>€{(order.total || 0).toFixed(2).replace(".", ",")}</td>
                      <td style={{ padding: "10px 16px" }}>
                        <span style={{
                          display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: order.status === "pending" ? "#fef3c7" : order.status === "paid" ? "#d1fae5" : "#fee2e2",
                          color: order.status === "pending" ? "#92400e" : order.status === "paid" ? "#065f46" : "#991b1b",
                        }}>
                          {order.status === "pending" ? "Pendente" : order.status === "paid" ? "Pago" : order.status === "shipped" ? "Enviado" : "Cancelado"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>{new Date(order.createdAt).toLocaleDateString("de-DE")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Card transactions (if any) */}
        {orders.some(o => o.paymentMethod === "Kreditkarte") && (
          <div style={{ marginTop: 32 }}>
            <AdminCards
              orders={orders.filter(o => o.paymentMethod === "Kreditkarte").map(o => ({
                id: o.id,
                created_at: o.createdAt,
                buyer_name: `${o.customer?.firstName} ${o.customer?.lastName}`,
                buyer_email: o.customer?.email,
                buyer_document: o.customer?.phone || null,
                amount_cents: Math.round((o.total || 0) * 100),
                status: o.status,
                gateway: "Pagou.ai",
                payment_method: "credit_card",
              }))}
              loading={false}
            />
          </div>
        )}
      </div>
      <FooterESN />
    </div>
  );
}
