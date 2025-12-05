import express from 'express';
import { addCard, getUserCards } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', addCard);           // Guardar tarjeta
router.get('/:userId', getUserCards); // Ver mis tarjetas

export default router;