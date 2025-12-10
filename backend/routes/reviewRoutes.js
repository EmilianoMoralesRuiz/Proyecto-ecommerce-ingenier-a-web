import express from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Publico: Cualquiera puede leer reseñas
router.get('/:productId', getProductReviews);

// Privado: Solo usuarios logueados pueden opinar
router.post('/', verifyToken, createReview);

export default router;