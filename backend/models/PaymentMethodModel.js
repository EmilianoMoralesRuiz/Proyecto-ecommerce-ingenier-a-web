import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const PaymentMethod = db.define('PaymentMethod', {
    card_holder: {
        type: DataTypes.STRING,
        allowNull: false
    },
    card_number: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    expiration_date: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    cvv: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: true
});

export default PaymentMethod;