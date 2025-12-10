import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Order from './OrderModel.js';
import Product from './ProductModel.js';

const OrderItem = db.define('OrderItem', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_at_purchase: { // Guardamos el precio al momento de compra por si cambia después
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false
});

// Relaciones
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

export default OrderItem;