import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const User = db.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'client', 'operator'), defaultValue: 'client' }
}, { timestamps: true });

export default User;
