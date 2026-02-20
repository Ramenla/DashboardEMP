import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, message, Space, Spin } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';
import ProjectModal from './components/ProjectModal';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import { MOCK_PROJECTS } from '../../data/mockData';

/**
 * halaman project list - daftar semua project dengan filtering
 * data diambil dari backend API (MySQL)
 * @returns {JSX.Element} halaman project list
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [saving, setSaving] = useState(false);

  // fetch data dari backend
  // fetch data dari local mock
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAllData([...MOCK_PROJECTS]); // Use spread to create new reference
    } catch (err) {
      message.error(err.message || 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // filter data
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

  // buka modal tambah
  const handleAdd = () => {
    setEditProject(null);
    setIsModalOpen(true);
  };

  // buka modal edit
  const handleEdit = (project) => {
    setEditProject(project);
    setIsModalOpen(true);
  };

  // simpan project (tambah / edit) - MOCK VERSION
  const handleSave = async (values) => {
    setSaving(true);
    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (editProject) {
        // Update mock data
        const index = MOCK_PROJECTS.findIndex(p => p.id === editProject.id);
        if (index !== -1) {
             MOCK_PROJECTS[index] = { ...MOCK_PROJECTS[index], ...values };
        }
        message.success('Project berhasil diperbarui (Simulasi)');
      } else {
        // Add new to mock data
        const newProject = {
             ...values, 
             id: values.id || `EMP-NEW-${Date.now()}`,
             issues: [],
             timelineEvents: [],
             team: []
        };
        MOCK_PROJECTS.unshift(newProject);
        message.success('Project berhasil ditambahkan (Simulasi)');
      }

      setIsModalOpen(false);
      setEditProject(null);
      fetchProjects();
    } catch (err) {
      message.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // hapus project - MOCK VERSION
  const handleDelete = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = MOCK_PROJECTS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PROJECTS.splice(index, 1);
      }
      message.success('Project berhasil dihapus (Simulasi)');
      fetchProjects();
    } catch (err) {
      message.error(err.message);
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

      {/* modal tambah/edit */}
      <ProjectModal
        open={isModalOpen}
        onCancel={() => { setIsModalOpen(false); setEditProject(null); }}
        onSave={handleSave}
        project={editProject}
        loading={saving}
      />

      {/* drawer detail */}
      <ProjectDetailDrawer project={selectedProject} open={isDrawerOpen} onClose={closeDrawer} />
    </div>
  );
};

export default ProjectList;
