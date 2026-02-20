const ASSETS = [
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
    { region: 'Jawa', name: "Kangean Block", location: "Jawa Timur (Offshore)" },
    { region: 'Sulawesi', name: "Sengkang Block", location: "Sulawesi Selatan" },
    { region: 'Mozambique', name: "Buzi EPCC", location: "Mozambique" }
];

const ACTIVITIES = {
    'EXPLORATION': ['Seismic 2D Acquisition', 'Seismic 3D Survey', 'Exploration Well Drilling', 'Geological Study', 'G&G Analysis'],
    'DRILLING': ['Development Well Drilling', 'Infill Drilling', 'Workover Well', 'Well Deepening', 'Rig Mobilization'],
    'OPERATION': ['Production Optimization', 'Gas Compressor Overhaul', 'Pipeline Inspection', 'Well Maintenance', 'Pump Replacement'],
    'FACILITY': ['New Separator Installation', 'Storage Tank Repair', 'Flowline Replacement', 'Control Room Upgrade', 'HSE Equipment Upgrade']
};

const CATEGORIES = ['EXPLORATION', 'DRILLING', 'OPERATION', 'FACILITY'];
const PRIORITIES = ['Tinggi', 'Sedang', 'Rendah'];
const STATUSES = ['Berjalan', 'Berjalan', 'Berjalan', 'Beresiko', 'Tertunda', 'Selesai'];
const MANAGERS = ['Budi Santoso', 'Siti Aminah', 'Eko Prasetyo', 'Dewi Lestari', 'Agus Setiawan', 'Rina Wati', 'Joko Widodo', 'Andi Hidayat'];

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

const generateMockProjects = () => {
    const projects = [];

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
            minBudget = 50000000000; 
            maxBudget = 1500000000000;
        } else if (category === 'EXPLORATION') {
            minBudget = 20000000000;
            maxBudget = 500000000000;
        } else if (category === 'FACILITY') {
             minBudget = 5000000000;
             maxBudget = 200000000000;
        }

        const totalBudget = Math.floor(Math.random() * (maxBudget - minBudget + 1)) + minBudget;
        const locationStr = `${asset.name} (${asset.region})`; 

        // Calculation Logic mimicking Controller
        const progress = status === 'Selesai' ? 100 : Math.floor(Math.random() * 90);
        const target = Math.max(0, Math.min(100, progress + (Math.random() * 20 - 10)));
        const budgetUsed = totalBudget * (progress / 100) * (Math.random() * 0.4 + 0.8);
        
        const earnedValue = totalBudget * (progress / 100);
        const plannedValue = totalBudget * (target / 100);
        const spi = plannedValue > 0 ? parseFloat((earnedValue / plannedValue).toFixed(2)) : 1;
        const cpi = budgetUsed > 0 ? parseFloat((earnedValue / budgetUsed).toFixed(2)) : 1;

        // Issues
        const issues = [];
        if (status === 'Beresiko' || status === 'Tertunda' || Math.random() > 0.8) {
            const numIssues = Math.floor(Math.random() * 2) + 1;
            for (let k = 0; k < numIssues; k++) {
                issues.push(ISSUE_TEMPLATES[Math.floor(Math.random() * ISSUE_TEMPLATES.length)]);
            }
        }

        // Timeline Events (Simplified)
        const timelineEvents = [];
        const phases = ['Preparation', 'Execution', 'Reporting'];
        const durationPerPhase = Math.floor(duration / phases.length) || 1;
        let currentStart = startDate;
        
        for (let j = 0; j < phases.length; j++) {
            const eventEnd = addMonths(currentStart, durationPerPhase);
            timelineEvents.push({
                id: `evt-${id}-${j}`,
                eventName: phases[j],
                startDate: currentStart,
                endDate: eventEnd,
                description: `${phases[j]} phase for ${name}`
            });
            currentStart = eventEnd;
        }

        // Team (Simplified)
        const team = [
            { name: manager, role: 'Project Manager' },
            { name: 'Staff A', role: 'Engineer' },
            { name: 'Staff B', role: 'HSE Officer' }
        ];
        
        projects.push({
            id,
            name,
            category,
            priority,
            status,
            startDate,
            endDate,
            duration,
            totalBudget,
            budgetUsed, // Backend uses this name instead of actualCost in list sometimes? Controller maps query result.
            // Let's match what UI expects: budgetUsed, progress, target, spi, cpi, issues, team, timelineEvents
            target,
            progress,
            spi: spi || 1, // Ensure fallback
            cpi: cpi || 1,
            location: locationStr,
            manager,
            issues, 
            timelineEvents,
            team,
            gallery: [],
            documents: []
        });
    }

    return projects;
};

export const MOCK_PROJECTS = generateMockProjects();
