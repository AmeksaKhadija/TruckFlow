import RegleMaintenance from '../models/regleMaintenanceModel.js';

export const getAllRegles = async (req, res) => {
    try {
        const regles = await RegleMaintenance.find().sort({ categorieVehicule: 1, typeEntretien: 1 });
        res.status(200).json({
            success: true,
            count: regles.length,
            data: regles,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRegleById = async (req, res) => {
    try {
        const regle = await RegleMaintenance.findById(req.params.id);
        if (!regle) {
            return res.status(404).json({ success: false, message: 'Règle non trouvée' });
        }
        res.status(200).json({ success: true, data: regle });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createRegle = async (req, res) => {
    try {
        const { typeEntretien, categorieVehicule } = req.body;

        // Vérifier si une règle existe déjà pour ce couple (type, catégorie)
        const existingRegle = await RegleMaintenance.findOne({ typeEntretien, categorieVehicule });
        if (existingRegle) {
            return res.status(400).json({
                success: false,
                message: `Une règle pour ${typeEntretien} sur ${categorieVehicule} existe déjà.`,
            });
        }

        const newRegle = await RegleMaintenance.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Règle de maintenance créée avec succès',
            data: newRegle,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRegle = async (req, res) => {
    try {
        const regle = await RegleMaintenance.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!regle) {
            return res.status(404).json({ success: false, message: 'Règle non trouvée' });
        }

        res.status(200).json({
            success: true,
            message: 'Règle mise à jour',
            data: regle,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRegle = async (req, res) => {
    try {
        const regle = await RegleMaintenance.findByIdAndDelete(req.params.id);
        if (!regle) {
            return res.status(404).json({ success: false, message: 'Règle non trouvée' });
        }
        res.status(200).json({ success: true, message: 'Règle supprimée' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};