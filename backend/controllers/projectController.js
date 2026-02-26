import db from '../config/db.js';

// Helper: Get Month Index (0-11)
const getMonthIndex = (date) => {
    if (!date) return 0;
    return new Date(date).getMonth();
};

// Helper: Calculate duration in months
const getDuration = (start, end) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
};

// Get all projects with relations and summary statistics
export const getProjects = async (req, res) => {
    try {
        const { year, month, category, status, location } = req.query;

        // 1. Get all projects with their latest metrics
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
        const queryParams = [];

        if (year) {
            if (month !== undefined && month !== null) {
                const startOfMonth = new Date(year, month, 1);
                const endOfMonth = new Date(year, parseInt(month) + 1, 0);
                query += ` AND p.startDate <= ? AND p.endDate >= ?`;
                queryParams.push(endOfMonth, startOfMonth);
            } else {
                query += ` AND YEAR(p.startDate) = ?`;
                queryParams.push(year);
            }
        }
        if (category) {
            const categories = Array.isArray(category) ? category : [category];
            query += ` AND p.category IN (?)`;
            queryParams.push(categories);
        }
        if (status) {
            query += ` AND p.status = ?`;
            queryParams.push(status);
        }
        if (location) {
            query += ` AND p.location LIKE ?`;
            queryParams.push(`%${location}%`);
        }

        query += ` ORDER BY p.id ASC`;

        const [projects] = await db.query(query, queryParams);

        // 2. Get all issues for the filtered projects
        const projectIds = projects.map(p => p.id);
        let allIssues = [];
        if (projectIds.length > 0) {
            try {
                [allIssues] = await db.query(`
                    SELECT id, projectId, title, division, severity, status, impactScore
                    FROM issues
                    WHERE projectId IN (?)
                `, [projectIds]);
            } catch (err) {
                console.warn("Issues table missing or query failed:", err.message);
            }
        }

        // 3. Get all timeline events for the filtered projects
        let allTimeline = [];
        if (projectIds.length > 0) {
            try {
                [allTimeline] = await db.query(`
                    SELECT id, projectId, eventName, startDate, endDate, taskBudget, calculatedProgress
                    FROM timeline_events
                    WHERE projectId IN (?)
                    ORDER BY startDate ASC
                `, [projectIds]);
            } catch (err) {
                console.warn("Timeline table missing or query failed:", err.message);
            }
        }

        // 4. Get all project members
        let allMembers = [];
        if (projectIds.length > 0) {
            try {
                [allMembers] = await db.query(`
                    SELECT pmb.projectId, pmb.role, e.name
                    FROM project_members pmb
                    LEFT JOIN employees e ON e.id = pmb.employeeId
                    WHERE pmb.projectId IN (?)
                `, [projectIds]);
            } catch (err) {
                console.warn("Members tables missing or query failed:", err.message);
            }
        }

        // Build lookup maps
        const issueMap = {};
        const issueStats = {}; // For top issues
        for (const issue of allIssues) {
            if (!issueMap[issue.projectId]) issueMap[issue.projectId] = [];
            issueMap[issue.projectId].push({ title: issue.title, division: issue.division });

            // Count issues for Top Issues
            if (!issueStats[issue.title]) {
                issueStats[issue.title] = {
                    name: issue.title,
                    count: 0,
                    categories: new Set(),
                    divisions: new Set(),
                    projects: []
                };
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
                id: evt.id,
                eventName: evt.eventName,
                startDate: evt.startDate,
                endDate: evt.endDate,
                description: `${evt.eventName} phase`
            });
        }

        const teamMap = {};
        for (const member of allMembers) {
            if (!teamMap[member.projectId]) teamMap[member.projectId] = [];
            teamMap[member.projectId].push({
                name: member.name || 'Staff',
                role: member.role || 'Member'
            });
        }

        let totalSpi = 0;
        let totalCpi = 0;
        let atRiskCount = 0;
        let onTrackCount = 0;

        // 5. Compose final result and calculate stats
        const projectsResult = projects.map(p => {
            const startMonth = getMonthIndex(p.startDate);
            const duration = getDuration(p.startDate, p.endDate) || 1;
            const progress = parseFloat(p.progress) || 0;
            const totalBudget = parseFloat(p.totalBudget) || 0;
            const budgetUsed = parseFloat(p.budgetUsed) || 0;
            const plannedValue = parseFloat(p.plannedValue) || 0;
            const spi = parseFloat((parseFloat(p.spi) || 1).toFixed(2));
            const cpi = parseFloat((parseFloat(p.cpi) || 1).toFixed(2));

            totalSpi += spi;
            totalCpi += cpi;

            const budgetPct = totalBudget > 0 ? (budgetUsed / totalBudget) * 100 : 0;
            if (p.status === 'Beresiko' || spi < 0.8 || budgetPct >= 90) {
                atRiskCount++;
            } else if (spi >= 0.9 && p.status !== 'Beresiko') {
                onTrackCount++;
            }

            // Update issueStats with categories for Top Issues


            // Calculate target from plannedValue
            const target = totalBudget > 0 ? (plannedValue / totalBudget) * 100 : 0;

            // Build team
            let team = teamMap[p.id] || [];
            if (team.length === 0 && p.manager) {
                team = [{ name: p.manager, role: 'Project Manager' }];
            }

            const projectObj = {
                id: p.id,
                name: p.name,
                category: p.category,
                priority: p.priority,
                status: p.status,
                startDate: p.startDate,
                endDate: p.endDate,
                startMonth,
                duration,
                totalBudget,
                budgetUsed,
                target,
                progress,
                spi,
                cpi,
                location: p.location,
                manager: p.manager,
                issues: issueMap[p.id] || [],
                timelineEvents: timelineMap[p.id] || [],
                team,
                gallery: [],
                documents: []
            };

            // Update issueStats with categories for Top Issues
            if (issueMap[p.id]) {
                issueMap[p.id].forEach(issueItem => {
                    const issueTitle = issueItem.title;
                    if (issueStats[issueTitle]) {
                        issueStats[issueTitle].categories.add(p.category);
                        issueStats[issueTitle].projects.push(projectObj);
                    }
                });
            }

            return projectObj;
        });

        const topIssues = Object.values(issueStats)
            .map(issue => ({
                ...issue,
                categories: Array.from(issue.categories),
                divisions: Array.from(issue.divisions)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const stats = {
            total: projectsResult.length,
            atRisk: atRiskCount,
            onTrack: onTrackCount,
            spiAvg: projectsResult.length > 0 ? (totalSpi / projectsResult.length).toFixed(2) : "0.00",
            cpiAvg: projectsResult.length > 0 ? (totalCpi / projectsResult.length).toFixed(2) : "0.00"
        };

        // For backward compatibility and specialized dashboard needs
        // we can check if the requester wants the legacy array format or the new object format.
        // But the user asked to move ALL logic, so we will transition to the object format.
        // IMPORTANT: We must update the frontend to handle this!
        res.json({
            projects: projectsResult,
            stats,
            topIssues
        });
    } catch (error) {
        console.error("Get Projects Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Create new project (DATABASE VERSION)
export const createProject = async (req, res) => {
    const p = req.body;
    try {
        const id = p.id || `EMP-NEW-${Date.now()}`;
        const projectCode = id;

        // Insert into projects table
        await db.query(`
            INSERT INTO projects (id, projectCode, name, category, priority, status, startDate, endDate, totalBudget, location, manager)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id, projectCode,
            p.name || '',
            p.category || 'OPERATION',
            p.priority || 'Sedang',
            p.status || 'Berjalan',
            p.startDate || new Date(),
            p.endDate || new Date(),
            p.totalBudget || 0,
            p.location || '',
            p.manager || ''
        ]);

        // Insert initial metrics
        const progress = parseFloat(p.progress) || 0;
        const totalBudget = parseFloat(p.totalBudget) || 0;
        const target = parseFloat(p.target) || 0;
        const budgetUsed = parseFloat(p.budgetUsed) || 0;
        const earnedValue = totalBudget * (progress / 100);
        const plannedValue = totalBudget * (target / 100);
        const spi = plannedValue > 0 ? (earnedValue / plannedValue).toFixed(2) : 1;
        const cpi = budgetUsed > 0 ? (earnedValue / budgetUsed).toFixed(2) : 1;

        await db.query(`
            INSERT INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, spi, cpi)
            VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)
        `, [`met-${id}`, id, budgetUsed, progress, plannedValue, earnedValue, spi, cpi]);

        res.status(201).json({ message: 'Project created successfully', id });
    } catch (error) {
        console.error("Create Project Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// Update project (DATABASE VERSION)
export const updateProject = async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    try {
        // Update projects table
        const fields = [];
        const values = [];

        if (p.name !== undefined) { fields.push('name = ?'); values.push(p.name); }
        if (p.category !== undefined) { fields.push('category = ?'); values.push(p.category); }
        if (p.priority !== undefined) { fields.push('priority = ?'); values.push(p.priority); }
        if (p.status !== undefined) { fields.push('status = ?'); values.push(p.status); }
        if (p.startDate !== undefined) { fields.push('startDate = ?'); values.push(p.startDate); }
        if (p.endDate !== undefined) { fields.push('endDate = ?'); values.push(p.endDate); }
        if (p.totalBudget !== undefined) { fields.push('totalBudget = ?'); values.push(p.totalBudget); }
        if (p.location !== undefined) { fields.push('location = ?'); values.push(p.location); }
        if (p.manager !== undefined) { fields.push('manager = ?'); values.push(p.manager); }

        if (fields.length > 0) {
            values.push(id);
            await db.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
        }

        // Update metrics if relevant fields provided
        if (p.progress !== undefined || p.budgetUsed !== undefined || p.target !== undefined) {
            const totalBudget = parseFloat(p.totalBudget) || 0;
            const progress = parseFloat(p.progress) || 0;
            const target = parseFloat(p.target) || 0;
            const budgetUsed = parseFloat(p.budgetUsed) || 0;
            const earnedValue = totalBudget * (progress / 100);
            const plannedValue = totalBudget * (target / 100);
            const spi = plannedValue > 0 ? (earnedValue / plannedValue).toFixed(2) : 1;
            const cpi = budgetUsed > 0 ? (earnedValue / budgetUsed).toFixed(2) : 1;

            // Upsert metrics
            const [existing] = await db.query('SELECT id FROM project_metrics WHERE projectId = ?', [id]);
            if (existing.length > 0) {
                await db.query(`
                    UPDATE project_metrics
                    SET actualCost = ?, actualProgress = ?, plannedValue = ?, earnedValue = ?, spi = ?, cpi = ?, recordDate = NOW()
                    WHERE projectId = ?
                `, [budgetUsed, progress, plannedValue, earnedValue, spi, cpi, id]);
            } else {
                await db.query(`
                    INSERT INTO project_metrics (id, projectId, recordDate, actualCost, actualProgress, plannedValue, earnedValue, spi, cpi)
                    VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?)
                `, [`met-${id}`, id, budgetUsed, progress, plannedValue, earnedValue, spi, cpi]);
            }
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error("Update Project Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// Delete project (DATABASE VERSION)
export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete related data first (in case no CASCADE)
        await db.query('DELETE FROM project_metrics WHERE projectId = ?', [id]);
        await db.query('DELETE FROM issues WHERE projectId = ?', [id]);
        await db.query('DELETE FROM timeline_events WHERE projectId = ?', [id]);
        await db.query('DELETE FROM project_members WHERE projectId = ?', [id]);
        await db.query('DELETE FROM task_milestones WHERE projectId = ?', [id]);

        // Delete project
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Delete Project Error:", error);
        res.status(500).json({ message: error.message });
    }
};
