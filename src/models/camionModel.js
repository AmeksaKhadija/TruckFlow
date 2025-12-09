import mongoose from 'mongoose';

const camionSchema = new mongoose.Schema(
    {
        matricule: {
            type: String,
            required: [true, 'Le matricule est requis'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        marque: {
            type: String,
            required: [true, 'La marque est requise'],
            trim: true,
        },
        modele: {
            type: String,
            required: [true, 'Le modèle est requis'],
            trim: true,
        },
        kilometrage: {
            type: Number,
            default: 0,
            min: [0, 'Le kilométrage ne peut pas être négatif'],
        },
        etatPneu: {
            type: String,
            enum: ['bon', 'moyen', 'mauvais', 'à_remplacer'],
            default: 'bon',
        },
        capaciteCharge: {
            type: Number,
            required: [true, 'La capacité de charge est requise'],
            min: [0, 'La capacité doit être positive'],
        },
        anneeFabrication: {
            type: Number,
            required: [true, 'L\'année de fabrication est requise'],
            min: [1950, 'Année invalide'],
            max: [new Date().getFullYear(), 'Année invalide'],
        },
        carburantRestant: {
            type: Number,
            default: 0,
            min: [0, 'Le carburant ne peut pas être négatif'],
        },
        etatGeneral: {
            type: String,
            enum: ['excellent', 'bon', 'moyen', 'mauvais'],
            default: 'bon',
        },
        estActif: {
            type: Boolean,
            default: true,
        },
        derniereMaintenanceDate: {
            type: Date,
            default: null,
        },
        prochainEntretien: {
            type: Date,
            default: null,
        },
        remarques: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Camion', camionSchema);