import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px', flexWrap: 'wrap' },
    gallery: { flex: '1', minWidth: '300px' },
    mainImage: { width: '100%', height: '400px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '10px' },
    thumbnails: { display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' },
    thumb: { width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '5px' },
    info: { flex: '1', minWidth: '300px' },
    title: { fontSize: '2rem', color: '#333', marginBottom: '10px' },
    price: { fontSize: '1.5rem', color: '#28a745', fontWeight: 'bold', marginBottom: '20px' },
    desc: { lineHeight: '1.6', color: '#555', marginBottom: '20px' },
    meta: { fontSize: '0.9rem', color: '#777', marginBottom: '10px' },
    btn: { padding: '15px 30px', backgroundColor: '#333', color: 'white', border: 'none', fontSize: '1rem', cursor: 'pointer', borderRadius: '5px' },
    reviewSection: { marginTop: '50px', width: '100%', borderTop: '1px solid #eee', paddingTop: '30px' },
    star: { cursor: 'pointer', fontSize: '1.5rem', color: '#ffc107' }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      if (data.ProductImages && data.ProductImages.length > 0) {
        setSelectedImage(data.ProductImages[0].imageUrl);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const user = localStorage.getItem('user');
    if (!user) return navigate('/login');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1, image: selectedImage });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Añadido al carrito');
  };

  const submitReview = (e) => {
    e.preventDefault();
    alert(`¡Gracias! Tu calificación de ${rating} estrellas ha sido guardada.`);
    setComment('');
  };

  if (loading) return <div>Cargando...</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div style={styles.container}>
      {/* GALERÍA */}
      <div style={styles.gallery}>
        <img src={selectedImage || 'https://via.placeholder.com/400'} alt={product.name} style={styles.mainImage} />
        <div style={styles.thumbnails}>
          {product.ProductImages && product.ProductImages.map((img, index) => (
            <img 
              key={index} 
              src={img.imageUrl} 
              style={{...styles.thumb, borderColor: selectedImage === img.imageUrl ? '#007bff' : '#ddd'}}
              onClick={() => setSelectedImage(img.imageUrl)}
            />
          ))}
        </div>
      </div>

      {/* DETALLES */}
      <div style={styles.info}>
        <h1 style={styles.title}>{product.name}</h1>
        <div style={styles.price}>${product.price}</div>
        <div style={styles.meta}>Categoría: {product.category}</div>
        <div style={styles.meta}>Stock: {product.stock} unidades</div>
        <div style={styles.meta}>Entrega estimada: {product.delivery_days} días</div>
        
        <p style={styles.desc}>{product.description}</p>

        <button style={styles.btn} onClick={handleAddToCart} disabled={product.stock <= 0}>
            {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
        </button>
      </div>

      {/* SECCIÓN DE RESEÑAS Y ESTRELLAS */}
      <div style={styles.reviewSection}>
        <h2>⭐ Calificaciones y Recomendaciones</h2>
        <form onSubmit={submitReview} style={{marginTop: '20px', maxWidth: '500px'}}>
            <div style={{marginBottom: '10px'}}>
                <label>Tu Calificación: </label>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={styles.star} onClick={() => setRating(star)}>
                        {star <= rating ? '★' : '☆'}
                    </span>
                ))}
            </div>
            <textarea 
                placeholder="Escribe tu recomendación o comentario..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{width: '100%', padding: '10px', height: '80px', marginBottom: '10px'}}
            />
            <button type="submit" style={{...styles.btn, padding: '10px 20px', fontSize: '0.9rem'}}>Enviar Reseña</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetail;