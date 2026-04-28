"use client";

import { useEffect, useState } from "react";

export default function PickupApp() {
  const [page, setPage] = useState("order");
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
    item: "",
    note: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("pickup_orders");
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  function saveOrders(newOrders) {
    setOrders(newOrders);
    localStorage.setItem("pickup_orders", JSON.stringify(newOrders));
  }

  function placeOrder(e) {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      ...form,
      status: "Pending",
      time: new Date().toLocaleString()
    };

    saveOrders([newOrder, ...orders]);
    setForm({ name: "", phone: "", pickup: "", dropoff: "", item: "", note: "" });
    alert("Pickup request sent successfully!");
  }

  function updateStatus(id, status) {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    );
    saveOrders(updated);
  }

  function deleteOrder(id) {
    const updated = orders.filter((order) => order.id !== id);
    saveOrders(updated);
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <h1 style={styles.title}>QR Pickup Order</h1>
        <p style={styles.subtitle}>Scan QR. Request pickup. Track order status.</p>
      </section>

      <div style={styles.nav}>
        <button style={page === "order" ? styles.activeBtn : styles.btn} onClick={() => setPage("order")}>Customer Order</button>
        <button style={page === "admin" ? styles.activeBtn : styles.btn} onClick={() => setPage("admin")}>Admin Dashboard</button>
      </div>

      {page === "order" && (
        <form onSubmit={placeOrder} style={styles.card}>
          <h2 style={styles.heading}>Request a Pickup</h2>

          <input style={styles.input} placeholder="Your Name" value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input style={styles.input} placeholder="Phone Number" value={form.phone} required onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input style={styles.input} placeholder="Pickup Location" value={form.pickup} required onChange={(e) => setForm({ ...form, pickup: e.target.value })} />
          <input style={styles.input} placeholder="Drop-off Location" value={form.dropoff} required onChange={(e) => setForm({ ...form, dropoff: e.target.value })} />
          <input style={styles.input} placeholder="Item / Order Details" value={form.item} required onChange={(e) => setForm({ ...form, item: e.target.value })} />
          <textarea style={styles.textarea} placeholder="Extra note for driver" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />

          <button style={styles.submit}>Order Pickup</button>
        </form>
      )}

      {page === "admin" && (
        <div style={styles.card}>
          <h2 style={styles.heading}>Admin Dashboard</h2>
          <p style={styles.small}>Orders are saved on this device for testing.</p>

          {orders.length === 0 && <p>No orders yet.</p>}

          {orders.map((order) => (
            <div key={order.id} style={styles.order}>
              <div style={styles.orderTop}>
                <b>{order.name}</b>
                <span style={styles.badge}>{order.status}</span>
              </div>
              <p><b>Phone:</b> {order.phone}</p>
              <p><b>Pickup:</b> {order.pickup}</p>
              <p><b>Drop-off:</b> {order.dropoff}</p>
              <p><b>Item:</b> {order.item}</p>
              <p><b>Note:</b> {order.note || "None"}</p>
              <small>{order.time}</small>

              <div style={styles.statusButtons}>
                <button onClick={() => updateStatus(order.id, "Accepted")}>Accept</button>
                <button onClick={() => updateStatus(order.id, "Picked Up")}>Picked Up</button>
                <button onClick={() => updateStatus(order.id, "Completed")}>Complete</button>
                <button onClick={() => deleteOrder(order.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const styles = {
  page: { fontFamily: "Arial, sans-serif", padding: 20, maxWidth: 680, margin: "auto", background: "#f7f7f7", minHeight: "100vh" },
  hero: { textAlign: "center", padding: 20, background: "#111827", color: "white", borderRadius: 18, marginBottom: 18 },
  title: { margin: 0, fontSize: 34 },
  subtitle: { marginBottom: 0 },
  nav: { display: "flex", gap: 10, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" },
  btn: { padding: "12px 16px", border: "1px solid #ddd", borderRadius: 10, background: "white", cursor: "pointer" },
  activeBtn: { padding: "12px 16px", border: "1px solid #111827", borderRadius: 10, background: "#111827", color: "white", cursor: "pointer" },
  card: { display: "flex", flexDirection: "column", gap: 12, padding: 20, background: "white", borderRadius: 18, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
  heading: { marginTop: 0 },
  input: { padding: 14, border: "1px solid #ddd", borderRadius: 10, fontSize: 16 },
  textarea: { padding: 14, border: "1px solid #ddd", borderRadius: 10, fontSize: 16, minHeight: 90 },
  submit: { padding: 14, fontWeight: "bold", background: "#16a34a", color: "white", border: "none", borderRadius: 10, fontSize: 16 },
  order: { border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, marginBottom: 12, background: "#fafafa" },
  orderTop: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" },
  badge: { background: "#e5e7eb", padding: "6px 10px", borderRadius: 999, fontSize: 13 },
  statusButtons: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
  small: { color: "#666", marginTop: -8 }
};
