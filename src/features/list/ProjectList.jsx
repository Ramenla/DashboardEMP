import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { projectsData } from '../../shared/data/mockData';
import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';

/**
 * halaman project list - daftar semua project dengan filtering
 * search bar + 4 filter (kategori, status, prioritas, lokasi) + tabel
 * @returns {JSX.Element} halaman project list
 */
const ProjectList = () => {
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    status: '',
    priority: '',
    location: '',
  });

  const [filteredData, setFilteredData] = useState(projectsData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    const result = projectsData.filter((item) => {
      const matchSearch = item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.manager.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      const matchStatus = !filters.status || item.status === filters.status;
      const matchPriority = !filters.priority || item.priority === filters.priority;
      const matchLocation = !filters.location || item.location === filters.location;

      return matchSearch && matchCategory && matchStatus && matchPriority && matchLocation;
    });
    setFilteredData(result);
  }, [filters]);

  const handleReset = () => {
    setFilters({ search: filters.search, categories: [], status: '', priority: '', location: '' });
  };

  return (
    <div className="pb-4 -mt-10">
      {/* header: title + search */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#001529] m-0">Project List</h2>
        <Input
          placeholder="Cari kode, nama, atau manager..."
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="rounded-lg"
          style={{ width: 320 }}
        />
      </div>

      {/* filter bar */}
      <FilterCard filters={filters} onFilterChange={setFilters} onReset={handleReset} />

      {/* table */}
      <div className="mt-3">
        <ProjectTable dataSource={filteredData} onRowClick={handleProjectClick} />
      </div>

      {/* drawer */}
      <ProjectDetailDrawer project={selectedProject} open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default ProjectList;