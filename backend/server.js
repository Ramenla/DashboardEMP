import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import { seedRandomProjects } from './controllers/seedController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/projects', projectRoutes);
app.post('/api/seed', seedRandomProjects);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ status: 'OK', message: 'Database connection successful', result: rows[0].solution });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Database connection failed', error: error.message });
  }
});

/**
 * Inisialisasi database secara otomatis saat server pertama kali berjalan.
 * Membuat tabel-tabel dan mengisi data dummy jika belum ada.
 */
async function initDatabase() {
    try {
        console.log('🔄 Checking database tables...');
        const [tables] = await db.query("SHOW TABLES LIKE 'projects'");

        if (tables.length > 0) {
            console.log('✅ Tables already exist. Running column migrations...');
            // Migration: tambahkan kolom 'division' ke tabel issues jika belum ada
            const [cols] = await db.query("SHOW COLUMNS FROM issues LIKE 'division'");
            if (cols.length === 0) {
                console.log("⬆️  Adding 'division' column to issues table...");
                await db.query("ALTER TABLE issues ADD COLUMN division VARCHAR(100) AFTER title");
                console.log("✅ 'division' column added.");
            }
            // Migration: tambahkan kolom 'location' ke tabel projects jika belum ada
            const [locCols] = await db.query("SHOW COLUMNS FROM projects LIKE 'location'");
            if (locCols.length === 0) {
                console.log("⬆️  Adding 'location' column to projects table...");
                await db.query("ALTER TABLE projects ADD COLUMN location VARCHAR(255) AFTER total_budget");
                console.log("✅ 'location' column added.");
            }
            // Migration: isi data division yang masih kosong (NULL) dari existing data
            await db.query(`
                UPDATE issues SET division = 'Drilling & Workover' WHERE id = 'ISS-01' AND (division IS NULL OR division = '');
                UPDATE issues SET division = 'Supply Chain' WHERE id = 'ISS-02' AND (division IS NULL OR division = '');
            `);
            // Migration: update lokasi proyek ke format Indonesia
            console.log('📍 Updating project locations to Indonesian format...');
            await db.query(`UPDATE projects SET location = 'Blok B (Sumatra)' WHERE location IS NULL OR location IN ("'B' Block (Sumatra)", 'B Block (Sumatra)')`);
            await db.query(`UPDATE projects SET location = 'Blok Siak (Sumatra)' WHERE location = 'Siak Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Kampar (Sumatra)' WHERE location = 'Kampar Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Korinci Baru (Sumatra)' WHERE location = 'Korinci Baru Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Kangean (Jawa)' WHERE location = 'Kangean Block (Jawa)'`);
            await db.query(`UPDATE projects SET location = 'Blok Sengkang (Sulawesi)' WHERE location = 'Sengkang Block (Sulawesi)'`);
            await db.query(`UPDATE projects SET location = 'Blok Malacca Strait (Sumatra)' WHERE location = 'Malacca Strait Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Bentu (Sumatra)' WHERE location = 'Bentu Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Tonga (Sumatra)' WHERE location = 'Tonga Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Gebang (Sumatra)' WHERE location = 'Gebang Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Bireun-Sigli (Sumatra)' WHERE location = 'Bireun-Sigli Block (Sumatra)'`);
            await db.query(`UPDATE projects SET location = 'Blok Buzi EPCC (Mozambique)' WHERE location = 'Buzi EPCC (Mozambique)'`);
            // Proyek yang masih NULL atau Makassar Strait → assign ke Blok South CPP
            await db.query(`UPDATE projects SET location = 'Blok South CPP (Sumatra)' WHERE location IS NULL OR location = '' OR location = 'Makassar Strait Block'`);
            console.log('✅ Project locations updated.');
            return;
        }

        console.log('🆕 No tables found. Creating schema and seeding dummy data...');

        // ───── SCHEMA ─────
        await db.query(`
            SET FOREIGN_KEY_CHECKS = 0;
            DROP TABLE IF EXISTS project_metrics;
            DROP TABLE IF EXISTS issues;
            DROP TABLE IF EXISTS task_milestones;
            DROP TABLE IF EXISTS timeline_events;
            DROP TABLE IF EXISTS project_members;
            DROP TABLE IF EXISTS employees;
            DROP TABLE IF EXISTS projects;
            SET FOREIGN_KEY_CHECKS = 1;
        `);

        await db.query(`
            CREATE TABLE projects (
              id VARCHAR(255) PRIMARY KEY,
              project_code VARCHAR(100) UNIQUE,
              name VARCHAR(255) NOT NULL,
              category ENUM('EXPLORATION', 'DRILLING', 'OPERATION', 'FACILITY') NOT NULL,
              priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
              status ENUM('ON_TRACK', 'AT_RISK', 'DELAYED', 'COMPLETED') DEFAULT 'ON_TRACK',
              start_date DATETIME,
              end_date DATETIME,
              total_budget DOUBLE,
              location VARCHAR(255),
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        await db.query(`
            CREATE TABLE employees (
              id VARCHAR(255) PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              position VARCHAR(100),
              department VARCHAR(100)
            );
        `);

        await db.query(`
            CREATE TABLE project_members (
              id VARCHAR(255) PRIMARY KEY,
              project_id VARCHAR(255),
              employee_id VARCHAR(255),
              role VARCHAR(100),
              FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
              FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE timeline_events (
              id VARCHAR(255) PRIMARY KEY,
              project_id VARCHAR(255),
              event_name VARCHAR(255) NOT NULL,
              start_date DATETIME,
              end_date DATETIME,
              task_budget DOUBLE DEFAULT 0,
              calculated_progress DOUBLE DEFAULT 0,
              FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE task_milestones (
              id VARCHAR(255) PRIMARY KEY,
              timeline_event_id VARCHAR(255),
              milestone_name VARCHAR(255) NOT NULL,
              progress_contribution DOUBLE DEFAULT 0,
              is_completed BOOLEAN DEFAULT FALSE,
              completed_at DATETIME,
              FOREIGN KEY (timeline_event_id) REFERENCES timeline_events(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE issues (
              id VARCHAR(255) PRIMARY KEY,
              project_id VARCHAR(255),
              title VARCHAR(255) NOT NULL,
              division VARCHAR(100),
              severity ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
              status ENUM('OPEN', 'IN_PROGRESS', 'CLOSED') DEFAULT 'OPEN',
              impact_score INT DEFAULT 1,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE project_metrics (
              id VARCHAR(255) PRIMARY KEY,
              project_id VARCHAR(255),
              record_date DATETIME NOT NULL,
              actual_cost DOUBLE DEFAULT 0,
              actual_progress DOUBLE DEFAULT 0,
              planned_value DOUBLE DEFAULT 0,
              earned_value DOUBLE DEFAULT 0,
              schedule_variance DOUBLE DEFAULT 0,
              cost_variance DOUBLE DEFAULT 0,
              spi DOUBLE DEFAULT 0,
              cpi DOUBLE DEFAULT 0,
              FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);

        console.log('✅ Schema created. Now seeding dummy data...');

        // ───── DUMMY DATA ─────
        await db.query(`
            INSERT INTO projects (id, project_code, name, category, priority, status, start_date, end_date, total_budget, location) VALUES
            ('PRJ-001', 'EXP-01', 'Eksplorasi Blok A', 'EXPLORATION', 'HIGH', 'ON_TRACK', '2026-01-01', '2026-12-31', 5000000000, 'Blok B (Sumatra)'),
            ('PRJ-002', 'DRL-01', 'Pengeboran Sumur B', 'DRILLING', 'HIGH', 'AT_RISK', '2026-02-15', '2026-11-30', 12000000000, 'Blok Siak (Sumatra)'),
            ('PRJ-003', 'OPR-01', 'Maintenance Fasilitas C', 'OPERATION', 'MEDIUM', 'DELAYED', '2026-03-01', '2026-09-30', 3500000000, 'Blok Kangean (Jawa)'),
            ('PRJ-004', 'FAC-01', 'Pembangunan Pipa Gas D', 'FACILITY', 'LOW', 'COMPLETED', '2025-06-01', '2026-01-15', 8000000000, 'Blok Sengkang (Sulawesi)');
        `);

        await db.query(`
            INSERT INTO employees (id, name, position, department) VALUES
            ('EMP-01', 'Budi Santoso', 'Project Manager', 'Engineering'),
            ('EMP-02', 'Siti Aminah', 'Lead Driller', 'Operations'),
            ('EMP-03', 'Andi Wijaya', 'HSE Officer', 'Safety');
        `);

        await db.query(`
            INSERT INTO project_members (id, project_id, employee_id, role) VALUES
            ('PM-01', 'PRJ-001', 'EMP-01', 'Project Manager'),
            ('PM-02', 'PRJ-001', 'EMP-03', 'HSE Officer'),
            ('PM-03', 'PRJ-002', 'EMP-02', 'Lead Driller');
        `);

        await db.query(`
            INSERT INTO timeline_events (id, project_id, event_name, start_date, end_date, task_budget, calculated_progress) VALUES
            ('EVT-01', 'PRJ-001', 'Studi Seismik', '2026-01-01', '2026-03-31', 1000000000, 100),
            ('EVT-02', 'PRJ-001', 'Pembebasan Lahan', '2026-04-01', '2026-06-30', 2000000000, 50),
            ('EVT-03', 'PRJ-002', 'Mobilisasi Rig', '2026-02-15', '2026-04-15', 3000000000, 100),
            ('EVT-04', 'PRJ-002', 'Drilling Phase 1', '2026-04-16', '2026-08-30', 6000000000, 20);
        `);

        await db.query(`
            INSERT INTO task_milestones (id, timeline_event_id, milestone_name, progress_contribution, is_completed, completed_at) VALUES
            ('MIL-01', 'EVT-01', 'Izin Survei Keluar', 50, true, '2026-01-15'),
            ('MIL-02', 'EVT-01', 'Laporan Seismik Selesai', 50, true, '2026-03-20'),
            ('MIL-03', 'EVT-02', 'Negosiasi Warga', 50, true, '2026-05-10'),
            ('MIL-04', 'EVT-02', 'Pembayaran Lahan', 50, false, null),
            ('MIL-05', 'EVT-03', 'Rig Tiba di Lokasi', 100, true, '2026-04-10'),
            ('MIL-06', 'EVT-04', 'Mencapai Kedalaman 1000m', 20, true, '2026-05-20'),
            ('MIL-07', 'EVT-04', 'Mencapai Kedalaman Target', 80, false, null);
        `);

        await db.query(`
            INSERT INTO issues (id, project_id, title, division, severity, status, impact_score) VALUES
            ('ISS-01', 'PRJ-002', 'Cuaca Buruk Menghambat Drilling', 'Drilling & Workover', 'HIGH', 'OPEN', 5),
            ('ISS-02', 'PRJ-003', 'Suku Cadang Terlambat Datang', 'Supply Chain', 'MEDIUM', 'IN_PROGRESS', 3);
        `);

        await db.query(`
            INSERT INTO project_metrics (id, project_id, record_date, actual_cost, actual_progress, planned_value, earned_value, schedule_variance, cost_variance, spi, cpi) VALUES
            ('MET-01', 'PRJ-001', '2026-05-31', 2300000000, 50, 2400000000, 2500000000, 100000000, 200000000, 1.04, 1.08),
            ('MET-02', 'PRJ-002', '2026-05-31', 6000000000, 35, 5000000000, 4200000000, -800000000, -1800000000, 0.84, 0.70);
        `);

        console.log('🌱 Dummy data seeded successfully!');
        console.log('🚀 Database initialization complete!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        // Jangan matikan server, biarkan tetap berjalan walaupun DB init gagal
    }
}

// Jalankan server setelah init DB selesai
app.listen(PORT, async () => {
    console.log(`🌐 Server is running on port ${PORT}`);
    await initDatabase();
});

