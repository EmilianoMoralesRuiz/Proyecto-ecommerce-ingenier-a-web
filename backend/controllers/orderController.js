import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';
import Product from '../models/ProductModel.js';

export const createOrder = async (req, res) => {
    try {
        const { total_amount, shipping_address, userId, items, status } = req.body;

        for (const item of items) {
            const product = await Product.findByPk(item.id);
            if (!product) return res.status(404).json({ message: `Producto ID ${item.id} no encontrado` });
            if (product.stock < item.quantity) return res.status(400).json({ message: `Stock insuficiente: ${product.name}` });
        }

        const newOrder = await Order.create({
            total_amount,
            shipping_address,
            userId, 
            status: status || 'pending' // Por defecto pendiente si no se especifica
        });

        if (items && items.length > 0) {
            const itemsToSave = items.map(item => ({
                OrderId: newOrder.id,
                ProductId: item.id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));
            
            await OrderItem.bulkCreate(itemsToSave);

            for (const item of items) {
                const product = await Product.findByPk(item.id);
                if (product) {
                    await product.update({ stock: product.stock - item.quantity });
                }
            }
        }

        res.status(201).json({ message: "Orden creada exitosamente", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { role, id } = req.user;
        let orders;

        const queryOptions = {
            include: [{ model: OrderItem, include: [Product] }],
            order: [['createdAt', 'DESC']]
        };

        if (role === 'admin' || role === 'operator') {
            orders = await Order.findAll(queryOptions);
        } else {
            orders = await Order.findAll({ where: { userId: id }, ...queryOptions });
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Order.update({ status }, { where: { id } });
        res.json({ message: "Estatus actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSalesReport = async (req, res) => {
    try {
        const orders = await Order.findAll({ include: [{ model: OrderItem, include: [Product] }] });
        let totalSales = 0;
        let productMap = {};

        orders.forEach(order => {
            totalSales += parseFloat(order.total_amount);
            if (order.OrderItems) {
                order.OrderItems.forEach(item => {
                    const prodName = item.Product ? item.Product.name : 'Producto Eliminado';
                    const qty = item.quantity;
                    productMap[prodName] = (productMap[prodName] || 0) + qty;
                });
            }
        });

        let bestSeller = { name: 'N/A', qty: 0 };
        Object.entries(productMap).forEach(([name, qty]) => {
            if (qty > bestSeller.qty) bestSeller = { name, qty };
        });

        res.json({ totalOrders: orders.length, totalSales, bestSeller });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NUEVA FUNCIÓN: ELIMINAR PEDIDO
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // Al borrar la orden, se borran los items en cascada si la BD está configurada,
        // o Sequelize lo intenta manejar.
        await Order.destroy({ where: { id } });
        res.json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};