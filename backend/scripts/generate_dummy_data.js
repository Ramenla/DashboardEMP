import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.TIDB_URL;

async function generateData() {
    let connection;

    try {
        console.log('🔄 Connecting to MySQL server to generate dummy data...');
        if (connectionString) {
             connection = await mysql.createConnection({
                 uri: connectionString,
                 multipleStatements: true
             });
        } else {
             connection = await mysql.createConnection({
                 host: process.env.DB_HOST || 'localhost',
                 user: process.env.DB_USER || 'root',
                 password: process.env.DB_PASSWORD || '',
                 database: process.env.DB_NAME || 'dashboard_emp',
                 multipleStatements: true
             });
        }
        
        console.log('🧹 Cleaning existing data...');
        await connection.query('DELETE FROM project_metrics');
        await connection.query('DELETE FROM issues');
        await connection.query('DELETE FROM task_milestones');
        await connection.query('DELETE FROM timeline_events');
        await connection.query('DELETE FROM project_members');
        await connection.query('DELETE FROM employees');
        await connection.query('DELETE FROM projects');

        console.log('🌱 Seeding EVM ERD Dummy Data...');

        // 1. Insert Projects
        await connection.query(`
            INSERT INTO projects (id, project_code, name, category, priority, status, start_date, end_date, total_budget) VALUES
            ('PRJ-001', 'EXP-01', 'Eksplorasi Blok A', 'EXPLORATION', 'HIGH', 'ON_TRACK', '2026-01-01', '2026-12-31', 5000000000),
            ('PRJ-002', 'DRL-01', 'Pengeboran Sumur B', 'DRILLING', 'HIGH', 'AT_RISK', '2026-02-15', '2026-11-30', 12000000000),
            ('PRJ-003', 'OPR-01', 'Maintanance Fasilitas C', 'OPERATION', 'MEDIUM', 'DELAYED', '2026-03-01', '2026-09-30', 3500000000),
            ('PRJ-004', 'FAC-01', 'Pembangunan Pipa Gas D', 'FACILITY', 'LOW', 'COMPLETED', '2025-06-01', '2026-01-15', 8000000000);
        `);

        // 2. Insert Employees
        await connection.query(`
            INSERT INTO employees (id, name, position, department) VALUES
            ('EMP-01', 'Budi Santoso', 'Project Manager', 'Engineering'),
            ('EMP-02', 'Siti Aminah', 'Lead Driller', 'Operations'),
            ('EMP-03', 'Andi Wijaya', 'HSE Officer', 'Safety');
        `);

        // 3. Insert Project Members
        await connection.query(`
            INSERT INTO project_members (id, project_id, employee_id, role) VALUES
            ('PM-01', 'PRJ-001', 'EMP-01', 'Project Manager'),
            ('PM-02', 'PRJ-001', 'EMP-03', 'HSE Officer'),
            ('PM-03', 'PRJ-002', 'EMP-02', 'Lead Driller');
        `);

        // 4. Insert Timeline Events
        await connection.query(`
            INSERT INTO timeline_events (id, project_id, event_name, start_date, end_date, task_budget, calculated_progress) VALUES
            ('EVT-01', 'PRJ-001', 'Studi Seismik', '2026-01-01', '2026-03-31', 1000000000, 100),
            ('EVT-02', 'PRJ-001', 'Pembebasan Lahan', '2026-04-01', '2026-06-30', 2000000000, 50),
            ('EVT-03', 'PRJ-002', 'Mobilisasi Rig', '2026-02-15', '2026-04-15', 3000000000, 100),
            ('EVT-04', 'PRJ-002', 'Drilling Phase 1', '2026-04-16', '2026-08-30', 6000000000, 20);
        `);

        // 5. Insert Task Milestones
        await connection.query(`
            INSERT INTO task_milestones (id, timeline_event_id, milestone_name, progress_contribution, is_completed, completed_at) VALUES
            ('MIL-01', 'EVT-01', 'Izin Survei Keluar', 50, true, '2026-01-15'),
            ('MIL-02', 'EVT-01', 'Laporan Seismik Selesai', 50, true, '2026-03-20'),
            ('MIL-03', 'EVT-02', 'Negosiasi Warga', 50, true, '2026-05-10'),
            ('MIL-04', 'EVT-02', 'Pembayaran Lahan', 50, false, null),
            ('MIL-05', 'EVT-03', 'Rig Tiba di Lokasi', 100, true, '2026-04-10'),
            ('MIL-06', 'EVT-04', 'Mencapai Kedalaman 1000m', 20, true, '2026-05-20'),
            ('MIL-07', 'EVT-04', 'Mencapai Kedalaman Target', 80, false, null);
        `);

        // 6. Insert Issues
        await connection.query(`
            INSERT INTO issues (id, project_id, title, severity, status, impact_score) VALUES
            ('ISS-01', 'PRJ-002', 'Cuaca Buruk Menghambat Drilling', 'HIGH', 'OPEN', 5),
            ('ISS-02', 'PRJ-003', 'Suku Cadang Terlambat Datang', 'MEDIUM', 'IN_PROGRESS', 3);
        `);

        // 7. Insert Project Metrics (EVM)
        await connection.query(`
            INSERT INTO project_metrics (id, project_id, record_date, actual_cost, actual_progress, planned_value, earned_value, schedule_variance, cost_variance, spi, cpi) VALUES
            ('MET-01', 'PRJ-001', '2026-05-31', 2300000000, 50, 2400000000, 2500000000, 100000000, 200000000, 1.04, 1.08),
            ('MET-02', 'PRJ-002', '2026-05-31', 6000000000, 35, 5000000000, 4200000000, -800000000, -1800000000, 0.84, 0.70);
        `);

        console.log('✅ Dummy data successfully seeded!');

    } catch (error) {
        console.error('❌ Data generation failed:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

generateData();
