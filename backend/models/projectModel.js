/**
 * @file projectModel.js
 * @description Model database untuk entitas Proyek dan data terkait
 * (Isus, Timeline, Anggota Tim, Metric). Menggunakan camelCase
 * sesuai dengan standar schema database yang diinisiasi.
 */

import db from '../config/db.js';

/**
 * Mencari semua list proyek ditambah data agregasi metrik terakhirnya.
 * @param {Object} [filters={}] - Filter opsional berdasarkan form 
 * @param {string} [filters.year] - Filter berdasarkan tahun jadwal proyek (start/end date)
 * @param {string} [filters.month] - Filter berdasarkan rentang bulan
 * @param {string|string[]} [filters.category] - Filter kategori spesifik
 * @param {string} [filters.status] - Filter status
 * @param {string} [filters.priority] - Filter level prioritas
 * @param {string} [filters.location] - Pencarian term lokasi
 * @returns {Promise<Array<Object>>} Daftar proyek lengkap beserta metrik terkininya
 */
export const findAll = async (filters = {}) => {
    let query = `
        SELECT 
            p.id,
            p.projectCode,
            p.name,
            p.category,
            p.priority,
            p.status,
            p.startDate,
            p.endDate,
            p.totalBudget,
            p.location,
            p.manager,
            pm.actualCost AS budgetUsed,
            pm.actualProgress AS progress,
            COALESCE(pm.plannedValue, 0) AS plannedValue,
            COALESCE(pm.earnedValue, 0) AS earnedValue,
            COALESCE(pm.spi, 1) AS spi,
            COALESCE(pm.cpi, 1) AS cpi
        FROM projects p
        LEFT JOIN project_metrics pm ON pm.projectId = p.id
        WHERE 1=1
    `;
    const params = [];

    if (filters.year) {
        if (filters.month !== undefined && filters.month !== null) {
            const startOfMonth = new Date(filters.year, filters.month, 1);
            const endOfMonth = new Date(filters.year, parseInt(filters.month) + 1, 0);
            query += ` AND p.startDate <= ? AND p.endDate >= ?`;
            params.push(endOfMonth, startOfMonth);
        } else {
            query += ` AND YEAR(p.startDate) = ?`;
            params.push(filters.year);
        }
    }
    if (filters.category) {
        const categories = Array.isArray(filters.category) ? filters.category : [filters.category];
        query += ` AND p.category IN (?)`;
        params.push(categories);
    }
    if (filters.status) {
        query += ` AND p.status = ?`;
        params.push(filters.status);
    }
    if (filters.priority) {
        query += ` AND p.priority = ?`;
        params.push(filters.priority);
    }
    if (filters.location) {
        query += ` AND p.location LIKE ?`;
        params.push(`%${filters.location}%`);
    }

    query += ` ORDER BY p.id ASC`;
    const [rows] = await db.query(query, params);
    return rows;
};


/**
 * Mengambil rekap isu-isu di beberapa proyek yang diminta.
 * @param {Array<string>} projectIds - Array ID proyek
 * @returns {Promise<Array<Object>>} Daftar isu terkait
 */
export const findIssues = async (projectIds) => {
    if (!projectIds.length) return [];
    const [rows] = await db.query(
        `SELECT id, projectId, title, division, severity, status, impactScore
         FROM issues WHERE projectId IN (?)`,
        [projectIds]
    );
    return rows;
};

/**
 * Mengambil timeline event ditiap proyek untuk render Gantt Chart
 * @param {Array<string>} projectIds - Array ID proyek
 * @returns {Promise<Array<Object>>} Daftar event timeline terkait
 */
export const findTimeline = async (projectIds) => {
    if (!projectIds.length) return [];
    const [rows] = await db.query(
        `SELECT id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress
         FROM timeline_events WHERE projectId IN (?) ORDER BY startDate ASC`,
        [projectIds]
    );
    return rows;
};


/**
 * Mengambil tim/anggota di beberapa proyek yang diminta.
 * @param {Array<string>} projectIds - Array ID proyek
 * @returns {Promise<Array<Object>>} Daftar anggota member
 */
export const findMembers = async (projectIds) => {
    if (!projectIds.length) return [];
    const [rows] = await db.query(
        `SELECT pmb.projectId, pmb.role, e.name
         FROM project_members pmb
         LEFT JOIN employees e ON e.id = pmb.employeeId
         WHERE pmb.projectId IN (?)`,
        [projectIds]
    );
    return rows;
};

