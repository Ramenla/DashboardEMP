/**
 * @file ProjectList.jsx
 * @description Halaman daftar proyek dengan filtering multi-kriteria.
 * Menampilkan tabel proyek yang dapat difilter berdasarkan pencarian teks,
 * kategori, status, prioritas, dan lokasi. Klik baris membuka drawer detail.
 * Data diambil dari backend API (MySQL).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Input, message, Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';

import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/projects';

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
  });

  const [filteredData, setFilteredData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * Mengambil data proyek dari backend API.
   * Mendukung format response array maupun object `{ projects }`.
   */
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const result = await res.json();
      const projects = Array.isArray(result) ? result : (result.projects || []);
      setAllData(projects);
    } catch (err) {
      message.error(err.message || 'Gagal mengambil data dari server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

      return matchSearch && matchCategory && matchStatus && matchPriority && matchLocation;
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
    setFilters({ search: filters.search, categories: [], status: '', priority: '', location: '' });
  };

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
            style={{ width: 320 }}
          />
        </Space>
      </div>

      <FilterCard filters={filters} onFilterChange={setFilters} onReset={handleReset} />

      <div className="mt-3">
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
