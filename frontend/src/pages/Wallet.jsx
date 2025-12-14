import React, { useState, useEffect } from 'react';

const Wallet = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newCard, setNewCard] = useState({
    card_holder: '',
    card_number: '',
    expiration: '',
    cvv: ''
  });

  const styles = {
    container: { padding: '40px', maxWidth: '800px', margin: '0 auto' },
    title: { marginBottom: '30px', color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' },
    card: {
      
      backgroundColor: 'linear-gradient(135deg, #005c97, #363795)', 
      color: 'white',
      padding: '20px',
      borderRadius: '15px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      position: 'relative',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    chip: { width: '45px', height: '35px', background: 'linear-gradient(135deg, #ffdb4d, #cfa300)', borderRadius: '6px', marginBottom: '10px' },
    number: { fontSize: '1.4rem', letterSpacing: '3px', fontFamily: '"Courier New", Courier, monospace', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' },
    label: { fontSize: '0.65rem', color: '#e0e0e0', textTransform: 'uppercase', marginBottom: '2px' },
    val: { fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase' },
    
    formContainer: { backgroundColor: '#f8f9fa', padding: '25px', borderRadius: '10px', border: '1px solid #ddd' },
    inputGroup: { marginBottom: '15px' },
    input: { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#005c97', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('https://mobistore-backend.onrender.com/api/payments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (error) {
      console.error("Error cargando tarjetas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await fetch('https://mobistore-backend.onrender.com/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          card_holder: newCard.card_holder,
          card_number: newCard.card_number,
          expiration_date: newCard.expiration,
          cvv: newCard.cvv,
          userId: user.id
        })
      });

      if (res.ok) {
        alert('Tarjeta guardada correctamente');
        setNewCard({ card_holder: '', card_number: '', expiration: '', cvv: '' });
        fetchCards(); 
      } else {
        const err = await res.json();
        alert('Error: ' + err.message);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Cargando billetera...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💳 Mi Billetera</h1>

      <div style={styles.grid}>
        {cards.length === 0 ? (
          <p>No tienes tarjetas guardadas.</p>
        ) : (
          cards.map(card => (
            <div key={card.id} style={styles.card}>
              <div style={styles.chip}></div>
              <div style={styles.number}>
                **** **** **** {card.card_number.slice(-4)}
              </div>
              <div style={styles.footer}>
                <div>
                  <div style={styles.label}>Titular</div>
                  <div style={styles.val}>{card.card_holder}</div>
                </div>
                <div>
                  <div style={styles.label}>Vence</div>
                  <div style={styles.val}>{card.expiration_date}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.formContainer}>
        <h3 style={{marginTop: 0, marginBottom: '20px', color: '#666'}}>➕ Agregar Nueva Tarjeta</h3>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Nombre del Titular</label>
            <input name="card_holder" placeholder="Como aparece en la tarjeta" value={newCard.card_holder} onChange={handleInputChange} required style={styles.input} />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Número de Tarjeta</label>
            <input name="card_number" placeholder="XXXX XXXX XXXX XXXX" maxLength="16" value={newCard.card_number} onChange={handleInputChange} required style={styles.input} />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label>Vencimiento (MM/AA)</label>
              <input name="expiration" placeholder="01/28" value={newCard.expiration} onChange={handleInputChange} required style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label>CVV</label>
              <input name="cvv" placeholder="123" maxLength="3" value={newCard.cvv} onChange={handleInputChange} required style={styles.input} />
            </div>
          </div>

          <button type="submit" style={styles.btn}>Guardar Tarjeta</button>
        </form>
      </div>
    </div>
  );
};

export default Wallet;