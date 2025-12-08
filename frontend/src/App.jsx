import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders'; 
import Wallet from './pages/Wallet'; 

import OperatorPanel from './pages/OperatorPanel';
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
      {/* --- BARRA DE NAVEGACIÓN (NAVBAR) --- */}
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
        {/* Lado Izquierdo */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
            📱 MobiStore
          </Link>
          <Link to="/cart" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1rem' }}>
            🛒 Carrito
          </Link>
        </div>
        
        {/* Lado Derecho (Menú Usuario) */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {user ? (
            <>
              {/* ESTE BOTÓN SOLO APARECE SI ERES ADMIN U OPERADOR */}
              {(user.role === 'operator' || user.role === 'admin') && (
                 <Link to="/operator" style={{ textDecoration: 'none', color: '#d63384', fontWeight: 'bold', border: '1px solid #d63384', padding: '5px 10px', borderRadius: '5px' }}>
                   🛠️ Panel Operador
                 </Link>
              )}

              <Link to="/orders" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                📦 Mis Pedidos
              </Link>
              
              <Link to="/wallet" style={{ textDecoration: 'none', color: '#6f42c1', fontWeight: 'bold' }}>
                💳 Billetera
              </Link>
              
              <span style={{ color: '#555', fontSize: '0.9rem', borderLeft: '1px solid #ccc', paddingLeft: '15px' }}>
                Hola, {user.name}
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

      {/* --- RUTAS DE LA APP --- */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* Rutas de Cliente */}
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
        <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />

        {/* --- RUTA NUEVA: PANEL DE OPERADOR --- */}
        <Route 
          path="/operator" 
          element={
            // Protección: Solo entra si hay usuario Y su rol es admin u operador
            user && (user.role === 'operator' || user.role === 'admin') 
            ? <OperatorPanel /> 
            : <Navigate to="/" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;