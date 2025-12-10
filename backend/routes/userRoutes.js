import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Acceso denegado. Solo administradores." });
    }
};

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

export default router;