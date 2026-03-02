/**
 * @file dateUtils.js
 * @description Utilitas parsing dan formatting tanggal untuk data proyek.
 * Mendukung format Indonesia ("DD MMM YYYY", "DD MMMM YYYY") maupun ISO string.
 * Juga menyediakan normalisasi data proyek dari format API ke format frontend.
 */

/**
 * Peta nama bulan (singkatan dan lengkap, Bahasa Indonesia & Inggris) ke indeks bulan JS (0-11).
 * @type {Object.<string, number>}
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

/**
 * Peta status proyek dari label Indonesia ke konstanta internal.
 * @type {Object.<string, string>}
 */
const STATUS_MAP = {
    'Berjalan': 'ON_TRACK',
    'Tertunda': 'DELAYED',
    'Kritis': 'AT_RISK',
    'Selesai': 'COMPLETED'
};

/**
 * Peta prioritas proyek dari label Indonesia ke konstanta internal.
 * @type {Object.<string, string>}
 */
const PRIORITY_MAP = {
    'Tinggi': 'HIGH',
    'Sedang': 'MEDIUM',
    'Rendah': 'LOW'
};

/**
 * Peta kategori proyek dari label API ke konstanta internal uppercase.
 * @type {Object.<string, string>}
 */
const CATEGORY_MAP = {
    'Exploration': 'EXPLORATION',
    'Drilling': 'DRILLING',
    'Facility': 'FACILITY',
    'Operation': 'OPERATION'
};

/**
 * Normalisasi data proyek dari format API ke format yang digunakan frontend.
 * Backend sudah mengembalikan label Indonesia (Tinggi, Sedang, Berjalan, dll)
 * sehingga tidak perlu di-map ulang ke enum Inggris.
 *
 * @param {Object} project - Data proyek mentah dari API.
 * @returns {Object} Data proyek yang sudah dinormalisasi.
 */
export const normalizeProjectData = (project) => {
    if (!project) return project;
    return { ...project };
};

/**
 * Mem-parsing string tanggal ke objek Date secara aman.
 * Mendukung format: "DD MMM YYYY", "DD MMMM YYYY", ISO string, dan objek Date.
 *
 * @param {string|Date} dateSource - Sumber tanggal yang akan di-parse.
 * @returns {Date} Objek Date yang valid, atau Invalid Date jika parsing gagal.
 */
export const parseProjectDate = (dateSource) => {
    if (!dateSource) return new Date(NaN);

    if (dateSource instanceof Date) return dateSource;

    let date = new Date(dateSource);
    if (!isNaN(date.getTime())) return date;

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
 * Format objek Date atau string tanggal ke format tampilan Indonesia (DD MMM YYYY).
 *
 * @param {string|Date} dateSource - Sumber tanggal yang akan diformat.
 * @returns {string} Tanggal dalam format "DD MMM YYYY" (contoh: "01 Mar 2026"), atau "-" jika invalid.
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
