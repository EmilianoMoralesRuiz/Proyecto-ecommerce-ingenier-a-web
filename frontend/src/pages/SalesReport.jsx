import React, { useState, useEffect } from 'react';

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    title: { marginBottom: '30px', color: '#333', textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '30px' },
    card: (color) => ({
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      borderLeft: `5px solid ${color}`,
      textAlign: 'center'
    }),
    number: { fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#333' },
    label: { color: '#666', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' },
    icon: { fontSize: '2rem', marginBottom: '10px' }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://mobistore-backend.onrender.com/api/orders/report', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Calculando estadísticas...</div>;
  if (!report) return <div>No se pudo cargar el reporte. (Asegúrate de haber hecho al menos una venta nueva)</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Reporte de Ventas</h1>
      
      <div style={styles.grid}>
        {/* TARJETA 1: TOTAL VENDIDO */}
        <div style={styles.card('#28a745')}>
          <div style={styles.icon}>💰</div>
          <div style={styles.label}>Ingresos Totales</div>
          <div style={styles.number}>
             ${report.totalSales ? report.totalSales.toLocaleString() : '0'}
          </div>
        </div>

        {/* TARJETA 2: TOTAL DE PEDIDOS */}
        <div style={styles.card('#007bff')}>
          <div style={styles.icon}>📦</div>
          <div style={styles.label}>Pedidos Realizados</div>
          <div style={styles.number}>{report.totalOrders}</div>
        </div>

        {/* TARJETA 3: PRODUCTO ESTRELLA */}
        <div style={styles.card('#ffc107')}>
          <div style={styles.icon}>🏆</div>
          <div style={styles.label}>Producto Más Vendido</div>
          <div style={{...styles.number, fontSize: '1.5rem'}}>
            {report.bestSeller.name}
          </div>
          <div style={{fontSize: '0.9rem', color: '#888'}}>
            {report.bestSeller.qty} unidades vendidas
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;