import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import { setupDatabase } from './scripts/setup_db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Auto-setup database on startup
setupDatabase().catch(err => {
  console.error('⚠️ Database setup failed, but server will try to continue...', err.message);
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

// Sample Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Test Database Connection Route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({
      status: 'OK',
      message: 'Database connection successful',
      result: rows[0].solution
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
