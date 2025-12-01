import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error:', error))
  }, [])

  return (
    <div className="App">
      <h1>MobiStore 📱</h1>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', width: '250px' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h3>Price: ${product.price}</h3>
            <p>Stock: {product.stock}</p>
            <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none', borderRadius: '5px' }}>
              Añadir al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
