import React, { useState, useEffect } from 'react';
import { Input, Button, message, Space } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';
import ProjectModal from './components/ProjectModal';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import * as projectService from '../../shared/services/projectService';

/**
 * halaman project list - daftar semua project dengan filtering
 * search bar + 4 filter (kategori, status, prioritas, lokasi) + tabel
 * @returns {JSX.Element} halaman project list
 */
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      message.error('Gagal mengambil data proyek');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    const result = projects.filter((item) => {
      const matchSearch = (item.id || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
        (item.manager || '').toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      const matchStatus = !filters.status || item.status === filters.status;
      const matchPriority = !filters.priority || item.priority === filters.priority;
      const matchLocation = !filters.location || item.location === filters.location;

      return matchSearch && matchCategory && matchStatus && matchPriority && matchLocation;
    });
    setFilteredData(result);
  }, [filters, projects]);

  const handleReset = () => {
    setFilters({ search: filters.search, categories: [], status: '', priority: '', location: '' });
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await projectService.deleteProject(id);
      message.success('Proyek berhasil dihapus');
      fetchProjects();
    } catch (error) {
      message.error('Gagal menghapus proyek');
    }
  };

  const handleSave = async (values) => {
    setLoading(true);
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, values);
        message.success('Proyek berhasil diperbarui');
      } else {
        await projectService.createProject(values);
        message.success('Proyek berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      message.error('Gagal menyimpan proyek');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-4 -mt-10">
      {/* header: title + search + action */}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="rounded-lg shadow-sm"
          >
            Tambah Proyek
          </Button>
        </Space>
      </div>

      {/* filter bar */}
      <FilterCard filters={filters} onFilterChange={setFilters} onReset={handleReset} />

      {/* table */}
      <div className="mt-3">
        <ProjectTable
          dataSource={filteredData}
          onRowClick={handleProjectClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* modal crud */}
      <ProjectModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSave}
        project={editingProject}
        loading={loading}
      />

      {/* drawer detail */}
      <ProjectDetailDrawer project={selectedProject} open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default ProjectList;
