import Order from '../models/OrderModel.js';


export const createOrder = async (req, res) => {
    try {
        const { total_amount, shipping_address, userId } = req.body;

        const newOrder = await Order.create({
            total_amount,
            shipping_address,
            userId, 
            status: 'paid' 
        });

        res.status(201).json({ message: "Orden creada exitosamente", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.findAll({ where: { userId } });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};