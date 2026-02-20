import db from '../config/db.js';

// Minimal data for seeding based on the mock structure
const sampleProjects = [
    {
        id: 'EXP-101', name: 'Seismic 3D Area Sumatra', category: 'Exploration', status: 'Berjalan', priority: 'Tinggi',
        progress: 45, target: 40, budgetUsed: 70, budgetTotal: 1500000000, startMonth: 0, duration: 4,
        sponsor: 'SKK Migas', manager: 'Budi Santoso', strategy: 'Fast Track Seismic', startDate: '01 Jan 2026', endDate: '30 Apr 2026',
        location: 'Blok Malacca Strait',
        issues: ['Cuaca buruk menghambat akuisisi data']
    },
    {
        id: 'EXP-102', name: 'G&G Study Basin Jawa', category: 'Exploration', status: 'Berjalan', priority: 'Sedang',
        progress: 80, target: 80, budgetUsed: 60, budgetTotal: 500000000, startMonth: 1, duration: 3,
        sponsor: 'Internal EMP', manager: 'Andi Wijaya', strategy: 'In-house Study', startDate: '01 Feb 2026', endDate: '30 Apr 2026',
        location: 'Kantor Pusat Jakarta', issues: ['Kendala perizinan']
    },
    {
        id: 'DRL-201', name: 'Dev Well D-1 Drilling', category: 'Drilling', status: 'Berjalan', priority: 'Tinggi',
        progress: 70, target: 70, budgetUsed: 65, budgetTotal: 4000000000, startMonth: 0, duration: 2,
        sponsor: 'Development', manager: 'Raihan P', strategy: 'Batch Drilling', startDate: '01 Jan 2026', endDate: '28 Feb 2026',
        location: 'Blok Kangean', issues: ['Budget overrun']
    },
    {
        id: 'FCL-301', name: 'Construction Gathering St.', category: 'Facility', status: 'Berjalan', priority: 'Tinggi',
        progress: 60, target: 60, budgetUsed: 55, budgetTotal: 10000000000, startMonth: 0, duration: 8,
        sponsor: 'Projects Div', manager: 'Ir. Soleh', strategy: 'EPC Contract', startDate: '01 Jan 2026', endDate: '30 Aug 2026',
        location: 'Blok Kangean', issues: ['Budget overrun']
    },
    {
        id: 'OPS-401', name: 'Preventive Maint GT-1', category: 'Operation', status: 'Berjalan', priority: 'Tinggi',
        progress: 100, target: 100, budgetUsed: 95, budgetTotal: 500000000, startMonth: 0, duration: 1,
        sponsor: 'Maintenance', manager: 'Turbine Spv', strategy: '4000 Hours Inspection', startDate: '01 Jan 2026', endDate: '30 Jan 2026',
        location: 'Blok Gebang', issues: []
    }
];

const seed = async () => {
    try {
        console.log('Seeding data...');
        for (const p of sampleProjects) {
            const query = `
                INSERT INTO projects 
                (id, name, category, status, priority, progress, target, budgetUsed, budgetTotal, 
                 startMonth, duration, sponsor, manager, strategy, startDate, endDate, location, 
                 issues, timelineEvents, team, hse, documents, gallery) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name=VALUES(name)
            `;

            await db.query(query, [
                p.id, p.id + " - " + p.name, p.category, p.status, p.priority, p.progress || 0, p.target || 0,
                p.budgetUsed || 0, p.budgetTotal || 0, p.startMonth || 0, p.duration || 0,
                p.sponsor, p.manager, p.strategy, p.startDate, p.endDate, p.location,
                JSON.stringify(p.issues || []),
                JSON.stringify([]),
                JSON.stringify([]),
                JSON.stringify({}),
                JSON.stringify([]),
                JSON.stringify([])
            ]);
        }
        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
