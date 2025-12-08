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

export const getOrders = async (req, res) => {
    try {
        // Obtenemos el rol y el id del usuario desde el token (req.user)
        const { role, id } = req.user;
        let orders;

        if (role === 'admin' || role === 'operator') {
            // Si es admin u operador, trae TODO
            orders = await Order.findAll();
        } else {
            // Si es cliente, trae solo SUS órdenes
            orders = await Order.findAll({ where: { userId: id } });
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