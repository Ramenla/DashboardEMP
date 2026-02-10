// --- 1. DATA MASTER PROJECT (50 Data Entry) ---
export const projectsData = [
    // --- EXPLORATION (10 Projects) ---
    { 
      id: 'EXP-101', name: 'Seismic 3D Area Sumatra', category: 'Exploration', status: 'Berjalan', priority: 'Tinggi', 
      progress: 45, target: 40, budgetUsed: 70, budgetTotal: 1500000000, startMonth: 0, duration: 4, 
      sponsor: 'SKK Migas', manager: 'Budi Santoso', strategy: 'Fast Track Seismic', startDate: '01 Jan 2026', endDate: '30 Apr 2026',
      issues: ['Cuaca buruk menghambat akuisisi data'], timelineEvents: [{date: '01 Jan', title: 'Start', status: 'finish'}, {date: '15 Feb', title: 'Acquisition', status: 'process'}]
    },
    { 
      id: 'EXP-102', name: 'G&G Study Basin Jawa', category: 'Exploration', status: 'Berjalan', priority: 'Sedang', 
      progress: 80, target: 80, budgetUsed: 60, budgetTotal: 500000000, startMonth: 1, duration: 3, 
      sponsor: 'Internal EMP', manager: 'Andi Wijaya', strategy: 'In-house Study', startDate: '01 Feb 2026', endDate: '30 Apr 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'EXP-103', name: 'Exploration Well Wildcat-1', category: 'Exploration', status: 'Kritis', priority: 'Tinggi', 
      progress: 15, target: 50, budgetUsed: 90, budgetTotal: 8000000000, startMonth: 2, duration: 5, 
      sponsor: 'EMP Exploration', manager: 'Rudi Hartono', strategy: 'Deep Drilling', startDate: '01 Mar 2026', endDate: '30 Jul 2026',
      issues: ['Kick pressure tinggi', 'Logistik lumpur terlambat'], timelineEvents: [{date: '01 Mar', title: 'Spud In', status: 'finish'}, {date: '10 Apr', title: 'Drilling', status: 'error'}]
    },
    { 
      id: 'EXP-104', name: 'Gravity Magnetic Survey', category: 'Exploration', status: 'Tertunda', priority: 'Rendah', 
      progress: 0, target: 20, budgetUsed: 5, budgetTotal: 300000000, startMonth: 5, duration: 2, 
      sponsor: 'Exploration Div', manager: 'Siti Aminah', strategy: 'Vendor Contract', startDate: '01 Jun 2026', endDate: '30 Jul 2026',
      issues: ['Menunggu persetujuan WP&B'], timelineEvents: []
    },
    { 
      id: 'EXP-105', name: 'Geological Field Mapping', category: 'Exploration', status: 'Berjalan', priority: 'Sedang', 
      progress: 60, target: 60, budgetUsed: 50, budgetTotal: 200000000, startMonth: 3, duration: 2, 
      sponsor: 'Exploration Div', manager: 'Dedi Kurniawan', strategy: 'Field Trip', startDate: '15 Mar 2026', endDate: '15 May 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'EXP-106', name: 'Seismic Processing Area X', category: 'Exploration', status: 'Berjalan', priority: 'Tinggi', 
      progress: 90, target: 85, budgetUsed: 80, budgetTotal: 1200000000, startMonth: 0, duration: 3, 
      sponsor: 'SKK Migas', manager: 'Fajar Nugraha', strategy: 'High Performance Computing', startDate: '01 Jan 2026', endDate: '30 Mar 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'EXP-107', name: 'Appraisal Well AP-2', category: 'Exploration', status: 'Kritis', priority: 'Tinggi', 
      progress: 30, target: 70, budgetUsed: 95, budgetTotal: 6000000000, startMonth: 1, duration: 4, 
      sponsor: 'EMP Exploration', manager: 'Guntur P', strategy: 'Appraisal', startDate: '01 Feb 2026', endDate: '30 May 2026',
      issues: ['Stuck pipe di 1500ft', 'Budget overrun'], timelineEvents: [{date: '01 Feb', title: 'Rig Up', status: 'finish'}, {date: '20 Mar', title: 'Drilling', status: 'error'}]
    },
    { 
      id: 'EXP-108', name: 'AMDAL Study Block B', category: 'Exploration', status: 'Berjalan', priority: 'Rendah', 
      progress: 50, target: 50, budgetUsed: 40, budgetTotal: 400000000, startMonth: 2, duration: 6, 
      sponsor: 'HSE Dept', manager: 'Rina S', strategy: 'Consultant', startDate: '01 Mar 2026', endDate: '30 Aug 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'EXP-109', name: 'Land Acquisition Seismic', category: 'Exploration', status: 'Terhenti', priority: 'Tinggi', 
      progress: 10, target: 40, budgetUsed: 20, budgetTotal: 2000000000, startMonth: 0, duration: 6, 
      sponsor: 'Legal & Relations', manager: 'Joko S', strategy: 'Social Approach', startDate: '01 Jan 2026', endDate: '30 Jun 2026',
      issues: ['Penolakan warga lokal', 'Sengketa tanah'], timelineEvents: [{date: 'Jan', title: 'Sosialisasi', status: 'finish'}, {date: 'Feb', title: 'Negosiasi', status: 'error'}]
    },
    { 
      id: 'EXP-110', name: 'Biostratigraphy Analysis', category: 'Exploration', status: 'Berjalan', priority: 'Rendah', 
      progress: 100, target: 100, budgetUsed: 90, budgetTotal: 150000000, startMonth: 0, duration: 1, 
      sponsor: 'Lab Services', manager: 'Maya P', strategy: 'Lab Analysis', startDate: '01 Jan 2026', endDate: '30 Jan 2026', issues: [], timelineEvents: []
    },
  
    // --- DRILLING (15 Projects) ---
    { 
      id: 'DRL-201', name: 'Dev Well D-1 Drilling', category: 'Drilling', status: 'Berjalan', priority: 'Tinggi', 
      progress: 70, target: 70, budgetUsed: 65, budgetTotal: 4000000000, startMonth: 0, duration: 2, 
      sponsor: 'Development', manager: 'Raihan P', strategy: 'Batch Drilling', startDate: '01 Jan 2026', endDate: '28 Feb 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-202', name: 'Dev Well D-2 Drilling', category: 'Drilling', status: 'Berjalan', priority: 'Tinggi', 
      progress: 40, target: 40, budgetUsed: 42, budgetTotal: 4000000000, startMonth: 2, duration: 2, 
      sponsor: 'Development', manager: 'Raihan P', strategy: 'Batch Drilling', startDate: '01 Mar 2026', endDate: '30 Apr 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-203', name: 'Dev Well D-3 Drilling', category: 'Drilling', status: 'Tertunda', priority: 'Tinggi', 
      progress: 0, target: 10, budgetUsed: 0, budgetTotal: 4000000000, startMonth: 4, duration: 2, 
      sponsor: 'Development', manager: 'Raihan P', strategy: 'Batch Drilling', startDate: '01 May 2026', endDate: '30 Jun 2026', 
      issues: ['Menunggu Rig release dari D-2'], timelineEvents: []
    },
    { 
      id: 'DRL-204', name: 'Workover Well W-15', category: 'Drilling', status: 'Berjalan', priority: 'Sedang', 
      progress: 85, target: 80, budgetUsed: 90, budgetTotal: 1000000000, startMonth: 1, duration: 1, 
      sponsor: 'Production', manager: 'Agus T', strategy: 'ESP Replacement', startDate: '01 Feb 2026', endDate: '28 Feb 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-205', name: 'Workover Well W-18', category: 'Drilling', status: 'Kritis', priority: 'Sedang', 
      progress: 20, target: 90, budgetUsed: 80, budgetTotal: 1200000000, startMonth: 0, duration: 1, 
      sponsor: 'Production', manager: 'Agus T', strategy: 'Sucker Rod Pump', startDate: '15 Jan 2026', endDate: '15 Feb 2026', 
      issues: ['Fishing job gagal', 'Alat terjepit'], timelineEvents: []
    },
    { 
      id: 'DRL-206', name: 'Rig Mobilization Project', category: 'Drilling', status: 'Berjalan', priority: 'Tinggi', 
      progress: 50, target: 50, budgetUsed: 40, budgetTotal: 500000000, startMonth: 3, duration: 1, 
      sponsor: 'Drilling Support', manager: 'Doni K', strategy: 'Land Transport', startDate: '01 Apr 2026', endDate: '30 Apr 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-207', name: 'Mud Logging Upgrade', category: 'Drilling', status: 'Berjalan', priority: 'Rendah', 
      progress: 100, target: 100, budgetUsed: 95, budgetTotal: 200000000, startMonth: 0, duration: 2, 
      sponsor: 'Drilling Support', manager: 'Sari W', strategy: 'System Upgrade', startDate: '01 Jan 2026', endDate: '28 Feb 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-208', name: 'Cementing Contract A', category: 'Drilling', status: 'Tertunda', priority: 'Sedang', 
      progress: 0, target: 100, budgetUsed: 0, budgetTotal: 3000000000, startMonth: 5, duration: 6, 
      sponsor: 'SCM', manager: 'Linda M', strategy: 'Tender Ulang', startDate: '01 Jun 2026', endDate: '31 Dec 2026', 
      issues: ['Peserta tender tidak lulus teknis'], timelineEvents: []
    },
    { 
      id: 'DRL-209', name: 'Directional Drilling Ops', category: 'Drilling', status: 'Berjalan', priority: 'Tinggi', 
      progress: 60, target: 60, budgetUsed: 55, budgetTotal: 1500000000, startMonth: 2, duration: 3, 
      sponsor: 'Drilling Ops', manager: 'Hendra G', strategy: 'Horizontal Well', startDate: '01 Mar 2026', endDate: '30 May 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-210', name: 'Well Stimulation Acid', category: 'Drilling', status: 'Berjalan', priority: 'Sedang', 
      progress: 30, target: 30, budgetUsed: 25, budgetTotal: 600000000, startMonth: 3, duration: 1, 
      sponsor: 'Production', manager: 'Tono R', strategy: 'Acidizing', startDate: '01 Apr 2026', endDate: '30 Apr 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-211', name: 'Hydraulic Fracturing Pilot', category: 'Drilling', status: 'Kritis', priority: 'Tinggi', 
      progress: 10, target: 40, budgetUsed: 50, budgetTotal: 5000000000, startMonth: 2, duration: 4, 
      sponsor: 'EOR Div', manager: 'Prof. Bambang', strategy: 'Pilot Project', startDate: '01 Mar 2026', endDate: '30 Jun 2026', 
      issues: ['Ketersediaan air kurang', 'Protes lingkungan'], timelineEvents: []
    },
    { 
      id: 'DRL-212', name: 'Well Testing Program', category: 'Drilling', status: 'Berjalan', priority: 'Rendah', 
      progress: 90, target: 90, budgetUsed: 85, budgetTotal: 300000000, startMonth: 0, duration: 3, 
      sponsor: 'Reservoir', manager: 'Dian S', strategy: 'Pressure Transient', startDate: '01 Jan 2026', endDate: '30 Mar 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-213', name: 'Site Preparation Pad A', category: 'Drilling', status: 'Berjalan', priority: 'Sedang', 
      progress: 75, target: 75, budgetUsed: 70, budgetTotal: 800000000, startMonth: 1, duration: 2, 
      sponsor: 'Construction', manager: 'Eko P', strategy: 'Civil Works', startDate: '01 Feb 2026', endDate: '30 Mar 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-214', name: 'Drilling Waste Management', category: 'Drilling', status: 'Berjalan', priority: 'Rendah', 
      progress: 50, target: 50, budgetUsed: 40, budgetTotal: 200000000, startMonth: 0, duration: 12, 
      sponsor: 'HSE', manager: 'Putri L', strategy: 'Zero Discharge', startDate: '01 Jan 2026', endDate: '31 Dec 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'DRL-215', name: 'Site Abandonment B', category: 'Drilling', status: 'Tertunda', priority: 'Rendah', 
      progress: 0, target: 50, budgetUsed: 0, budgetTotal: 100000000, startMonth: 4, duration: 2, 
      sponsor: 'HSE', manager: 'Putri L', strategy: 'Restoration', startDate: '01 May 2026', endDate: '30 Jun 2026', 
      issues: ['Menunggu alat berat'], timelineEvents: []
    },
  
    // --- FACILITY (15 Projects) ---
    { 
      id: 'FCL-301', name: 'Construction Gathering St.', category: 'Facility', status: 'Berjalan', priority: 'Tinggi', 
      progress: 60, target: 60, budgetUsed: 55, budgetTotal: 10000000000, startMonth: 0, duration: 8, 
      sponsor: 'Projects Div', manager: 'Ir. Soleh', strategy: 'EPC Contract', startDate: '01 Jan 2026', endDate: '30 Aug 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-302', name: 'Pipeline Replacement 12"', category: 'Facility', status: 'Kritis', priority: 'Tinggi', 
      progress: 40, target: 80, budgetUsed: 90, budgetTotal: 5000000000, startMonth: 0, duration: 5, 
      sponsor: 'Asset Integrity', manager: 'Wahyu K', strategy: 'Sectional Replacement', startDate: '01 Jan 2026', endDate: '30 May 2026', 
      issues: ['Kebocoran baru ditemukan', 'Material pipa kurang'], timelineEvents: []
    },
    { 
      id: 'FCL-303', name: 'Storage Tank T-101 Repair', category: 'Facility', status: 'Berjalan', priority: 'Sedang', 
      progress: 80, target: 80, budgetUsed: 75, budgetTotal: 2000000000, startMonth: 1, duration: 3, 
      sponsor: 'Maintenance', manager: 'Bambang S', strategy: 'Plate Replacement', startDate: '01 Feb 2026', endDate: '30 Apr 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-304', name: 'Gas Compressor Install', category: 'Facility', status: 'Tertunda', priority: 'Tinggi', 
      progress: 10, target: 40, budgetUsed: 10, budgetTotal: 8000000000, startMonth: 2, duration: 6, 
      sponsor: 'Production', manager: 'Teddy A', strategy: 'Rental Unit', startDate: '01 Mar 2026', endDate: '30 Aug 2026', 
      issues: ['Pengiriman unit tertunda'], timelineEvents: []
    },
    { 
      id: 'FCL-305', name: 'Water Treatment Upgrade', category: 'Facility', status: 'Berjalan', priority: 'Sedang', 
      progress: 30, target: 30, budgetUsed: 25, budgetTotal: 1500000000, startMonth: 3, duration: 4, 
      sponsor: 'HSE', manager: 'Rina M', strategy: 'New Filtration', startDate: '01 Apr 2026', endDate: '30 Jul 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-306', name: 'Flare Stack Replacement', category: 'Facility', status: 'Terhenti', priority: 'Tinggi', 
      progress: 5, target: 30, budgetUsed: 20, budgetTotal: 3000000000, startMonth: 2, duration: 3, 
      sponsor: 'Operations', manager: 'Lukman H', strategy: 'Shutdown Job', startDate: '01 Mar 2026', endDate: '30 May 2026', 
      issues: ['Kontraktor bangkrut', 'Tender ulang'], timelineEvents: []
    },
    { 
      id: 'FCL-307', name: 'Control Room Renovation', category: 'Facility', status: 'Berjalan', priority: 'Rendah', 
      progress: 95, target: 95, budgetUsed: 90, budgetTotal: 500000000, startMonth: 0, duration: 2, 
      sponsor: 'General Affairs', manager: 'Susi P', strategy: 'Civil Interior', startDate: '01 Jan 2026', endDate: '28 Feb 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-308', name: 'SCADA System Upgrade', category: 'Facility', status: 'Berjalan', priority: 'Tinggi', 
      progress: 50, target: 50, budgetUsed: 45, budgetTotal: 4000000000, startMonth: 1, duration: 6, 
      sponsor: 'IT & Ops', manager: 'Rizky IT', strategy: 'Digitalization', startDate: '01 Feb 2026', endDate: '30 Jul 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-309', name: 'Road Access Improvement', category: 'Facility', status: 'Berjalan', priority: 'Sedang', 
      progress: 20, target: 20, budgetUsed: 20, budgetTotal: 1000000000, startMonth: 3, duration: 3, 
      sponsor: 'Logistic', manager: 'Pak RT', strategy: 'Aspal Hotmix', startDate: '01 Apr 2026', endDate: '30 Jun 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-310', name: 'Jetty Rehabilitation', category: 'Facility', status: 'Kritis', priority: 'Sedang', 
      progress: 60, target: 90, budgetUsed: 95, budgetTotal: 2500000000, startMonth: 0, duration: 4, 
      sponsor: 'Logistic', manager: 'Capt. Budi', strategy: 'Marine Works', startDate: '01 Jan 2026', endDate: '30 Apr 2026', 
      issues: ['Pasang surut air laut ekstrim', 'Material tiang pancang kurang'], timelineEvents: []
    },
    { 
      id: 'FCL-311', name: 'Genset Power Plant B', category: 'Facility', status: 'Berjalan', priority: 'Tinggi', 
      progress: 10, target: 10, budgetUsed: 10, budgetTotal: 3500000000, startMonth: 4, duration: 3, 
      sponsor: 'Maintenance', manager: 'Listrik A', strategy: 'New Unit', startDate: '01 May 2026', endDate: '30 Jul 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-312', name: 'Warehouse Expansion', category: 'Facility', status: 'Tertunda', priority: 'Rendah', 
      progress: 0, target: 20, budgetUsed: 0, budgetTotal: 800000000, startMonth: 5, duration: 3, 
      sponsor: 'SCM', manager: 'Gudang B', strategy: 'Civil Works', startDate: '01 Jun 2026', endDate: '30 Aug 2026', 
      issues: ['Revisi desain'], timelineEvents: []
    },
    { 
      id: 'FCL-313', name: 'Fire Protection System', category: 'Facility', status: 'Berjalan', priority: 'Tinggi', 
      progress: 80, target: 80, budgetUsed: 75, budgetTotal: 1200000000, startMonth: 0, duration: 3, 
      sponsor: 'HSE', manager: 'Safety Off', strategy: 'Hydrant & Sprinkle', startDate: '01 Jan 2026', endDate: '30 Mar 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-314', name: 'HVAC Platform Offshore', category: 'Facility', status: 'Berjalan', priority: 'Sedang', 
      progress: 40, target: 40, budgetUsed: 40, budgetTotal: 500000000, startMonth: 2, duration: 2, 
      sponsor: 'Maintenance', manager: 'Cooling A', strategy: 'Replacement', startDate: '01 Mar 2026', endDate: '30 Apr 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'FCL-315', name: 'Corrosion Painting', category: 'Facility', status: 'Berjalan', priority: 'Rendah', 
      progress: 30, target: 30, budgetUsed: 30, budgetTotal: 300000000, startMonth: 3, duration: 6, 
      sponsor: 'Maintenance', manager: 'Cat B', strategy: 'Coating', startDate: '01 Apr 2026', endDate: '30 Sep 2026', issues: [], timelineEvents: []
    },
  
    // --- OPERATION (10 Projects) ---
    { 
      id: 'OPS-401', name: 'Preventive Maint GT-1', category: 'Operation', status: 'Berjalan', priority: 'Tinggi', 
      progress: 100, target: 100, budgetUsed: 95, budgetTotal: 500000000, startMonth: 0, duration: 1, 
      sponsor: 'Maintenance', manager: 'Turbine Spv', strategy: '4000 Hours Inspection', startDate: '01 Jan 2026', endDate: '30 Jan 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'OPS-402', name: 'Pigging Pipeline Seg-A', category: 'Operation', status: 'Tertunda', priority: 'Sedang', 
      progress: 0, target: 50, budgetUsed: 5, budgetTotal: 200000000, startMonth: 1, duration: 1, 
      sponsor: 'Ops Pipeline', manager: 'Pigging Crew', strategy: 'Intelligent Pigging', startDate: '01 Feb 2026', endDate: '28 Feb 2026', 
      issues: ['Launcher rusak', 'Pig stuck risk high'], timelineEvents: []
    },
    { 
      id: 'OPS-403', name: 'Shutdown Turnaround 2026', category: 'Operation', status: 'Berjalan', priority: 'Tinggi', 
      progress: 10, target: 10, budgetUsed: 15, budgetTotal: 15000000000, startMonth: 6, duration: 1, 
      sponsor: 'Plant Manager', manager: 'TA Manager', strategy: 'Plant Shutdown', startDate: '01 Jul 2026', endDate: '30 Jul 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'OPS-404', name: 'HSE Training Program', category: 'Operation', status: 'Berjalan', priority: 'Rendah', 
      progress: 25, target: 25, budgetUsed: 20, budgetTotal: 100000000, startMonth: 0, duration: 12, 
      sponsor: 'HR & HSE', manager: 'Trainer A', strategy: 'Monthly Batch', startDate: '01 Jan 2026', endDate: '31 Dec 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'OPS-405', name: 'Waste Management Ops', category: 'Operation', status: 'Berjalan', priority: 'Sedang', 
      progress: 40, target: 40, budgetUsed: 40, budgetTotal: 300000000, startMonth: 0, duration: 12, 
      sponsor: 'HSE', manager: 'Limbah B3', strategy: 'Vendor Disposal', startDate: '01 Jan 2026', endDate: '31 Dec 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'OPS-406', name: 'Chem Injection Optimization', category: 'Operation', status: 'Kritis', priority: 'Sedang', 
      progress: 50, target: 80, budgetUsed: 90, budgetTotal: 400000000, startMonth: 1, duration: 3, 
      sponsor: 'Production', manager: 'Chem Eng', strategy: 'Dosing Trial', startDate: '01 Feb 2026', endDate: '30 Apr 2026', 
      issues: ['Chemical tidak efektif', 'Cost membengkak'], timelineEvents: []
    },
    { 
      id: 'OPS-407', name: 'Rotating Equip Overhaul', category: 'Operation', status: 'Terhenti', priority: 'Tinggi', 
      progress: 60, target: 90, budgetUsed: 80, budgetTotal: 800000000, startMonth: 2, duration: 2, 
      sponsor: 'Maintenance', manager: 'Pump Spv', strategy: 'Major Overhaul', startDate: '01 Mar 2026', endDate: '30 Apr 2026', 
      issues: ['Sparepart obsolete', 'Menunggu pabrikan'], timelineEvents: []
    },
    { 
      id: 'OPS-408', name: 'Instrument Calibration', category: 'Operation', status: 'Berjalan', priority: 'Rendah', 
      progress: 30, target: 30, budgetUsed: 30, budgetTotal: 150000000, startMonth: 0, duration: 12, 
      sponsor: 'Maintenance', manager: 'Inst Spv', strategy: 'Yearly Schedule', startDate: '01 Jan 2026', endDate: '31 Dec 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'OPS-409', name: 'Digital Twin Pilot', category: 'Operation', status: 'Berjalan', priority: 'Tinggi', 
      progress: 20, target: 20, budgetUsed: 30, budgetTotal: 2000000000, startMonth: 3, duration: 6, 
      sponsor: 'IT', manager: 'Data Scientist', strategy: 'AI Implementation', startDate: '01 Apr 2026', endDate: '30 Sep 2026', issues: [], timelineEvents: []
    },
    { 
      id: 'OPS-410', name: 'Supply Chain Optimization', category: 'Operation', status: 'Berjalan', priority: 'Sedang', 
      progress: 50, target: 50, budgetUsed: 40, budgetTotal: 100000000, startMonth: 2, duration: 4, 
      sponsor: 'SCM', manager: 'Logistics Mgr', strategy: 'Inventory Reduction', startDate: '01 Mar 2026', endDate: '30 Jun 2026', issues: [], timelineEvents: []
    },
  ].map(p => ({
    ...p,
    // Default value untuk field yang mungkin kosong agar tidak error
    issues: p.issues || [],
    timelineEvents: p.timelineEvents.length > 0 ? p.timelineEvents : [
        { date: p.startDate, title: 'Project Start', status: 'finish' },
        { date: 'Mid Term', title: 'Execution', status: 'process' },
        { date: p.endDate, title: 'Project End', status: 'wait' }
    ]
  }));
  
  // --- 2. DATA BUDGET CHART (Aggregated Dummy) ---
  export const budgetTrendData = [
    { name: 'JAN', value: 4500 },
    { name: 'FEB', value: 5200 },
    { name: 'MAR', value: 4800 },
    { name: 'APR', value: 6100 },
    { name: 'MAY', value: 5500 },
    { name: 'JUN', value: 6700 },
    { name: 'JUL', value: 7200 },
    { name: 'AUG', value: 6900 },
    { name: 'SEP', value: 7800 },
    { name: 'OCT', value: 7500 },
    { name: 'NOV', value: 8200 },
    { name: 'DEC', value: 9500 },
  ];
  
  // --- 3. DATA TOP ISSUES (Otomatis ambil dari project yang bermasalah) ---
  export const topIssuesData = projectsData
    .filter(p => p.issues.length > 0) // Ambil yang punya isu
    .map((p) => ({
      key: p.id,
      issue: p.issues[0], // Ambil isu pertama saja untuk tabel ringkas
      category: p.category,
      total: p.issues.length + Math.floor(Math.random() * 5) // Dummy total count
    }))
    .sort((a, b) => b.total - a.total) // Sort descending by total (terbanyak di atas)
    .slice(0, 5) // Hanya ambil 5 teratas
    .map((item, index) => ({
      ...item,
      rank: index + 1 // Set rank setelah sorting
    }));