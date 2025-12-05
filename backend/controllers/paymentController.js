import PaymentMethod from '../models/PaymentMethodModel.js';

// Agregar nueva tarjeta
export const addCard = async (req, res) => {
    try {
        const { card_holder, card_number, expiration_date, cvv, userId } = req.body;
        
        const newCard = await PaymentMethod.create({
            card_holder,
            card_number, // Podrías guardar solo los últimos 4 dígitos si prefieres seguridad
            expiration_date,
            cvv,
            userId
        });

        res.status(201).json({ message: "Tarjeta guardada correctamente", card: newCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener tarjetas de un usuario
export const getUserCards = async (req, res) => {
    try {
        const { userId } = req.params;
        const cards = await PaymentMethod.findAll({ where: { userId } });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};