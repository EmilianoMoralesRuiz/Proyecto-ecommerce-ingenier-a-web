import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    if (response.ok) {
      // 1. Guardamos el Token y el Usuario en la memoria del navegador
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('¡Bienvenido de nuevo!');
      
      // 2. Forzamos una recarga para que la App detecte el cambio de usuario
      window.location.href = '/'; 
    } else {
      alert('Error: ' + data.message);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto', marginTop: '50px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: 'white' }}>
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;