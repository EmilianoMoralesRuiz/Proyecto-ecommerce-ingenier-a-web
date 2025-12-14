import { useState } from 'react';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('https://mobistore-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (response.ok) {
      alert('Registro exitoso');
    } else {
      alert('Error: ' + data.message);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nombre" onChange={(e) => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Contraseña" onChange={(e) => setForm({...form, password: e.target.value})} required />
        <select onChange={(e) => setForm({...form, role: e.target.value})}>
          <option value="client">Cliente</option>
          <option value="operator">Operador</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;