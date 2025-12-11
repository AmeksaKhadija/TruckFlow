import Camion from '../models/camionModel.js';
import Remorque from '../models/remorqueModel.js';
import RegleMaintenance from '../models/regleMaintenanceModel.js';

export const getMaintenanceAlerts = async (req, res) => {
    try {
        const alertes = [];

        const regles = await RegleMaintenance.find();

        const camions = await Camion.find({ estActif: true });

        for (const camion of camions) {
            const reglesCamion = regles.filter(r => r.categorieVehicule === 'Camion');

            for (const regle of reglesCamion) {
                // A. Vérification par Kilométrage
                if (regle.intervalleKm) {

                    const kmDepuisDernierEntretien = camion.kilometrage; // Simplification (à améliorer avec historique)
                    const prochainEntretienKm = Math.ceil((kmDepuisDernierEntretien + 1) / regle.intervalleKm) * regle.intervalleKm;
                    const kmRestant = prochainEntretienKm - camion.kilometrage;

                    if (kmRestant <= regle.seuilAlerteKm) {
                        alertes.push({
                            vehiculeId: camion._id,
                            matricule: camion.matricule,
                            typeVehicule: 'Camion',
                            typeEntretien: regle.typeEntretien,
                            gravite: kmRestant <= 0 ? 'CRITIQUE' : 'ATTENTION',
                            message: kmRestant <= 0
                                ? `Entretien ${regle.typeEntretien} dépassé de ${Math.abs(kmRestant)} km`
                                : `Entretien ${regle.typeEntretien} prévu dans ${kmRestant} km`,
                            echeance: `${prochainEntretienKm} km`
                        });
                    }
                }

                // B. Vérification par Temps (Date)
                if (regle.intervalleTempsMois && camion.derniereMaintenanceDate) {
                    const dateDerniere = new Date(camion.derniereMaintenanceDate);
                    const dateProchaine = new Date(dateDerniere);
                    dateProchaine.setMonth(dateDerniere.getMonth() + regle.intervalleTempsMois);

                    const aujourdhui = new Date();
                    const diffTemps = dateProchaine - aujourdhui;
                    const joursRestants = Math.ceil(diffTemps / (1000 * 60 * 60 * 24));

                    // Seuil d'alerte en jours (approx 30 jours par mois)
                    const seuilJours = regle.seuilAlerteMois * 30;

                    if (joursRestants <= seuilJours) {
                        alertes.push({
                            vehiculeId: camion._id,
                            matricule: camion.matricule,
                            typeVehicule: 'Camion',
                            typeEntretien: regle.typeEntretien,
                            gravite: joursRestants <= 0 ? 'CRITIQUE' : 'ATTENTION',
                            message: joursRestants <= 0
                                ? `Entretien ${regle.typeEntretien} en retard de ${Math.abs(joursRestants)} jours`
                                : `Entretien ${regle.typeEntretien} prévu dans ${joursRestants} jours`,
                            echeance: dateProchaine.toISOString().split('T')[0]
                        });
                    }
                }
            }
        }

        // 3. Vérifier les Remorques (Logique similaire)
        const remorques = await Remorque.find({ estActif: true });

        for (const remorque of remorques) {
            const reglesRemorque = regles.filter(r => r.categorieVehicule === 'Remorque');

            for (const regle of reglesRemorque) {
                // Logique KM
                if (regle.intervalleKm) {
                    const kmRestant = (Math.ceil((remorque.kilometrage + 1) / regle.intervalleKm) * regle.intervalleKm) - remorque.kilometrage;

                    if (kmRestant <= regle.seuilAlerteKm) {
                        alertes.push({
                            vehiculeId: remorque._id,
                            matricule: remorque.matricule,
                            typeVehicule: 'Remorque',
                            typeEntretien: regle.typeEntretien,
                            gravite: kmRestant <= 0 ? 'CRITIQUE' : 'ATTENTION',
                            message: kmRestant <= 0
                                ? `Entretien ${regle.typeEntretien} dépassé de ${Math.abs(kmRestant)} km`
                                : `Entretien ${regle.typeEntretien} prévu dans ${kmRestant} km`,
                            echeance: `${remorque.kilometrage + kmRestant} km`
                        });
                    }
                }
            }
        }

        res.status(200).json({
            success: true,
            count: alertes.length,
            data: alertes
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};