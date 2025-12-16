import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders'; 
import Wallet from './pages/Wallet'; 
import OperatorPanel from './pages/OperatorPanel';
import Inventory from './pages/Inventory'; 
import ProductDetail from './pages/ProductDetail'; 
import SalesReport from './pages/SalesReport'; 
import UsersList from './pages/UsersList';
import Footer from './components/Footer';
import Checkout from './pages/Checkout.jsx';
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
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
            <Link to="/cart" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1rem' }}>
              🛒 Carrito
            </Link>
          </div>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {user ? (
              <>
                {(user.role === 'operator' || user.role === 'admin') && (
                  <>
                   <Link to="/operator" style={{ textDecoration: 'none', color: '#d63384', fontWeight: 'bold', border: '1px solid #d63384', padding: '5px 10px', borderRadius: '5px' }}>
                     🛠️ Panel Operador
                   </Link>
                   <Link to="/inventory" style={{ textDecoration: 'none', color: '#198754', fontWeight: 'bold', border: '1px solid #198754', padding: '5px 10px', borderRadius: '5px' }}>
                     📋 Inventario
                   </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link to="/sales-report" style={{ textDecoration: 'none', color: '#6610f2', fontWeight: 'bold', border: '1px solid #6610f2', padding: '5px 10px', borderRadius: '5px' }}>
                       📈 Reportes
                    </Link>
                    <Link to="/users" style={{ textDecoration: 'none', color: '#fd7e14', fontWeight: 'bold', border: '1px solid #fd7e14', padding: '5px 10px', borderRadius: '5px', marginLeft: '10px' }}>
                        👥 Usuarios
                    </Link>
                  </>
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

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />

            <Route 
              path="/operator" 
              element={
                user && (user.role === 'operator' || user.role === 'admin') 
                ? <OperatorPanel /> 
                : <Navigate to="/" />
              } 
            />
            <Route 
              path="/inventory" 
              element={
                user && (user.role === 'operator' || user.role === 'admin') 
                ? <Inventory /> 
                : <Navigate to="/" />
              } 
            />
            <Route 
              path="/sales-report" 
              element={
                user && user.role === 'admin' 
                ? <SalesReport /> 
                : <Navigate to="/" />
              } 
            />
            <Route 
              path="/users" 
              element={
                user && user.role === 'admin' 
                ? <UsersList /> 
                : <Navigate to="/" />
              } 
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;