import express from 'express';
import { createOrder, getOrders, updateOrderStatus, getSalesReport, deleteOrder } from '../controllers/orderController.js';
import { verifyToken } from '../controllers/authController.js'; 

const router = express.Router();

router.get('/report', verifyToken, getSalesReport);
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getOrders);
router.put('/:id', verifyToken, updateOrderStatus);
// RUTA NUEVA
router.delete('/:id', verifyToken, deleteOrder);

export default router;