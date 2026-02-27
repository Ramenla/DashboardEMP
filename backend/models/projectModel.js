import db from '../config/db.js';

// ───── Query: Projects + Latest Metrics (camelCase) ─────

/**
 * Ambil semua project beserta metrics, dengan filter opsional.
 * @param {Object} filters - { year, month, category, status, priority, location }
 * @returns {Promise<Array>} rows dari query
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

// ───── Query: Issues (camelCase) ─────

export const findIssues = async (projectIds) => {
    if (!projectIds.length) return [];
    const [rows] = await db.query(
        `SELECT id, projectId, title, division, severity, status, impactScore
         FROM issues WHERE projectId IN (?)`,
        [projectIds]
    );
    return rows;
};

// ───── Query: Timeline Events (camelCase) ─────

export const findTimeline = async (projectIds) => {
    if (!projectIds.length) return [];
    const [rows] = await db.query(
        `SELECT id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress
         FROM timeline_events WHERE projectId IN (?) ORDER BY startDate ASC`,
        [projectIds]
    );
    return rows;
};

// ───── Query: Members (camelCase) ─────

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

// ───── Mutation: Create Project (camelCase) ─────

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

// ───── Mutation: Update Project (camelCase) ─────

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

    // Update metrics if relevant fields provided
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

// ───── Mutation: Delete Project (camelCase) ─────

export const remove = async (id) => {
    // Delete related data first (in case no CASCADE)
    await db.query('DELETE FROM project_metrics WHERE projectId = ?', [id]);
    await db.query('DELETE FROM issues WHERE projectId = ?', [id]);
    await db.query('DELETE FROM timeline_events WHERE projectId = ?', [id]);
    await db.query('DELETE FROM project_members WHERE projectId = ?', [id]);

    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows;
};
