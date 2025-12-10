import mongoose from 'mongoose';

const pneuSchema = new mongoose.Schema(
    {
        reference: {
            type: String,
            required: [true, 'La référence est requise'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        typeVehicule: {
            type: String,
            enum: ['Camion', 'Remorque'],
            required: [true, 'Le type de véhicule est requis'],
        },
        vehiculeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'L\'ID du véhicule est requis'],
            refPath: 'typeVehicule',
        },
        position: {
            type: String,
            enum: ['avant_gauche', 'avant_droit', 'arriere_gauche', 'arriere_droit', 'spare'],
            required: [true, 'La position est requise'],
        },
        etat: {
            type: String,
            enum: ['neuf', 'bon', 'moyen', 'usé', 'à_remplacer'],
            default: 'neuf',
        },
        usurePourcentage: {
            type: Number,
            default: 0,
            min: [0, 'L\'usure ne peut pas être négative'],
            max: [100, 'L\'usure ne peut pas dépasser 100%'],
        },
        dateInstallation: {
            type: Date,
            required: [true, 'La date d\'installation est requise'],
            default: Date.now,
        },
        kilometrageInstallation: {
            type: Number,
            required: [true, 'Le kilométrage d\'installation est requis'],
            min: [0, 'Le kilométrage ne peut pas être négatif'],
        },
        marque: {
            type: String,
            trim: true,
            default: '',
        },
        modele: {
            type: String,
            trim: true,
            default: '',
        },
        dimension: {
            type: String,
            trim: true,
            default: '',
        },
        pression: {
            type: Number,
            min: [0, 'La pression ne peut pas être négative'],
            default: 0,
        },
        remarques: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

// Index pour recherche rapide
pneuSchema.index({ vehiculeId: 1, position: 1 });
pneuSchema.index({ reference: 1 });

export default mongoose.model('Pneu', pneuSchema);