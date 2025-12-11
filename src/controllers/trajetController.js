import Trajet from '../models/trajetModel.js';
import Camion from '../models/camionModel.js';
import Remorque from '../models/remorqueModel.js';
import User from '../models/userModel.js';

// GET /api/trajets
export const getAllTrajets = async (req, res) => {
    try {
        const trajets = await Trajet.find()
            .populate('chauffeurId', 'nom prenom email')
            .populate('camionId', 'matricule marque modele')
            .populate('remorqueId', 'matricule marque modele')
            .sort({ dateDepart: -1 });

        res.status(200).json({ success: true, count: trajets.length, data: trajets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/trajets/:id
export const getTrajetById = async (req, res) => {
    try {
        const trajet = await Trajet.findById(req.params.id)
            .populate('chauffeurId', 'nom prenom email')
            .populate('camionId', 'matricule marque modele kilometrage')
            .populate('remorqueId', 'matricule marque modele');

        if (!trajet) return res.status(404).json({ success: false, message: 'Trajet non trouvé' });

        res.status(200).json({ success: true, data: trajet });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/trajets/chauffeur/:chauffeurId - Obtenir trajets par chauffeur
export const getTrajetsByChauffeur = async (req, res) => {
    try {
        const { chauffeurId } = req.params;

        const trajets = await Trajet.find({ chauffeurId })
            .populate('camionId', 'matricule marque modele')
            .populate('remorqueId', 'matricule marque modele')
            .sort({ dateDepart: -1 });

        res.status(200).json({
            success: true,
            count: trajets.length,
            data: trajets,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/trajets/statut/:statut - Obtenir trajets par statut
export const getTrajetsByStatut = async (req, res) => {
    try {
        const { statut } = req.params;

        if (!['a_faire', 'en_cours', 'termine'].includes(statut)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide (a_faire, en_cours, termine)',
            });
        }

        const trajets = await Trajet.find({ statut })
            .populate('chauffeurId', 'nom prenom email')
            .populate('camionId', 'matricule marque modele')
            .populate('remorqueId', 'matricule marque modele')
            .sort({ dateDepart: -1 });

        res.status(200).json({
            success: true,
            count: trajets.length,
            data: trajets,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/trajets - Créer un nouveau trajet
export const createTrajet = async (req, res) => {
    // ⚠️ Notez bien : il n'y a PAS de 'next' dans les arguments (req, res)
    try {
        const {
            pointDepart,
            pointArrivee,
            dateDepart,
            kmDepart,
            chauffeurId,
            camionId,
            remorqueId,
            remarques,
        } = req.body;

        // 1. Vérifier le chauffeur
        const chauffeur = await User.findById(chauffeurId);
        if (!chauffeur) {
            return res.status(404).json({
                success: false,
                message: 'Chauffeur non trouvé',
            });
        }

        // 2. Vérifier le camion
        const camion = await Camion.findById(camionId);
        if (!camion) {
            return res.status(404).json({
                success: false,
                message: 'Camion non trouvé',
            });
        }

        // 3. Vérifier la remorque (optionnel)
        if (remorqueId) {
            const remorque = await Remorque.findById(remorqueId);
            if (!remorque) {
                return res.status(404).json({
                    success: false,
                    message: 'Remorque non trouvée',
                });
            }
        }

        // 4. Créer le trajet
        const newTrajet = await Trajet.create({
            pointDepart,
            pointArrivee,
            dateDepart,
            kmDepart,
            chauffeurId,
            camionId,
            remorqueId: remorqueId || null,
            remarques,
        });

        // ❌ C'est ici que vous aviez probablement "next();" ou "return next();"
        // IL FAUT LE SUPPRIMER.

        // 5. Répondre au client
        res.status(201).json({
            success: true,
            message: 'Trajet créé avec succès',
            data: newTrajet,
        });

    } catch (error) {
        // L'erreur "next is not a function" est capturée ici et renvoyée au client
        console.error("Erreur dans createTrajet:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/trajets/:id - Modifier un trajet
export const updateTrajet = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const trajet = await Trajet.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate('chauffeurId', 'nom prenom email')
            .populate('camionId', 'matricule marque modele')
            .populate('remorqueId', 'matricule marque modele');

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Trajet modifié avec succès',
            data: trajet,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/trajets/:id/statut - Mettre à jour le statut
export const updateStatut = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut, kmArrivee, volumeGasoil, dateArrivee, remarques } = req.body;

        const trajet = await Trajet.findById(id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé',
            });
        }

        // Vérifier la transition de statut
        if (statut === 'en_cours' && trajet.statut !== 'a_faire') {
            return res.status(400).json({
                success: false,
                message: 'Seul un trajet "à faire" peut passer en "en cours"',
            });
        }

        if (statut === 'termine' && trajet.statut !== 'en_cours') {
            return res.status(400).json({
                success: false,
                message: 'Seul un trajet "en cours" peut être terminé',
            });
        }

        // Mettre à jour le statut
        trajet.statut = statut;

        if (statut === 'termine') {
            if (!kmArrivee) {
                return res.status(400).json({
                    success: false,
                    message: 'Le kilométrage d\'arrivée est requis pour terminer le trajet',
                });
            }

            if (kmArrivee <= trajet.kmDepart) {
                return res.status(400).json({
                    success: false,
                    message: 'Le kilométrage d\'arrivée ne peut pas être inférieur au kilométrage de départ',
                });
            }

            trajet.kmArrivee = kmArrivee;
            trajet.dateArrivee = dateArrivee || new Date();
            trajet.volumeGasoil = volumeGasoil || 0;

            // Mettre à jour le kilométrage du camion
            await Camion.findByIdAndUpdate(trajet.camionId, {
                kilometrage: kmArrivee,
            });

            // Mettre à jour le kilométrage de la remorque si présente
            if (trajet.remorqueId) {
                await Remorque.findByIdAndUpdate(trajet.remorqueId, {
                    kilometrage: kmArrivee,
                });
            }
        }

        if (remarques) {
            trajet.remarques = remarques;
        }

        await trajet.save();

        const updatedTrajet = await Trajet.findById(id)
            .populate('chauffeurId', 'nom prenom email')
            .populate('camionId', 'matricule marque modele')
            .populate('remorqueId', 'matricule marque modele');

        res.status(200).json({
            success: true,
            message: `Trajet passé en ${statut}`,
            data: updatedTrajet,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/trajets/:id - Supprimer un trajet
export const deleteTrajet = async (req, res) => {
    try {
        const trajet = await Trajet.findByIdAndDelete(req.params.id);

        if (!trajet) {
            return res.status(404).json({
                success: false,
                message: 'Trajet non trouvé',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Trajet supprimé avec succès',
            data: trajet,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/trajets/stats/global - Statistiques globales
export const getStatsGlobal = async (req, res) => {
    try {
        const stats = await Trajet.aggregate([
            {
                $group: {
                    _id: null,
                    totalTrajets: { $sum: 1 },
                    totalDistance: { $sum: '$distanceParcourue' },
                    totalGasoil: { $sum: '$volumeGasoil' },
                    consommationMoyenne: { $avg: '$consommationMoyenne' },
                },
            },
        ]);

        const statsByStatut = await Trajet.aggregate([
            {
                $group: {
                    _id: '$statut',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                global: stats[0] || {},
                parStatut: statsByStatut,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};