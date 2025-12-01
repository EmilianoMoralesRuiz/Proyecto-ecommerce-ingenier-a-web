import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Product = db.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    category: { type: DataTypes.STRING, allowNull: false },
    delivery_days: { type: DataTypes.INTEGER, defaultValue: 3 }
}, { timestamps: true });

export default Product;
