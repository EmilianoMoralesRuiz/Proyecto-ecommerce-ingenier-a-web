import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);

  const [step, setStep] = useState(1);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null); // null = creando nueva
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  // tarjetas
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [loadingCards, setLoadingCards] = useState(true);

  const styles = {
    container: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
    title: { marginBottom: "20px", color: "#333", textAlign: "center" },

    layout: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" },

    panel: {
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "16px",
    },

    sectionTitle: { marginTop: 0, marginBottom: "12px", color: "#333" },

    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    inputGroup: { marginBottom: "12px" },
    label: { display: "block", marginBottom: "6px", color: "#555", fontWeight: "bold" },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      outline: "none",
      fontSize: "15px",
    },

    // resumen
    item: { display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" },
    imgWrap: {
      width: "58px",
      height: "58px",
      borderRadius: "10px",
      border: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      padding: "6px",
      flexShrink: 0,
    },
    img: { width: "100%", height: "100%", objectFit: "contain" },
    itemName: { fontWeight: "bold", color: "#333", fontSize: "0.95rem" },
    itemMeta: { color: "#666", fontSize: "0.85rem" },
    itemPrice: { marginLeft: "auto", fontWeight: "bold", color: "#28a745" },

    summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#444" },
    total: { fontSize: "1.15rem", fontWeight: "bold", color: "#28a745" },

    btnRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" },
    btn: {
      padding: "12px 14px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.95rem",
    },
    btnPrimary: { background: "#007bff", color: "white" },
    btnDark: { background: "#333", color: "white" },
    btnLight: { background: "#f3f3f3", color: "#333", border: "1px solid #ddd" },

    // tarjetas
    cardList: { display: "grid", gap: "10px" },
    cardBox: (active) => ({
      border: active ? "2px solid #007bff" : "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: "12px",
      cursor: "pointer",
      background: active ? "rgba(0,123,255,0.06)" : "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
    }),
    badge: {
      padding: "4px 10px",
      borderRadius: "999px",
      background: "#007bff",
      color: "white",
      fontSize: "0.75rem",
      fontWeight: "bold",
      whiteSpace: "nowrap",
      height: "fit-content",
    },

    // direcciones
    addrList: { display: "grid", gap: "10px", marginBottom: "12px" },
    addrBox: (active) => ({
      border: active ? "2px solid #007bff" : "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: "12px",
      cursor: "pointer",
      background: active ? "rgba(0,123,255,0.06)" : "white",
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
    }),
    miniActions: { display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px" },
    tinyBtn: {
      padding: "8px 10px",
      borderRadius: "10px",
      border: "1px solid #ddd",
      background: "#f3f3f3",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.85rem",
    },
    tinyDanger: {
      padding: "8px 10px",
      borderRadius: "10px",
      border: "1px solid #f0b8bf",
      background: "#fff2f4",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.85rem",
      color: "#c82333",
    },
  };

  const getUser = () => JSON.parse(localStorage.getItem("user") || "null");
  const getUserId = () => {
    const u = getUser();
    return u?.id ? String(u.id) : null;
  };

  const addrKey = () => {
    const uid = getUserId();
    return uid ? `address_book_${uid}` : "address_book_guest";
  };

  const defaultAddrKey = () => {
    const uid = getUserId();
    return uid ? `default_address_${uid}` : "default_address_guest";
  };

  const saveAddressBook = (nextBook) => {
    setAddresses(nextBook);
    localStorage.setItem(addrKey(), JSON.stringify(nextBook));
  };

  const loadAddressBook = () => {
    const book = JSON.parse(localStorage.getItem(addrKey()) || "[]");
    const defId = localStorage.getItem(defaultAddrKey());

    const safeBook = Array.isArray(book) ? book : [];
    const def = defId ? String(defId) : null;

    setAddresses(safeBook);
    setDefaultAddressId(def);

    if (def && safeBook.some((a) => String(a.id) === def)) {
      setSelectedAddressId(def);
      setShowAddressForm(false);
      setEditingAddressId(null);
    } else if (safeBook.length > 0) {
      setSelectedAddressId(String(safeBook[0].id));
      setShowAddressForm(false);
      setEditingAddressId(null);
    } else {
      setSelectedAddressId(null);
      setShowAddressForm(true);
      setEditingAddressId(null);
    }
  };

  const getSelectedAddress = () => {
    const found = addresses.find((a) => String(a.id) === String(selectedAddressId));
    return found || null;
  };

  const formatShippingAddress = (addr) => {
    if (!addr) return "";
    return (
      `${addr.fullName} | ${addr.phone}\n` +
      `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}\n` +
      `${addr.notes || ""}`
    );
  };

  useEffect(() => {
    const stateItems = location.state?.items;
    if (Array.isArray(stateItems) && stateItems.length > 0) {
      setCart(stateItems);
    } else {
      const savedCart =
        JSON.parse(localStorage.getItem("checkout_cart")) ||
        JSON.parse(localStorage.getItem("cart")) ||
        [];
      setCart(Array.isArray(savedCart) ? savedCart : []);
    }

    loadAddressBook();

    const last = JSON.parse(localStorage.getItem("checkout_address") || "null");
    if (last && typeof last === "object") {
      setAddress((prev) => ({ ...prev, ...last }));
    }

  }, [location.state]);

  // ===== Cargar tarjetas =====
  useEffect(() => {
    const fetchCards = async () => {
      setLoadingCards(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCards([]);
        setLoadingCards(false);
        return;
      }

      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const safe = Array.isArray(data) ? data : [];
          setCards(safe);
          if (safe.length > 0) setSelectedCardId(safe[0].id);
        } else {
          setCards([]);
        }
      } catch {
        setCards([]);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchCards();
  }, []);

  // ===== Cálculos / Validaciones =====
  const subtotal = useMemo(() => {
    return cart.reduce((acc, p) => {
      const price = Number(p.price) || 0;
      const qty = Number(p.quantity) || 1;
      return acc + price * qty;
    }, 0);
  }, [cart]);

  const formAddressIsValid = useMemo(() => {
    return (
      address.fullName.trim() &&
      address.phone.trim() &&
      address.street.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.zip.trim()
    );
  }, [address]);

  const paymentIsValid = useMemo(() => !!selectedCardId, [selectedCardId]);

  // ===== Acciones de direcciones =====
  const startAddAddress = () => {
    setEditingAddressId(null);
    setSaveAsDefault(true);
    setAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
    });
    setShowAddressForm(true);
  };

  const startEditAddress = (id) => {
    const found = addresses.find((a) => String(a.id) === String(id));
    if (!found) return;
    setEditingAddressId(String(found.id));
    setSaveAsDefault(defaultAddressId === String(found.id));
    setAddress({
      fullName: found.fullName || "",
      phone: found.phone || "",
      street: found.street || "",
      city: found.city || "",
      state: found.state || "",
      zip: found.zip || "",
      notes: found.notes || "",
    });
    setShowAddressForm(true);
  };

  const cancelAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const setAsDefault = (id) => {
    const uid = getUserId();
    if (!uid) {
      alert("Debes iniciar sesión para guardar una dirección predeterminada.");
      return;
    }
    localStorage.setItem(defaultAddrKey(), String(id));
    setDefaultAddressId(String(id));
  };

  const deleteAddress = (id) => {
    const uid = getUserId();
    if (!uid) {
      alert("Debes iniciar sesión para administrar direcciones.");
      return;
    }

    const found = addresses.find((a) => String(a.id) === String(id));
    if (!found) return;

    const ok = window.confirm(
      `¿Seguro que quieres eliminar esta dirección?\n\n${found.street}, ${found.city}`
    );
    if (!ok) return;

    const next = addresses.filter((a) => String(a.id) !== String(id));
    saveAddressBook(next);

    // Si era la predeterminada, reasigna
    if (defaultAddressId && String(defaultAddressId) === String(id)) {
      if (next.length > 0) {
        localStorage.setItem(defaultAddrKey(), String(next[0].id));
        setDefaultAddressId(String(next[0].id));
      } else {
        localStorage.removeItem(defaultAddrKey());
        setDefaultAddressId(null);
      }
    }

    // Si era la seleccionada, selecciona otra o abre form
    if (selectedAddressId && String(selectedAddressId) === String(id)) {
      if (next.length > 0) {
        setSelectedAddressId(String(next[0].id));
      } else {
        setSelectedAddressId(null);
        startAddAddress();
      }
    }

    // Si estaba editando esa, cierra form
    if (editingAddressId && String(editingAddressId) === String(id)) {
      cancelAddressForm();
    }
  };

  const saveAddressFromForm = () => {
    const uid = getUserId();
    if (!uid) {
      alert("Debes iniciar sesión para guardar direcciones.");
      return null;
    }

    if (!formAddressIsValid) {
      alert("Completa los campos obligatorios de dirección.");
      return null;
    }

    // Editar
    if (editingAddressId) {
      const next = addresses.map((a) =>
        String(a.id) === String(editingAddressId)
          ? { ...a, ...address, id: a.id }
          : a
      );
      saveAddressBook(next);

      if (saveAsDefault) setAsDefault(editingAddressId);


      setSelectedAddressId(String(editingAddressId));
      setShowAddressForm(false);
      setEditingAddressId(null);

      return next.find((a) => String(a.id) === String(editingAddressId)) || null;
    }

    // Crear nueva
    const newAddr = { id: Date.now(), ...address };
    const next = [...addresses, newAddr];
    saveAddressBook(next);

    if (saveAsDefault) setAsDefault(newAddr.id);

    setSelectedAddressId(String(newAddr.id));
    setShowAddressForm(false);
    setEditingAddressId(null);

    return newAddr;
  };

  const continueFromAddressStep = () => {
    // Si está usando lista
    if (!showAddressForm) {
      const sel = getSelectedAddress();
      if (!sel) {
        alert("Selecciona una dirección o agrega una nueva.");
        return;
      }
      localStorage.setItem("checkout_address", JSON.stringify(sel));
      setStep(2);
      return;
    }

    const saved = saveAddressFromForm();
    if (!saved) return;

    localStorage.setItem("checkout_address", JSON.stringify(saved));
    setStep(2);
  };

  const finalizePurchase = async () => {
    const token = localStorage.getItem("token");
    const user = getUser();
    if (!token || !user) return alert("Debes iniciar sesión para comprar.");

    if (!cart || cart.length === 0) return alert("No hay productos para comprar.");
    if (!paymentIsValid) return alert("Selecciona una tarjeta para pagar.");

    const addrToUse = showAddressForm
      ? address
      : (getSelectedAddress() || null);

    if (!addrToUse) return alert("Selecciona o agrega una dirección.");
    if (showAddressForm && !formAddressIsValid) return alert("Completa la dirección antes de finalizar.");

    const items = cart.map((p) => ({
      id: p.id,
      quantity: Number(p.quantity) || 1,
      price: Number(p.price) || 0,
    }));

    const shipping_address = formatShippingAddress(addrToUse);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + "/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          total_amount: subtotal,
          shipping_address,
          userId: user.id,
          items,
          status: "pending",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Error al crear la orden.");
        return;
      }

      localStorage.removeItem("checkout_cart");
      localStorage.removeItem("checkout_address");

      const fullCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const purchasedIds = new Set(items.map((i) => i.id));
      const remaining = Array.isArray(fullCart)
        ? fullCart.filter((p) => !purchasedIds.has(p.id))
        : [];
      localStorage.setItem("cart", JSON.stringify(remaining));

      alert("✅ Orden creada exitosamente");
      navigate("/orders");
    } catch {
      alert("Error de conexión");
    }
  };


  if (!cart || cart.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Checkout</h1>
        <div style={styles.panel}>
          <p>No hay productos para comprar.</p>
          <div style={styles.btnRow}>
            <button style={{ ...styles.btn, ...styles.btnDark }} onClick={() => navigate("/")}>
              Ir a inicio
            </button>
            <button style={{ ...styles.btn, ...styles.btnLight }} onClick={() => navigate("/cart")}>
              Volver al carrito
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✅ Checkout</h1>

      <div style={styles.layout}>
        {/* IZQUIERDA */}
        <div style={styles.panel}>

          {step === 1 && (
            <>
              <h2 style={styles.sectionTitle}>1) Dirección de envío</h2>

              {/* LISTA de direcciones guardadas */}
              {addresses.length > 0 && !showAddressForm && (
                <>
                  <div style={styles.addrList}>
                    {addresses.map((a) => {
                      const active = String(selectedAddressId) === String(a.id);
                      const isDefault = defaultAddressId && String(defaultAddressId) === String(a.id);

                      return (
                        <div
                          key={a.id}
                          style={styles.addrBox(active)}
                          onClick={() => setSelectedAddressId(String(a.id))}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold", color: "#333" }}>{a.fullName}</div>
                            <div style={{ color: "#666", marginTop: "4px" }}>
                              {a.street}, {a.city}, {a.state} {a.zip}
                            </div>
                            <div style={{ color: "#666", marginTop: "4px" }}>Tel: {a.phone}</div>

                            <div style={styles.miniActions}>
                              {!isDefault ? (
                                <button
                                  type="button"
                                  style={styles.tinyBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAsDefault(a.id);
                                  }}
                                >
                                  Hacer predeterminada
                                </button>
                              ) : (
                                <span style={styles.badge}>Predeterminada</span>
                              )}

                              <button
                                type="button"
                                style={styles.tinyBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditAddress(a.id);
                                }}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                style={styles.tinyDanger}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAddress(a.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>

                          {active && <div style={styles.badge}>Seleccionada</div>}
                        </div>
                      );
                    })}
                  </div>

                  <div style={styles.btnRow}>
                    <button
                      style={{ ...styles.btn, ...styles.btnLight }}
                      onClick={startAddAddress}
                    >
                      Agregar nueva dirección
                    </button>

                    <button
                      style={{ ...styles.btn, ...styles.btnPrimary }}
                      onClick={continueFromAddressStep}
                    >
                      Continuar a pago
                    </button>
                  </div>
                </>
              )}

              {/* FORMULARIO nueva/editar */}
              {(addresses.length === 0 || showAddressForm) && (
                <>
                  <div style={{ marginBottom: "8px", color: "#555", fontWeight: "bold" }}>
                    {editingAddressId ? "Editar dirección" : "Nueva dirección"}
                  </div>

                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nombre completo *</label>
                      <input
                        style={styles.input}
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Teléfono *</label>
                      <input
                        style={styles.input}
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Calle y número *</label>
                    <input
                      style={styles.input}
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                  </div>

                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Ciudad *</label>
                      <input
                        style={styles.input}
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Estado *</label>
                      <input
                        style={styles.input}
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Código postal *</label>
                      <input
                        style={styles.input}
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Notas (opcional)</label>
                      <input
                        style={styles.input}
                        value={address.notes}
                        onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "6px" }}>
                    <input
                      type="checkbox"
                      checked={saveAsDefault}
                      onChange={(e) => setSaveAsDefault(e.target.checked)}
                    />
                    <span style={{ color: "#555" }}>
                      Guardar como predeterminada
                    </span>
                  </div>

                  <div style={styles.btnRow}>
                    {addresses.length > 0 && (
                      <button
                        style={{ ...styles.btn, ...styles.btnLight }}
                        onClick={cancelAddressForm}
                      >
                        Usar una guardada
                      </button>
                    )}

                    <button
                      style={{ ...styles.btn, ...styles.btnPrimary, opacity: formAddressIsValid ? 1 : 0.7 }}
                      onClick={continueFromAddressStep}
                    >
                      {editingAddressId ? "Guardar cambios y continuar" : "Guardar y continuar"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={styles.sectionTitle}>2) Pago</h2>

              {loadingCards ? (
                <p>Cargando tarjetas...</p>
              ) : cards.length === 0 ? (
                <>
                  <p style={{ color: "#555" }}>
                    No tienes tarjetas guardadas. Agrega una en tu billetera.
                  </p>

                  <div style={styles.btnRow}>
                    <button
                      style={{ ...styles.btn, ...styles.btnDark }}
                      onClick={() => navigate("/wallet")}
                    >
                      Ir a billetera
                    </button>

                    <button
                      style={{ ...styles.btn, ...styles.btnLight }}
                      onClick={() => setStep(1)}
                    >
                      Volver a dirección
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.cardList}>
                    {cards.map((c) => (
                      <div
                        key={c.id}
                        style={styles.cardBox(selectedCardId === c.id)}
                        onClick={() => setSelectedCardId(c.id)}
                      >
                        <div>
                          <div style={{ fontWeight: "bold", color: "#333" }}>{c.card_holder}</div>
                          <div style={{ color: "#666", marginTop: "4px" }}>
                            **** **** **** {String(c.card_number).slice(-4)} · Vence {c.expiration_date}
                          </div>
                        </div>
                        {selectedCardId === c.id && <div style={styles.badge}>Seleccionada</div>}
                      </div>
                    ))}
                  </div>

                  <div style={styles.btnRow}>
                    <button
                      style={{ ...styles.btn, ...styles.btnLight }}
                      onClick={() => setStep(1)}
                    >
                      Volver a dirección
                    </button>

<button
  style={{ ...styles.btn, ...styles.btnDark }}
  onClick={() => navigate("/wallet?from=checkout")}
>
  Agregar / Administrar tarjetas
</button>


                    <button
                      style={{
                        ...styles.btn,
                        ...styles.btnPrimary,
                        opacity: paymentIsValid ? 1 : 0.7,
                      }}
                      onClick={finalizePurchase}
                    >
                      Finalizar compra
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* DERECHA: RESUMEN */}
        <div style={styles.panel}>
          <h3 style={styles.sectionTitle}>Resumen</h3>

          <div style={{ marginBottom: "12px" }}>
            {cart.map((p) => (
              <div key={p.id} style={styles.item}>
                <div style={styles.imgWrap}>
                  <img
                    src={p.image || "https://via.placeholder.com/150?text=Sin+Foto"}
                    alt={p.name}
                    style={styles.img}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={styles.itemName}>{p.name}</div>
                  <div style={styles.itemMeta}>
                    ${p.price} · Cantidad: {p.quantity || 1}
                  </div>
                </div>

                <div style={styles.itemPrice}>
                  ${((Number(p.price) || 0) * (Number(p.quantity) || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <b>${subtotal.toFixed(2)}</b>
          </div>

          <div style={styles.summaryRow}>
            <span>Total</span>
            <span style={styles.total}>${subtotal.toFixed(2)}</span>
          </div>

         <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
  <button
    style={{ ...styles.btn, ...styles.btnLight }}
    onClick={() => navigate("/cart")}
  >
    Volver al carrito
  </button>

  <button
    style={{ ...styles.btn, ...styles.btnLight }}
    onClick={() => navigate("/")}
  >
    Volver a inicio
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;


