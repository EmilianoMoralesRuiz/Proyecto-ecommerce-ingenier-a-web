import express from 'express';
import { addCard, getUserCards } from '../controllers/paymentController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/', verifyToken, addCard);
router.get('/', verifyToken, getUserCards);

export default router;