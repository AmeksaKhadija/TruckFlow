import Camion from '../models/camionModel.js';

// @desc    Obtenir tous les camions
// @route   GET /api/camions
// @access  Private/Admin
export const getAllCamions = async (req, res) => {
    try {
        const camions = await Camion.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: camions.length,
            data: camions,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir un camion par ID
// @route   GET /api/camions/:id
// @access  Private/Admin
export const getCamionById = async (req, res) => {
    try {
        const camion = await Camion.findById(req.params.id);

        if (!camion) {
            return res.status(404).json({
                success: false,
                message: 'Camion non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            data: camion,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Créer un nouveau camion
// @route   POST /api/camions
// @access  Private/Admin
export const createCamion = async (req, res) => {
    try {
        const {
            matricule,
            marque,
            modele,
            capaciteCharge,
            anneeFabrication,
            etatGeneral,
            remarques,
        } = req.body;

        // Vérifier les champs requis
        if (!matricule || !marque || !modele || !capaciteCharge || !anneeFabrication) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs requis doivent être remplis',
            });
        }

        // Vérifier si le matricule existe déjà
        const existingCamion = await Camion.findOne({ matricule: matricule.toUpperCase() });
        if (existingCamion) {
            return res.status(400).json({
                success: false,
                message: 'Ce matricule existe déjà',
            });
        }

        const newCamion = new Camion({
            matricule,
            marque,
            modele,
            capaciteCharge,
            anneeFabrication,
            etatGeneral: etatGeneral || 'bon',
            remarques,
        });

        await newCamion.save();

        res.status(201).json({
            success: true,
            message: 'Camion créé avec succès',
            data: newCamion,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Modifier un camion
// @route   PUT /api/camions/:id
// @access  Private/Admin
export const updateCamion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Vérifier si le matricule est modifié et s'il existe déjà
        if (updateData.matricule) {
            const existingCamion = await Camion.findOne({
                matricule: updateData.matricule.toUpperCase(),
                _id: { $ne: id },
            });
            if (existingCamion) {
                return res.status(400).json({
                    success: false,
                    message: 'Ce matricule existe déjà',
                });
            }
        }

        const camion = await Camion.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!camion) {
            return res.status(404).json({
                success: false,
                message: 'Camion non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Camion modifié avec succès',
            data: camion,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Supprimer un camion
// @route   DELETE /api/camions/:id
// @access  Private/Admin
export const deleteCamion = async (req, res) => {
    try {
        const camion = await Camion.findByIdAndDelete(req.params.id);

        if (!camion) {
            return res.status(404).json({
                success: false,
                message: 'Camion non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Camion supprimé avec succès',
            data: camion,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Obtenir les camions actifs uniquement
// @route   GET /api/camions/actifs
// @access  Private/Admin
export const getCamionsActifs = async (req, res) => {
    try {
        const camions = await Camion.find({ estActif: true }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: camions.length,
            data: camions,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mettre à jour le kilométrage
// @route   PATCH /api/camions/:id/kilometrage
// @access  Private/Chauffeur
export const updateKilometrage = async (req, res) => {
    try {
        const { kilometrage } = req.body;

        if (!kilometrage || kilometrage < 0) {
            return res.status(400).json({
                success: false,
                message: 'Kilométrage invalide',
            });
        }

        const camion = await Camion.findByIdAndUpdate(
            req.params.id,
            { kilometrage },
            { new: true, runValidators: true }
        );

        if (!camion) {
            return res.status(404).json({
                success: false,
                message: 'Camion non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kilométrage mis à jour',
            data: camion,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};