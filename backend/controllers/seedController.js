import db from '../config/db.js';

// ─── Reference Data ────────────────────────────────────────────────────────

const PROJECT_NAMES = [
  'Eksplorasi Cekungan Sumatera Selatan', 'Pengeboran Sumur Dev-3X', 'Rehabilitasi Separator Gas',
  'Pemasangan Flowline Offshore Block B', 'Survey Seismik 3D Blok Kalimantan',
  'Pengembangan Lapangan Minyak Matur', 'Upgrade Kompresor Fasilitas Produksi',
  'Pembangunan Wellpad DRL-09', 'Studi EOR Injeksi Polimer', 'Overhaul Pompa Sentrifugal A',
  'Pipeline Integrity Assessment', 'Pengembangan Lapangan Gas Bumi Korinci',
  'Konstruksi Stasiun Pengumpul SP-07', 'Workover Sumur Tua WR-22X', 'Eksplorasi Blok Malacca Strait',
  'Instalasi Turbin Gas GTG-03', 'Pelapisan Ulang Tangki Timbun TK-12',
  'Pembangunan Dermaga Pengisian LNG', 'Proyek Deliniasi Sumur SUM-10',
  'Optimasi Lifting Gas System', 'Penggantian Manifold Header Produksi',
  'Survei Batimetri Laut Jawa Blok L', 'Instalasi SCADA Real-Time Monitoring',
  'Rekonstruksi Heater Treater Unit-2', 'Perluasan Tangki Penyimpanan TK-18',
  'Pengeboran Sumur Appraisal AP-07X', 'Komisi Turbin Uap ST-02',
  'Perluasan Fasilitas Receiving LNG', 'Simulasi Reservoir Dinamis',
  'Pembangunan Jalan Akses Ladang Baru', 'Overhaul Kompresor Gas K-04',
  'Pengembangan Infrastruktur Water Injection', 'Pemasangan Subsea Control Module',
  'Konstruksi Tangki Storage TK-20', 'Proyek Smart Well Completion',
  'Persiapan Pengeboran Sumur Dev-7', 'Studi Kelayakan Lapangan X-Ray',
  'Pengadaan & Instalasi FPSO Unit', 'Pembangunan Power Plant 10 MW',
  'Uji Produksi Sumur DRL-15', 'Recertifikasi Flare Stack FS-02',
  'Operasi Penutupan Sumur Tua P&A-5', 'Upgrade Kontrol Sistem DCS',
  'Modifikasi Slug Catcher SC-01', 'Pengeboran Horizontal HDD-04X',
  'Eksplorasi Deep Water Blok Makassar', 'Konstruksi Metering Station MS-09',
  'Overhaul Annual Pompa K-02', 'Studi Prospek Geologi Blok Tonga',
  'Pembangunan Kamp Fasilitas Pekerja', 'Implementasi Fiber Optic Network'
];

const CATEGORIES = ['EXPLORATION', 'DRILLING', 'OPERATION', 'FACILITY'];
const PRIORITIES = ['Tinggi', 'Sedang', 'Rendah'];
const STATUSES = ['Berjalan', 'Beresiko', 'Tertunda', 'Selesai'];
const LOCATIONS = [
  'Bentu Block (Sumatra)', 'Bireun-Sigli Block (Sumatra)', 'Gebang Block (Sumatra)',
  'Tonga Block (Sumatra)', 'Malacca Strait Block (Sumatra)', 'Siak Block (Sumatra)',
  'Kampar Block (Sumatra)', '\'B\' Block (Sumatra)', 'Korinci Baru Block (Sumatra)',
  'South CPP Block (Sumatra)', 'Kangean Block (Jawa)', 'Sengkang Block (Sulawesi)',
  'Buzi EPCC (Mozambique)'
];
const MANAGERS = [
  'Budi Santoso', 'Siti Aminah', 'Andi Hidayat', 'Rina Wati', 'Dewi Lestari',
  'Joko Widodo', 'Agus Setiawan', 'Eko Prasetyo', 'Hendra Saputra', 'Indah Kusuma'
];
const DIVISIONS = ['Drilling & Workover', 'Production', 'Facilities Engineering', 'Reservoir', 'Supply Chain', 'HSSE', 'Subsurface'];
const ISSUE_TITLES = [
  'Keterlambatan Pengiriman Material', 'Cuaca buruk menghentikan aktivitas offshore', 'Revisi Desain Engineering',
  'Kekurangan tenaga kerja kontraktor', 'Keterlambatan persetujuan izin dari pemerintah daerah', 'Sengketa pembebasan lahan dengan masyarakat lokal',
  'Kerusakan peralatan saat operasi', 'Peningkatan Biaya Material', 'Investigasi insiden keselamatan diperlukan',
  'Temuan geologis tak terduga memerlukan revisi rencana', 'Gangguan rantai pasok untuk suku cadang kritis', 'Perselisihan Kontrak Vendor'
];
const EVENT_NAMES = ['Preparation', 'Execution', 'Reporting'];

