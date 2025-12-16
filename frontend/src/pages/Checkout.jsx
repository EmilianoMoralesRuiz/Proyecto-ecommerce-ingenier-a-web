import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); 
  const [cart, setCart] = useState([]);

  // Dirección
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  // Pago
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(Array.isArray(savedCart) ? savedCart : []);

   
    const savedAddress = JSON.parse(localStorage.getItem("checkout_address") || "null");
    if (savedAddress) setAddress(savedAddress);
  }, [navigate]);

  const { subtotal, totalItems } = useMemo(() => {
    const subtotalCalc = cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);

    const items = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    return { subtotal: subtotalCalc, totalItems: items };
  }, [cart]);

  const styles = {
    container: { padding: "30px", maxWidth: "950px", margin: "0 auto" },
    title: { marginBottom: "10px", color: "#333" },
    subtitle: { color: "#666", marginBottom: "18px" },
    card: {
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "18px",
      marginBottom: "16px",
    },
    row: { display: "flex", gap: "14px", alignItems: "center" },
    imgWrap: {
      width: "110px",
      height: "110px",
      borderRadius: "10px",
      background: "#fff",
      border: "1px solid #eee",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      padding: "8px",
      flexShrink: 0,
    },
    img: { width: "100%", height: "100%", objectFit: "contain" },
    name: { fontSize: "1.05rem", fontWeight: "bold", color: "#333", marginBottom: "4px" },
    meta: { color: "#666", fontSize: "0.95rem" },
    total: { fontSize: "1.15rem", fontWeight: "bold", color: "#28a745" },

    stepper: { display: "flex", gap: "10px", marginBottom: "18px" },
    stepPill: (active) => ({
      padding: "8px 12px",
      borderRadius: "999px",
      border: "1px solid #ddd",
      background: active ? "#333" : "#f7f7f7",
      color: active ? "#fff" : "#333",
      fontWeight: "bold",
      fontSize: "0.9rem",
    }),

    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      outline: "none",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      outline: "none",
      minHeight: "90px",
      resize: "vertical",
    },

    btnRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
    btn: {
      padding: "12px 16px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
    btnPrimary: { backgroundColor: "#007bff", color: "white" },
    btnDark: { backgroundColor: "#333", color: "white" },
    btnLight: { backgroundColor: "#f1f1f1", color: "#333" },
    btnDanger: { backgroundColor: "#dc3545", color: "white" },

    radioRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px",
      border: "1px solid #eee",
      borderRadius: "10px",
      marginBottom: "10px",
    },
    small: { fontSize: "0.85rem", color: "#777" },
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const required = ["fullName", "phone", "street", "city", "state", "zip"];
    for (const k of required) {
      if (!String(address[k] || "").trim()) return false;
    }
    return true;
  };

  const goToPayment = async () => {
    if (!validateAddress()) {
      alert("Por favor completa la dirección (nombre, teléfono, calle, ciudad, estado y CP).");
      return;
    }

  
    localStorage.setItem("checkout_address", JSON.stringify(address));

    setStep(2);
    await fetchCards();
  };

  const fetchCards = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCards([]);
      return;
    }

    setLoadingCards(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedCardId(String(data[0].id));
        }
      } else {
        setCards([]);
      }
    } catch (e) {
      setCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

const finalizePurchase = async () => {
  // Validaciones básicas
  if (!validateAddress()) {
    alert("Dirección incompleta.");
    setStep(1);
    return;
  }

  if (!selectedCardId) {
    alert("Selecciona una tarjeta para pagar o agrega una en la billetera.");
    return;
  }

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    alert("Tu sesión expiró. Inicia sesión de nuevo.");
    return navigate("/login");
  }

  if (!cart || cart.length === 0) {
    alert("Carrito vacío.");
    return navigate("/");
  }

 
  const items = cart.map((p) => ({
    id: p.id,
    quantity: Number(p.quantity) || 1,
    price: Number(p.price) || 0,
  }));

  const total_amount = items.reduce(
    (acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );

  const shipping_address =
    `${address.fullName}, ${address.phone}, ${address.street}, ` +
    `${address.city}, ${address.state}, CP ${address.zip}` +
    (address.notes ? `, Notas: ${address.notes}` : "");

  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        total_amount,
        shipping_address,
        userId: user.id,
        items,
        status: "pending",
        
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return alert("Error al crear la orden: " + (data.message || "desconocido"));
    }

    
    localStorage.removeItem("cart");
    localStorage.removeItem("checkout_address");
    alert("✅ Orden creada exitosamente");
    navigate("/orders");
  } catch (error) {
    alert("Error de conexión al crear la orden");
  }
};

  if (!cart || cart.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>
        <div style={styles.card}>
          <p>No hay productos para comprar.</p>
          <button style={{ ...styles.btn, ...styles.btnDark }} onClick={() => navigate("/")}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧾 Checkout</h1>
      <div style={styles.subtitle}>
        Artículos: <b>{totalItems}</b> · Total: <b style={{ color: "#28a745" }}>${subtotal.toFixed(2)}</b>
      </div>

      <div style={styles.stepper}>
        <div style={styles.stepPill(step === 1)}>1) Dirección</div>
        <div style={styles.stepPill(step === 2)}>2) Pago</div>
      </div>

      {/* Resumen de productos */}
      <div style={styles.card}>
        {cart.map((item) => (
          <div key={item.id} style={{ ...styles.row, marginBottom: "12px" }}>
            <div style={styles.imgWrap}>
              <img src={item.image} alt={item.name} style={styles.img} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.name}>{item.name}</div>
              <div style={styles.meta}>
                Cantidad: {item.quantity} · Precio: ${item.price}
              </div>
              <div style={styles.meta}>
                Total producto:{" "}
                <b>${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</b>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* STEP 1: Dirección */}
      {step === 1 && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>📦 Dirección de envío</h2>

          <div style={styles.formGrid}>
            <div>
              <div style={styles.small}>Nombre completo</div>
              <input
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                style={styles.input}
                placeholder="Ej. Hector Mendoza"
              />
            </div>
            <div>
              <div style={styles.small}>Teléfono</div>
              <input
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                style={styles.input}
                placeholder="Ej. 55 1234 5678"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={styles.small}>Calle y número</div>
              <input
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                style={styles.input}
                placeholder="Ej. Av. Siempre Viva 123"
              />
            </div>

            <div>
              <div style={styles.small}>Ciudad</div>
              <input
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                style={styles.input}
                placeholder="Ej. Guadalajara"
              />
            </div>
            <div>
              <div style={styles.small}>Estado</div>
              <input
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                style={styles.input}
                placeholder="Ej. Jalisco"
              />
            </div>

            <div>
              <div style={styles.small}>Código Postal</div>
              <input
                name="zip"
                value={address.zip}
                onChange={handleAddressChange}
                style={styles.input}
                placeholder="Ej. 44100"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={styles.small}>Notas (opcional)</div>
              <textarea
                name="notes"
                value={address.notes}
                onChange={handleAddressChange}
                style={styles.textarea}
                placeholder="Ej. Entregar con el guardia, depto 302..."
              />
            </div>
          </div>

          <div style={{ ...styles.btnRow, marginTop: "14px" }}>
            <button style={{ ...styles.btn, ...styles.btnLight }} onClick={() => navigate("/")}>
              Seguir comprando
            </button>
            <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={goToPayment}>
              Continuar a pago
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Pago */}
      {step === 2 && (
        <div style={styles.card}>
          <h2 style={{ marginTop: 0 }}>💳 Pago</h2>

          <div style={{ marginBottom: "10px", color: "#555" }}>
            Selecciona una tarjeta guardada o agrega una nueva en tu billetera.
          </div>

          {loadingCards ? (
            <div>Cargando tarjetas...</div>
          ) : cards.length === 0 ? (
            <div style={{ marginBottom: "12px" }}>
              <b>No tienes tarjetas guardadas.</b>
              <div style={styles.small}>Usa “Ir a billetera” para agregar una.</div>
            </div>
          ) : (
            <div style={{ marginBottom: "12px" }}>
              {cards.map((c) => (
                <label key={c.id} style={styles.radioRow}>
                  <input
                    type="radio"
                    name="card"
                    checked={String(selectedCardId) === String(c.id)}
                    onChange={() => setSelectedCardId(String(c.id))}
                  />
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      **** **** **** {String(c.card_number || "").slice(-4)}
                    </div>
                    <div style={styles.small}>
                      Titular: {c.card_holder} · Vence: {c.expiration_date}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div style={styles.btnRow}>
            <button style={{ ...styles.btn, ...styles.btnLight }} onClick={() => setStep(1)}>
              Volver a dirección
            </button>

            <button style={{ ...styles.btn, ...styles.btnDark }} onClick={() => navigate("/wallet")}>
              Ir a billetera
            </button>

            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={finalizePurchase}
            >
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;

