import mongoose from 'mongoose';

const regleMaintenanceSchema = new mongoose.Schema(
    {
        typeEntretien: {
            type: String,
            required: [true, "Le type d'entretien est requis"],
            enum: ['vidange', 'pneus', 'revision', 'freins', 'technique', 'autre'],
            trim: true,
        },
        categorieVehicule: {
            type: String,
            required: [true, 'La catégorie de véhicule est requise'],
            enum: ['Camion', 'Remorque'],
        },
        intervalleKm: {
            type: Number,
            default: null,
            min: [0, "L'intervalle en km doit être positif"],
            description: "Nombre de km entre deux entretiens",
        },
        intervalleTempsMois: {
            type: Number,
            default: null,
            min: [0, "L'intervalle de temps doit être positif"],
            description: "Nombre de mois entre deux entretiens",
        },
        seuilAlerteKm: {
            type: Number,
            default: 1000,
            min: [0, "Le seuil d'alerte doit être positif"],
            description: "Prévenir X km avant l'échéance",
        },
        seuilAlerteMois: {
            type: Number,
            default: 1,
            min: [0, "Le seuil d'alerte doit être positif"],
            description: "Prévenir X mois avant l'échéance",
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

// Empêcher les doublons : Une seule règle par type d'entretien pour une catégorie donnée
// Exemple : On ne peut pas avoir deux règles "vidange" pour "Camion"
regleMaintenanceSchema.index({ typeEntretien: 1, categorieVehicule: 1 }, { unique: true });

export default mongoose.model('RegleMaintenance', regleMaintenanceSchema);