import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware de vérification JWT
export const protect = async (req, res, next) => {
    try {
        let token;

        // Récupérer le token du header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Vérifier qu'il y a un token
        if (!token) {
            return res.status(401).json({ message: 'Pas de token fourni' });
        }

        try {
            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware de vérification du rôle
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Accès non autorisé pour ce rôle',
            });
        }
        next();
    };
};