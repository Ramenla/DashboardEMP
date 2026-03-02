/**
 * @file initDb.js
 * @description Inisialisasi struktur database secara otomatis saat server berjalan.
 * Jika tabel belum ada, tabel akan dibuat beserta relasi dan data dummynya.
 * Mendukung migrasi skema ringan untuk environment development.
 */

import db from './db.js';

/**
 * Mengeksekusi pengecekan, migrasi, pembuatan tabel, dan penyisipan data dummy
 * ke dalam database MySQL.
 * @async
 * @returns {Promise<void>}
 */
async function initDatabase() {
    try {
        console.log('🔄 Checking database tables...');
        const [tables] = await db.query("SHOW TABLES LIKE 'projects'");

        if (tables.length > 0) {
            console.log('✅ Tables already exist. Running column migrations...');

            try {
                const [cols] = await db.query("SHOW COLUMNS FROM issues LIKE 'division'");
                if (cols.length === 0) {
                    console.log("⬆️  Adding 'division' column to issues table...");
                    await db.query("ALTER TABLE issues ADD COLUMN division VARCHAR(100) AFTER title");
                    console.log("✅ 'division' column added.");
                }
            } catch (e) {
                console.warn("Migration check for 'division' failed:", e.message);
            }

            try {
                const [mgrCols] = await db.query("SHOW COLUMNS FROM projects LIKE 'manager'");
                if (mgrCols.length === 0) {
                    console.log("⬆️  Adding 'manager' column to projects table...");
                    await db.query("ALTER TABLE projects ADD COLUMN manager VARCHAR(255) AFTER location");
                    console.log("✅ 'manager' column added.");
                }
            } catch (e) {
                console.warn("Migration check for 'manager' failed:", e.message);
            }

            console.log('✅ Migrations complete.');
            return;
        }

        console.log('🆕 No tables found. Creating schema and seeding dummy data...');

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
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              projectCode VARCHAR(50) DEFAULT NULL,
              name VARCHAR(255) NOT NULL,
              category ENUM('EXPLORATION','DRILLING','OPERATION','FACILITY') NOT NULL,
              priority VARCHAR(50) DEFAULT 'Sedang',
              status VARCHAR(50) DEFAULT NULL,
              startDate DATETIME DEFAULT NULL,
              endDate DATETIME DEFAULT NULL,
              totalBudget DOUBLE DEFAULT 0,
              location VARCHAR(255) DEFAULT NULL,
              manager VARCHAR(255) DEFAULT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              UNIQUE KEY projectCode (projectCode)
            );
        `);

        await db.query(`
            CREATE TABLE employees (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              position VARCHAR(100) DEFAULT NULL,
              department VARCHAR(100) DEFAULT NULL
            );
        `);

        await db.query(`
            CREATE TABLE project_members (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              projectId VARCHAR(50) NOT NULL,
              employeeId VARCHAR(50) NOT NULL,
              role VARCHAR(100) DEFAULT NULL,
              FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
              FOREIGN KEY (employeeId) REFERENCES employees(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE timeline_events (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              projectId VARCHAR(50) NOT NULL,
              eventName VARCHAR(255) NOT NULL,
              startDate DATETIME DEFAULT NULL,
              endDate DATETIME DEFAULT NULL,
              taskBudget DOUBLE DEFAULT 0,
              calculatedProgress FLOAT DEFAULT 0,
              FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE task_milestones (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              timelineEventId VARCHAR(50) NOT NULL,
              milestoneName VARCHAR(255) NOT NULL,
              progressContribution FLOAT DEFAULT 0,
              isCompleted TINYINT(1) DEFAULT 0,
              completedAt DATETIME DEFAULT NULL,
              FOREIGN KEY (timelineEventId) REFERENCES timeline_events(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE issues (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              projectId VARCHAR(50) NOT NULL,
              title VARCHAR(255) NOT NULL,
              division VARCHAR(100) DEFAULT NULL,
              severity ENUM('HIGH','MEDIUM','LOW') DEFAULT 'MEDIUM',
              status ENUM('OPEN','IN_PROGRESS','CLOSED') DEFAULT 'OPEN',
              impactScore INT DEFAULT 1,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);

        await db.query(`
            CREATE TABLE project_metrics (
              id VARCHAR(50) NOT NULL PRIMARY KEY,
              projectId VARCHAR(50) NOT NULL,
              recordDate DATETIME NOT NULL,
              actualCost DOUBLE DEFAULT 0,
              actualProgress FLOAT DEFAULT 0,
              plannedValue DOUBLE DEFAULT 0,
              earnedValue DOUBLE DEFAULT 0,
              scheduleVariance DOUBLE DEFAULT 0,
              costVariance DOUBLE DEFAULT 0,
              spi FLOAT DEFAULT 1,
              cpi FLOAT DEFAULT 1,
              FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
            );
        `);

        console.log('✅ Schema created (camelCase). Now seeding dummy data...');

        await db.query(`
            INSERT INTO projects (id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager) VALUES
            ('EMP-DRI-002', 'EMP-DRI-002', 'Bentu Block - Workover Well #5', 'DRILLING', 'Sedang', 'Berjalan', '2026-06-04 07:12:50', '2026-10-04 00:12:50', 698722592716, 'Bentu Block (Sumatra)', 'Andi Hidayat'),
            ('EMP-EXP-004', 'EMP-EXP-004', 'Gebang Block - Geological Study #5', 'EXPLORATION', 'Rendah', 'Berjalan', '2026-03-09 20:10:28', '2026-08-09 13:10:28', 311492339569, 'Gebang Block (Sumatra)', 'Eko Prasetyo'),
            ('EMP-FAC-006', 'EMP-FAC-006', 'Bireun-Sigli Block - Flowline Replacement #1', 'FACILITY', 'Tinggi', 'Berjalan', '2026-05-06 00:10:09', '2026-07-05 17:10:09', 6765990767, 'Bireun-Sigli Block (Sumatra)', 'Andi Hidayat'),
            ('EMP-OPE-001', 'EMP-OPE-001', 'Kangean Block - Pump Replacement #4', 'OPERATION', 'Rendah', 'Berjalan', '2026-06-11 01:46:54', '2026-08-10 18:46:54', 86899272800, 'Kangean Block (Jawa)', 'Joko Widodo');
        `);

        await db.query(`
            INSERT INTO employees (id, name, position, department) VALUES
            ('EMP-01', 'Budi Santoso', 'Project Manager', 'Engineering'),
            ('EMP-02', 'Siti Aminah', 'Lead Driller', 'Operations'),
            ('EMP-03', 'Andi Wijaya', 'HSE Officer', 'Safety');
        `);

        await db.query(`
            INSERT INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, scheduleVariance, costVariance, spi, cpi) VALUES
            ('met-EMP-DRI-002', 'EMP-DRI-002', '2026-02-20 09:55:48', 286765932566.76, 41, 319991173509.14, 286476263013.56, 0, 0, 0.9, 1),
            ('met-EMP-EXP-004', 'EMP-EXP-004', '2026-02-20 09:55:48', 231355587680.93, 74, 229551208027.97, 230504331281.06, 0, 0, 1, 1),
            ('met-EMP-FAC-006', 'EMP-FAC-006', '2026-02-20 09:55:48', 3570014763.53, 45, 2869309378.37, 3044695845.15, 0, 0, 1.06, 0.85),
            ('met-EMP-OPE-001', 'EMP-OPE-001', '2026-02-20 09:55:48', 11664667312.22, 14, 6793677734.28, 12165898192, 0, 0, 1.79, 1.04);
        `);

        await db.query(`
            INSERT INTO issues (id, projectId, title, division, severity, status, impactScore) VALUES
            ('iss-EMP-DRI-002-0', 'EMP-DRI-002', 'Cuaca buruk menghentikan aktivitas offshore', 'Drilling & Workover', 'HIGH', 'OPEN', 3),
            ('iss-EMP-FAC-006-0', 'EMP-FAC-006', 'Gangguan rantai pasok untuk suku cadang kritis', 'Facilities Engineering', 'HIGH', 'OPEN', 4);
        `);

        await db.query(`
            INSERT INTO timeline_events (id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress) VALUES
            ('evt-EMP-DRI-002-0', 'EMP-DRI-002', 'Preparation', '2026-06-04 07:12:50', '2026-07-04 00:12:50', 232907530905.33, 4),
            ('evt-EMP-DRI-002-1', 'EMP-DRI-002', 'Execution', '2026-07-04 00:12:50', '2026-08-03 17:12:50', 232907530905.33, 88),
            ('evt-EMP-DRI-002-2', 'EMP-DRI-002', 'Reporting', '2026-08-03 17:12:50', '2026-09-03 10:12:50', 232907530905.33, 81);
        `);

        console.log('🌱 Dummy data seeded successfully!');
        console.log('🚀 Database initialization complete!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
    }
}

export default initDatabase;
