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
    return (req, res, next) => {  // ✅ DOIT retourner cette fonction
        if (!req.user) {
            return res.status(401).json({ message: 'Non authentifié' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès refusé' });
        }
        next();  // ✅ DOIT appeler next()
    };
};


export const validate = (schema) => {
    console.log('✅ validate() a été appelé avec le schéma:', schema !== undefined);

    return (req, res, next) => {
        console.log('✅ Middleware de validation exécuté');
        console.log('📝 Body reçu:', req.body);

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            console.log('❌ Erreurs de validation:', errors);
            return res.status(400).json({
                success: false,
                message: 'Validation échouée',
                errors,
            });
        }

        console.log('✅ Validation réussie, appel de next()');
        next();
    };
};