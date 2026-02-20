import db from '../config/db.js';

// Get all projects
export const getProjects = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
        // Parse JSON fields if necessary (some MySQL drivers do this automatically)
        const projects = rows.map(p => ({
            ...p,
            issues: typeof p.issues === 'string' ? JSON.parse(p.issues) : p.issues,
            timelineEvents: typeof p.timelineEvents === 'string' ? JSON.parse(p.timelineEvents) : p.timelineEvents,
            team: typeof p.team === 'string' ? JSON.parse(p.team) : p.team,
            hse: typeof p.hse === 'string' ? JSON.parse(p.hse) : p.hse,
            documents: typeof p.documents === 'string' ? JSON.parse(p.documents) : p.documents,
            gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery,
        }));
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new project
export const createProject = async (req, res) => {
    const p = req.body;
    try {
        const query = `
      INSERT INTO projects 
      (id, name, category, status, priority, progress, target, budgetUsed, budgetTotal, 
       startMonth, duration, sponsor, manager, strategy, startDate, endDate, location, 
       issues, timelineEvents, team, hse, documents, gallery) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        await db.query(query, [
            p.id, p.name, p.category, p.status, p.priority, p.progress || 0, p.target || 0,
            p.budgetUsed || 0, p.budgetTotal || 0, p.startMonth || 0, p.duration || 0,
            p.sponsor, p.manager, p.strategy, p.startDate, p.endDate, p.location,
            JSON.stringify(p.issues || []),
            JSON.stringify(p.timelineEvents || []),
            JSON.stringify(p.team || []),
            JSON.stringify(p.hse || {}),
            JSON.stringify(p.documents || []),
            JSON.stringify(p.gallery || [])
        ]);

        res.status(201).json({ message: 'Project created successfully', id: p.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    try {
        const query = `
      UPDATE projects SET 
      name=?, category=?, status=?, priority=?, progress=?, target=?, budgetUsed=?, budgetTotal=?, 
      startMonth=?, duration=?, sponsor=?, manager=?, strategy=?, startDate=?, endDate=?, location=?, 
      issues=?, timelineEvents=?, team=?, hse=?, documents=?, gallery=?
      WHERE id=?
    `;

        await db.query(query, [
            p.name, p.category, p.status, p.priority, p.progress, p.target, p.budgetUsed, p.budgetTotal,
            p.startMonth, p.duration, p.sponsor, p.manager, p.strategy, p.startDate, p.endDate, p.location,
            JSON.stringify(p.issues || []),
            JSON.stringify(p.timelineEvents || []),
            JSON.stringify(p.team || []),
            JSON.stringify(p.hse || {}),
            JSON.stringify(p.documents || []),
            JSON.stringify(p.gallery || []),
            id
        ]);

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
