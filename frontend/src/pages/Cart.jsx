import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  
  const [address, setAddress] = useState({
    street: '', exterior_number: '', neighborhood: '', city: '', zip_code: ''
  });

  const [cards, setCards] = useState([]); 
  const [selectedCard, setSelectedCard] = useState('new'); 
  const [newCard, setNewCard] = useState({
    card_holder: '', card_number: '', expiration: '', cvv: ''
  });

  useEffect(() => {
    loadCart();
    loadCards();
  }, []);

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    setTotal(sum);
  };

  const loadCards = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCards(data);
        if (data.length > 0) {
          setSelectedCard(data[0].id);
        } else {
          setSelectedCard('new');
        }
      }
    } catch (error) {
      console.error("Error cargando tarjetas");
    }
  };

  // --- NUEVA FUNCIÓN: CAMBIAR CANTIDAD ---
  const handleQuantityChange = (id, newQty) => {
    const quantity = parseInt(newQty);

    // 1. Validaciones básicas
    if (quantity < 1) return; // No permitir menos de 1

    const updatedCart = cart.map(item => {
      if (item.id === id) {
        // 2. Validación de Stock: No dejar seleccionar más de lo que existe
        if (item.stock && quantity > item.stock) {
          alert(`Solo tenemos ${item.stock} unidades disponibles de este producto.`);
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: quantity };
      }
      return item;
    });

    // 3. Guardar cambios
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });
  const handleCardChange = (e) => setNewCard({ ...newCard, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      return navigate('/login');
    }

    if (cart.length === 0) return alert('El carrito está vacío.');

    if (!address.street || !address.exterior_number || !address.zip_code || !address.city) {
        return alert("Por favor completa todos los campos de la dirección");
    }

    try {
      if (selectedCard === 'new') {
        if (!newCard.card_number || !newCard.cvv || !newCard.expiration || !newCard.card_holder) {
            return alert('Debes llenar los datos de la tarjeta o seleccionar una existente');
        }

        const saveCardRes = await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            card_holder: newCard.card_holder,
            card_number: newCard.card_number,
            expiration_date: newCard.expiration, 
            cvv: newCard.cvv, 
            userId: user.id
          })
        });

        if (!saveCardRes.ok) {
            const errData = await saveCardRes.json();
            return alert('Error al guardar la tarjeta: ' + errData.message);
        }
      }

      const fullAddress = `${address.street} #${address.exterior_number}, Col. ${address.neighborhood}, ${address.city}, CP ${address.zip_code}`;

      const orderData = {
        total_amount: total,
        shipping_address: fullAddress,
        userId: user.id,
        items: cart,
        status: 'paid' 
      };

      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (orderRes.ok) {
        localStorage.removeItem('cart');
        setCart([]);
        navigate('/orders'); 
      } else {
        const errorData = await orderRes.json();
        alert('Error al crear la orden: ' + errorData.message);
      }

    } catch (error) {
      console.error(error);
      alert('Error de conexión.');
    }
  };

  const styles = {
    container: { padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' },
    itemsSection: { flex: '1.5', minWidth: '300px' },
    summarySection: { flex: '1', minWidth: '350px', backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px', height: 'fit-content' },
    itemCard: { display: 'flex', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' },
    img: { width: '80px', height: '80px', objectFit: 'contain', marginRight: '15px', border: '1px solid #ddd', borderRadius: '5px' },
    input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#555', marginTop: '10px' },
    sectionTitle: { marginBottom: '15px', borderBottom: '2px solid #ddd', paddingBottom: '5px', color: '#333' },
    checkoutBtn: { width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', marginTop: '20px' },
    
    // Estilo para el input de cantidad
    qtyInput: { width: '60px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc', textAlign: 'center', marginLeft: '10px' }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Tu carrito está vacío 🛒</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.itemsSection}>
        <h2 style={{ marginBottom: '20px' }}>Tu Carrito ({cart.length})</h2>
        {cart.map((item, index) => (
          <div key={index} style={styles.itemCard}>
            <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} style={styles.img} />
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              
              {/* --- CONTROL DE CANTIDAD NUEVO --- */}
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '5px' }}>
                <span style={{color: '#666'}}>Cantidad:</span>
                <input 
                  type="number" 
                  min="1" 
                  max={item.stock} // Límite basado en el stock real
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  style={styles.qtyInput}
                />
                <span style={{fontSize: '0.8rem', color: '#888', marginLeft: '10px'}}>
                  (Disp: {item.stock})
                </span>
              </div>
              
              <p style={{ margin: 0, fontWeight: 'bold', color: '#28a745' }}>
                Subtotal: ${item.price * item.quantity}
              </p>
            </div>

            <button onClick={() => handleRemove(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Eliminar">🗑️</button>
          </div>
        ))}
      </div>

      <div style={styles.summarySection}>
        <h2 style={{marginTop: 0}}>Total a Pagar: ${total}</h2>
        <form onSubmit={handleCheckout}>
          
          <h4 style={styles.sectionTitle}>📍 Dirección de Envío</h4>
          <input name="street" placeholder="Calle" required onChange={handleAddressChange} style={styles.input} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input name="exterior_number" placeholder="Número Ext." required onChange={handleAddressChange} style={styles.input} />
            <input name="zip_code" placeholder="C.P." required onChange={handleAddressChange} style={styles.input} />
          </div>

          <input name="neighborhood" placeholder="Colonia" required onChange={handleAddressChange} style={styles.input} />
          <input name="city" placeholder="Ciudad / Municipio" required onChange={handleAddressChange} style={styles.input} />

          <h4 style={styles.sectionTitle}>💳 Método de Pago</h4>
          
          <select 
            value={selectedCard} 
            onChange={(e) => setSelectedCard(e.target.value)}
            style={styles.input}
          >
            {cards.map(card => (
              <option key={card.id} value={card.id}>
                Terminada en **** {card.card_number.slice(-4)} ({card.card_holder})
              </option>
            ))}
            <option value="new">➕ Agregar nueva tarjeta...</option>
          </select>

          {selectedCard === 'new' && (
            <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '5px', border: '1px solid #ddd' }}>
              <input name="card_holder" placeholder="Titular de la tarjeta" value={newCard.card_holder} onChange={handleCardChange} style={styles.input} />
              <input name="card_number" placeholder="Número de tarjeta (16 dígitos)" maxLength="16" value={newCard.card_number} onChange={handleCardChange} style={styles.input} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input name="expiration" placeholder="MM/AA" value={newCard.expiration} onChange={handleCardChange} style={styles.input} />
                <input name="cvv" placeholder="CVV (3 dígitos)" maxLength="3" value={newCard.cvv} onChange={handleCardChange} style={styles.input} />
              </div>
            </div>
          )}

          <button type="submit" style={styles.checkoutBtn}>Confirmar Compra</button>
        </form>
      </div>
    </div>
  );
};

export default Cart;