import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Product from './ProductModel.js';
import User from './UserModel.js';

const Review = db.define('Review', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5 
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true 
    }
}, {
    timestamps: true 
});


User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

export default Review;