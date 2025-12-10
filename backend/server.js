import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Rutas
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Modelos (Importamos para asegurar que Sequelize registre las relaciones antes de sincronizar)
import './models/UserModel.js';
import './models/ProductModel.js';
import './models/OrderModel.js';
import './models/OrderItemModel.js';
import './models/PaymentMethodModel.js';
import './models/ProductImageModel.js';
import './models/ReviewModel.js';
import './models/AddressModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Definición de Rutas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

const conectarDB = async () => {
    try {
        await db.authenticate();
        console.log('Conexión exitosa a la base de datos MySQL');
        
        // alter: true actualiza la estructura de las tablas existentes y crea las nuevas
        await db.sync({ alter: true }); 
        console.log('Tablas y Modelos sincronizados correctamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

conectarDB();

app.get('/', (req, res) => {
    res.send('API del e-commerce funcionando...');
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));