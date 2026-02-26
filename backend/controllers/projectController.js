import db from '../config/db.js';

const getMonthIndex = (date) => {
    if (!date) return 0;
    return new Date(date).getMonth();
};

const getDuration = (start, end) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
};

const mapPriority = (p) => {
    if (p === 'HIGH') return 'Tinggi';
    if (p === 'MEDIUM') return 'Sedang';
    if (p === 'LOW') return 'Rendah';
    return p;
};

/**
 * Hitung status proyek dari EVM metrics, bukan dari kolom status di DB.
 * Logic:
 * 1. Selesai:  progress == 100
 * 2. Beresiko: SPI < 0.8 ATAU (budgetUsed/totalBudget > 0.9 && progress < 100)
 * 3. Tertunda: SPI antara 0.8 – 0.95
 * 4. Berjalan: SPI > 0.95
 */
const computeStatus = (progress, spi, budgetUsed, totalBudget) => {
    if (progress >= 100) return 'Selesai';
    const budgetRatio = totalBudget > 0 ? budgetUsed / totalBudget : 0;
    if (spi < 0.8 || (budgetRatio > 0.9 && progress < 100)) return 'Beresiko';
    if (spi >= 0.8 && spi < 0.95) return 'Tertunda';
    return 'Berjalan';
};

