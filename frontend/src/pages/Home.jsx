import { useEffect, useState } from 'react';
import '../App.css';

// Función auxiliar para obtener el usuario logueado
const getLoggedInUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
}

function Home() {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(getLoggedInUser());
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error:', error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!user || (user.role !== 'admin' && user.role !== 'operator')) {
            alert("No tienes permisos para agregar productos.");
            return;
        }

        fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        .then(res => res.json())
        .then(data => {
            alert('Producto agregado correctamente');
            setForm({ name: '', description: '', price: '', stock: '', category: '' });
            fetchProducts();
        })
        .catch(error => console.error('Error:', error));
    };

    // --- FUNCIÓN NUEVA: AÑADIR AL CARRITO ---
    const addToCart = (product) => {
        // 1. Leemos lo que ya hay en el carrito (o creamos un arreglo vacío)
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // 2. Agregamos el producto seleccionado
        currentCart.push(product);
        
        // 3. Guardamos de nuevo en el navegador
        localStorage.setItem('cart', JSON.stringify(currentCart));
        
        alert(`${product.name} agregado al carrito 🛒`);
    };

    // Solo Admin u Operator pueden ver el formulario de crear productos
    const canSeeForm = user && (user.role === 'admin' || user.role === 'operator');

    return (
        <div className="App" style={{ padding: '20px' }}>
            <h1>Panel de Productos - MobiStore 📱</h1>
            
            {/* Formulario solo visible para personal autorizado */}
            {canSeeForm && (
                <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '400px', margin: '20px auto', backgroundColor: '#fff' }}>
                    <h2>Agregar Nuevo Producto</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" name="name" placeholder="Nombre del producto" value={form.name} onChange={handleChange} required style={{ padding: '8px' }}/>
                        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} style={{ padding: '8px' }}/>
                        <input type="number" name="price" placeholder="Precio" value={form.price} onChange={handleChange} required style={{ padding: '8px' }}/>
                        <input type="number" name="stock" placeholder="Stock disponible" value={form.stock} onChange={handleChange} required style={{ padding: '8px' }}/>
                        <select name="category" value={form.category} onChange={handleChange} required style={{ padding: '8px' }}>
                            <option value="">Selecciona una categoría</option>
                            <option value="Celulares">Celulares</option>
                            <option value="Accesorios">Accesorios</option>
                            <option value="Tablets">Tablets</option>
                        </select>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                            Guardar Producto
                        </button>
                    </form>
                </div>
            )}

            <h2>Catálogo</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px', width: '250px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3>{product.name}</h3>
                        <p style={{ color: '#555', fontSize: '0.9rem' }}>{product.description}</p>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>${product.price}</p>
                        <p style={{ fontSize: '0.8rem' }}>Stock: {product.stock}</p>
                        <p style={{ fontSize: '0.8rem', color: '#777' }}>Categoría: {product.category}</p>
                        
                        {/* --- BOTÓN NUEVO CON FUNCIONALIDAD --- */}
                        <button 
                            onClick={() => addToCart(product)} 
                            style={{ width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Añadir al Carrito 🛒
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;