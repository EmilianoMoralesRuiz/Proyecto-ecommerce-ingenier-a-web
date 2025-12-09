import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import User from './UserModel.js';

const Address = db.define('Address', {
    street: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    exterior_number: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    interior_number: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    neighborhood: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    zip_code: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    municipality: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    city: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    country: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'México' 
    }
}, {
    timestamps: true
});


User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });

export default Address;