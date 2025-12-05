import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders'; 
import Wallet from './pages/Wallet'; // <--- Importamos la Billetera
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Al cargar la página, revisamos si hay una sesión guardada
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav style={{ 
        padding: '15px 30px', 
        borderBottom: '1px solid #e0e0e0', 
        marginBottom: '30px', 
        backgroundColor: '#fff',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        {/* Lado Izquierdo: Logo y Carrito */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
            📱 MobiStore
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1rem' }}>
            🛒 Carrito
          </Link>
        </div>
        
        {/* Lado Derecho: Menú de Usuario */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              {/* Enlaces solo para usuarios logueados */}
              <Link to="/orders" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                📦 Mis Pedidos
              </Link>
              
              <Link to="/wallet" style={{ textDecoration: 'none', color: '#6f42c1', fontWeight: 'bold' }}>
                💳 Billetera
              </Link>
              
              <span style={{ color: '#555', fontSize: '0.9rem', borderLeft: '1px solid #ccc', paddingLeft: '15px' }}>
                Hola, {user.name} ({user.role})
              </span>
              
              <button 
                onClick={handleLogout} 
                style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Salir
              </button>
            </>
          ) : (
            <>
              {/* Enlaces para visitantes */}
              <Link to="/login" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
                Iniciar Sesión
              </Link>
              <Link to="/register" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#28a745', padding: '8px 15px', borderRadius: '5px' }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* --- DEFINICIÓN DE RUTAS --- */}
      <Routes>
        {/* Página Principal (Catálogo) */}
        <Route path="/" element={<Home />} />
        
        {/* Rutas Públicas (Login/Registro) - Si ya estás logueado, te mandan al Home */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* Ruta del Carrito (Pública, pero pide login al pagar) */}
        <Route path="/cart" element={<Cart />} />
        
        {/* Rutas Protegidas (Solo usuarios logueados) */}
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;