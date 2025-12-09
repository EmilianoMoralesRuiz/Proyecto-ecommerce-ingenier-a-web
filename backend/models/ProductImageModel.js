import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Product from './ProductModel.js';

const ProductImage = db.define('ProductImage', {
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false 
});


Product.hasMany(ProductImage, { 
    foreignKey: 'productId',
    onDelete: 'CASCADE' 
});


ProductImage.belongsTo(Product, {
    foreignKey: 'productId'
});

export default ProductImage;