import express from 'express';
import { createOrder, getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);           // Crear orden
router.get('/:userId', getUserOrders);   // Ver historial de usuario

export default router;