export const getProjects = async (req, res) => {
    try {
        const { year, month, category, status } = req.query;

        // Ambil projects + latest metric per project
        let query = `
            SELECT 
                p.id,
                p.project_code AS projectCode,
                p.name,
                p.category,
                p.priority,
                p.start_date AS startDate,
                p.end_date AS endDate,
                p.total_budget AS totalBudget,
                p.location,
                COALESCE(pm.actual_cost, 0) AS budgetUsed,
                COALESCE(pm.actual_progress, 0) AS progress,
                COALESCE(pm.planned_value, 0) AS plannedValue,
                COALESCE(pm.earned_value, 0) AS earnedValue,
                COALESCE(pm.spi, 1) AS spi,
                COALESCE(pm.cpi, 1) AS cpi
            FROM projects p
            LEFT JOIN (
                SELECT m1.*
                FROM project_metrics m1
                INNER JOIN (
                    SELECT project_id, MAX(record_date) AS max_date
                    FROM project_metrics
                    GROUP BY project_id
                ) m2 ON m1.project_id = m2.project_id AND m1.record_date = m2.max_date
            ) pm ON pm.project_id = p.id
            WHERE 1=1
        `;
        const queryParams = [];

        if (year) {
            if (month !== undefined && month !== null) {
                const startOfMonth = new Date(year, month, 1);
                const endOfMonth = new Date(year, parseInt(month) + 1, 0);
                query += ` AND p.start_date <= ? AND p.end_date >= ?`;
                queryParams.push(endOfMonth, startOfMonth);
            } else {
                // Tampilkan proyek yang AKTIF di tahun tersebut (bukan hanya yang mulai di tahun tersebut)
                query += ` AND YEAR(p.start_date) <= ? AND YEAR(p.end_date) >= ?`;
                queryParams.push(year, year);
            }
        }
        if (category) {
            const categories = Array.isArray(category) ? category : [category];
            query += ` AND p.category IN (?)`;
            queryParams.push(categories);
        }
        if (status) {
            const reverseStatus = { 'Berjalan': 'ON_TRACK', 'Beresiko': 'AT_RISK', 'Tertunda': 'DELAYED', 'Selesai': 'COMPLETED' };
            query += ` AND p.status = ?`;
            queryParams.push(reverseStatus[status] || status);
        }
        if (req.query.priority) {
            const reversePriority = { 'Tinggi': 'HIGH', 'Sedang': 'MEDIUM', 'Rendah': 'LOW' };
            query += ` AND p.priority = ?`;
            queryParams.push(reversePriority[req.query.priority] || req.query.priority);
        }
        if (req.query.location) {
            query += ` AND p.location = ?`;
            queryParams.push(req.query.location);
        }

        query += ` ORDER BY p.id ASC`;
        const [projects] = await db.query(query, queryParams);

        const projectIds = projects.map(p => p.id);

        let allIssues = [], allTimeline = [], allMembers = [];

        if (projectIds.length > 0) {
            [allIssues] = await db.query(
                `SELECT id, project_id AS projectId, title, division, severity, status, impact_score AS impactScore FROM issues WHERE project_id IN (?)`,
                [projectIds]
            );
            [allTimeline] = await db.query(
                `SELECT id, project_id AS projectId, event_name AS eventName, start_date AS startDate, end_date AS endDate, task_budget AS taskBudget, calculated_progress AS calculatedProgress
                 FROM timeline_events WHERE project_id IN (?) ORDER BY start_date ASC`,
                [projectIds]
            );
            [allMembers] = await db.query(
                `SELECT pmb.project_id AS projectId, pmb.role, e.name
                 FROM project_members pmb
                 LEFT JOIN employees e ON e.id = pmb.employee_id
                 WHERE pmb.project_id IN (?)`,
                [projectIds]
            );
        }

        const issueMap = {};
        const issueStats = {};
        for (const issue of allIssues) {
            if (!issueMap[issue.projectId]) issueMap[issue.projectId] = [];
            // Simpan objek lengkap { title, division } agar frontend bisa baca division
            issueMap[issue.projectId].push({ title: issue.title, division: issue.division || '' });

            if (!issueStats[issue.title]) {
                issueStats[issue.title] = { name: issue.title, count: 0, categories: new Set(), divisions: new Set(), projects: [] };
            }
            issueStats[issue.title].count++;
            if (issue.division) {
                issueStats[issue.title].divisions.add(issue.division);
            }
        }

        const timelineMap = {};
        for (const evt of allTimeline) {
            if (!timelineMap[evt.projectId]) timelineMap[evt.projectId] = [];
            timelineMap[evt.projectId].push({
                id: evt.id, eventName: evt.eventName,
                startDate: evt.startDate, endDate: evt.endDate,
                description: `${evt.eventName} phase`
            });
        }

        const teamMap = {};
        for (const member of allMembers) {
            if (!teamMap[member.projectId]) teamMap[member.projectId] = [];
            teamMap[member.projectId].push({ name: member.name || 'Staff', role: member.role || 'Member' });
        }

        let totalSpi = 0, totalCpi = 0, atRiskCount = 0, onTrackCount = 0;

        const projectsResult = projects.map(p => {
            const startMonth = getMonthIndex(p.startDate);
            const duration = getDuration(p.startDate, p.endDate) || 1;
            const progress = parseFloat(p.progress) || 0;
            const totalBudget = parseFloat(p.totalBudget) || 0;
            const budgetUsed = parseFloat(p.budgetUsed) || 0;
            const plannedValue = parseFloat(p.plannedValue) || 0;
            const spi = parseFloat((parseFloat(p.spi) || 1).toFixed(2));
            const cpi = parseFloat((parseFloat(p.cpi) || 1).toFixed(2));

            // Status dihitung dari EVM metrics, bukan dari kolom status di DB
            const computedStatus = computeStatus(progress, spi, budgetUsed, totalBudget);

            totalSpi += spi;
            totalCpi += cpi;

            if (computedStatus === 'Beresiko') atRiskCount++;
            else if (computedStatus === 'Berjalan') onTrackCount++;

            if (issueMap[p.id]) {
                issueMap[p.id].forEach(issue => {
                    const issueName = issue.title;
                    const issueDivision = issue.division || '';
                    if (issueStats[issueName]) {
                        issueStats[issueName].categories.add(p.category);
                        issueStats[issueName].projects.push({
                            id: p.id, name: p.name, category: p.category,
                            activeDivision: issueDivision
                        });
                    }
                });
            }

            const target = totalBudget > 0 ? (plannedValue / totalBudget) * 100 : 0;
            const team = teamMap[p.id] || [];
            const manager = team.find(t => t.role === 'Project Manager')?.name || 'Belum Ditentukan';

            return {
                id: p.id, name: p.name, category: p.category, priority: mapPriority(p.priority),
                status: computedStatus, startDate: p.startDate, endDate: p.endDate,
                startMonth, duration, totalBudget, budgetUsed, target, progress, spi, cpi,
                location: p.location || 'Head Office', manager,
                issues: issueMap[p.id] || [],
                timelineEvents: timelineMap[p.id] || [],
                team, gallery: [], documents: []
            };
        });

        const topIssues = Object.values(issueStats)
            .map(issue => ({ ...issue, categories: Array.from(issue.categories), divisions: Array.from(issue.divisions || []) }))
            .sort((a, b) => b.count - a.count).slice(0, 5);

        const n = projectsResult.length;
        const stats = {
            total: n, atRisk: atRiskCount, onTrack: onTrackCount,
            spiAvg: n > 0 ? (totalSpi / n).toFixed(2) : "0.00",
            cpiAvg: n > 0 ? (totalCpi / n).toFixed(2) : "0.00"
        };

        res.json({ projects: projectsResult, stats, topIssues });
    } catch (error) {
        console.error("Get Projects Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    const p = req.body;
    try {
        const id = p.id || `EMP-NEW-${Date.now()}`;
        const mapPriority = (x) => x === 'Tinggi' ? 'HIGH' : (x === 'Rendah' ? 'LOW' : 'MEDIUM');
        const mapStatusReverse = (x) => x === 'Beresiko' ? 'AT_RISK' : (x === 'Tertunda' ? 'DELAYED' : (x === 'Selesai' ? 'COMPLETED' : 'ON_TRACK'));

        await db.query(
            `INSERT INTO projects (id, project_code, name, category, priority, status, start_date, end_date, total_budget)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, id, p.name || '', p.category || 'OPERATION', mapPriority(p.priority),
             mapStatusReverse(p.status), p.startDate || new Date(), p.endDate || new Date(),
             p.totalBudget || 0]
        );

        const progress = parseFloat(p.progress) || 0;
        const totalBudget = parseFloat(p.totalBudget) || 0;
        const budgetUsed = parseFloat(p.budgetUsed) || 0;
        const plannedValue = totalBudget * ((parseFloat(p.target) || 0) / 100);
        const earnedValue = totalBudget * (progress / 100);
        const spi = plannedValue > 0 ? parseFloat((earnedValue / plannedValue).toFixed(2)) : 1;
        const cpi = budgetUsed > 0 ? parseFloat((earnedValue / budgetUsed).toFixed(2)) : 1;

        await db.query(
            `INSERT INTO project_metrics (id, project_id, record_date, actual_cost, actual_progress, planned_value, earned_value, spi, cpi)
             VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)`,
            [`met-${id}`, id, budgetUsed, progress, plannedValue, earnedValue, spi, cpi]
        );

        res.status(201).json({ message: 'Project created successfully', id });
    } catch (error) {
        console.error("Create Project Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    res.json({ message: 'Update not implemented for new ERD' });
};

export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
