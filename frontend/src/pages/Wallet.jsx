import { useState, useEffect } from 'react';

function Wallet() {
    const [cards, setCards] = useState([]);
    const [form, setForm] = useState({
        card_holder: '',
        card_number: '',
        expiration_date: '',
        cvv: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) fetchCards();
    }, []);

    const fetchCards = () => {
        fetch(`http://localhost:5000/api/payments/${user.id}`)
            .then(res => res.json())
            .then(data => setCards(data))
            .catch(error => console.error(error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        fetch('http://localhost:5000/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, userId: user.id })
        })
        .then(res => res.json())
        .then(data => {
            alert('Tarjeta agregada');
            setForm({ card_holder: '', card_number: '', expiration_date: '', cvv: '' });
            fetchCards();
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>💳 Mi Billetera</h1>

            {/* Formulario de Agregar Tarjeta */}
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '30px', backgroundColor: 'white' }}>
                <h3>Agregar Nueva Tarjeta</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="card_holder" placeholder="Nombre del Titular" value={form.card_holder} onChange={handleChange} required style={{ padding: '10px' }}/>
                    <input type="text" name="card_number" placeholder="Número de Tarjeta (16 dígitos)" maxLength="16" value={form.card_number} onChange={handleChange} required style={{ padding: '10px' }}/>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="expiration_date" placeholder="MM/YY" maxLength="5" value={form.expiration_date} onChange={handleChange} required style={{ flex: 1, padding: '10px' }}/>
                        <input type="text" name="cvv" placeholder="CVV" maxLength="3" value={form.cvv} onChange={handleChange} required style={{ flex: 1, padding: '10px' }}/>
                    </div>
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Guardar Tarjeta
                    </button>
                </form>
            </div>

            {/* Lista de Tarjetas */}
            <h3>Mis Tarjetas Guardadas</h3>
            {cards.length === 0 ? <p>No tienes tarjetas guardadas.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cards.map(card => (
                        <div key={card.id} style={{ padding: '15px', background: 'linear-gradient(45deg, #333, #555)', color: 'white', borderRadius: '10px' }}>
                            <p style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>**** **** **** {card.card_number.slice(-4)}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <span>{card.card_holder.toUpperCase()}</span>
                                <span>Exp: {card.expiration_date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wallet;