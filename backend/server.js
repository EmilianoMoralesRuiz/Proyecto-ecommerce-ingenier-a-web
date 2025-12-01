import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import User from './models/UserModel.js';
import Product from './models/ProductModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

const conectarDB = async () => {
    try {
        await db.authenticate();
        console.log('Conexión exitosa a la base de datos MySQL');
        
        await db.sync(); 
        console.log('Tablas sincronizadas correctamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

conectarDB();

app.get('/', (req, res) => {
    res.send('API del e-commerce funcionando...');
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