/**
 * Menyisipkan proyek baru dan init datanya ke project_metrics.
 * @param {Object} data - Objek insert
 * @returns {Promise<string>} ID baru yang diinsert
 */
export const create = async (data) => {
    const {
        id, projectCode, name, category, priority, status,
        startDate, endDate, totalBudget, location, manager,
        budgetUsed, progress, plannedValue, earnedValue, spi, cpi
    } = data;

    await db.query(
        `INSERT INTO projects (id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager]
    );

    await db.query(
        `INSERT INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, spi, cpi)
         VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
        [`met-${id}`, id, budgetUsed, progress, plannedValue, earnedValue, spi, cpi]
    );

    return id;
};

/**
 * Mengupdate field tertentu proyek berdasarkan ID, termasuk metrik.
 * @param {string} id - ID proyek target update
 * @param {Object} data - Objek values yang akan diperbaharui
 * @returns {Promise<void>}
 */
export const update = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category); }
    if (data.priority !== undefined) { fields.push('priority = ?'); values.push(data.priority); }
    if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
    if (data.startDate !== undefined) { fields.push('startDate = ?'); values.push(data.startDate); }
    if (data.endDate !== undefined) { fields.push('endDate = ?'); values.push(data.endDate); }
    if (data.totalBudget !== undefined) { fields.push('totalBudget = ?'); values.push(data.totalBudget); }
    if (data.location !== undefined) { fields.push('location = ?'); values.push(data.location); }
    if (data.manager !== undefined) { fields.push('manager = ?'); values.push(data.manager); }

    if (fields.length > 0) {
        values.push(id);
        await db.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    if (data.progress !== undefined || data.budgetUsed !== undefined || data.target !== undefined) {
        const totalBudget = parseFloat(data.totalBudget) || 0;
        const progress = parseFloat(data.progress) || 0;
        const target = parseFloat(data.target) || 0;
        const budgetUsed = parseFloat(data.budgetUsed) || 0;
        const earnedValue = totalBudget * (progress / 100);
        const plannedValue = totalBudget * (target / 100);
        const spi = plannedValue > 0 ? (earnedValue / plannedValue).toFixed(2) : 1;
        const cpi = budgetUsed > 0 ? (earnedValue / budgetUsed).toFixed(2) : 1;

        const [existing] = await db.query('SELECT id FROM project_metrics WHERE projectId = ?', [id]);
        if (existing.length > 0) {
            await db.query(
                `UPDATE project_metrics SET actualCost = ?, actualProgress = ?, plannedValue = ?, earnedValue = ?, spi = ?, cpi = ?, recordDate = NOW() WHERE projectId = ?`,
                [budgetUsed, progress, plannedValue, earnedValue, spi, cpi, id]
            );
        } else {
            await db.query(
                `INSERT INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, spi, cpi) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
                [`met-${id}`, id, budgetUsed, progress, plannedValue, earnedValue, spi, cpi]
            );
        }
    }
};

/**
 * Menghapus data spesifik proyek beserta semua references data lainnya
 * di table terhubung.
 * @param {string} id - ID string yang akan dihapus
 * @returns {Promise<number>} affected rows (jumlah row terhapus)
 */
export const remove = async (id) => {
    await db.query('DELETE FROM project_metrics WHERE projectId = ?', [id]);
    await db.query('DELETE FROM issues WHERE projectId = ?', [id]);
    await db.query('DELETE FROM timeline_events WHERE projectId = ?', [id]);
    await db.query('DELETE FROM project_members WHERE projectId = ?', [id]);

    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows;
};
// ───── Query: Metadata (Dynamic Filters) ─────

export const getMetadata = async () => {
    const [categories] = await db.query('SELECT DISTINCT category FROM projects WHERE category IS NOT NULL');
    const [statuses] = await db.query('SELECT DISTINCT status FROM projects WHERE status IS NOT NULL');
    const [locations] = await db.query('SELECT DISTINCT location FROM projects WHERE location IS NOT NULL AND location != ""');

    return {
        categories: categories.map(c => c.category),
        statuses: statuses.map(s => s.status),
        locations: locations.map(l => l.location)
    };
};
