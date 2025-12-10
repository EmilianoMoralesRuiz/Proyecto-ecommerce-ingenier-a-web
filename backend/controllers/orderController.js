import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';
import Product from '../models/ProductModel.js';

// Crear orden (Con detalle de productos)
export const createOrder = async (req, res) => {
    try {
        // Recibimos 'items' del carrito (array de productos)
        const { total_amount, shipping_address, userId, items, status } = req.body;

        // 1. Crear la Orden General
        const newOrder = await Order.create({
            total_amount,
            shipping_address,
            userId, 
            status: status || 'paid'
        });

        // 2. Guardar los detalles (OrderItems) si hay items
        if (items && items.length > 0) {
            const itemsToSave = items.map(item => ({
                OrderId: newOrder.id,
                ProductId: item.id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));
            
            await OrderItem.bulkCreate(itemsToSave);
        }

        res.status(201).json({ message: "Orden creada exitosamente", order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Obtener órdenes (Para historial y panel operador)
export const getOrders = async (req, res) => {
    try {
        const { role, id } = req.user;
        let orders;

        // Opciones de búsqueda: Incluir los productos comprados para ver detalle
        const queryOptions = {
            include: [
                { 
                    model: OrderItem,
                    include: [Product] // Para ver el nombre del producto
                }
            ],
            order: [['createdAt', 'DESC']] // Las más recientes primero
        };

        if (role === 'admin' || role === 'operator') {
            orders = await Order.findAll(queryOptions);
        } else {
            orders = await Order.findAll({ 
                where: { userId: id },
                ...queryOptions
            });
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

// --- NUEVO: REPORTE DE VENTAS PARA ADMIN ---
export const getSalesReport = async (req, res) => {
    try {
        // Traemos todas las órdenes con sus items
        const orders = await Order.findAll({
            include: [{ model: OrderItem, include: [Product] }]
        });

        let totalSales = 0;
        let productMap = {}; // Para contar qué producto se vende más

        orders.forEach(order => {
            // Sumar al total general
            totalSales += parseFloat(order.total_amount);

            // Contar productos
            if (order.OrderItems) {
                order.OrderItems.forEach(item => {
                    const prodName = item.Product ? item.Product.name : 'Producto Eliminado';
                    const qty = item.quantity;

                    if (productMap[prodName]) {
                        productMap[prodName] += qty;
                    } else {
                        productMap[prodName] = qty;
                    }
                });
            }
        });

        // Encontrar el producto más vendido
        let bestSeller = { name: 'N/A', qty: 0 };
        Object.entries(productMap).forEach(([name, qty]) => {
            if (qty > bestSeller.qty) {
                bestSeller = { name, qty };
            }
        });

        res.json({
            totalOrders: orders.length,
            totalSales: totalSales, // Formato moneda lo hacemos en frontend
            bestSeller: bestSeller
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};