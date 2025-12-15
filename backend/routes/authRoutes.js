import express from 'express';
import { register, login, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); // Nueva ruta para Google

export default router;