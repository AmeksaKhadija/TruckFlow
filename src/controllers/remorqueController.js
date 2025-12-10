import Remorque from '../models/remorqueModel.js';

export const getAllRemorques = async (req, res) => {
    try {
        const remorques = await Remorque.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: remorques.length, data: remorques });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRemorqueById = async (req, res) => {
    try {
        const remorque = await Remorque.findById(req.params.id);
        if (!remorque) return res.status(404).json({ success: false, message: 'Remorque non trouvée' });
        res.status(200).json({ success: true, data: remorque });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createRemorque = async (req, res) => {
    try {
        const { matricule, marque, modele, capaciteCharge, anneeFabrication, type, remarques } = req.body;
        if (!matricule || !marque || !modele || !capaciteCharge || !anneeFabrication) {
            return res.status(400).json({ success: false, message: 'Tous les champs requis doivent être remplis' });
        }
        const exists = await Remorque.findOne({ matricule: matricule.toUpperCase() });
        if (exists) return res.status(400).json({ success: false, message: 'Ce matricule existe déjà' });

        const remorque = await Remorque.create({
            matricule,
            marque,
            modele,
            capaciteCharge,
            anneeFabrication,
            type: type || 'fourgon',
            remarques,
        });

        res.status(201).json({ success: true, message: 'Remorque créée avec succès', data: remorque });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRemorque = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.matricule) {
            const exists = await Remorque.findOne({
                matricule: updateData.matricule.toUpperCase(),
                _id: { $ne: id },
            });
            if (exists) return res.status(400).json({ success: false, message: 'Ce matricule existe déjà' });
        }

        const remorque = await Remorque.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!remorque) return res.status(404).json({ success: false, message: 'Remorque non trouvée' });

        res.status(200).json({ success: true, message: 'Remorque modifiée avec succès', data: remorque });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRemorque = async (req, res) => {
    try {
        const remorque = await Remorque.findByIdAndDelete(req.params.id);
        if (!remorque) return res.status(404).json({ success: false, message: 'Remorque non trouvée' });
        res.status(200).json({ success: true, message: 'Remorque supprimée avec succès', data: remorque });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRemorquesActives = async (req, res) => {
    try {
        const remorques = await Remorque.find({ estActif: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: remorques.length, data: remorques });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateKilometrageRemorque = async (req, res) => {
    try {
        const { kilometrage } = req.body;
        if (kilometrage === undefined || kilometrage < 0) {
            return res.status(400).json({ success: false, message: 'Kilométrage invalide' });
        }
        const remorque = await Remorque.findByIdAndUpdate(
            req.params.id,
            { kilometrage },
            { new: true, runValidators: true }
        );
        if (!remorque) return res.status(404).json({ success: false, message: 'Remorque non trouvée' });

        res.status(200).json({ success: true, message: 'Kilométrage mis à jour', data: remorque });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};