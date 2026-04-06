/**
 * @file projectService.js
 * @description Service layer untuk semua operasi API terkait proyek.
 *
 * Mendukung mode FALLBACK ke data dummy lokal ketika backend tidak tersedia.
 * Untuk mengaktifkan fallback paksa, set variabel env:
 *   VITE_USE_DUMMY_DATA=true
 * atau ketika permintaan API gagal (auto-fallback).
 *
 * Format response dummyGetAll() IDENTIK dengan format projectController.getProjects()
 * di backend, termasuk: projects[].issues, projects[].timelineEvents, projects[].team,
 * topIssues[]{name, count, categories, divisions, projects[]}, stats.
 */

import apiClient from '../../api/apiClient';
import {
    projectsWithMetrics,
    metadata as dummyMetadata,
    issues as dummyIssues,
    timelineEvents as dummyTimelineEvents,
    employees as dummyEmployees,
    projectMembers as dummyProjectMembers,
} from '../../data/dummyData';

// ─────────────────────────────────────────────────────────────────────────────
// MODE FLAG: aktifkan true untuk selalu pakai dummy tanpa hit backend
// ─────────────────────────────────────────────────────────────────────────────
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY_DATA === 'true';

/** Simulasi network delay agar terasa realistik */
const simulateDelay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS: hitungan index bulan proyek (sama dengan backend)
// ─────────────────────────────────────────────────────────────────────────────
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

const isProjectAtRisk = (p) => {
    const spi = parseFloat(p.spi) || 1;
    const totalBudget = parseFloat(p.totalBudget) || 0;
    const budgetUsed = parseFloat(p.budgetUsed) || 0;
    const budgetPct = totalBudget > 0 ? (budgetUsed / totalBudget) * 100 : 0;
    return p.status === 'Beresiko' || spi < 0.8 || budgetPct >= 90;
};

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY GET ALL — mereplikasi logika projectController.getProjects()
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Filter + kembalikan data dummy dalam format IDENTIK dengan backend.
 * @param {Object} params
 * @returns {{ projects, stats, topIssues }}
 */
