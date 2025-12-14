import React, { useState, useEffect } from 'react';

const OperatorPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusTranslations = {
    'pending': 'Pendiente',
    'paid': 'Pagado',
    'shipped': 'Enviado',
    'delivered': 'Entregado',
    'canceled': 'Cancelado'
  };

  const statusColors = {
    'pending': '#ffc107',
    'paid': '#17a2b8',
    'shipped': '#007bff',
    'delivered': '#28a745',
    'canceled': '#dc3545'
  };

  const styles = {
    container: { padding: '40px', maxWidth: '1200px', margin: '0 auto' },
    title: { marginBottom: '30px', color: '#333', borderBottom: '2px solid #d63384', paddingBottom: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' },
    th: { backgroundColor: '#343a40', color: 'white', padding: '15px', textAlign: 'left' },
    td: { padding: '15px', borderBottom: '1px solid #eee', backgroundColor: 'white', verticalAlign: 'middle' },
    select: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', fontWeight: 'bold' },
    badge: (status) => ({
      padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', color: 'white',
      backgroundColor: statusColors[status] || '#6c757d',
      display: 'inline-block', minWidth: '80px', textAlign: 'center'
    }),
    btnDelete: { padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (error) {
      console.error(error);
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
        alert(`Estatus actualizado a: ${statusTranslations[newStatus]}`);
        fetchOrders();
      }
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido permanentemente?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Pedido eliminado');
        setOrders(orders.filter(o => o.id !== id));
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando panel...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛠️ Panel de Operador</h1>
      
      {orders.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Estatus Actual</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={styles.td}>#{order.id}</td>
                <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>ID Usuario: {order.userId}</td>
                <td style={styles.td}>${order.total_amount}</td>
                
                <td style={styles.td}>
                  <span style={styles.badge(order.status)}>
                    {statusTranslations[order.status] || order.status}
                  </span>
                </td>

                <td style={styles.td}>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="canceled">Cancelado</option>
                  </select>

                  <button onClick={() => handleDelete(order.id)} style={styles.btnDelete} title="Eliminar pedido">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OperatorPanel;