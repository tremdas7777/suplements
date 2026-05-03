import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import AdminCards from "../components/AdminCards";
import { useCart } from "../context/CartContext";
import { useEffect, useState, Fragment } from "react";

export default function AdminPanel() {
  const { getOrders } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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
                    <Fragment key={order.id}>
                      <tr 
                        style={{ borderBottom: "1px solid #edf1f2", cursor: "pointer", transition: "background 0.2s" }}
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfcfc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px", fontWeight: 700, fontFamily: "monospace", color: "#111" }}>{order.id}</td>
                        <td style={{ padding: "12px 16px" }}>{order.customer?.firstName} {order.customer?.lastName}</td>
                        <td style={{ padding: "12px 16px" }}>{order.customer?.email}</td>
                        <td style={{ padding: "12px 16px", fontWeight: 800 }}>€{(order.total || 0).toFixed(2).replace(".", ",")}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                            background: order.status === "pending" ? "#fef3c7" : order.status === "paid" ? "#d1fae5" : "#fee2e2",
                            color: order.status === "pending" ? "#92400e" : order.status === "paid" ? "#065f46" : "#991b1b",
                          }}>
                            {order.status === "pending" ? "Pendente" : order.status === "paid" ? "Pago" : order.status === "shipped" ? "Enviado" : "Cancelado"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{new Date(order.createdAt).toLocaleDateString("de-DE")}</td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan={6} style={{ padding: "0 24px 24px", background: "#fcfcfc" }}>
                            <div style={{ padding: 20, background: "#fff", borderRadius: 12, border: "1.5px solid #edf1f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                              <h4 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Itens do Pedido</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {order.items?.map((item: any, idx: number) => (
                                  <div key={idx} style={{ display: "flex", gap: 16, alignItems: "center", paddingBottom: idx === order.items.length - 1 ? 0 : 12, borderBottom: idx === order.items.length - 1 ? "none" : "1px solid #edf1f2" }}>
                                    {item.image && <img src={item.image} alt="" style={{ width: 48, height: 48, objectFit: "contain", background: "#f8f9fa", borderRadius: 8 }} />}
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.title}</div>
                                      <div style={{ fontSize: 12, color: "#6b7280" }}>Qtd: {item.quantity} · Preço: €{item.price?.toFixed(2).replace(".", ",")}</div>
                                      
                                      {item.isCombo && item.comboSelections && (
                                        <div style={{ marginTop: 10, padding: 12, background: "#f8f9fa", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                                          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", marginBottom: 6, color: "#111" }}>Seleções do Combo:</div>
                                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px 16px" }}>
                                            {Object.entries(item.comboSelections).map(([key, val]: [string, any]) => (
                                              <div key={key} style={{ fontSize: 12 }}>
                                                <span style={{ fontWeight: 600, color: "#6b7280" }}>{key.replace(/_/g, ' ')}:</span> <span style={{ fontWeight: 700 }}>{val}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      
                                      {item.variant && !item.isCombo && (
                                        <div style={{ fontSize: 12, marginTop: 4 }}>
                                          <span style={{ fontWeight: 600, color: "#6b7280" }}>Sabor:</span> <strong>{item.variant}</strong>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "2px solid #edf1f2" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Endereço de Entrega:</div>
                                <div style={{ fontSize: 13, color: "#4b5563", marginTop: 4 }}>
                                  {order.customer?.address}, {order.customer?.zip} {order.customer?.city}<br />
                                  {order.customer?.country}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
                buyer_name: `${o.customer?.firstName || ""} ${o.customer?.lastName || ""}`.trim() || "Cliente",
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
