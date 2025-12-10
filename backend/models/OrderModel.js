import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Order = db.define('Order', {
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    shipping_address: { 
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

export default Order;