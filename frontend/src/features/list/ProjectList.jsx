/**
 * @file ProjectList.jsx
 * @description Halaman daftar proyek dengan filtering multi-kriteria.
 * Menampilkan tabel proyek yang dapat difilter berdasarkan pencarian teks,
 * kategori, status, prioritas, lokasi, dan rentang tanggal.
 * Filter ditampilkan dalam popup (Popover) saat klik tombol "Filter".
 * Data diambil dari backend API (MySQL).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import projectService from '../../shared/services/projectService';

/**
 * @returns {JSX.Element} Halaman project list dengan filter, tabel, dan drawer detail.
 */
const ProjectList = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    status: '',
    priority: '',
    location: '',
    dateRange: null,
  });

  const [filteredData, setFilteredData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [metadata, setMetadata] = useState({ categories: [], statuses: [], locations: [], priorities: [] });

  const fetchMetadata = useCallback(async () => {
    try {
      const data = await projectService.getMetadata();
      setMetadata(data);
    } catch (err) {
      console.error('Error fetching metadata:', err);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const result = await projectService.getAll();
      const projects = Array.isArray(result) ? result : (result.projects || []);
      setAllData(projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    fetchProjects();
  }, [fetchMetadata, fetchProjects]);

  useEffect(() => {
    const result = allData.filter((item) => {
      const matchSearch = (item.id || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.manager || '').toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      const matchStatus = !filters.status || item.status === filters.status;
      const matchPriority = !filters.priority || item.priority === filters.priority;
      const matchLocation = !filters.location ||
        (item.location || '').toLowerCase().includes(filters.location.toLowerCase());

      // Date range filter
      let matchDate = true;
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const from = filters.dateRange[0].startOf('day').valueOf();
        const to = filters.dateRange[1].endOf('day').valueOf();
        const startDate = item.startDate ? new Date(item.startDate).getTime() : null;
        const endDate = item.endDate ? new Date(item.endDate).getTime() : null;

        if (startDate && endDate) {
          matchDate = startDate <= to && endDate >= from;
        } else if (startDate) {
          matchDate = startDate >= from && startDate <= to;
        }
      }

      return matchSearch && matchCategory && matchStatus && matchPriority && matchLocation && matchDate;
    });
    setFilteredData(result);
  }, [filters, allData]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProject(null);
  };

  const handleReset = () => {
    setFilters({ search: '', categories: [], status: '', priority: '', location: '', dateRange: null });
  };

  // Hitung jumlah proyek total dan yang terfilter
  const totalCount = allData.length;
  const filteredCount = filteredData.length;

  return (
    <div className="pb-4 -mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#001529] m-0">Project List</h2>
        <Space size="middle">
          <Input
            placeholder="Cari kode, nama, atau manager..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="rounded-lg"
            style={{ width: 280 }}
            size="small"
          />
          <FilterCard
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleReset}
            metadata={metadata}
            loading={loading}
          />
        </Space>
      </div>

      <div className="mt-1">
        <ProjectTable
          dataSource={filteredData}
          onRowClick={handleProjectClick}
          loading={loading}
        />
      </div>

      <ProjectDetailDrawer project={selectedProject} open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default ProjectList;
