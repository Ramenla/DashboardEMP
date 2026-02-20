/**
 * Utilitas untuk menangani parsing tanggal dari berbagai format yang ada di aplikasi
 */

const MONTH_MAP = {
    'Jan': 0, 'Januari': 0,
    'Feb': 1, 'Februari': 1,
    'Mar': 2, 'Maret': 2,
    'Apr': 3, 'April': 3,
    'Mei': 4, 'May': 4,
    'Jun': 5, 'Juni': 5,
    'Jul': 6, 'Juli': 6,
    'Agu': 7, 'Aug': 7, 'Agustus': 7,
    'Sep': 8, 'September': 8,
    'Okt': 9, 'Oct': 9, 'Oktober': 9,
    'Nov': 10, 'November': 10,
    'Des': 11, 'Dec': 11, 'Desember': 11
};

const STATUS_MAP = {
    'Berjalan': 'ON_TRACK',
    'Tertunda': 'DELAYED',
    'Kritis': 'AT_RISK',
    'Selesai': 'COMPLETED'
};

const PRIORITY_MAP = {
    'Tinggi': 'HIGH',
    'Sedang': 'MEDIUM',
    'Rendah': 'LOW'
};

const CATEGORY_MAP = {
    'Exploration': 'EXPLORATION',
    'Drilling': 'DRILLING',
    'Facility': 'FACILITY',
    'Operation': 'OPERATION'
};

/**
 * Normalisasi data project dari format database ke format yang digunakan frontend
 * @param {Object} project - data project mentah dari API
 * @returns {Object} project yang sudah dinormalisasi
 */
export const normalizeProjectData = (project) => {
    if (!project) return project;

    return {
        ...project,
        status: STATUS_MAP[project.status] || project.status,
        priority: PRIORITY_MAP[project.priority] || project.priority,
        category: CATEGORY_MAP[project.category] || project.category
    };
};

/**
 * Memparsing string tanggal ke Date object secara aman.
 * Mendukung format: "DD MMM YYYY" (01 Mar 2026), ISO String, dan Date object.
 * 
 * @param {string|Date} dateSource - sumber tanggal
 * @returns {Date} - Date object, atau Invalid Date jika gagal
 */
export const parseProjectDate = (dateSource) => {
    if (!dateSource) return new Date(NaN);

    if (dateSource instanceof Date) return dateSource;

    // Coba parse langsung (berhasil untuk ISO string)
    let date = new Date(dateSource);
    if (!isNaN(date.getTime())) return date;

    // Tangani format "DD MMM YYYY" atau "DD MMMM YYYY"
    if (typeof dateSource === 'string') {
        const parts = dateSource.split(' ');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const monthStr = parts[1];
            const year = parseInt(parts[2], 10);

            const month = MONTH_MAP[monthStr];

            if (month !== undefined && !isNaN(day) && !isNaN(year)) {
                return new Date(year, month, day);
            }
        }
    }

    return new Date(NaN);
};

/**
 * Format date ke standar tampilan lokal Indonesia (DD MMM YYYY)
 */
export const formatProjectDate = (dateSource) => {
    const d = parseProjectDate(dateSource);
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};
