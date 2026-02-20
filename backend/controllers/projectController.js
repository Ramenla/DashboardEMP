import { MOCK_PROJECTS } from '../data/mockData.js';
// import db from '../config/db.js'; // Database disabled for mock mode

// In-memory storage for the session
let projects = [...MOCK_PROJECTS];

// Helper: Format Date to YYYY-MM-DD
const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

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

// Get all projects with relations (MOCK VERSION)
export const getProjects = async (req, res) => {
    try {
        // Return in-memory projects directly
        // The mock data is already in the "Frontend Structure" heavily, 
        // but let's ensure we map it if needed. 
        // Our MOCK_PROJECTS generator already creates the structure the frontend expects 
        // (including issues, timelineEvents, team, etc.)
        
        // Just sort by created date (simulated or just return as is)
        // MOCK_PROJECTS array order.
        
        // We might need to ensure numeric fields are numbers if they were strings.
        
        // Recalculate duration/startMonth dynamic fields just in case
        const result = projects.map(p => {
             const startMonth = getMonthIndex(p.startDate);
             const duration = getDuration(p.startDate, p.endDate) || 1;
             
             return {
                 ...p,
                 startMonth,
                 duration,
                 // Ensure nested arrays exist
                 issues: p.issues || [],
                 timelineEvents: p.timelineEvents || [],
                 team: p.team || [],
                 gallery: p.gallery || [],
                 documents: p.documents || []
             };
        });

        res.json(result);
    } catch (error) {
        console.error("Get Projects Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Create new project (MOCK VERSION)
export const createProject = async (req, res) => {
    const p = req.body;
    try {
        const newProject = {
            ...p,
            id: p.id || `EMP-NEW-${Date.now()}`,
            issues: p.issues || [],
            timelineEvents: p.timelineEvents || [],
            team: p.team || [],
            gallery: [],
            documents: []
        };
        projects.unshift(newProject); // Add to beginning
        res.status(201).json({ message: 'Project created successfully (MOCK)', id: newProject.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update project (MOCK VERSION)
export const updateProject = async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    try {
        const index = projects.findIndex(proj => proj.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...p };
            res.json({ message: 'Project updated successfully (MOCK)' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete project (MOCK VERSION)
export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        projects = projects.filter(p => p.id !== id);
        res.json({ message: 'Project deleted successfully (MOCK)' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
