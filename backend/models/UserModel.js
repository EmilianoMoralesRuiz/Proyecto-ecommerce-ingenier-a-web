import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import Order from './OrderModel.js'; // <--- CORRECCIÓN CLAVE: Importamos Order
import PaymentMethod from './PaymentMethodModel.js';
const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'client', 'operator'),
        defaultValue: 'client'
    }
}, {
    timestamps: true,
    hooks: {
        // Encriptación de contraseña antes de crear el usuario
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

// Definición de las Relaciones (Debe ir después de definir User)
// Un Usuario (Cliente) puede tener muchos Pedidos.
User.hasMany(Order, { foreignKey: 'userId' }); 
Order.belongsTo(User, { foreignKey: 'userId' });


// NUEVA RELACIÓN: Métodos de Pago
User.hasMany(PaymentMethod, { foreignKey: 'userId' });
PaymentMethod.belongsTo(User, { foreignKey: 'userId' });

export default User;