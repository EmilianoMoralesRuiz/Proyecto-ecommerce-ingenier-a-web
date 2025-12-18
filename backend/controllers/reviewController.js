import Review from '../models/ReviewModel.js';
import User from '../models/UserModel.js';
import Order from '../models/OrderModel.js';
import OrderItem from '../models/OrderItemModel.js';

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // Viene del token

    // 1) Validación: solo reseñar si compró y está ENTREGADO
    const deliveredPurchase = await Order.findOne({
      where: { userId, status: 'delivered' },
      include: [
        {
          model: OrderItem,
          where: { ProductId: productId },
          required: true
        }
      ]
    });

    if (!deliveredPurchase) {
      return res.status(403).json({
        message: 'Solo puedes reseñar este producto cuando tu pedido esté marcado como ENTREGADO.'
      });
    }

    // 2) Evitar reseñas duplicadas del mismo usuario al mismo producto
    const existingReview = await Review.findOne({ where: { productId, userId } });
    if (existingReview) {
      return res.status(400).json({ message: "Ya has calificado este producto anteriormente." });
    }

    // 3) Crear reseña
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
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

