import express from 'express';
import { addCard, getUserCards, deleteCard } from '../controllers/paymentController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/', verifyToken, addCard);
router.get('/', verifyToken, getUserCards);
router.delete('/:id', verifyToken, deleteCard);

export default router;