const dummyGetAll = (params = {}) => {
    // 1. Filter projects (sama dengan SQL WHERE di backend)
    let filtered = [...projectsWithMetrics];

    if (params.year) {
        filtered = filtered.filter(p => {
            const start = new Date(p.startDate);
            const end   = new Date(p.endDate);
            if (params.month !== undefined && params.month !== null) {
                const som = new Date(params.year, params.month, 1);
                const eom = new Date(params.year, parseInt(params.month) + 1, 0);
                return start <= eom && end >= som;
            }
            return start.getFullYear() === parseInt(params.year);
        });
    }
    if (params.category) {
        const cats = Array.isArray(params.category) ? params.category : [params.category];
        if (cats.length > 0) filtered = filtered.filter(p => cats.includes(p.category));
    }
    if (params.status)   filtered = filtered.filter(p => p.status === params.status);
    if (params.priority) filtered = filtered.filter(p => p.priority === params.priority);
    if (params.location) filtered = filtered.filter(p =>
        (p.location || '').toLowerCase().includes(params.location.toLowerCase())
    );

    const projectIds = filtered.map(p => p.id);

    // 2. Build lookup maps (mirror issueMap, timelineMap, teamMap pakai backend)
    const issueMap = {};
    const issueStats = {};

    dummyIssues
        .filter(iss => projectIds.includes(iss.projectId))
        .forEach(issue => {
            if (!issueMap[issue.projectId]) issueMap[issue.projectId] = [];
            issueMap[issue.projectId].push({ title: issue.title, division: issue.division });

            const trimmedTitle = issue.title ? issue.title.trim() : '';
            if (trimmedTitle) {
                if (!issueStats[trimmedTitle]) {
                    issueStats[trimmedTitle] = {
                        name: trimmedTitle,
                        count: 0,
                        categories: new Set(),
                        divisions: new Set(),
                        projects: [],
                        addedProjects: new Set(),
                    };
                }
                issueStats[trimmedTitle].count++;
                if (issue.division) issueStats[trimmedTitle].divisions.add(issue.division.trim());
            }
        });

    const timelineMap = {};
    dummyTimelineEvents
        .filter(evt => projectIds.includes(evt.projectId))
        .forEach(evt => {
            if (!timelineMap[evt.projectId]) timelineMap[evt.projectId] = [];
            timelineMap[evt.projectId].push({
                id: evt.id, eventName: evt.eventName,
                startDate: evt.startDate, endDate: evt.endDate,
                description: `${evt.eventName} phase`,
            });
        });

    const teamMap = {};
    dummyProjectMembers
        .filter(pm => projectIds.includes(pm.projectId))
        .forEach(pm => {
            if (!teamMap[pm.projectId]) teamMap[pm.projectId] = [];
            const emp = dummyEmployees.find(e => e.id === pm.employeeId);
            if (emp) teamMap[pm.projectId].push({ name: emp.name, role: pm.role });
        });

    // 3. Build project objects dengan stats (identik dengan backend)
    let totalSpi = 0, totalCpi = 0, atRiskCount = 0, onTrackCount = 0;

    const projectsResult = filtered.map(p => {
        const startMonth  = getMonthIndex(p.startDate);
        const duration    = getDuration(p.startDate, p.endDate) || 1;
        const progress    = parseFloat(p.progress) || 0;
        const totalBudget = parseFloat(p.totalBudget) || 0;
        const budgetUsed  = parseFloat(p.budgetUsed) || 0;
        const plannedValue = parseFloat(p.plannedValue) || 0;
        const spi = parseFloat((parseFloat(p.spi) || 1).toFixed(2));
        const cpi = parseFloat((parseFloat(p.cpi) || 1).toFixed(2));

        totalSpi += spi;
        totalCpi += cpi;

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
            team, gallery: [], documents: [],
        };

        // Tambahkan ke issueStats.projects (sama dengan backend)
        if (issueMap[p.id]) {
            issueMap[p.id].forEach(issueItem => {
                const issueTitle = issueItem.title ? issueItem.title.trim() : '';
                const division   = issueItem.division ? issueItem.division.trim() : '';
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

    // 4. Build topIssues (identik format dengan backend)
    const topIssues = Object.values(issueStats)
        .map(issue => {
            const { addedProjects, ...rest } = issue;
            return {
                ...rest,
                categories: Array.from(issue.categories),
                divisions: Array.from(issue.divisions),
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // 5. Aggregate stats
    const n = projectsResult.length;
    const stats = {
        total: n,
        atRisk: atRiskCount,
        onTrack: onTrackCount,
        spiAvg: n > 0 ? (totalSpi / n).toFixed(2) : '0.00',
        cpiAvg: n > 0 ? (totalCpi / n).toFixed(2) : '0.00',
    };

    return { projects: projectsResult, stats, topIssues };
};

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE OBJECT
// ─────────────────────────────────────────────────────────────────────────────
const projectService = {
    /**
     * Get all projects dengan optional filters.
     * @param {Object} params - { year, month, category, status, location }
     * @returns {{ projects, stats, topIssues }}
     */
    getAll: async (params = {}) => {
        if (USE_DUMMY) {
            await simulateDelay();
            return dummyGetAll(params);
        }

        try {
            const response = await apiClient.get('projects', { params });
            return response.data;
        } catch (err) {
            console.warn('[projectService] Backend tidak tersedia, menggunakan data dummy.', err.message);
            return dummyGetAll(params);
        }
    },

    /**
     * Get metadata untuk dropdown filter (categories, statuses, locations).
     */
    getMetadata: async () => {
        if (USE_DUMMY) {
            await simulateDelay(200);
            return dummyMetadata;
        }

        try {
            const response = await apiClient.get('projects/metadata');
            return response.data;
        } catch (err) {
            console.warn('[projectService] Metadata: fallback ke dummy.', err.message);
            return dummyMetadata;
        }
    },

    /**
     * Create a new project.
     */
    create: async (projectData) => {
        if (USE_DUMMY) {
            await simulateDelay();
            return { success: true, message: 'Data dummy (tidak disimpan permanen).' };
        }
        const response = await apiClient.post('projects', projectData);
        return response.data;
    },

    /**
     * Update an existing project.
     */
    update: async (id, projectData) => {
        if (USE_DUMMY) {
            await simulateDelay();
            return { success: true, message: 'Data dummy diupdate (tidak disimpan permanen).' };
        }
        const response = await apiClient.put(`projects/${id}`, projectData);
        return response.data;
    },

    /**
     * Delete a project.
     */
    delete: async (id) => {
        if (USE_DUMMY) {
            await simulateDelay();
            return { success: true, message: 'Data dummy dihapus (tidak disimpan permanen).' };
        }
        const response = await apiClient.delete(`projects/${id}`);
        return response.data;
    },
};

export default projectService;
