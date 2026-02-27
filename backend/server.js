import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import projectRoutes from './routes/projectRoutes.js';
import { seedRandomProjects } from './controllers/seedController.js';
import initDatabase from './config/initDb.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ───── Middleware ─────
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Sajikan file statis dari folder dist React (untuk production/Railway)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ───── Routes ─────
app.use('/api/projects', projectRoutes);
app.post('/api/seed', seedRandomProjects);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/test-db', async (req, res, next) => {
    try {
        const db = (await import('./config/db.js')).default;
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'OK', message: 'Database connection successful', result: rows[0].solution });
    } catch (error) {
        next(error);
    }
});

// Route catch-all: Kirim index.html untuk rute non-API (untuk mendukung SPA)
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ message: 'Frontend build not found. Run npm run build first.' });
    }
});

// ───── Error Handler (harus di paling bawah, setelah semua routes) ─────
app.use(errorHandler);

// ───── Start Server ─────
app.listen(PORT, async () => {
    console.log(`🌐 Server is running on port ${PORT}`);
    await initDatabase();
});
