import mongoose from 'mongoose';

const trajetSchema = new mongoose.Schema(
    {
        pointDepart: {
            type: String,
            required: [true, 'Le point de départ est requis'],
            trim: true,
        },
        pointArrivee: {
            type: String,
            required: [true, 'Le point d\'arrivée est requis'],
            trim: true,
        },
        dateDepart: {
            type: Date,
            required: [true, 'La date de départ est requise'],
        },
        dateArrivee: {
            type: Date,
            default: null,
        },
        kmDepart: {
            type: Number,
            required: [true, 'Le kilométrage de départ est requis'],
            min: [0, 'Le kilométrage ne peut pas être négatif'],
        },
        kmArrivee: {
            type: Number,
            default: null,
            min: [0, 'Le kilométrage ne peut pas être négatif'],
        },
        volumeGasoil: {
            type: Number,
            default: 0,
            min: [0, 'Le volume de gasoil ne peut pas être négatif'],
        },
        statut: {
            type: String,
            enum: ['a_faire', 'en_cours', 'termine'],
            default: 'a_faire',
        },
        chauffeurId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Le chauffeur est requis'],
        },
        camionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Camion',
            required: [true, 'Le camion est requis'],
        },
        remorqueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Remorque',
            default: null,
        },
        distanceParcourue: {
            type: Number,
            default: 0,
            min: [0, 'La distance ne peut pas être négative'],
        },
        consommationMoyenne: {
            type: Number,
            default: 0,
            min: [0, 'La consommation ne peut pas être négative'],
        },
        remarques: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

// ✅ CORRECTION DU MIDDLEWARE MONGOOSE
// Utilisation d'une fonction nommée pour le débogage et vérification de next
trajetSchema.pre('save', function (next) {
    try {
        // Calculer la distance si kmArrivee est défini
        if (this.kmArrivee && this.kmDepart) {
            this.distanceParcourue = this.kmArrivee - this.kmDepart;
        }

        // Calculer la consommation moyenne (L/100km)
        if (this.distanceParcourue > 0 && this.volumeGasoil > 0) {
            this.consommationMoyenne = (this.volumeGasoil / this.distanceParcourue) * 100;
        }

        // Vérification de sécurité
        if (typeof next === 'function') {
            next();
        }
    } catch (error) {
        if (typeof next === 'function') {
            next(error);
        }
    }
});

// Index pour recherche rapide
trajetSchema.index({ chauffeurId: 1, statut: 1 });
trajetSchema.index({ camionId: 1 });
trajetSchema.index({ dateDepart: -1 });

export default mongoose.model('Trajet', trajetSchema);