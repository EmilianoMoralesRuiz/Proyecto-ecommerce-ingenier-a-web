import React, { useState, useEffect } from 'react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  
  const styles = {
    container: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    th: { backgroundColor: '#343a40', color: 'white', padding: '15px', textAlign: 'left' },
    td: { padding: '15px', borderBottom: '1px solid #eee', backgroundColor: 'white' },
    badge: (role) => ({
      padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white',
      backgroundColor: role === 'admin' ? '#dc3545' : role === 'operator' ? '#d63384' : '#28a745'
    }),
    btn: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    // Nota: Necesitas haber configurado la ruta en el backend (/api/users) previamente
    try {
        const res = await fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(await res.json());
        }
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setUsers(users.filter(u => u.id !== id));
      alert('Usuario eliminado');
    }
  };

  return (
    <div style={styles.container}>
      <h1>👥 Gestión de Usuarios</h1>
      <table style={styles.table}>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.name} <br/><small>{u.email}</small></td>
              <td style={styles.td}><span style={styles.badge(u.role)}>{u.role}</span></td>
              <td style={styles.td}>
                {u.role !== 'admin' && <button onClick={() => handleDelete(u.id)} style={styles.btn}>Borrar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;