// ─── Helpers ───────────────────────────────────────────────────────────────

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, dec = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d.toISOString().split('T')[0]; };

// ─── Main Seed Function (camelCase) ─────────────────────────────────────────

export const seedRandomProjects = async (req, res) => {
    try {
        const [existingProjects] = await db.query("SELECT COUNT(*) as cnt FROM projects");
        const startIdx = existingProjects[0].cnt + 1;

        const projects = [];
        const employees = [];
        const projectMembers = [];
        const timelineEvents = [];
        const milestones = [];
        const issues = [];
        const metrics = [];

        // Generate 10 employees pool
        for (let i = 0; i < 10; i++) {
            const empId = `EMP-SEED-${i + 1}`;
            employees.push([empId, MANAGERS[i], rand(['Senior Engineer', 'Project Manager', 'Drilling Engineer']), rand(['Engineering', 'Operations', 'Drilling'])]);
        }

        const CAT_PREFIXES = { 'EXPLORATION': 'EXP', 'DRILLING': 'DRI', 'OPERATION': 'OPE', 'FACILITY': 'FAC' };

        for (let i = 0; i < 50; i++) {
            const idx = startIdx + i;
            const category = rand(CATEGORIES);
            const prefix = CAT_PREFIXES[category];
            const projectId = `EMP-${prefix}-${String(idx).padStart(3, '0')}`;
            const status = rand(STATUSES);
            const priority = rand(PRIORITIES);
            const manager = rand(MANAGERS);
            const location = rand(LOCATIONS);
            const startDate = `202${randInt(4, 6)}-${String(randInt(1, 12)).padStart(2, '0')}-${String(randInt(1, 28)).padStart(2, '0')}`;
            const durationMonths = randInt(4, 12);
            const endDate = addDays(startDate, durationMonths * 30);
            const totalBudget = randInt(1, 50) * 500_000_000;
            const name = PROJECT_NAMES[i] || `${location.split(' ')[0]} - ${category} Project #${idx}`;

            // camelCase columns: id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager
            projects.push([projectId, projectId, name, category, priority, status, startDate, endDate, totalBudget, location, manager]);

            // Project member
            const empId = `EMP-SEED-${randInt(1, 10)}`;
            // camelCase: id, projectId, employeeId, role
            projectMembers.push([`PM-SEED-${idx}`, projectId, empId, 'Project Manager']);

            // Timeline events (3 events: Preparation, Execution, Reporting)
            let eventStart = startDate;
            let overallProgress = 0;

            for (let e = 0; e < 3; e++) {
                const evtId = `evt-${projectId}-${e}`;
                const evtEnd = addDays(eventStart, randInt(30, 90));
                const evtBudget = Math.round(totalBudget / 3);
                const evtProgress = status === 'Selesai' ? 100 : (e === 0 ? randInt(50, 100) : randInt(0, 95));
                overallProgress += evtProgress / 3;

                // camelCase: id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress
                timelineEvents.push([evtId, projectId, EVENT_NAMES[e], eventStart, evtEnd, evtBudget, evtProgress]);

                // 2 milestones per event
                for (let m = 0; m < 2; m++) {
                    const milId = `mil-${projectId}-${e}-${m}`;
                    const isCompleted = evtProgress === 100 || (evtProgress > 50 && m === 0);
                    const completedAt = isCompleted ? addDays(eventStart, randInt(10, 30)) : null;
                    // camelCase: id, timelineEventId, milestoneName, progressContribution, isCompleted, completedAt
                    milestones.push([milId, evtId, `Milestone ${e + 1}.${m + 1}`, 50, isCompleted, completedAt]);
                }

                eventStart = addDays(evtEnd, 1);
            }

            // 0–2 issues
            const numIssues = randInt(0, 2);
            for (let is = 0; is < numIssues; is++) {
                const issueId = `iss-${projectId}-${is}`;
                // camelCase: id, projectId, title, division, severity, status, impactScore
                issues.push([issueId, projectId, rand(ISSUE_TITLES), rand(DIVISIONS), rand(['HIGH', 'MEDIUM', 'LOW']), rand(['OPEN', 'IN_PROGRESS', 'CLOSED']), randInt(1, 5)]);
            }

            // EVM metrics
            const progress = Math.min(100, Math.round(overallProgress));
            const budgetUsed = Math.round(totalBudget * (progress / 100) * randFloat(0.85, 1.15));
            const plannedValue = Math.round(totalBudget * randFloat(0.3, 0.9));
            const earnedValue = Math.round(totalBudget * (progress / 100));
            const spi = plannedValue > 0 ? parseFloat((earnedValue / plannedValue).toFixed(2)) : 1.0;
            const cpi = budgetUsed > 0 ? parseFloat((earnedValue / budgetUsed).toFixed(2)) : 1.0;
            const sv = earnedValue - plannedValue;
            const cv = earnedValue - budgetUsed;
            // camelCase: id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, scheduleVariance, costVariance, spi, cpi
            metrics.push([`met-${projectId}`, projectId, new Date().toISOString().split('T')[0], budgetUsed, progress, plannedValue, earnedValue, sv, cv, spi, cpi]);
        }

        // ── Insert everything ──────────────────────────────────────────────
        for (const emp of employees) {
            await db.query(`INSERT IGNORE INTO employees (id, name, position, department) VALUES (?, ?, ?, ?)`, emp);
        }
        for (const p of projects) {
            await db.query(`INSERT IGNORE INTO projects (id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, p);
        }
        for (const pm of projectMembers) {
            await db.query(`INSERT IGNORE INTO project_members (id, projectId, employeeId, role) VALUES (?, ?, ?, ?)`, pm);
        }
        for (const evt of timelineEvents) {
            await db.query(`INSERT IGNORE INTO timeline_events (id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress) VALUES (?, ?, ?, ?, ?, ?, ?)`, evt);
        }
        for (const m of milestones) {
            await db.query(`INSERT IGNORE INTO task_milestones (id, timelineEventId, milestoneName, progressContribution, isCompleted, completedAt) VALUES (?, ?, ?, ?, ?, ?)`, m);
        }
        for (const iss of issues) {
            await db.query(`INSERT IGNORE INTO issues (id, projectId, title, division, severity, status, impactScore) VALUES (?, ?, ?, ?, ?, ?, ?)`, iss);
        }
        for (const mt of metrics) {
            await db.query(`INSERT IGNORE INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, scheduleVariance, costVariance, spi, cpi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, mt);
        }

        res.json({
            success: true,
            message: `✅ Berhasil menyisipkan 50 project random beserta data relasionalnya!`,
            details: {
                projects: projects.length,
                employees: employees.length,
                timelineEvents: timelineEvents.length,
                milestones: milestones.length,
                issues: issues.length,
                metrics: metrics.length
            }
        });

    } catch (error) {
        console.error('Seed Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
