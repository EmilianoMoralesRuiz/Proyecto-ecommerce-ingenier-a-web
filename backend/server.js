import express from 'express';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API del e-commerce de iPhones está funcionando...');
});

app.post('/api/products', async (req, res) => {
  try { 
    const { name, price, description, stock } = req.body;

    const [result] = await pool.query(
      'INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)',
      [name, price, description, stock]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      price,
      description,
      stock,
    });
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));
