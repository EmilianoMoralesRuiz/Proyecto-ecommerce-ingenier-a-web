import Review from '../models/ReviewModel.js';
import User from '../models/UserModel.js';

// Guardar una nueva reseña
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id; // Viene del token

        // Verificamos si ya opinó sobre este producto (Opcional, para evitar spam)
        const existingReview = await Review.findOne({ where: { productId, userId } });
        if (existingReview) {
            return res.status(400).json({ message: "Ya has calificado este producto anteriormente." });
        }

        const newReview = await Review.create({
            userId,
            productId,
            rating,
            comment
        });

        res.status(201).json({ message: "Reseña guardada", review: newReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener reseñas de un producto específico
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.findAll({
            where: { productId },
            include: [{ model: User, attributes: ['name'] }], // Incluimos el nombre del usuario
            order: [['createdAt', 'DESC']] // Las más recientes primero
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};