import { Op } from 'sequelize';
import Product from '../models/ProductModel.js';
import ProductImage from '../models/ProductImageModel.js';

export const getProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let whereCondition = {};

        if (search) {
            whereCondition = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const products = await Product.findAll({
            where: whereCondition,
            include: [{ model: ProductImage }]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: ProductImage }]
        });
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, delivery_days, imageUrls } = req.body;

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            delivery_days: delivery_days || 3
        });

        if (imageUrls && imageUrls.length > 0) {
            const imagesData = imageUrls.map(url => ({
                imageUrl: url,
                productId: newProduct.id
            }));
            
            await ProductImage.bulkCreate(imagesData);
        }

        res.status(201).json({ message: "Producto creado exitosamente", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.update(req.body, { where: { id } });
        res.json({ message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.destroy({ where: { id } });
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};