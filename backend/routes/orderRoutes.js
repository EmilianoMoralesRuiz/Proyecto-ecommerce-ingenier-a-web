import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken } from '../controllers/authController.js'; 

const router = express.Router();

// Crear orden
router.post('/', verifyToken, createOrder);

// Obtener órdenes (sirve para Cliente y Operador gracias a la lógica del controlador)
router.get('/', verifyToken, getOrders);

// Actualizar estatus (solo operadores/admin deberían poder, pero validamos en frontend por ahora)
router.put('/:id', verifyToken, updateOrderStatus);

export default router;