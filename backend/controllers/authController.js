import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client("872890595089-bso70jjfsmnoo0um8r4bqmuu2pmv353s.apps.googleusercontent.com");

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'client'
        });

        res.status(201).json({ message: "Usuario creado exitosamente", userId: user.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

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

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "872890595089-bso70jjfsmnoo0um8r4bqmuu2pmv353s.apps.googleusercontent.com",
        });

        const { name, email } = ticket.getPayload();

        let user = await User.findOne({ where: { email } });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name: name,
                email: email,
                password: randomPassword,
                role: 'client'
            });
        }

        const tokenJWT = jwt.sign(
            { id: user.id, role: user.role }, 
            'secreto_super_seguro', 
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login con Google exitoso",
            token: tokenJWT,
            user: { id: user.id, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al autenticar con Google" });
    }
};

export const verifyToken = (req, res, next) => {
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        const token = tokenHeader.startsWith("Bearer ") 
            ? tokenHeader.slice(7, tokenHeader.length).trimLeft() 
            : tokenHeader;

        const verified = jwt.verify(token, 'secreto_super_seguro');

        req.user = verified;
        
        next(); 
    } catch (error) {
        res.status(400).json({ message: "Token no válido o expirado." });
    }
};