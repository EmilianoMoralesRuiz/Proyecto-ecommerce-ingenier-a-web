import React, { useState, useEffect } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    title: { marginBottom: '20px', color: '#333' },
    card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #eee' },
    header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' },
    status: (status) => ({
      padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold',
      color: 'white',
      backgroundColor: status === 'paid' ? '#28a745' : status === 'shipped' ? '#17a2b8' : '#ffc107'
    })
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://mobistore-backend.onrender.com/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Aseguramos que data sea un array, si no, lo seteamos vacío
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Formato de orden incorrecto", data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop: '50px'}}>Cargando pedidos...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📦 Mis Pedidos</h1>
      
      {orders.length === 0 ? (
        <p>No has realizado ningún pedido aún.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <div>
                <strong>Pedido #{order.id}</strong>
                <div style={{fontSize: '0.9rem', color: '#666'}}>Fecha: {new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <span style={styles.status(order.status)}>{order.status.toUpperCase()}</span>
              </div>
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <strong>Dirección de envío:</strong><br/>
              <span style={{color: '#555'}}>{order.shipping_address}</span>
            </div>
            
            <div style={{textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', color: '#333'}}>
              Total: ${order.total_amount}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;