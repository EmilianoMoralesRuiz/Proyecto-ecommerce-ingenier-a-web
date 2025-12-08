import React, { useState, useEffect } from 'react';

const OperatorPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estilos simples para que se vea bien sin instalar nada extra
  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
    header: { marginBottom: '20px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    th: { backgroundColor: '#343a40', color: 'white', padding: '12px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #ddd', backgroundColor: '#fff' },
    select: { padding: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    badge: (status) => ({
      padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold',
      color: 'white',
      backgroundColor: status === 'paid' ? '#28a745' : status === 'shipped' ? '#17a2b8' : '#ffc107'
    })
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      // Conexión al backend (asegúrate de que tu backend esté corriendo en el puerto 5000)
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Error al obtener órdenes");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Actualizamos la tabla instantáneamente
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        alert('Estatus actualizado correctamente');
      }
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando panel...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🛠️ Panel de Operador</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID Orden</th>
            <th style={styles.th}>ID Cliente</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Estatus Actual</th>
            <th style={styles.th}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td style={styles.td}>#{order.id}</td>
              <td style={styles.td}>{order.userId}</td>
              <td style={styles.td}>${order.total_amount}</td>
              <td style={styles.td}>
                <span style={styles.badge(order.status)}>{order.status.toUpperCase()}</span>
              </td>
              <td style={styles.td}>
                <select 
                  style={styles.select}
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No hay órdenes registradas.</p>}
    </div>
  );
};

export default OperatorPanel;