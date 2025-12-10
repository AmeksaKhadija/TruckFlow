import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // ✅ Logs de debug
        console.log('📡 Tentative de connexion à MongoDB...');
        console.log('🔗 MONGO_URI:', process.env.MONGO_URI);
        console.log('🔗 Type:', typeof process.env.MONGO_URI);

        if (!process.env.MONGO_URI) {
            throw new Error('❌ MONGO_URI n\'est pas défini dans le fichier .env');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Erreur connexion MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;