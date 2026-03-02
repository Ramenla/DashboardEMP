/**
 * @file projectController.js
 * @description Controller untuk menangani endpoint API pengelolaan data proyek,
 * menghitung EVM (Earned Value Management) secara agregat, kompilasi data issues,
 * timeline proyek, dan pengelolaan data tim proyek.
 */

import * as ProjectModel from '../models/projectModel.js';

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

/**
 * Logika terpusat untuk menentukan apakah sebuah proyek "Berisiko" (At Risk)
 */
export const isProjectAtRisk = (p) => {
    const spi = parseFloat(p.spi) || 1;
    const totalBudget = parseFloat(p.totalBudget) || 0;
    const budgetUsed = parseFloat(p.budgetUsed) || 0;
    const budgetPct = totalBudget > 0 ? (budgetUsed / totalBudget) * 100 : 0;

    return p.status === 'Beresiko' || spi < 0.8 || budgetPct >= 90;
};

export const getProjects = async (req, res) => {
    try {
        const { year, month, category, status, location } = req.query;

        const projects = await ProjectModel.findAll({ year, month, category, status, location });
        const projectIds = projects.map(p => p.id);

        let allIssues = [], allTimeline = [], allMembers = [];
        try { allIssues = await ProjectModel.findIssues(projectIds); } catch (e) { console.warn("Issues query failed:", e.message); }
        try { allTimeline = await ProjectModel.findTimeline(projectIds); } catch (e) { console.warn("Timeline query failed:", e.message); }
        try { allMembers = await ProjectModel.findMembers(projectIds); } catch (e) { console.warn("Members query failed:", e.message); }

        const issueMap = {};
        const issueStats = {};
        for (const issue of allIssues) {
            if (!issueMap[issue.projectId]) issueMap[issue.projectId] = [];
            issueMap[issue.projectId].push({ title: issue.title, division: issue.division });

            const trimmedTitle = issue.title ? issue.title.trim() : "";
            if (trimmedTitle) {
                if (!issueStats[trimmedTitle]) {
                    issueStats[trimmedTitle] = {
                        name: trimmedTitle,
                        count: 0,
                        categories: new Set(),
                        divisions: new Set(),
                        projects: [],
                        addedProjects: new Set()
                    };
                }
                issueStats[trimmedTitle].count++;
                if (issue.division) {
                    issueStats[trimmedTitle].divisions.add(issue.division.trim());
                }
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

            totalSpi += spi;
            totalCpi += cpi;

            const budgetPct = totalBudget > 0 ? (budgetUsed / totalBudget) * 100 : 0;

            if (isProjectAtRisk(p)) {
                atRiskCount++;
            } else if (spi >= 0.9 && p.status !== 'Beresiko') {
                onTrackCount++;
            }

            const target = totalBudget > 0 ? (plannedValue / totalBudget) * 100 : 0;

            let team = teamMap[p.id] || [];
            if (team.length === 0 && p.manager) {
                team = [{ name: p.manager, role: 'Project Manager' }];
            }

            const projectObj = {
                id: p.id, name: p.name, category: p.category,
                priority: p.priority, status: p.status,
                startDate: p.startDate, endDate: p.endDate,
                startMonth, duration, totalBudget, budgetUsed,
                target, progress, spi, cpi,
                location: p.location, manager: p.manager,
                issues: issueMap[p.id] || [],
                timelineEvents: timelineMap[p.id] || [],
                team, gallery: [], documents: []
            };

            if (issueMap[p.id]) {
                issueMap[p.id].forEach(issueItem => {
                    const issueTitle = issueItem.title ? issueItem.title.trim() : "";
                    const division = issueItem.division ? issueItem.division.trim() : "";
                    const projectKey = `${p.id}:${division}`;

                    if (issueStats[issueTitle]) {
                        issueStats[issueTitle].categories.add(p.category);
                        if (!issueStats[issueTitle].addedProjects.has(projectKey)) {
                            issueStats[issueTitle].projects.push({ ...projectObj, activeDivision: division });
                            issueStats[issueTitle].addedProjects.add(projectKey);
                        }
                    }
                });
            }

            return projectObj;
        });

        const topIssues = Object.values(issueStats)
            .map(issue => {
                const { addedProjects, ...rest } = issue;
                return {
                    ...rest,
                    categories: Array.from(issue.categories),
                    divisions: Array.from(issue.divisions)
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

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

/**
 * Controller membuat proyek baru beserta placeholder value di DB.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export const createProject = async (req, res) => {
    const p = req.body;
    try {
        const id = p.id || `EMP-NEW-${Date.now()}`;

        const progress = parseFloat(p.progress) || 0;
        const totalBudget = parseFloat(p.totalBudget) || 0;
        const budgetUsed = parseFloat(p.budgetUsed) || 0;
        const target = parseFloat(p.target) || 0;
        const earnedValue = totalBudget * (progress / 100);
        const plannedValue = totalBudget * (target / 100);
        const spi = plannedValue > 0 ? parseFloat((earnedValue / plannedValue).toFixed(2)) : 1;
        const cpi = budgetUsed > 0 ? parseFloat((earnedValue / budgetUsed).toFixed(2)) : 1;

        await ProjectModel.create({
            id,
            projectCode: id,
            name: p.name || '',
            category: p.category || 'OPERATION',
            priority: p.priority || 'Sedang',
            status: p.status || 'Berjalan',
            startDate: p.startDate || new Date(),
            endDate: p.endDate || new Date(),
            totalBudget,
            location: p.location || '',
            manager: p.manager || '',
            budgetUsed, progress, plannedValue, earnedValue, spi, cpi
        });

        res.status(201).json({ message: 'Project created successfully', id });
    } catch (error) {
        console.error("Create Project Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller pembaruan proyek.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export const updateProject = async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    try {
        await ProjectModel.update(id, p);
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error("Update Project Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller penghapusan proyek.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await ProjectModel.remove(id);
        if (affectedRows === 0) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Delete Project Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getProjectMetadata = async (req, res) => {
    try {
        const metadata = await ProjectModel.getMetadata();
        res.json(metadata);
    } catch (error) {
        console.error("Get Metadata Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};
