import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'dashboard_emp',
    multipleStatements: true
};

// Real EMP Assets / Locations
const ASSETS = [
    // Sumatra
    { region: 'Sumatra', name: "'B' Block", location: "Riau" },
    { region: 'Sumatra', name: "Bireun-Sigli Block", location: "Aceh" },
    { region: 'Sumatra', name: "Gebang Block", location: "Sumatera Utara" },
    { region: 'Sumatra', name: "Tonga Block", location: "Sumatera Utara" },
    { region: 'Sumatra', name: "Malacca Strait Block", location: "Riau" },
    { region: 'Sumatra', name: "Siak Block", location: "Riau" },
    { region: 'Sumatra', name: "Kampar Block", location: "Riau" },
    { region: 'Sumatra', name: "Bentu Block", location: "Riau" },
    { region: 'Sumatra', name: "Korinci Baru Block", location: "Riau" },
    { region: 'Sumatra', name: "South CPP Block", location: "Riau" },
    // Jawa
    { region: 'Jawa', name: "Kangean Block", location: "Jawa Timur (Offshore)" },
    // Sulawesi
    { region: 'Sulawesi', name: "Sengkang Block", location: "Sulawesi Selatan" },
    // Mozambique
    { region: 'Mozambique', name: "Buzi EPCC", location: "Mozambique" }
];

// Realistic Activities per Category
const ACTIVITIES = {
    'EXPLORATION': ['Seismic 2D Acquisition', 'Seismic 3D Survey', 'Exploration Well Drilling', 'Geological Study', 'G&G Analysis'],
    'DRILLING': ['Development Well Drilling', 'Infill Drilling', 'Workover Well', 'Well Deepening', 'Rig Mobilization'],
    'OPERATION': ['Production Optimization', 'Gas Compressor Overhaul', 'Pipeline Inspection', 'Well Maintenance', 'Pump Replacement'],
    'FACILITY': ['New Separator Installation', 'Storage Tank Repair', 'Flowline Replacement', 'Control Room Upgrade', 'HSE Equipment Upgrade']
};

const CATEGORIES = ['EXPLORATION', 'DRILLING', 'OPERATION', 'FACILITY'];
const PRIORITIES = ['Tinggi', 'Sedang', 'Rendah'];
// Updated Statuses: Berjalan, Beresiko, Tertunda, Selesai
const STATUSES = ['Berjalan', 'Berjalan', 'Berjalan', 'Beresiko', 'Tertunda', 'Selesai'];
const MANAGERS = ['Budi Santoso', 'Siti Aminah', 'Eko Prasetyo', 'Dewi Lestari', 'Agus Setiawan', 'Rina Wati', 'Joko Widodo', 'Andi Hidayat'];

// Helper for date
const randomDate = (startYear = 2026, endYear = 2027) => {
    const start = new Date(`${startYear}-01-01`);
    const end = new Date(`${endYear}-12-31`);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().slice(0, 19).replace('T', ' ');
};

const addMonths = (dateStr, months) => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 19).replace('T', ' ');
};

