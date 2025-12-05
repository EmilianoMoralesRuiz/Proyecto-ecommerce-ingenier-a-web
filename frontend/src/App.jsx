import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart'; // <--- 1. Importamos el Carrito
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
            📱 MobiStore
          </Link>
          {/* <--- 2. Enlace al Carrito visible para todos */}
          <Link to="/cart" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1rem' }}>
            🛒 Carrito
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontWeight: 'bold', color: '#555' }}>Hola, {user.name} ({user.role})</span>
              <button 
                onClick={handleLogout} 
                style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
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

      {/* --- RUTAS --- */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        {/* <--- 3. Ruta del Carrito */}
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;