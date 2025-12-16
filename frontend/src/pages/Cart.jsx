import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState({}); // { [id]: true/false }

  const styles = {
    container: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
    title: { marginBottom: "20px", color: "#333", textAlign: "center" },

    layout: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" },

    card: {
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "16px",
      marginBottom: "12px",
    },

    itemRow: { display: "flex", gap: "14px", alignItems: "center" },

    check: { width: "18px", height: "18px" },

    imgWrap: {
      width: "90px",
      height: "90px",
      borderRadius: "10px",
      border: "1px solid #eee",
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "8px",
      flexShrink: 0,
    },
    img: { width: "100%", height: "100%", objectFit: "contain" },

    name: { fontWeight: "bold", color: "#333", cursor: "pointer" },
    meta: { color: "#666", fontSize: "0.9rem", marginTop: "4px" },

    qtyRow: { display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" },
    qtyBtn: {
      width: "34px",
      height: "34px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      background: "#f7f7f7",
      cursor: "pointer",
      fontWeight: "bold",
    },
    qtyVal: { minWidth: "24px", textAlign: "center", fontWeight: "bold" },

    price: { fontWeight: "bold", color: "#28a745", marginLeft: "auto" },

    removeBtn: {
      border: "none",
      background: "none",
      color: "#dc3545",
      cursor: "pointer",
      fontWeight: "bold",
      marginLeft: "10px",
    },

    summary: {
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "16px",
      height: "fit-content",
      position: "sticky",
      top: "20px",
    },
    summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#444" },
    total: { fontSize: "1.2rem", fontWeight: "bold", color: "#28a745" },

    topActions: { display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" },
    smallBtn: {
      padding: "10px 12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      cursor: "pointer",
      background: "#f7f7f7",
      fontWeight: "bold",
    },

    primaryBtn: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: "#007bff",
      color: "white",
      fontWeight: "bold",
      marginTop: "10px",
    },
    darkBtn: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      background: "#333",
      color: "white",
      fontWeight: "bold",
      marginTop: "10px",
    },
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(Array.isArray(saved) ? saved : []);

    // Por defecto: todo seleccionado
    const initial = {};
    (Array.isArray(saved) ? saved : []).forEach((p) => (initial[p.id] = true));
    setSelected(initial);
  }, []);

  const persistCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("cart", JSON.stringify(nextCart));
  };

  const toggleOne = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allSelected = useMemo(() => {
    if (cart.length === 0) return false;
    return cart.every((p) => selected[p.id]);
  }, [cart, selected]);

  const toggleAll = () => {
    const next = {};
    cart.forEach((p) => (next[p.id] = !allSelected));
    setSelected(next);
  };

  const updateQty = (id, delta) => {
    const next = cart.map((p) => {
      if (p.id !== id) return p;
      const qty = Math.max(1, (Number(p.quantity) || 1) + delta);
      return { ...p, quantity: qty };
    });
    persistCart(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((p) => p.id !== id);
    persistCart(next);

    // también quita selección
    setSelected((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const selectedItems = useMemo(() => cart.filter((p) => selected[p.id]), [cart, selected]);

  const totalSelected = useMemo(() => {
    return selectedItems.reduce((acc, p) => {
      const price = Number(p.price) || 0;
      const qty = Number(p.quantity) || 1;
      return acc + price * qty;
    }, 0);
  }, [selectedItems]);

  const proceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Selecciona al menos un producto para continuar.");
      return;
    }

    // ✅ Para NO perder tu carrito completo, guardamos la selección en otra key
    localStorage.setItem("checkout_cart", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🛒 Carrito</h1>
        <div style={styles.card}>
          <p>Tu carrito está vacío.</p>
          <button style={styles.darkBtn} onClick={() => navigate("/")}>
            Ir a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 Carrito</h1>

      <div style={styles.topActions}>
        <button style={styles.smallBtn} onClick={toggleAll}>
          {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
        </button>

        <button style={styles.smallBtn} onClick={() => navigate("/")}>
          Seguir comprando
        </button>
      </div>

      <div style={styles.layout}>
        {/* LISTA */}
        <div>
          {cart.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.itemRow}>
                <input
                  type="checkbox"
                  style={styles.check}
                  checked={!!selected[item.id]}
                  onChange={() => toggleOne(item.id)}
                />

                <div style={styles.imgWrap} onClick={() => navigate(`/product/${item.id}`)}>
                  <img
                    src={item.image || "https://via.placeholder.com/150?text=Sin+Foto"}
                    alt={item.name}
                    style={styles.img}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={styles.name} onClick={() => navigate(`/product/${item.id}`)}>
                    {item.name}
                  </div>
                  <div style={styles.meta}>${item.price} · {item.category}</div>

                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>-</button>
                    <div style={styles.qtyVal}>{item.quantity || 1}</div>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>

                    <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>

                <div style={styles.price}>
                  ${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RESUMEN */}
        <div style={styles.summary}>
          <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Resumen</h3>

          <div style={styles.summaryRow}>
            <span>Productos seleccionados</span>
            <b>{selectedItems.length}</b>
          </div>

          <div style={styles.summaryRow}>
            <span>Total</span>
            <span style={styles.total}>${totalSelected.toFixed(2)}</span>
          </div>

          <button style={styles.primaryBtn} onClick={proceedToCheckout}>
            Proceder a checkout
          </button>

          <button style={styles.darkBtn} onClick={() => navigate("/")}>
            Seguir comprando
          </button>

          {/* Nota: aquí YA NO va dirección ni método de pago */}
        </div>
      </div>
    </div>
  );
};

export default Cart;
