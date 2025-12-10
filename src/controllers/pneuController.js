import Pneu from '../models/pneuModel.js';
import Camion from '../models/camionModel.js';
import Remorque from '../models/remorqueModel.js';

export const getAllPneus = async (req, res) => {
    try {
        const pneus = await Pneu.find()
            .populate('vehiculeId', 'matricule marque modele')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pneus.length,
            data: pneus,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPneuById = async (req, res) => {
    try {
        const pneu = await Pneu.findById(req.params.id)
            .populate('vehiculeId', 'matricule marque modele kilometrage');

        if (!pneu) {
            return res.status(404).json({
                success: false,
                message: 'Pneu non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            data: pneu,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/pneus - Créer un nouveau pneu
export const createPneu = async (req, res) => {
    try {
        const {
            reference,
            typeVehicule,
            vehiculeId,
            position,
            etat,
            usurePourcentage,
            dateInstallation,
            kilometrageInstallation,
            marque,
            modele,
            dimension,
            pression,
            remarques,
        } = req.body;

        // Validation des champs requis
        if (!reference || !typeVehicule || !vehiculeId || !position || !kilometrageInstallation) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs requis doivent être remplis',
            });
        }

        // ✅ Vérifier le type de véhicule
        if (!['Camion', 'Remorque'].includes(typeVehicule)) {
            return res.status(400).json({
                success: false,
                message: 'Type de véhicule invalide (Camion ou Remorque)',
            });
        }

        // Vérifier que le véhicule existe
        let vehicule;
        if (typeVehicule === 'Camion') {
            vehicule = await Camion.findById(vehiculeId);
        } else if (typeVehicule === 'Remorque') {
            vehicule = await Remorque.findById(vehiculeId);
        }

        if (!vehicule) {
            return res.status(404).json({
                success: false,
                message: `${typeVehicule} non trouvé`,
            });
        }

        // Vérifier si la référence existe déjà
        const existingPneu = await Pneu.findOne({ reference: reference.toUpperCase() });
        if (existingPneu) {
            return res.status(400).json({
                success: false,
                message: 'Cette référence de pneu existe déjà',
            });
        }

        // Vérifier si cette position est déjà occupée sur ce véhicule
        const existingPosition = await Pneu.findOne({
            typeVehicule,
            vehiculeId,
            position,
        });

        if (existingPosition) {
            return res.status(400).json({
                success: false,
                message: `Un pneu existe déjà à la position ${position} sur ce véhicule`,
            });
        }

        const newPneu = await Pneu.create({
            reference,
            typeVehicule,
            vehiculeId,
            position,
            etat: etat || 'neuf',
            usurePourcentage: usurePourcentage || 0,
            dateInstallation: dateInstallation || Date.now(),
            kilometrageInstallation,
            marque,
            modele,
            dimension,
            pression,
            remarques,
        });

        const populatedPneu = await Pneu.findById(newPneu._id)
            .populate('vehiculeId', 'matricule marque modele');

        res.status(201).json({
            success: true,
            message: 'Pneu créé avec succès',
            data: populatedPneu,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/pneus/vehicule/:typeVehicule/:vehiculeId - Obtenir pneus par véhicule
export const getPneusByVehicule = async (req, res) => {
    try {
        const { typeVehicule, vehiculeId } = req.params;

        // ✅ Vérifier le type de véhicule avec majuscules
        if (!['Camion', 'Remorque'].includes(typeVehicule)) {
            return res.status(400).json({
                success: false,
                message: 'Type de véhicule invalide (Camion ou Remorque)',
            });
        }

        const pneus = await Pneu.find({ typeVehicule, vehiculeId })
            .populate('vehiculeId', 'matricule marque modele')
            .sort({ position: 1 });

        res.status(200).json({
            success: true,
            count: pneus.length,
            data: pneus,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePneu = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Vérifier si la référence est modifiée et existe déjà
        if (updateData.reference) {
            const existingPneu = await Pneu.findOne({
                reference: updateData.reference.toUpperCase(),
                _id: { $ne: id },
            });
            if (existingPneu) {
                return res.status(400).json({
                    success: false,
                    message: 'Cette référence de pneu existe déjà',
                });
            }
        }

        // Vérifier si la position est modifiée et est déjà occupée
        if (updateData.position || updateData.vehiculeId) {
            const currentPneu = await Pneu.findById(id);
            const newPosition = updateData.position || currentPneu.position;
            const newVehiculeId = updateData.vehiculeId || currentPneu.vehiculeId;

            const existingPosition = await Pneu.findOne({
                vehiculeId: newVehiculeId,
                position: newPosition,
                _id: { $ne: id },
            });

            if (existingPosition) {
                return res.status(400).json({
                    success: false,
                    message: `Un pneu existe déjà à la position ${newPosition} sur ce véhicule`,
                });
            }
        }

        const pneu = await Pneu.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate('vehiculeId', 'matricule marque modele');

        if (!pneu) {
            return res.status(404).json({
                success: false,
                message: 'Pneu non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pneu modifié avec succès',
            data: pneu,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUsure = async (req, res) => {
    try {
        const { usurePourcentage } = req.body;

        if (usurePourcentage === undefined || usurePourcentage < 0 || usurePourcentage > 100) {
            return res.status(400).json({
                success: false,
                message: 'Usure invalide (doit être entre 0 et 100)',
            });
        }

        // Déterminer l'état en fonction de l'usure
        let etat = 'neuf';
        if (usurePourcentage > 0 && usurePourcentage <= 25) etat = 'bon';
        else if (usurePourcentage > 25 && usurePourcentage <= 50) etat = 'moyen';
        else if (usurePourcentage > 50 && usurePourcentage <= 75) etat = 'usé';
        else if (usurePourcentage > 75) etat = 'à_remplacer';

        const pneu = await Pneu.findByIdAndUpdate(
            req.params.id,
            { usurePourcentage, etat },
            { new: true, runValidators: true }
        ).populate('vehiculeId', 'matricule marque modele');

        if (!pneu) {
            return res.status(404).json({
                success: false,
                message: 'Pneu non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usure mise à jour',
            data: pneu,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deletePneu = async (req, res) => {
    try {
        const pneu = await Pneu.findByIdAndDelete(req.params.id);

        if (!pneu) {
            return res.status(404).json({
                success: false,
                message: 'Pneu non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Pneu supprimé avec succès',
            data: pneu,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUsureStats = async (req, res) => {
    try {
        const stats = await Pneu.aggregate([
            {
                $group: {
                    _id: '$etat',
                    count: { $sum: 1 },
                    avgUsure: { $avg: '$usurePourcentage' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const total = await Pneu.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                total,
                parEtat: stats,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};