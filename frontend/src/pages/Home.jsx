import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' },
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'transform 0.2s' },
    imageContainer: { height: '200px', width: '100%', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' },
    image: { width: '100%', height: '100%', objectFit: 'contain' }, 
    info: { padding: '15px' },
    category: { fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },
    name: { fontSize: '1.1rem', fontWeight: 'bold', margin: '5px 0', color: '#333', cursor: 'pointer' },
    price: { fontSize: '1.2rem', color: '#28a745', fontWeight: 'bold' },
    delivery: { fontSize: '0.85rem', color: '#007bff', marginTop: '5px' },
    button: { width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const user = localStorage.getItem('user');
    if (!user) {
      return navigate('/login');
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      const mainImage = (product.ProductImages && product.ProductImages.length > 0) 
        ? product.ProductImages[0].imageUrl 
        : 'https://via.placeholder.com/150?text=Sin+Foto';

      cart.push({ ...product, quantity: 1, image: mainImage });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`¡${product.name} agregado al carrito!`);
  };

  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Cargando catálogo...</div>;

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Nuestros Productos</h1>
      
      {products.length === 0 ? (
        <p style={{textAlign: 'center'}}>No hay productos disponibles por el momento.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => {
            const productImg = (product.ProductImages && product.ProductImages.length > 0) 
              ? product.ProductImages[0].imageUrl 
              : 'https://via.placeholder.com/300x200?text=Sin+Imagen';

            return (
              <div key={product.id} style={styles.card}>
                <div style={styles.imageContainer} onClick={() => goToDetail(product.id)}>
                  <img src={productImg} alt={product.name} style={styles.image} />
                </div>
                
                <div style={styles.info}>
                  <div style={styles.category}>{product.category}</div>
                  <div style={styles.name} onClick={() => goToDetail(product.id)}>
                    {product.name}
                  </div>
                  <div style={styles.price}>${product.price}</div>
                  
                  <div style={styles.delivery}>
                    🚚 Llega en {product.delivery_days || 3} días
                  </div>

                  <button 
                    style={styles.button}
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0} 
                  >
                    {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;