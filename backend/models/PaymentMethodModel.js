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
        // NOTA: En la vida real, NUNCA guardes el número completo.
        // Aquí lo haremos por ser un proyecto académico.
    },
    expiration_date: {
        type: DataTypes.STRING, // Formato "MM/YY"
        allowNull: false
    },
    cvv: {
        type: DataTypes.STRING,
        allowNull: false
    }
    // userId se agregará automáticamente con la relación
}, {
    timestamps: true
});

export default PaymentMethod;