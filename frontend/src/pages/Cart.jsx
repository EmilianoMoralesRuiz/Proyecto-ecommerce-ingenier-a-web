import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    // Al cargar, leemos el carrito del LocalStorage
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    // Calcular el total
    const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

    const handleCheckout = async () => {
        // 1. Validar que haya usuario logueado
        const userString = localStorage.getItem('user');
        if (!userString) {
            alert('Debes iniciar sesión para comprar.');
            navigate('/login');
            return;
        }
        const user = JSON.parse(userString);

        // 2. Validar dirección
        if (!address) {
            alert('Por favor ingresa una dirección de envío.');
            return;
        }

        // 3. Enviar al Backend
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    total_amount: total,
                    shipping_address: address,
                    userId: user.id
                })
            });

            if (response.ok) {
                alert('¡Compra realizada con éxito! 📦');
                localStorage.removeItem('cart'); // Limpiar carrito
                setCart([]);
                navigate('/');
            } else {
                alert('Error al procesar la compra.');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión.');
        }
    };

    const removeItem = (indexToRemove) => {
        const newCart = cart.filter((_, index) => index !== indexToRemove);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2>🛒 Tu Carrito de Compras</h2>

            {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
            ) : (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        {cart.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', padding: '10px' }}>
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>${item.price}</p>
                                </div>
                                <button onClick={() => removeItem(index)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '2px solid #333', paddingTop: '20px' }}>
                        <h3>Total a Pagar: ${total.toFixed(2)}</h3>
                        
                        <div style={{ margin: '20px 0' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Dirección de Envío:</label>
                            <textarea 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                placeholder="Calle, Número, Colonia, Ciudad..." 
                                style={{ width: '100%', padding: '10px', height: '80px' }}
                            />
                        </div>

                        <button 
                            onClick={handleCheckout} 
                            style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.2rem' }}
                        >
                            Confirmar Compra
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;