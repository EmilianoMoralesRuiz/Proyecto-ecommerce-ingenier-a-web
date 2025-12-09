import PaymentMethod from '../models/PaymentMethodModel.js';

export const addCard = async (req, res) => {
    try {
        const { card_holder, card_number, expiration_date, cvv, userId } = req.body;
        
        const newCard = await PaymentMethod.create({
            card_holder,
            card_number, 
            expiration_date,
            cvv,
            userId
        });

        res.status(201).json({ message: "Tarjeta guardada correctamente", card: newCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserCards = async (req, res) => {
    try {
        // CORRECCIÓN: Usamos req.user.id (del token) en lugar de req.params
        const userId = req.user.id; 
        
        const cards = await PaymentMethod.findAll({ where: { userId } });
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};