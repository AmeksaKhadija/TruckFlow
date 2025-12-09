import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Serveur lancé sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
};

startServer();