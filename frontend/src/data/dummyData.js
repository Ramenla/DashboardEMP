/**
 * @file dummyData.js
 * @description Data dummy yang mereplikasi struktur database secara lengkap.
 * Mencakup tabel: projects, employees, project_members, timeline_events,
 * task_milestones, issues, dan project_metrics.
 *
 * File ini digunakan sebagai fallback ketika backend tidak tersedia,
 * sehingga frontend tetap bisa berjalan dan menampilkan data.
 */

// ─────────────────────────────────────────────────────────────────────────────
// TABLE: employees
// ─────────────────────────────────────────────────────────────────────────────
export const employees = [
    { id: 'EMP-SEED-1',  name: 'Budi Santoso',   position: 'Project Manager',   department: 'Engineering' },
    { id: 'EMP-SEED-2',  name: 'Siti Aminah',    position: 'Senior Engineer',   department: 'Operations' },
    { id: 'EMP-SEED-3',  name: 'Andi Hidayat',   position: 'Drilling Engineer', department: 'Drilling' },
    { id: 'EMP-SEED-4',  name: 'Rina Wati',      position: 'Project Manager',   department: 'Engineering' },
    { id: 'EMP-SEED-5',  name: 'Dewi Lestari',   position: 'Senior Engineer',   department: 'Operations' },
    { id: 'EMP-SEED-6',  name: 'Joko Widodo',    position: 'Drilling Engineer', department: 'Drilling' },
    { id: 'EMP-SEED-7',  name: 'Agus Setiawan',  position: 'Project Manager',   department: 'Engineering' },
    { id: 'EMP-SEED-8',  name: 'Eko Prasetyo',   position: 'Senior Engineer',   department: 'Operations' },
    { id: 'EMP-SEED-9',  name: 'Hendra Saputra', position: 'Drilling Engineer', department: 'Drilling' },
    { id: 'EMP-SEED-10', name: 'Indah Kusuma',   position: 'Project Manager',   department: 'Engineering' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TABLE: projects
// ─────────────────────────────────────────────────────────────────────────────
export const projects = [
    // ── EXPLORATION ──────────────────────────────────────────────────────────
    {
        id: 'EMP-EXP-001', projectCode: 'EMP-EXP-001',
        name: 'Eksplorasi Cekungan Sumatera Selatan',
        category: 'EXPLORATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-03-01', endDate: '2025-11-30',
        totalBudget: 12500000000, location: 'Bentu Block (Sumatra)', manager: 'Budi Santoso',
    },
    {
        id: 'EMP-EXP-002', projectCode: 'EMP-EXP-002',
        name: 'Survey Seismik 3D Blok Kalimantan',
        category: 'EXPLORATION', priority: 'Sedang', status: 'Tertunda',
        startDate: '2025-06-01', endDate: '2026-01-31',
        totalBudget: 8500000000, location: 'Tonga Block (Sumatra)', manager: 'Siti Aminah',
    },
    {
        id: 'EMP-EXP-003', projectCode: 'EMP-EXP-003',
        name: 'Eksplorasi Blok Malacca Strait',
        category: 'EXPLORATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-01-15', endDate: '2025-09-15',
        totalBudget: 15000000000, location: 'Malacca Strait Block (Sumatra)', manager: 'Andi Hidayat',
    },
    {
        id: 'EMP-EXP-004', projectCode: 'EMP-EXP-004',
        name: 'Survei Batimetri Laut Jawa Blok L',
        category: 'EXPLORATION', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-04-01', endDate: '2024-12-31',
        totalBudget: 5000000000, location: 'Kangean Block (Jawa)', manager: 'Rina Wati',
    },
    {
        id: 'EMP-EXP-005', projectCode: 'EMP-EXP-005',
        name: 'Pengeboran Sumur Appraisal AP-07X',
        category: 'EXPLORATION', priority: 'Tinggi', status: 'Beresiko',
        startDate: '2025-09-01', endDate: '2026-05-31',
        totalBudget: 20000000000, location: 'Bireun-Sigli Block (Sumatra)', manager: 'Dewi Lestari',
    },
    {
        id: 'EMP-EXP-006', projectCode: 'EMP-EXP-006',
        name: 'Studi Prospek Geologi Blok Tonga',
        category: 'EXPLORATION', priority: 'Sedang', status: 'Berjalan',
        startDate: '2025-02-01', endDate: '2025-08-31',
        totalBudget: 3500000000, location: 'Tonga Block (Sumatra)', manager: 'Joko Widodo',
    },
    {
        id: 'EMP-EXP-007', projectCode: 'EMP-EXP-007',
        name: 'Studi Kelayakan Lapangan X-Ray',
        category: 'EXPLORATION', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-07-01', endDate: '2025-01-31',
        totalBudget: 2500000000, location: 'Gebang Block (Sumatra)', manager: 'Agus Setiawan',
    },
    {
        id: 'EMP-EXP-008', projectCode: 'EMP-EXP-008',
        name: 'Eksplorasi Deep Water Blok Makassar',
        category: 'EXPLORATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2026-01-01', endDate: '2026-10-31',
        totalBudget: 25000000000, location: 'Sengkang Block (Sulawesi)', manager: 'Eko Prasetyo',
    },
    {
        id: 'EMP-EXP-009', projectCode: 'EMP-EXP-009',
        name: 'Proyek Deliniasi Sumur SUM-10',
        category: 'EXPLORATION', priority: 'Sedang', status: 'Tertunda',
        startDate: '2026-03-01', endDate: '2026-09-30',
        totalBudget: 6000000000, location: 'South CPP Block (Sumatra)', manager: 'Hendra Saputra',
    },
    {
        id: 'EMP-EXP-010', projectCode: 'EMP-EXP-010',
        name: 'Simulasi Reservoir Dinamis',
        category: 'EXPLORATION', priority: 'Rendah', status: 'Berjalan',
        startDate: '2025-11-01', endDate: '2026-05-31',
        totalBudget: 4000000000, location: 'Kampar Block (Sumatra)', manager: 'Indah Kusuma',
    },

    // ── DRILLING ─────────────────────────────────────────────────────────────
    {
        id: 'EMP-DRI-001', projectCode: 'EMP-DRI-001',
        name: 'Pengeboran Sumur Dev-3X',
        category: 'DRILLING', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-04-01', endDate: '2025-10-31',
        totalBudget: 18000000000, location: 'Siak Block (Sumatra)', manager: 'Budi Santoso',
    },
    {
        id: 'EMP-DRI-002', projectCode: 'EMP-DRI-002',
        name: 'Workover Sumur Tua WR-22X',
        category: 'DRILLING', priority: 'Sedang', status: 'Selesai',
        startDate: '2024-09-01', endDate: '2025-03-31',
        totalBudget: 7500000000, location: 'Bentu Block (Sumatra)', manager: 'Siti Aminah',
    },
    {
        id: 'EMP-DRI-003', projectCode: 'EMP-DRI-003',
        name: 'Pembangunan Wellpad DRL-09',
        category: 'DRILLING', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-07-01', endDate: '2026-03-31',
        totalBudget: 22000000000, location: 'Korinci Baru Block (Sumatra)', manager: 'Andi Hidayat',
    },
    {
        id: 'EMP-DRI-004', projectCode: 'EMP-DRI-004',
        name: 'Persiapan Pengeboran Sumur Dev-7',
        category: 'DRILLING', priority: 'Rendah', status: 'Tertunda',
        startDate: '2026-02-01', endDate: '2026-08-31',
        totalBudget: 9000000000, location: 'Bireun-Sigli Block (Sumatra)', manager: 'Rina Wati',
    },
    {
        id: 'EMP-DRI-005', projectCode: 'EMP-DRI-005',
        name: 'Pengeboran Horizontal HDD-04X',
        category: 'DRILLING', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-10-01', endDate: '2026-06-30',
        totalBudget: 30000000000, location: 'Malacca Strait Block (Sumatra)', manager: 'Dewi Lestari',
    },
    {
        id: 'EMP-DRI-006', projectCode: 'EMP-DRI-006',
        name: 'Uji Produksi Sumur DRL-15',
        category: 'DRILLING', priority: 'Sedang', status: 'Selesai',
        startDate: '2024-11-01', endDate: '2025-05-31',
        totalBudget: 5500000000, location: 'Siak Block (Sumatra)', manager: 'Joko Widodo',
    },
    {
        id: 'EMP-DRI-007', projectCode: 'EMP-DRI-007',
        name: 'Operasi Penutupan Sumur Tua P&A-5',
        category: 'DRILLING', priority: 'Rendah', status: 'Beresiko',
        startDate: '2025-05-01', endDate: '2025-11-30',
        totalBudget: 4500000000, location: "B' Block (Sumatra)", manager: 'Agus Setiawan',
    },
    {
        id: 'EMP-DRI-008', projectCode: 'EMP-DRI-008',
        name: 'Proyek Smart Well Completion',
        category: 'DRILLING', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2026-01-15', endDate: '2026-09-15',
        totalBudget: 35000000000, location: 'Kampar Block (Sumatra)', manager: 'Eko Prasetyo',
    },
    {
        id: 'EMP-DRI-009', projectCode: 'EMP-DRI-009',
        name: 'Pengadaan & Instalasi FPSO Unit',
        category: 'DRILLING', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-08-01', endDate: '2026-07-31',
        totalBudget: 50000000000, location: 'Sengkang Block (Sulawesi)', manager: 'Hendra Saputra',
    },
    {
        id: 'EMP-DRI-010', projectCode: 'EMP-DRI-010',
        name: 'Studi EOR Injeksi Polimer',
        category: 'DRILLING', priority: 'Sedang', status: 'Tertunda',
        startDate: '2026-04-01', endDate: '2026-10-31',
        totalBudget: 11000000000, location: 'Tonga Block (Sumatra)', manager: 'Indah Kusuma',
    },

    // ── OPERATION ────────────────────────────────────────────────────────────
    {
        id: 'EMP-OPE-001', projectCode: 'EMP-OPE-001',
        name: 'Rehabilitasi Separator Gas',
        category: 'OPERATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-02-01', endDate: '2025-08-31',
        totalBudget: 6500000000, location: 'Bentu Block (Sumatra)', manager: 'Budi Santoso',
    },
    {
        id: 'EMP-OPE-002', projectCode: 'EMP-OPE-002',
        name: 'Overhaul Pompa Sentrifugal A',
        category: 'OPERATION', priority: 'Sedang', status: 'Selesai',
        startDate: '2024-06-01', endDate: '2024-12-31',
        totalBudget: 3000000000, location: 'Siak Block (Sumatra)', manager: 'Siti Aminah',
    },
    {
        id: 'EMP-OPE-003', projectCode: 'EMP-OPE-003',
        name: 'Pengembangan Lapangan Minyak Matur',
        category: 'OPERATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-01-01', endDate: '2025-12-31',
        totalBudget: 17500000000, location: 'Gebang Block (Sumatra)', manager: 'Andi Hidayat',
    },
    {
        id: 'EMP-OPE-004', projectCode: 'EMP-OPE-004',
        name: 'Optimasi Lifting Gas System',
        category: 'OPERATION', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-10-01', endDate: '2025-04-30',
        totalBudget: 2000000000, location: 'South CPP Block (Sumatra)', manager: 'Rina Wati',
    },
    {
        id: 'EMP-OPE-005', projectCode: 'EMP-OPE-005',
        name: 'Pipeline Integrity Assessment',
        category: 'OPERATION', priority: 'Tinggi', status: 'Beresiko',
        startDate: '2025-09-01', endDate: '2026-03-31',
        totalBudget: 9500000000, location: 'Korinci Baru Block (Sumatra)', manager: 'Dewi Lestari',
    },
    {
        id: 'EMP-OPE-006', projectCode: 'EMP-OPE-006',
        name: 'Upgrade Kontrol Sistem DCS',
        category: 'OPERATION', priority: 'Sedang', status: 'Tertunda',
        startDate: '2026-01-01', endDate: '2026-07-31',
        totalBudget: 8000000000, location: 'Kampar Block (Sumatra)', manager: 'Joko Widodo',
    },
    {
        id: 'EMP-OPE-007', projectCode: 'EMP-OPE-007',
        name: 'Penggantian Manifold Header Produksi',
        category: 'OPERATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-06-15', endDate: '2025-12-15',
        totalBudget: 7000000000, location: 'Bireun-Sigli Block (Sumatra)', manager: 'Agus Setiawan',
    },
    {
        id: 'EMP-OPE-008', projectCode: 'EMP-OPE-008',
        name: 'Recertifikasi Flare Stack FS-02',
        category: 'OPERATION', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-08-01', endDate: '2025-02-28',
        totalBudget: 1500000000, location: 'Kangean Block (Jawa)', manager: 'Eko Prasetyo',
    },
    {
        id: 'EMP-OPE-009', projectCode: 'EMP-OPE-009',
        name: 'Modifikasi Slug Catcher SC-01',
        category: 'OPERATION', priority: 'Sedang', status: 'Berjalan',
        startDate: '2026-02-01', endDate: '2026-08-31',
        totalBudget: 5000000000, location: 'Tonga Block (Sumatra)', manager: 'Hendra Saputra',
    },
    {
        id: 'EMP-OPE-010', projectCode: 'EMP-OPE-010',
        name: 'Pengembangan Lapangan Gas Bumi Korinci',
        category: 'OPERATION', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-05-01', endDate: '2026-04-30',
        totalBudget: 21000000000, location: 'Korinci Baru Block (Sumatra)', manager: 'Indah Kusuma',
    },
    {
        id: 'EMP-OPE-011', projectCode: 'EMP-OPE-011',
        name: 'Implementasi Fiber Optic Network',
        category: 'OPERATION', priority: 'Sedang', status: 'Berjalan',
        startDate: '2026-01-15', endDate: '2026-07-15',
        totalBudget: 3500000000, location: 'South CPP Block (Sumatra)', manager: 'Budi Santoso',
    },

    // ── FACILITY ──────────────────────────────────────────────────────────────
    {
        id: 'EMP-FAC-001', projectCode: 'EMP-FAC-001',
        name: 'Pemasangan Flowline Offshore Block B',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-03-15', endDate: '2025-12-15',
        totalBudget: 19000000000, location: "B' Block (Sumatra)", manager: 'Budi Santoso',
    },
    {
        id: 'EMP-FAC-002', projectCode: 'EMP-FAC-002',
        name: 'Upgrade Kompresor Fasilitas Produksi',
        category: 'FACILITY', priority: 'Sedang', status: 'Berjalan',
        startDate: '2025-04-01', endDate: '2025-10-31',
        totalBudget: 10500000000, location: 'Bentu Block (Sumatra)', manager: 'Siti Aminah',
    },
    {
        id: 'EMP-FAC-003', projectCode: 'EMP-FAC-003',
        name: 'Instalasi Turbin Gas GTG-03',
        category: 'FACILITY', priority: 'Tinggi', status: 'Beresiko',
        startDate: '2025-08-01', endDate: '2026-04-30',
        totalBudget: 16000000000, location: 'Siak Block (Sumatra)', manager: 'Andi Hidayat',
    },
    {
        id: 'EMP-FAC-004', projectCode: 'EMP-FAC-004',
        name: 'Konstruksi Stasiun Pengumpul SP-07',
        category: 'FACILITY', priority: 'Sedang', status: 'Selesai',
        startDate: '2024-05-01', endDate: '2025-01-31',
        totalBudget: 12000000000, location: 'Bireun-Sigli Block (Sumatra)', manager: 'Rina Wati',
    },
    {
        id: 'EMP-FAC-005', projectCode: 'EMP-FAC-005',
        name: 'Pelapisan Ulang Tangki Timbun TK-12',
        category: 'FACILITY', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-11-01', endDate: '2025-05-31',
        totalBudget: 2500000000, location: 'Gebang Block (Sumatra)', manager: 'Dewi Lestari',
    },
    {
        id: 'EMP-FAC-006', projectCode: 'EMP-FAC-006',
        name: 'Pembangunan Dermaga Pengisian LNG',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-10-01', endDate: '2026-08-31',
        totalBudget: 28000000000, location: 'Buzi EPCC (Mozambique)', manager: 'Joko Widodo',
    },
    {
        id: 'EMP-FAC-007', projectCode: 'EMP-FAC-007',
        name: 'Rekonstruksi Heater Treater Unit-2',
        category: 'FACILITY', priority: 'Sedang', status: 'Berjalan',
        startDate: '2025-07-01', endDate: '2026-01-31',
        totalBudget: 8500000000, location: 'Kampar Block (Sumatra)', manager: 'Agus Setiawan',
    },
    {
        id: 'EMP-FAC-008', projectCode: 'EMP-FAC-008',
        name: 'Perluasan Tangki Penyimpanan TK-18',
        category: 'FACILITY', priority: 'Rendah', status: 'Tertunda',
        startDate: '2026-03-01', endDate: '2026-09-30',
        totalBudget: 6000000000, location: 'South CPP Block (Sumatra)', manager: 'Eko Prasetyo',
    },
    {
        id: 'EMP-FAC-009', projectCode: 'EMP-FAC-009',
        name: 'Instalasi SCADA Real-Time Monitoring',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-06-01', endDate: '2025-12-31',
        totalBudget: 11000000000, location: 'Korinci Baru Block (Sumatra)', manager: 'Hendra Saputra',
    },
    {
        id: 'EMP-FAC-010', projectCode: 'EMP-FAC-010',
        name: 'Konstruksi Tangki Storage TK-20',
        category: 'FACILITY', priority: 'Sedang', status: 'Selesai',
        startDate: '2024-07-01', endDate: '2025-03-31',
        totalBudget: 9500000000, location: 'Kangean Block (Jawa)', manager: 'Indah Kusuma',
    },
    {
        id: 'EMP-FAC-011', projectCode: 'EMP-FAC-011',
        name: 'Perluasan Fasilitas Receiving LNG',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2026-01-01', endDate: '2026-10-31',
        totalBudget: 33000000000, location: 'Buzi EPCC (Mozambique)', manager: 'Budi Santoso',
    },
    {
        id: 'EMP-FAC-012', projectCode: 'EMP-FAC-012',
        name: 'Pembangunan Kamp Fasilitas Pekerja',
        category: 'FACILITY', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-09-01', endDate: '2025-03-31',
        totalBudget: 4000000000, location: 'Tonga Block (Sumatra)', manager: 'Siti Aminah',
    },
    {
        id: 'EMP-FAC-013', projectCode: 'EMP-FAC-013',
        name: 'Komisi Turbin Uap ST-02',
        category: 'FACILITY', priority: 'Sedang', status: 'Beresiko',
        startDate: '2025-11-01', endDate: '2026-06-30',
        totalBudget: 13500000000, location: 'Sengkang Block (Sulawesi)', manager: 'Andi Hidayat',
    },
    {
        id: 'EMP-FAC-014', projectCode: 'EMP-FAC-014',
        name: 'Overhaul Kompresor Gas K-04',
        category: 'FACILITY', priority: 'Sedang', status: 'Berjalan',
        startDate: '2026-02-15', endDate: '2026-08-15',
        totalBudget: 7500000000, location: 'Bireun-Sigli Block (Sumatra)', manager: 'Rina Wati',
    },
    {
        id: 'EMP-FAC-015', projectCode: 'EMP-FAC-015',
        name: 'Pengembangan Infrastruktur Water Injection',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-05-15', endDate: '2026-02-15',
        totalBudget: 14000000000, location: 'Malacca Strait Block (Sumatra)', manager: 'Dewi Lestari',
    },
    {
        id: 'EMP-FAC-016', projectCode: 'EMP-FAC-016',
        name: 'Konstruksi Metering Station MS-09',
        category: 'FACILITY', priority: 'Rendah', status: 'Tertunda',
        startDate: '2026-04-01', endDate: '2026-10-31',
        totalBudget: 5500000000, location: 'Siak Block (Sumatra)', manager: 'Joko Widodo',
    },
    {
        id: 'EMP-FAC-017', projectCode: 'EMP-FAC-017',
        name: 'Pemasangan Subsea Control Module',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-09-01', endDate: '2026-05-31',
        totalBudget: 40000000000, location: 'Buzi EPCC (Mozambique)', manager: 'Agus Setiawan',
    },
    {
        id: 'EMP-FAC-018', projectCode: 'EMP-FAC-018',
        name: 'Pembangunan Power Plant 10 MW',
        category: 'FACILITY', priority: 'Tinggi', status: 'Berjalan',
        startDate: '2025-12-01', endDate: '2026-09-30',
        totalBudget: 45000000000, location: 'Sengkang Block (Sulawesi)', manager: 'Eko Prasetyo',
    },
    {
        id: 'EMP-FAC-019', projectCode: 'EMP-FAC-019',
        name: 'Overhaul Annual Pompa K-02',
        category: 'FACILITY', priority: 'Rendah', status: 'Selesai',
        startDate: '2024-12-01', endDate: '2025-06-30',
        totalBudget: 3000000000, location: 'Gebang Block (Sumatra)', manager: 'Hendra Saputra',
    },
    {
        id: 'EMP-FAC-020', projectCode: 'EMP-FAC-020',
        name: 'Pembangunan Jalan Akses Ladang Baru',
        category: 'FACILITY', priority: 'Sedang', status: 'Berjalan',
        startDate: '2026-01-15', endDate: '2026-07-15',
        totalBudget: 6500000000, location: 'Kampar Block (Sumatra)', manager: 'Indah Kusuma',
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// TABLE: project_members
// ─────────────────────────────────────────────────────────────────────────────
export const projectMembers = projects.map((p, i) => ({
    id: `PM-DUMMY-${i + 1}`,
    projectId: p.id,
    employeeId: `EMP-SEED-${(i % 10) + 1}`,
    role: 'Project Manager',
}));

// ─────────────────────────────────────────────────────────────────────────────
// TABLE: timeline_events (3 events per project: Preparation, Execution, Reporting)
// ─────────────────────────────────────────────────────────────────────────────
const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

const progressByStatus = {
    'Selesai': [100, 100, 100],
    'Berjalan': [100, 65, 20],
    'Beresiko': [100, 40, 0],
    'Tertunda':  [80, 10, 0],
};

export const timelineEvents = [];
export const taskMilestones = [];

projects.forEach(p => {
    const phases = progressByStatus[p.status] || [80, 50, 10];
    let evtStart = p.startDate;
    const durationMs = new Date(p.endDate) - new Date(p.startDate);
    const phaseLen = Math.floor(durationMs / 3 / 86400000);

    ['Preparation', 'Execution', 'Reporting'].forEach((evtName, e) => {
        const evtEnd = addDays(evtStart, phaseLen);
        const evtBudget = Math.round(p.totalBudget / 3);
        const evtProgress = phases[e];
        const evtId = `evt-${p.id}-${e}`;

        timelineEvents.push({
            id: evtId,
            projectId: p.id,
            eventName: evtName,
            startDate: evtStart,
            endDate: evtEnd,
            taskBudget: evtBudget,
            calculatedProgress: evtProgress,
        });

        // 2 milestones per event
        [0, 1].forEach(m => {
            const isCompleted = evtProgress === 100 || (evtProgress > 50 && m === 0);
            taskMilestones.push({
                id: `mil-${p.id}-${e}-${m}`,
                timelineEventId: evtId,
                milestoneName: `Milestone ${e + 1}.${m + 1}`,
                progressContribution: 50,
                isCompleted,
                completedAt: isCompleted ? addDays(evtStart, 15) : null,
            });
        });

        evtStart = addDays(evtEnd, 1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// TABLE: issues
// ─────────────────────────────────────────────────────────────────────────────
const ISSUE_POOL = [
    { title: 'Keterlambatan Pengiriman Material',                             division: 'Supply Chain',          severity: 'HIGH',   impactScore: 4 },
    { title: 'Cuaca buruk menghentikan aktivitas offshore',                   division: 'HSSE',                  severity: 'HIGH',   impactScore: 5 },
    { title: 'Revisi Desain Engineering',                                     division: 'Facilities Engineering', severity: 'MEDIUM', impactScore: 3 },
    { title: 'Kekurangan tenaga kerja kontraktor',                            division: 'Drilling & Workover',   severity: 'MEDIUM', impactScore: 3 },
    { title: 'Keterlambatan persetujuan izin dari pemerintah daerah',         division: 'Production',            severity: 'HIGH',   impactScore: 5 },
    { title: 'Sengketa pembebasan lahan dengan masyarakat lokal',             division: 'HSSE',                  severity: 'HIGH',   impactScore: 4 },
    { title: 'Kerusakan peralatan saat operasi',                              division: 'Facilities Engineering', severity: 'HIGH',   impactScore: 5 },
    { title: 'Peningkatan Biaya Material',                                    division: 'Supply Chain',          severity: 'MEDIUM', impactScore: 3 },
    { title: 'Investigasi insiden keselamatan diperlukan',                    division: 'HSSE',                  severity: 'HIGH',   impactScore: 5 },
    { title: 'Temuan geologis tak terduga memerlukan revisi rencana',         division: 'Subsurface',            severity: 'MEDIUM', impactScore: 4 },
    { title: 'Gangguan rantai pasok untuk suku cadang kritis',                division: 'Supply Chain',          severity: 'MEDIUM', impactScore: 3 },
    { title: 'Perselisihan Kontrak Vendor',                                   division: 'Production',            severity: 'LOW',    impactScore: 2 },
];

export const issues = [];
const issueStatusMap = {
    'Beresiko': 'IN_PROGRESS',
    'Tertunda':  'OPEN',
    'Berjalan':  'OPEN',
    'Selesai':   'CLOSED',
};

projects.forEach((p, pIdx) => {
    const numIssues = ['Beresiko', 'Tinggi'].includes(p.status || p.priority) ? 2 : (p.status === 'Selesai' ? 0 : 1);
    for (let is = 0; is < numIssues; is++) {
        const issue = ISSUE_POOL[(pIdx + is) % ISSUE_POOL.length];
        issues.push({
            id: `iss-${p.id}-${is}`,
            projectId: p.id,
            title: issue.title,
            division: issue.division,
            severity: issue.severity,
            status: issueStatusMap[p.status] || 'OPEN',
            impactScore: issue.impactScore,
        });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// TABLE: project_metrics
// ─────────────────────────────────────────────────────────────────────────────
const progressForStatus = { 'Selesai': 100, 'Berjalan': 62, 'Beresiko': 38, 'Tertunda': 18 };

export const projectMetrics = projects.map(p => {
    const progress = progressForStatus[p.status] ?? 50;
    const actualCost = Math.round(p.totalBudget * (progress / 100) * (0.9 + Math.random() * 0.25));
    const plannedValue = Math.round(p.totalBudget * (progress / 100 + (Math.random() * 0.2 - 0.05)));
    const earnedValue = Math.round(p.totalBudget * (progress / 100));
    const spi = plannedValue > 0 ? parseFloat((earnedValue / plannedValue).toFixed(2)) : 1.0;
    const cpi = actualCost > 0 ? parseFloat((earnedValue / actualCost).toFixed(2)) : 1.0;
    const sv = earnedValue - plannedValue;
    const cv = earnedValue - actualCost;

    return {
        id: `met-${p.id}`,
        projectId: p.id,
        recordDate: '2026-04-06',
        actualCost,
        actualProgress: progress,
        plannedValue,
        earnedValue,
        scheduleVariance: sv,
        costVariance: cv,
        spi,
        cpi,
    };
});

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED VIEW: projects + metrics (mirrors SQL JOIN result from findAll query)
// ─────────────────────────────────────────────────────────────────────────────
export const projectsWithMetrics = projects.map(p => {
    const metric = projectMetrics.find(m => m.projectId === p.id) || {};
    return {
        ...p,
        budgetUsed: metric.actualCost ?? 0,
        progress: metric.actualProgress ?? 0,
        plannedValue: metric.plannedValue ?? 0,
        earnedValue: metric.earnedValue ?? 0,
        spi: metric.spi ?? 1,
        cpi: metric.cpi ?? 1,
    };
});

// ─────────────────────────────────────────────────────────────────────────────
// METADATA: distinct categories, statuses, locations (for filter dropdowns)
// ─────────────────────────────────────────────────────────────────────────────
export const metadata = {
    categories: [...new Set(projects.map(p => p.category))],
    statuses:   [...new Set(projects.map(p => p.status))],
    locations:  [...new Set(projects.map(p => p.location))],
    priorities: [...new Set(projects.map(p => p.priority))],
};

// ─────────────────────────────────────────────────────────────────────────────
// TOP ISSUES: sorted by impactScore desc (for dashboard PosturProyek)
// ─────────────────────────────────────────────────────────────────────────────
export const topIssues = [...issues]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 10);

export default {
    employees,
    projects,
    projectMembers,
    timelineEvents,
    taskMilestones,
    issues,
    projectMetrics,
    projectsWithMetrics,
    metadata,
    topIssues,
};
