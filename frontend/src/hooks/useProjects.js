import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../shared/services/projectService';

/**
 * Custom hook untuk mengambil data proyek dari API.
 * Meng-wrap projectService.getProjects() dengan state management.
 *
 * @param {Object} filters - filter opsional (year, month, category, dll)
 * @returns {{ projects: Array, stats: Object, topIssues: Array, loading: boolean, error: string|null, refetch: Function }}
 */
const useProjects = (filters = {}) => {
    const [data, setData] = useState({ projects: [], stats: {}, topIssues: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getProjects(filters);
            setData({
                projects: result.projects || [],
                stats: result.stats || {},
                topIssues: result.topIssues || [],
            });
        } catch (err) {
            setError(err.message || 'Gagal mengambil data proyek');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        projects: data.projects,
        stats: data.stats,
        topIssues: data.topIssues,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useProjects;
