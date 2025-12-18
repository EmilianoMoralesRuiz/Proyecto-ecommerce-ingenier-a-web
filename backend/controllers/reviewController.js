import Review from '../models/ReviewModel.js';
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';

// Guardar una nueva reseña
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // Viene del token

    // Validaciones básicas
    if (!productId || !rating) {
      return res.status(400).json({ message: "Faltan datos obligatorios (productId, rating)." });
    }

    const orderWithProduct = await Order.findOne({
      where: { userId },
      include: [
        {
          model: OrderItem,
          required: true,
          where: { ProductId: productId } // 👈 importante: en OrderItem es ProductId
        }
      ],
    });

    if (!orderWithProduct) {
      return res.status(403).json({
        message: "Solo puedes dejar reseña si compraste este producto."
      });
    }

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

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId },
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
