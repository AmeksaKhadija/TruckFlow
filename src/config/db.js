import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connecté avec succès');
    } catch (error) {
        console.error('❌ Erreur connexion MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;