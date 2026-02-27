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
const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['ON_TRACK', 'AT_RISK', 'DELAYED', 'COMPLETED'];
const LOCATIONS = [
    'Blok B (Sumatra)', 'Blok Bireun-Sigli (Sumatra)', 'Blok Gebang (Sumatra)',
    'Blok Tonga (Sumatra)', 'Blok Malacca Strait (Sumatra)', 'Blok Siak (Sumatra)',
    'Blok Kampar (Sumatra)', 'Blok Bentu (Sumatra)', 'Blok Korinci Baru (Sumatra)',
    'Blok South CPP (Sumatra)', 'Blok Kangean (Jawa)', 'Blok Sengkang (Sulawesi)',
    'Blok Buzi EPCC (Mozambique)'
];
const MANAGERS = [
    'Budi Santoso', 'Siti Aminah', 'Andi Wijaya', 'Rizky Pratama', 'Dewi Lestari',
    'Fajar Nugroho', 'Hendra Saputra', 'Indah Kusuma', 'Joko Wibowo', 'Kartini Halim'
];
const DIVISIONS = ['Drilling & Workover', 'Production', 'Facilities Engineering', 'Reservoir', 'Supply Chain', 'HSSE', 'Subsurface'];
const ISSUE_TITLES = [
    'Keterlambatan Pengiriman Material', 'Cuaca Buruk di Lokasi', 'Revisi Desain Engineering',
    'Kekurangan Tenaga Ahli Lapangan', 'Perubahan Regulasi Pemerintah', 'Masalah Perizinan Lahan',
    'Kerusakan Peralatan Utama', 'Peningkatan Biaya Material', 'Kendala Aksesibilitas Lokasi',
    'Kegagalan Pengujian Pressure Test', 'Penundaan Mobilisasi Rig', 'Perselisihan Kontrak Vendor'
];
const EVENT_NAMES = [
    ['Studi & Persiapan', 'Mobilisasi Tim', 'Pelaksanaan Utama', 'Commissioning', 'Demobilisasi'],
    ['Survey Lokasi', 'Engineering Design', 'Pengadaan Material', 'Konstruksi', 'Testing & Handover'],
    ['Perencanaan', 'Mobilisasi', 'Operasi Lapangan', 'Evaluasi', 'Penutupan'],
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, dec = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const addDays = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d.toISOString().split('T')[0]; };

// ─── Main Seed Function ────────────────────────────────────────────────────

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

        // Generate 50 employees pool
        for (let i = 0; i < 10; i++) {
            const empId = `EMP-SEED-${i + 1}`;
            employees.push([empId, MANAGERS[i], rand(['Senior Engineer', 'Project Manager', 'Drilling Engineer']), rand(['Engineering', 'Operations', 'Drilling'])]);
        }

        for (let i = 0; i < 25; i++) {
            const idx = startIdx + i;
            const projectId = `PRJ-${String(idx).padStart(3, '0')}`;
            const category = rand(CATEGORIES);
            const status = rand(STATUSES);
            const priority = rand(PRIORITIES);
            const startDate = `202${randInt(4, 5)}-${String(randInt(1, 10)).padStart(2, '0')}-01`;
            const durationMonths = randInt(4, 24);
            const endDate = addDays(startDate, durationMonths * 30);
            const totalBudget = randInt(1, 50) * 500_000_000;
            const name = PROJECT_NAMES[i] || `Proyek ${category} ${idx}`;

            projects.push([projectId, `${category.substring(0, 3)}-${idx}`, name, category, priority, status, startDate, endDate, totalBudget, rand(LOCATIONS)]);

            // Project member
            const empId = `EMP-SEED-${randInt(1, 10)}`;
            projectMembers.push([`PM-SEED-${idx}`, projectId, empId, 'Project Manager']);

            // Timeline events (3–4 events)
            const eventTemplate = rand(EVENT_NAMES);
            const numEvents = randInt(3, 4);
            let eventStart = startDate;
            let overallProgress = 0;
            const eventIds = [];

            for (let e = 0; e < numEvents; e++) {
                const evtId = `EVT-SEED-${idx}-${e + 1}`;
                const evtEnd = addDays(eventStart, randInt(30, 90));
                const evtBudget = Math.round(totalBudget / numEvents);
                const evtProgress = e < numEvents - 1 ? (status === 'COMPLETED' ? 100 : e === 0 ? 100 : randInt(0, 100)) : (status === 'COMPLETED' ? 100 : randInt(0, 60));
                overallProgress += evtProgress / numEvents;

                timelineEvents.push([evtId, projectId, eventTemplate[e] || `Fase ${e + 1}`, eventStart, evtEnd, evtBudget, evtProgress]);
                eventIds.push(evtId);

                // 2 milestones per event
                for (let m = 0; m < 2; m++) {
                    const milId = `MIL-SEED-${idx}-${e + 1}-${m + 1}`;
                    const contribution = 50;
                    const isCompleted = evtProgress === 100 || (evtProgress > 50 && m === 0);
                    const completedAt = isCompleted ? addDays(eventStart, randInt(10, 30)) : null;
                    milestones.push([milId, evtId, `Milestone ${e + 1}.${m + 1}`, contribution, isCompleted, completedAt]);
                }

                eventStart = addDays(evtEnd, 1);
            }

            // 0–2 issues
            const numIssues = randInt(0, 2);
            for (let is = 0; is < numIssues; is++) {
                const issueId = `ISS-SEED-${idx}-${is + 1}`;
                issues.push([issueId, projectId, rand(ISSUE_TITLES), rand(DIVISIONS), rand(['HIGH', 'MEDIUM', 'LOW']), rand(['OPEN', 'IN_PROGRESS', 'CLOSED']), randInt(1, 10)]);
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
            metrics.push([`MET-SEED-${idx}`, projectId, new Date().toISOString().split('T')[0], budgetUsed, progress, plannedValue, earnedValue, sv, cv, spi, cpi]);
        }

        // ── Insert everything ──────────────────────────────────────────────
        // Employees (upsert)
        for (const emp of employees) {
            await db.query(
                `INSERT IGNORE INTO employees (id, name, position, department) VALUES (?, ?, ?, ?)`, emp
            );
        }

        // Projects
        for (const p of projects) {
            await db.query(
                `INSERT IGNORE INTO projects (id, project_code, name, category, priority, status, start_date, end_date, total_budget, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, p
            );
        }

        // Project Members
        for (const pm of projectMembers) {
            await db.query(`INSERT IGNORE INTO project_members (id, project_id, employee_id, role) VALUES (?, ?, ?, ?)`, pm);
        }

        // Timeline Events
        for (const evt of timelineEvents) {
            await db.query(`INSERT IGNORE INTO timeline_events (id, project_id, event_name, start_date, end_date, task_budget, calculated_progress) VALUES (?, ?, ?, ?, ?, ?, ?)`, evt);
        }

        // Milestones
        for (const m of milestones) {
            await db.query(`INSERT IGNORE INTO task_milestones (id, timeline_event_id, milestone_name, progress_contribution, is_completed, completed_at) VALUES (?, ?, ?, ?, ?, ?)`, m);
        }

        // Issues
        for (const iss of issues) {
            await db.query(`INSERT IGNORE INTO issues (id, project_id, title, division, severity, status, impact_score) VALUES (?, ?, ?, ?, ?, ?, ?)`, iss);
        }

        // Metrics
        for (const mt of metrics) {
            await db.query(`INSERT IGNORE INTO project_metrics (id, project_id, record_date, actual_cost, actual_progress, planned_value, earned_value, schedule_variance, cost_variance, spi, cpi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, mt);
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
