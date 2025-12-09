import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        nom: {
            type: String,
            required: [true, 'Le nom est requis'],
            trim: true,
        },
        prenom: {
            type: String,
            required: [true, 'Le prénom est requis'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'L\'email est requis'],
            unique: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide'],
        },
        password: {
            type: String,
            required: [true, 'Le mot de passe est requis'],
            minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
            select: false, // Ne pas retourner le password par défaut
        },
        role: {
            type: String,
            enum: ['admin', 'chauffeur'],
            default: 'chauffeur',
        },
        actif: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Hash password avant de sauvegarder
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);