import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
    
    searchContainer: { 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '25px' 
    },
    searchForm: { 
      display: 'flex', 
      width: '100%', 
      maxWidth: '600px', 
      gap: '10px' 
    },
    searchInput: { 
      flex: 1, 
      padding: '12px', 
      borderRadius: '8px', 
      border: '1px solid #ddd', 
      fontSize: '16px', 
      outline: 'none' 
    },
    searchButton: { 
      padding: '12px 24px', 
      backgroundColor: '#007bff', 
      color: 'white', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontWeight: 'bold' 
    },

    filterContainer: { 
      display: 'flex', 
      gap: '15px', 
      marginBottom: '30px', 
      overflowX: 'auto', 
      paddingBottom: '10px',
      borderBottom: '1px solid #eee'
    },
    filterBtn: (isActive) => ({
      padding: '8px 20px',
      borderRadius: '20px',
      border: isActive ? 'none' : '1px solid #ddd',
      backgroundColor: isActive ? '#333' : 'white',
      color: isActive ? 'white' : '#555',
      cursor: 'pointer',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s'
    }),

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

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/products`;
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      setProducts(data);
      setFilteredProducts(data);

      if (!search) {
        const uniqueCategories = ['Todas', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
      }
      
    } catch (error) {
      console.error("Error al cargar el catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
    setSelectedCategory('Todas');
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'Todas') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => p.category === category);
      setFilteredProducts(filtered);
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
      <h1 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Nuestros Productos</h1>
      
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Buscar
          </button>
        </form>
      </div>

      <div style={styles.filterContainer}>
        {categories.map(cat => (
          <button 
            key={cat} 
            style={styles.filterBtn(selectedCategory === cat)}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
          <p>No se encontraron productos que coincidan con tu búsqueda.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              fetchProducts();
              setSelectedCategory('Todas');
            }} 
            style={{marginTop: '10px', cursor:'pointer', background:'none', border:'none', color:'#007bff', textDecoration:'underline'}}
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => {
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