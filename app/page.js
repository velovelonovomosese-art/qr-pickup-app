"use client";
import { useState, useEffect } from "react";

export default function PickupApp() {
  const [page, setPage] = useState("order");
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
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

    setForm({
      name: "",
      phone: "",
      pickup: "",
      dropoff: "",
      note: ""
    });

    alert("Pickup request sent!");
  }

  function updateStatus(id, status) {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    );
    saveOrders(updated);
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>QR Pickup Order</h1>

      <div style={styles.nav}>
        <button onClick={() => setPage("order")}>Customer</button>
        <button onClick={() => setPage("admin")}>Admin</button>
      </div>

      {page === "order" && (
        <form onSubmit={placeOrder} style={styles.card}>
          <h2>Request Pickup</h2>

          <input
            placeholder="Your Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Phone Number"
            value={form.phone}
            required
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            placeholder="Pickup Location"
            value={form.pickup}
            required
            onChange={(e) => setForm({ ...form, pickup: e.target.value })}
          />

          <input
            placeholder="Drop-off Location"
            value={form.dropoff}
            required
            onChange={(e) => setForm({ ...form, dropoff: e.target.value })}
          />

          <textarea
            placeholder="Extra note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <button style={styles.submit}>Order Pickup</button>
        </form>
      )}

      {page === "admin" && (
        <div style={styles.card}>
          <h2>Admin Dashboard</h2>

          {orders.length === 0 && <p>No orders yet.</p>}

          {orders.map((order) => (
            <div key={order.id} style={styles.order}>
              <b>{order.name}</b>
              <p>Phone: {order.phone}</p>
              <p>Pickup: {order.pickup}</p>
              <p>Drop-off: {order.dropoff}</p>
              <p>Note: {order.note || "None"}</p>
              <p>Status: <b>{order.status}</b></p>
              <small>{order.time}</small>

              <div style={styles.statusButtons}>
                <button onClick={() => updateStatus(order.id, "Accepted")}>
                  Accept
                </button>
                <button onClick={() => updateStatus(order.id, "Picked Up")}>
                  Picked Up
                </button>
                <button onClick={() => updateStatus(order.id, "Completed")}>
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    padding: 20,
    maxWidth: 600,
    margin: "auto"
  },
  title: {
    textAlign: "center"
  },
  nav: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 20
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
  },
  submit: {
    padding: 12,
    fontWeight: "bold"
  },
  order: {
    border: "1px solid #ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  statusButtons: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 10
  }
};
