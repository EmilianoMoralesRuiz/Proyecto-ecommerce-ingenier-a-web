import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';



const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    secretKey: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const ADMIN_CODE = "TELEMATICA2025"; 

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#f4f4f9',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '450px',
      textAlign: 'center'
    },
    title: {
      marginBottom: '25px',
      color: '#333',
      fontSize: '2rem',
      fontWeight: 'bold'
    },
    inputGroup: {
      marginBottom: '15px',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#666',
      fontSize: '0.9rem',
      fontWeight: 'bold'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      fontSize: '16px',
      outline: 'none',
      transition: 'border 0.3s'
    },
    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ddd',
      backgroundColor: 'white',
      fontSize: '16px'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background 0.3s'
    },
    linkText: {
      marginTop: '20px',
      fontSize: '0.9rem',
      color: '#666'
    },
    error: {
      color: 'red',
      marginBottom: '15px',
      fontSize: '0.9rem',
      backgroundColor: '#ffe6e6',
      padding: '10px',
      borderRadius: '4px'
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'admin' || formData.role === 'operator') {
      if (formData.secretKey !== ADMIN_CODE) {
        setError('❌ El Código de Acceso para personal es incorrecto.');
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Registro exitoso. Ahora inicia sesión.');
        navigate('/login');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear Cuenta</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Ej. Emiliano Morales"
              required
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              required
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="********"
              required
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tipo de Cuenta</label>
            <select style={styles.select} name="role" onChange={handleChange} value={formData.role}>
              <option value="client">Cliente (Comprador)</option>
              <option value="operator">Operador (Inventario)</option>
              <option value="admin">Administrador (Total)</option>
            </select>
          </div>

          {(formData.role === 'admin' || formData.role === 'operator') && (
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, color: '#d63384' }}>
                🔒 Código de Acceso (Requerido)
              </label>
              <input
                style={{ ...styles.input, borderColor: '#d63384' }}
                type="password"
                name="secretKey"
                placeholder="Ingresa el código del personal"
                required
                onChange={handleChange}
              />
              <small style={{ fontSize: '0.8rem', color: '#888' }}>
                Pide este código a tu supervisor.
              </small>
            </div>
          )}

          <button type="submit" style={styles.button}>
            Registrarse
          </button>
        </form>

        <p style={styles.linkText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
            Inicia Sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;