import mongoose from 'mongoose';

const remorqueSchema = new mongoose.Schema(
    {
        matricule: {
            type: String,
            required: [true, 'Le matricule est requis'],
            unique: true,
            trim: true,
            uppercase: true,
        },
        marque: { type: String, required: true, trim: true },
        modele: { type: String, required: true, trim: true },
        type: { type: String, enum: ['fourgon', 'plateau', 'citerne', 'frigo', 'bache'], default: 'fourgon' },
        capaciteCharge: { type: Number, required: true, min: 0 },
        anneeFabrication: {
            type: Number,
            required: true,
            min: 1950,
            max: new Date().getFullYear(),
        },
        kilometrage: { type: Number, default: 0, min: 0 },
        etatPneu: { type: String, enum: ['bon', 'moyen', 'mauvais', 'à_remplacer'], default: 'bon' },
        etatGeneral: { type: String, enum: ['excellent', 'bon', 'moyen', 'mauvais'], default: 'bon' },
        estActif: { type: Boolean, default: true },
        derniereMaintenanceDate: { type: Date, default: null },
        prochainEntretien: { type: Date, default: null },
        remarques: { type: String, trim: true, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('Remorque', remorqueSchema);