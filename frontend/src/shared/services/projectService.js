import apiClient from '../../api/apiClient';

/**
 * Service for project related API calls
 */
const projectService = {
    /**
     * Get all projects with optional filters
     * @param {Object} params - { year, month, category, status, location }
     */
    getAll: async (params = {}) => {
        const response = await apiClient.get('/projects', { params });
        // Returns { projects, stats, topIssues }
        return response.data;
    },

    /**
     * Get project metadata (categories, statuses, locations)
     */
    getMetadata: async () => {
        const response = await apiClient.get('/projects/metadata');
        return response.data;
    },

    /**
     * Create a new project
     */
    create: async (projectData) => {
        const response = await apiClient.post('/projects', projectData);
        return response.data;
    },

    /**
     * Update an existing project
     */
    update: async (id, projectData) => {
        const response = await apiClient.put(`/projects/${id}`, projectData);
        return response.data;
    },

    /**
     * Delete a project
     */
    delete: async (id) => {
        const response = await apiClient.delete(`/projects/${id}`);
        return response.data;
    }
};

export default projectService;
