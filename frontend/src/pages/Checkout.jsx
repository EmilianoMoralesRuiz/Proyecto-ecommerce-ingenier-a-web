import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1); 
  const [cart, setCart] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [saveAsDefault, setSaveAsDefault] = useState(true);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

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

  const startAddAddress = () => {
    setAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      notes: "",
    });
    setSaveAsDefault(true);
    setShowAddressForm(true);
    setEditingAddressId(null);
  };

  const editAddress = (id) => {
    const found = addresses.find((a) => String(a.id) === String(id));
    if (!found) return;
    setEditingAddressId(String(id));
    setSaveAsDefault(false);
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

    if (defaultAddressId && String(defaultAddressId) === String(id)) {
      if (next.length > 0) {
        localStorage.setItem(defaultAddrKey(), String(next[0].id));
        setDefaultAddressId(String(next[0].id));
      } else {
        localStorage.removeItem(defaultAddrKey());
        setDefaultAddressId(null);
      }
    }

    if (selectedAddressId && String(selectedAddressId) === String(id)) {
      if (next.length > 0) {
        setSelectedAddressId(String(next[0].id));
      } else {
        setSelectedAddressId(null);
        startAddAddress();
      }
    }

    if (editingAddressId && String(editingAddressId) === String(id)) {
      cancelAddressForm();
    }
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const formAddressIsValid = useMemo(() => {
    const required = ["fullName", "phone", "street", "city", "state", "zip"];
    return required.every((k) => String(address[k] || "").trim());
  }, [address]);

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
        String(a.id) === String(editingAddressId) ? { ...a, ...address, id: a.id } : a
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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return navigate("/login");

    const savedStep = Number(sessionStorage.getItem("checkout_step") || "1");
    if (savedStep === 2) setStep(2);

    const stateBuyNow = location.state?.buyNowItem;
    const storedBuyNow = JSON.parse(sessionStorage.getItem("buy_now_item") || "null");
    const buyNowItem = stateBuyNow || storedBuyNow;

    if (buyNowItem && typeof buyNowItem === "object") {
      setIsBuyNow(true);

      const normalized = {
        ...buyNowItem,
        quantity: Number(buyNowItem.quantity) || 1,
        image:
          buyNowItem.image ||
          buyNowItem.ProductImages?.[0]?.imageUrl ||
          "https://via.placeholder.com/150?text=Sin+Foto",
      };

      setCart([normalized]);

      sessionStorage.setItem("buy_now_item", JSON.stringify(normalized));
    } else {
      setIsBuyNow(false);
      sessionStorage.removeItem("buy_now_item");

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
    }

    loadAddressBook();

    const last = JSON.parse(localStorage.getItem("checkout_address") || "null");
    if (last && typeof last === "object") {
      setAddress((prev) => ({ ...prev, ...last }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]);

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
          if (safe.length > 0) setSelectedCardId(String(safe[0].id));
        } else {
          setCards([]);
        }
      } catch {
        setCards([]);
      } finally {
        setLoadingCards(false);
      }
    };

    if (step === 2) fetchCards();
  }, [step]);

  const { subtotal } = useMemo(() => {
    const subtotalCalc = cart.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);
    return { subtotal: subtotalCalc };
  }, [cart]);

  const styles = {
    container: { padding: "30px", maxWidth: "1100px", margin: "0 auto" },
    title: { marginBottom: "10px", color: "#333" },

    layout: { display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "16px" },
    panel: {
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "18px",
    },
    sectionTitle: { margin: 0, marginBottom: "8px", color: "#333" },
    subtitle: { color: "#666", marginBottom: "14px", fontSize: "0.95rem" },

    addrList: { display: "grid", gap: "10px", marginBottom: "12px" },
    addrBox: (active) => ({
      border: active ? "2px solid #007bff" : "1px solid #eee",
      borderRadius: "10px",
      padding: "12px",
      cursor: "pointer",
      display: "flex",
      gap: "10px",
      alignItems: "flex-start",
      justifyContent: "space-between",
      background: active ? "#f3f8ff" : "white",
    }),
    miniActions: { display: "flex", gap: "10px", marginTop: "8px", flexWrap: "wrap" },
    miniBtn: {
      border: "1px solid #ddd",
      background: "#f7f7f7",
      padding: "6px 10px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.85rem",
    },
    miniBtnDanger: {
      border: "1px solid #dc3545",
      background: "#fff5f5",
      color: "#dc3545",
      padding: "6px 10px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "0.85rem",
    },

    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    input: {
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "16px",
      background: "#fafafa",
      outline: "none",
    },
    textarea: {
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "16px",
      background: "#fafafa",
      outline: "none",
      resize: "vertical",
      minHeight: "80px",
    },

    btnRow: { display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" },
    btn: { padding: "12px 14px", borderRadius: "10px", border: "none", fontWeight: "bold", cursor: "pointer" },
    btnPrimary: { backgroundColor: "#007bff", color: "white" },
    btnDark: { backgroundColor: "#333", color: "white" },
    btnLight: { backgroundColor: "#f3f3f3", border: "1px solid #ddd", color: "#333" },

    radioRow: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px",
      border: "1px solid #eee",
      borderRadius: "10px",
      marginBottom: "10px",
    },
    badge: {
      background: "#e8f5e9",
      color: "#2e7d32",
      border: "1px solid #c8e6c9",
      padding: "4px 8px",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: "bold",
    },
    small: { fontSize: "0.85rem", color: "#777" },

    backLinkBtn: {
      background: "none",
      border: "none",
      color: "#007bff",
      cursor: "pointer",
      fontWeight: "bold",
      padding: 0,
      marginBottom: 10,
    },

    // resumen
    item: {
      display: "flex",
      gap: "12px",
      padding: "12px 0",
      borderBottom: "1px solid #f0f0f0",
      alignItems: "center",
    },
    imgWrap: {
      width: "80px",
      height: "80px",
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
    itemName: { fontWeight: "bold", color: "#333" },
    itemMeta: { color: "#666", marginTop: "3px", fontSize: "0.9rem" },
    itemPrice: { fontWeight: "bold", color: "#333" },
    summaryRow: { display: "flex", justifyContent: "space-between", marginTop: "10px" },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #eee",
      fontSize: "1.05rem",
    },
  };

  const paymentIsValid = Boolean(selectedCardId);

  const continueFromAddressStep = () => {
    if (!showAddressForm) {
      const sel = getSelectedAddress();
      if (!sel) {
        alert("Selecciona una dirección o agrega una nueva.");
        return;
      }
      localStorage.setItem("checkout_address", JSON.stringify(sel));
      setStep(2);
      sessionStorage.setItem("checkout_step", "2");
      return;
    }

    const saved = saveAddressFromForm();
    if (!saved) return;

    localStorage.setItem("checkout_address", JSON.stringify(saved));
    setStep(2);
    sessionStorage.setItem("checkout_step", "2");
  };

  const finalizePurchase = async () => {
    const token = localStorage.getItem("token");
    const user = getUser();
    if (!token || !user) return alert("Debes iniciar sesión para comprar.");

    if (!cart || cart.length === 0) return alert("No hay productos para comprar.");
    if (!paymentIsValid) return alert("Selecciona una tarjeta para pagar.");

    const addrToUse = showAddressForm ? address : getSelectedAddress() || null;

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

      sessionStorage.removeItem("checkout_step");
      sessionStorage.removeItem("buy_now_item");

      if (!isBuyNow) {
        const fullCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const purchasedIds = new Set(items.map((i) => i.id));
        const remaining = Array.isArray(fullCart) ? fullCart.filter((p) => !purchasedIds.has(p.id)) : [];
        localStorage.setItem("cart", JSON.stringify(remaining));
      }

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
              Volver a inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      <div style={styles.layout}>
        {/* IZQUIERDA */}
        <div style={styles.panel}>
          {step === 1 ? (
            <>
              {/* ✅ NUEVO: VOLVER A CARRITO EN DIRECCIÓN (SOLO SI VIENES DEL CARRITO) */}
              {!isBuyNow && (
                <button type="button" style={styles.backLinkBtn} onClick={() => navigate("/cart")}>
                  ← Volver a carrito
                </button>
              )}

              <h3 style={styles.sectionTitle}>1) Dirección</h3>
              <div style={styles.subtitle}>
                Guarda una dirección y márcala como predeterminada para no escribirla cada vez.
              </div>

              {!showAddressForm && addresses.length > 0 ? (
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
                            <div style={{ fontWeight: "bold", color: "#333" }}>
                              {a.fullName}{" "}
                              {isDefault && <span style={{ marginLeft: 8, ...styles.badge }}>Predeterminada</span>}
                            </div>
                            <div style={{ color: "#666", marginTop: "4px" }}>
                              {a.street}, {a.city}, {a.state} {a.zip}
                            </div>
                            <div style={{ color: "#666", marginTop: "4px" }}>Tel: {a.phone}</div>
                            {a.notes ? <div style={{ color: "#777", marginTop: "4px" }}>{a.notes}</div> : null}

                            <div style={styles.miniActions}>
                              {!isDefault && (
                                <button
                                  type="button"
                                  style={styles.miniBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAsDefault(a.id);
                                  }}
                                >
                                  Hacer predeterminada
                                </button>
                              )}

                              <button
                                type="button"
                                style={styles.miniBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editAddress(a.id);
                                }}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                style={styles.miniBtnDanger}
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
                      onClick={() => {
                        startAddAddress();
                      }}
                    >
                      + Agregar otra dirección
                    </button>

                    <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={continueFromAddressStep}>
                      Continuar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label>Nombre completo</label>
                      <input
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        style={styles.input}
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label>Teléfono</label>
                      <input
  name="phone"
  value={address.phone}
  onChange={(e) => {
    // Solo números y máximo 10 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAddress({ ...address, phone: value });
  }}
  style={styles.input}
  placeholder="Ej. 5512345678"
  maxLength={10}
/>
                    </div>

                    <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
                      <label>Calle y número</label>
                      <input
                        name="street"
                        value={address.street}
                        onChange={handleAddressChange}
                        style={styles.input}
                        placeholder="Ej. Av. Siempre Viva 123"
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label>Ciudad</label>
                      <input name="city" value={address.city} onChange={handleAddressChange} style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                      <label>Estado</label>
                      <input name="state" value={address.state} onChange={handleAddressChange} style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                      <label>Código postal</label>
                      <input name="zip" value={address.zip} onChange={handleAddressChange} style={styles.input} />
                    </div>

                    <div style={{ ...styles.inputGroup, gridColumn: "1 / -1" }}>
                      <label>Notas (opcional)</label>
                      <textarea
                        name="notes"
                        value={address.notes}
                        onChange={handleAddressChange}
                        style={styles.textarea}
                        placeholder="Referencias para el repartidor"
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={saveAsDefault}
                        onChange={(e) => setSaveAsDefault(e.target.checked)}
                      />
                      <span style={styles.small}>Guardar como predeterminada</span>
                    </div>
                  </div>

                  <div style={styles.btnRow}>
                    {addresses.length > 0 && (
                      <button style={{ ...styles.btn, ...styles.btnLight }} onClick={() => loadAddressBook()}>
                        Ver direcciones guardadas
                      </button>
                    )}

                    <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={continueFromAddressStep}>
                      Guardar y continuar
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h3 style={styles.sectionTitle}>2) Pago</h3>
              <div style={styles.subtitle}>Selecciona una tarjeta guardada o agrega una nueva en tu billetera.</div>

              {loadingCards ? (
                <p>Cargando tarjetas...</p>
              ) : cards.length === 0 ? (
                <>
                  <p style={{ color: "#555" }}>No tienes tarjetas guardadas. Agrega una en tu billetera.</p>

                  <div style={styles.btnRow}>
                    <button
                      style={{ ...styles.btn, ...styles.btnDark }}
                      onClick={() => {
                        sessionStorage.setItem("checkout_step", "2");
                        navigate("/wallet?from=checkout");
                      }}
                    >
                      Ir a billetera
                    </button>

                    <button
                      style={{ ...styles.btn, ...styles.btnLight }}
                      onClick={() => {
                        setStep(1);
                        sessionStorage.setItem("checkout_step", "1");
                      }}
                    >
                      Volver a dirección
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "12px" }}>
                    {cards.map((c) => (
                      <label key={c.id} style={styles.radioRow}>
                        <input
                          type="radio"
                          name="card"
                          checked={String(selectedCardId) === String(c.id)}
                          onChange={() => setSelectedCardId(String(c.id))}
                          style={{ marginTop: 3 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "bold", color: "#333" }}>{c.card_holder}</div>
                          <div style={styles.small}>
                            **** **** **** {String(c.card_number || "").slice(-4)} · Vence {c.expiration_date}
                          </div>
                        </div>
                        {String(selectedCardId) === String(c.id) && <div style={styles.badge}>Seleccionada</div>}
                      </label>
                    ))}
                  </div>

                  <div style={styles.btnRow}>
                    <button
                      style={{ ...styles.btn, ...styles.btnLight }}
                      onClick={() => {
                        setStep(1);
                        sessionStorage.setItem("checkout_step", "1");
                      }}
                    >
                      Volver a dirección
                    </button>

                    <button
                      style={{ ...styles.btn, ...styles.btnDark }}
                      onClick={() => {
                        sessionStorage.setItem("checkout_step", "2");
                        navigate("/wallet?from=checkout");
                      }}
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

          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={{ color: "#28a745", fontWeight: "bold" }}>${subtotal.toFixed(2)}</span>
          </div>

          <div style={styles.btnRow}>
            {step === 1 ? (
              <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={continueFromAddressStep}>
                Continuar
              </button>
            ) : (
              <button
                style={{ ...styles.btn, ...styles.btnLight }}
                onClick={() => {
                  setStep(1);
                  sessionStorage.setItem("checkout_step", "1");
                }}
              >
                Cambiar dirección
              </button>
            )}

            <button style={{ ...styles.btn, ...styles.btnLight }} onClick={() => navigate("/")}>
              Volver a inicio
            </button>

            {!isBuyNow && (
              <button style={{ ...styles.btn, ...styles.btnDark }} onClick={() => navigate("/cart")}>
                Volver a carrito
              </button>
            )}
          </div>

          {isBuyNow && (
            <div style={{ marginTop: 10, ...styles.small }}>
              Estás comprando con <b>Comprar ahora</b>. Este producto no se guardará en el carrito si no finalizas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
