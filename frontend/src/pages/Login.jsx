import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const styles = {
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#f4f6f9'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    },
    title: {
      marginBottom: '30px',
      color: '#333',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    input: {
      padding: '14px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      backgroundColor: '#fafafa',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    button: {
      padding: '14px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '0.9rem',
      textAlign: 'left'
    },
    registerLink: {
      marginTop: '20px',
      fontSize: '0.9rem',
      color: '#666'
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
      fontWeight: 'bold',
      marginLeft: '5px'
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.location.href = '/'; 
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        
        {error && <div style={styles.errorMessage}>⚠️ {error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        <div style={styles.registerLink}>
          ¿No tienes una cuenta? 
          <Link to="/register" style={styles.link}>Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;