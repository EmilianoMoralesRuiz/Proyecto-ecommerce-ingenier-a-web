import { useEffect, useState } from 'react';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Obtener el usuario logueado
        const userString = localStorage.getItem('user');
        if (!userString) return;
        const user = JSON.parse(userString);

        // 2. Pedir las órdenes de ESTE usuario al Backend
        fetch(`http://localhost:5000/api/orders/${user.id}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Cargando tus pedidos...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h1>📦 Mis Pedidos</h1>

            {orders.length === 0 ? (
                <p>No has realizado ninguna compra todavía.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map((order) => (
                        <div key={order.id} style={{ 
                            border: '1px solid #ddd', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3>Pedido #{order.id}</h3>
                                <span style={{ 
                                    padding: '5px 10px', 
                                    borderRadius: '15px', 
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    backgroundColor: order.status === 'paid' ? '#d4edda' : '#fff3cd', // Verde si pagado, Amarillo si no
                                    color: order.status === 'paid' ? '#155724' : '#856404'
                                }}>
                                    {/* Traducimos el estatus para mostrarlo bonito */}
                                    {order.status === 'processing' && 'En Proceso'}
                                    {order.status === 'paid' && 'Pagado'}
                                    {order.status === 'shipped' && 'Enviado'}
                                    {order.status === 'received' && 'Entregado'}
                                </span>
                            </div>
                            
                            <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Dirección de Envío:</strong> {order.shipping_address}</p>
                            <h4 style={{ marginTop: '10px', color: '#007bff' }}>Total Pagado: ${order.total_amount}</h4>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;