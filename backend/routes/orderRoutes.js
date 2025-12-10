import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getSalesReport } from '../controllers/orderController.js';
import { verifyToken } from '../controllers/authController.js'; 

const router = express.Router();

// Reporte de Ventas (Ruta nueva)
router.get('/report', verifyToken, getSalesReport);

// Crear orden
router.post('/', verifyToken, createOrder);

// Obtener órdenes
router.get('/', verifyToken, getOrders);

// Actualizar estatus
router.put('/:id', verifyToken, updateOrderStatus);

export default router;