const generateProjects = async () => {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected.');

        // ALTER TABLE to ensure status column can hold new strings (if it was ENUM)
        console.log('Updating schema...');
        try {
            await connection.query("ALTER TABLE projects MODIFY COLUMN status VARCHAR(50)");
        } catch (e) {
            console.log("Schema update note: " + e.message); // Ignore if already varchar
        }
        
        console.log('Cleaning existing data...');
        await connection.query('DELETE FROM project_metrics');
        await connection.query('DELETE FROM issues');
        await connection.query('DELETE FROM task_milestones');
        await connection.query('DELETE FROM timeline_events');
        await connection.query('DELETE FROM projects');
        
        console.log('Generating 50 realistic EMP projects...');

        for (let i = 1; i <= 50; i++) {
            const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
            const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            const possibleActivities = ACTIVITIES[category];
            const activityName = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
            
            const name = `${asset.name} - ${activityName} #${Math.floor(Math.random() * 5) + 1}`;
            
            const catCode = category.substring(0, 3);
            const seq = String(i).padStart(3, '0');
            const projectCode = `EMP-${catCode}-${seq}`;
            const id = projectCode;
            
            const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
            const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
            const manager = MANAGERS[Math.floor(Math.random() * MANAGERS.length)];
            
            const startDate = randomDate(2026, 2026);
            const duration = Math.floor(Math.random() * 8) + 2; 
            const endDate = addMonths(startDate, duration);
            
            let minBudget = 1000000000; 
            let maxBudget = 100000000000; 
            
            if (category === 'DRILLING') {
                minBudget = 50000000000; // 50 M
                maxBudget = 1500000000000; // 1.5 T
            } else if (category === 'EXPLORATION') {
                minBudget = 20000000000; // 20 M
                maxBudget = 500000000000; // 500 M
            } else if (category === 'FACILITY') {
                 minBudget = 5000000000; // 5 M
                 maxBudget = 200000000000; // 200 M
            }

            const totalBudget = Math.floor(Math.random() * (maxBudget - minBudget + 1)) + minBudget;
            
            const locationStr = `${asset.name} (${asset.region})`; 

            // Insert Project
            await connection.query(`
                INSERT INTO projects (id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, locationStr, manager]);

            // Insert Timeline Events
            const phases = ['Preparation', 'Execution', 'Reporting'];
            const durationPerPhase = Math.floor(duration / phases.length) || 1;
            
            let currentStart = startDate;
            for (let j = 0; j < phases.length; j++) {
                const eventId = `evt-${id}-${j}`;
                const eventEnd = addMonths(currentStart, durationPerPhase);
                
                await connection.query(`
                    INSERT INTO timeline_events (id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [eventId, id, phases[j], currentStart, eventEnd, totalBudget / phases.length, status === 'Selesai' ? 100 : Math.floor(Math.random() * 100)]);
                
                currentStart = eventEnd;
            }

            // Insert Issues (Realistic)
            if (status === 'Beresiko' || status === 'Tertunda' || Math.random() > 0.8) {
                const numIssues = Math.floor(Math.random() * 2) + 1;
                const ISSUE_TEMPLATES = [
                    "Keterlambatan persetujuan izin dari pemerintah daerah",
                    "Kerusakan peralatan saat operasi",
                    "Cuaca buruk menghentikan aktivitas offshore",
                    "Gangguan rantai pasok untuk suku cadang kritis",
                    "Temuan geologis tak terduga memerlukan revisi rencana",
                    "Sengketa pembebasan lahan dengan masyarakat lokal",
                    "Investigasi insiden keselamatan diperlukan",
                    "Kekurangan tenaga kerja kontraktor"
                ];

                for (let k = 0; k < numIssues; k++) {
                    const issueId = `iss-${id}-${k}`;
                    const template = ISSUE_TEMPLATES[Math.floor(Math.random() * ISSUE_TEMPLATES.length)];
                    await connection.query(`
                        INSERT INTO issues (id, projectId, title, severity, status, impactScore)
                        VALUES (?, ?, ?, ?, ?, ?)
                    `, [issueId, id, template, 'HIGH', 'OPEN', Math.floor(Math.random() * 5) + 1]);
                }
            }

            // Insert Metrics
             const progress = status === 'Selesai' ? 100 : Math.floor(Math.random() * 90);
             // Generate target (Planned Progress) roughly around actual progress (with some deviation)
             const target = Math.max(0, Math.min(100, progress + (Math.random() * 20 - 10))); 
             
             // Calculate absolute values (Currency)
             const earnedValue = totalBudget * (progress / 100);
             const plannedValue = totalBudget * (target / 100);
             const actualCost = totalBudget * (progress / 100) * (Math.random() * 0.4 + 0.8); // Random cost efficiency
             
             const spi = plannedValue > 0 ? (earnedValue / plannedValue).toFixed(2) : 1;
             const cpi = actualCost > 0 ? (earnedValue / actualCost).toFixed(2) : 1;
             
             await connection.query(`
                INSERT INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, spi, cpi)
                VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)
            `, [`met-${id}`, id, actualCost, progress, plannedValue, earnedValue, spi, cpi]);
        }

        console.log('Successfully generated 50 realistic EMP projects.');

    } catch (error) {
        console.error('Generation failed:', error);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
};

generateProjects();
