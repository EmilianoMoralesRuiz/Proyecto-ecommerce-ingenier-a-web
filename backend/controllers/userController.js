import User from '../models/UserModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } 
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToDelete = await User.findByPk(id);
        
        if (!userToDelete) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const requesterEmail = req.user.email; 
        const isMaster = requesterEmail === 'admin@gmail.com';

        if (req.user.id === userToDelete.id) {
            return res.status(400).json({ message: "No puedes eliminar tu propia cuenta" });
        }

        if (userToDelete.email === 'admin@gmail.com') {
            return res.status(403).json({ message: "No puedes eliminar al Administrador Maestro" });
        }

        if (userToDelete.role === 'admin' && !isMaster) {
            return res.status(403).json({ message: "Solo el Administrador Maestro puede eliminar a otros administradores" });
        }

        await userToDelete.destroy();
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};