import User from '../models/userModel.js';

export const getAllChauffeurs = async (req, res) => {
    try {
        const chauffeurs = await User.find({ role: 'chauffeur' }).select('-password'); // On exclut le mot de passe
        res.status(200).json({
            success: true,
            count: chauffeurs.length,
            data: chauffeurs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ success: true, message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};