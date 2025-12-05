import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. REGISTRO
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Crear usuario (el modelo encriptará el password solo)
        const user = await User.create({
            name,
            email,
            password,
            role // (admin, client, operator)
        });

        res.status(201).json({ message: "Usuario creado exitosamente", userId: user.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2. LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar si existe el email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseñas (la que escribió vs la encriptada)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Crear el Token (Pase de acceso)
        const token = jwt.sign({ id: user.id, role: user.role }, 'secreto_super_seguro', {
            expiresIn: '1h'
        });

        res.json({ 
            message: "Login exitoso", 
            token, 
            user: { id: user.id, name: user.name, role: user.role } 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};