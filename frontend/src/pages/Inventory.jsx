import React, { useState, useEffect } from 'react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // Si es null, estamos creando. Si tiene datos, editando.

  // Formulario inicial
  const initialForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    delivery_days: '3',
    imageUrls: '' // Lo manejaremos como texto separado por comas
  };
  
  const [formData, setFormData] = useState(initialForm);

  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
    formCard: { backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    inputGroup: { marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ced4da', width: '100%' },
    fullWidth: { gridColumn: '1 / -1' },
    button: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { backgroundColor: '#343a40', color: 'white', padding: '12px', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #ddd' },
    actionBtn: (color) => ({ padding: '5px 10px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', fontSize: '0.8rem' })
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Preparamos los datos
    const payload = {
      ...formData,
      // Convertimos el string de imagenes a un array real
      imageUrls: formData.imageUrls.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    try {
      let url = 'http://localhost:5000/api/products';
      let method = 'POST';

      if (editingProduct) {
        url = `http://localhost:5000/api/products/${editingProduct.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al guardar');

      alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
      setFormData(initialForm);
      setEditingProduct(null);
      fetchProducts(); // Recargar tabla

    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Rellenar formulario con datos existentes
    // Nota: Para las imágenes, tomamos el array y lo volvemos string para el input
    const imagesString = product.ProductImages ? product.ProductImages.map(img => img.imageUrl).join(', ') : '';
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      delivery_days: product.delivery_days || 3,
      imageUrls: imagesString
    });
    
    // Scrollear hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('Producto eliminado');
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  if (loading) return <div>Cargando inventario...</div>;

  return (
    <div style={styles.container}>
      <h1 style={{marginBottom: '20px', color: '#333'}}>📦 Gestión de Inventario</h1>

      {/* --- FORMULARIO --- */}
      <div style={styles.formCard}>
        <h3 style={{marginBottom: '15px'}}>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input name="name" placeholder="Nombre del producto" value={formData.name} onChange={handleInputChange} style={styles.input} required />
            <input name="category" placeholder="Categoría (ej: Celulares)" value={formData.category} onChange={handleInputChange} style={styles.input} required />
          </div>
          
          <div style={styles.inputGroup}>
            <input type="number" name="price" placeholder="Precio ($)" value={formData.price} onChange={handleInputChange} style={styles.input} required />
            <input type="number" name="stock" placeholder="Stock (Cantidad)" value={formData.stock} onChange={handleInputChange} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <input type="number" name="delivery_days" placeholder="Días de entrega (ej: 3)" value={formData.delivery_days} onChange={handleInputChange} style={styles.input} />
            <input name="imageUrls" placeholder="URLs de imágenes (separadas por coma)" value={formData.imageUrls} onChange={handleInputChange} style={styles.input} />
          </div>

          <textarea name="description" placeholder="Descripción detallada..." value={formData.description} onChange={handleInputChange} style={{...styles.input, ...styles.fullWidth, height: '80px', marginBottom: '15px'}} required />

          <button type="submit" style={styles.button}>{editingProduct ? 'Actualizar' : 'Guardar Producto'}</button>
          {editingProduct && (
            <button type="button" onClick={() => { setEditingProduct(null); setFormData(initialForm); }} style={styles.cancelBtn}>Cancelar Edición</button>
          )}
        </form>
      </div>

      {/* --- TABLA --- */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Producto</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Días Entrega</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={styles.td}>{p.id}</td>
              <td style={styles.td}>
                <strong>{p.name}</strong><br/>
                <span style={{fontSize: '0.8em', color: '#666'}}>{p.category}</span>
              </td>
              <td style={styles.td}>${p.price}</td>
              <td style={styles.td}>
                <span style={{ color: p.stock < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
                  {p.stock} unid.
                </span>
              </td>
              <td style={styles.td}>{p.delivery_days || 3} días</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(p)} style={styles.actionBtn('#ffc107')}>✏️ Editar</button>
                <button onClick={() => handleDelete(p.id)} style={styles.actionBtn('#dc3545')}>🗑️ Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;