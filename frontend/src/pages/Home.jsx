import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, styles, goToDetail, addToCart, buyNow }) => {
  const images = product.ProductImages || [];
  const fallback = 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);

  const currentImg = images.length > 0 ? images[currentIndex]?.imageUrl : fallback;

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={styles.card}>
      <div
        style={styles.imageContainer}
        onClick={() => goToDetail(product.id)}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <img
          src={currentImg}
          alt={product.name}
          style={{
            ...styles.image,
            transform: isHover ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform 0.35s ease',
          }}
        />
      </div>

      <div style={styles.info}>
        <div style={styles.category}>{product.category}</div>
        <div style={styles.name} onClick={() => goToDetail(product.id)}>
          {product.name}
        </div>
        <div style={styles.price}>${product.price}</div>

        <div style={styles.delivery}>🚚 Llega en {product.delivery_days || 3} días</div>

        <button
          style={styles.button}
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
        </button>

        <button
          style={{ ...styles.button, backgroundColor: '#007bff' }}
          onClick={() => buyNow(product)}
          disabled={product.stock <= 0}
        >
          Comprar ahora
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); 
  const navigate = useNavigate();

  const styles = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },

    topControls: {
      display: 'grid',
      gridTemplateColumns: '1fr 220px',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '18px',
    },

    searchInput: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #ddd',
      fontSize: '16px',
      outline: 'none',
    },

    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: '1px solid #ddd',
      fontSize: '14px',
      outline: 'none',
      cursor: 'pointer',
      background: 'white'
    },

    filterContainer: {
      display: 'flex',
      gap: '15px',
      marginBottom: '22px',
      overflowX: 'auto',
      paddingBottom: '10px',
      borderBottom: '1px solid #eee',
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
    }),

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '25px',
    },
    card: {
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    imageContainer: {
      height: '200px',
      width: '100%',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '12px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    info: { padding: '15px' },
    category: {
      fontSize: '0.8rem',
      color: '#888',
      textTransform: 'uppercase',
    },
    name: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      margin: '5px 0',
      color: '#333',
      cursor: 'pointer',
    },
    price: { fontSize: '1.2rem', color: '#28a745', fontWeight: 'bold' },
    delivery: { fontSize: '0.85rem', color: '#007bff', marginTop: '5px' },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      marginTop: '10px',
      fontWeight: 'bold',
    },

    empty: { textAlign: 'center', padding: '40px', color: '#666' }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/products`;
      const response = await fetch(url);
      const data = await response.json();

      setProducts(Array.isArray(data) ? data : []);

      const uniqueCategories = ['Todas', ...new Set((Array.isArray(data) ? data : []).map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error al cargar el catálogo:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'Todas') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = String(p.name || '').toLowerCase();
        const cat = String(p.category || '').toLowerCase();
        return name.includes(q) || cat.includes(q);
      });
    }

    const priceNum = (x) => Number(x?.price) || 0;
    const nameStr = (x) => String(x?.name || '').toLowerCase();

    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => priceNum(a) - priceNum(b));
        break;
      case 'price_desc':
        list.sort((a, b) => priceNum(b) - priceNum(a));
        break;
      case 'name_asc':
        list.sort((a, b) => nameStr(a).localeCompare(nameStr(b), 'es'));
        break;
      case 'name_desc':
        list.sort((a, b) => nameStr(b).localeCompare(nameStr(a), 'es'));
        break;
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        break;
    }

    return list;
  }, [products, selectedCategory, searchTerm, sortBy]);

  const addToCart = (product) => {
    const user = localStorage.getItem('user');
    if (!user) return navigate('/login');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const idx = cart.findIndex((item) => item.id === product.id);

    const mainImage =
      product.ProductImages && product.ProductImages.length > 0
        ? product.ProductImages[0].imageUrl
        : 'https://via.placeholder.com/150?text=Sin+Foto';

    if (idx >= 0) cart[idx].quantity += 1;
    else cart.push({ ...product, quantity: 1, image: mainImage });

    localStorage.setItem('cart', JSON.stringify(cart));

    const goCart = window.confirm(
      `✅ ${product.name} agregado al carrito.\n\n¿Ir al carrito?\n(Cancelar = Seguir comprando)`
    );
    if (goCart) navigate('/cart');
  };

  const buyNow = (product) => {
    const user = localStorage.getItem('user');
    if (!user) return navigate('/login');

    const mainImage =
      product.ProductImages && product.ProductImages.length > 0
        ? product.ProductImages[0].imageUrl
        : 'https://via.placeholder.com/150?text=Sin+Foto';

    navigate('/checkout', {
      state: { items: [{ ...product, quantity: 1, image: mainImage }] },
    });
  };

  const goToDetail = (id) => navigate(`/product/${id}`);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando catálogo...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>
        Nuestros Productos
      </h1>

      {/* ✅ NUEVO: buscador + ordenar */}
      <div style={styles.topControls}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="default">Ordenar: recomendado</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="name_asc">Nombre: A → Z</option>
          <option value="name_desc">Nombre: Z → A</option>
          <option value="newest">Más nuevos</option>
        </select>
      </div>

      {/* ✅ Tu filtro por categorías se queda intacto */}
      <div style={styles.filterContainer}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={styles.filterBtn(selectedCategory === cat)}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredAndSorted.length === 0 ? (
        <div style={styles.empty}>
          <p>No se encontraron productos.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSortBy('default');
              setSelectedCategory('Todas');
            }}
            style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline' }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredAndSorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              styles={styles}
              goToDetail={goToDetail}
              addToCart={addToCart}
              buyNow={buyNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
