import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#343a40',
      color: '#ffffff',
      padding: '40px 20px',
      marginTop: 'auto', 
      borderTop: '5px solid #007bff'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px'
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#ffc107'
    },
    link: {
      color: '#ddd',
      textDecoration: 'none',
      fontSize: '0.9rem',
      transition: 'color 0.2s'
    },
    text: {
      fontSize: '0.9rem',
      color: '#ccc',
      lineHeight: '1.6'
    },
    copyright: {
      textAlign: 'center',
      marginTop: '40px',
      paddingTop: '20px',
      borderTop: '1px solid #555',
      fontSize: '0.8rem',
      color: '#aaa'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.column}>
          <div style={styles.title}>📱 MobiStore</div>
          <p style={styles.text}>
            Tu tienda de confianza para los mejores celulares y accesorios del mercado. 
            Envíos seguros y garantía garantizada.
          </p>
        </div>

        <div style={styles.column}>
          <div style={styles.title}>Enlaces Rápidos</div>
          <Link to="/" style={styles.link}>Inicio</Link>
          <Link to="/cart" style={styles.link}>Carrito de Compras</Link>
          <Link to="/login" style={styles.link}>Iniciar Sesión</Link>
          <Link to="/register" style={styles.link}>Registrarse</Link>
        </div>

        <div style={styles.column}>
          <div style={styles.title}>Contacto</div>
          <p style={styles.text}>📍 Avenida Instituto Politécnico Nacional No. 2580, Colonia Barrio la Laguna Ticomán, Alcaldía Gustavo A. Madero, Ciudad de México, C.P. 07340</p>
          <p style={styles.text}>📧 contacto@mobistore.com</p>
          <p style={styles.text}>📞 +52 55 1234 5678</p>
        </div>
      </div>

      <div style={styles.copyright}>
        &copy; {new Date().getFullYear()} MobiStore. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;