import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import camionRoutes from './routes/camionRoutes.js';
import remorqueRoutes from './routes/remorqueRoutes.js';
import pneuRoutes from './routes/pneuRoutes.js';
import trajetRoutes from './routes/trajetRoutes.js';
import regleMaintenanceRoutes from './routes/regleMaintenanceRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';


const app = express();

app.use(cors());

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/camions', camionRoutes);
app.use('/api/remorques', remorqueRoutes);
app.use('/api/pneus', pneuRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/regles-maintenance', regleMaintenanceRoutes);
app.use('/api/maintenance', maintenanceRoutes);



// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Erreur serveur',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default app;