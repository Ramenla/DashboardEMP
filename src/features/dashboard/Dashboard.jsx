import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'antd';

// import data
import { projectsData } from '../../shared/data/mockData';

// import components
import PageTitle from '../../components/layout/PageTitle';
import BudgetCard from './components/BudgetCard';
import IssueCard from './components/IssueCard';
import PriorityCard from './components/PriorityCard';
import StatusCard from './components/StatusCard';
import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';

/**
 * komponen dashboard utama yang menampilkan ringkasan project dengan filtering
 * menampilkan chart budget, top issues, distribusi priority & status, filter, dan tabel project
 * @returns {JSX.Element} dashboard dengan berbagai widget statistic dan tabel project yang dapat difilter
 */
const Dashboard = () => {
  // state untuk semua filter yang tersedia
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    priority: '',
    status: '',
    maxBudget: 100,
  });

  // state untuk menyimpan data yang sudah difilter
  const [filteredData, setFilteredData] = useState(projectsData);

  // state untuk drawer detail project
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * handler ketika user klik pada row project di tabel
   * membuka drawer dan set project yang dipilih
   * @param {Object} project - data project yang diklik
   */
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  /**
   * handler untuk menutup drawer detail project
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProject(null);
  };

  /**
   * menghitung statistik priority dari data yang sudah difilter
   * untuk ditampilkan di PriorityCard dalam bentuk donut chart
   * @returns {Array} array dengan count untuk setiap level priority (Rendah, Sedang, Tinggi)
   */
  const priorityStats = useMemo(() => {
    const stats = [{ name: 'Rendah', value: 0 }, { name: 'Sedang', value: 0 }, { name: 'Tinggi', value: 0 }];
    filteredData.forEach(p => {
      if (p.priority === 'Rendah') stats[0].value++;
      else if (p.priority === 'Sedang') stats[1].value++;
      else if (p.priority === 'Tinggi') stats[2].value++;
    });
    return stats;
  }, [filteredData]);

  /**
   * menghitung statistik status dari data yang sudah difilter
   * untuk ditampilkan di StatusCard dalam bentuk donut chart
   * @returns {Array} array dengan count untuk setiap status (Kritis, Tertunda, Berjalan)
   */
  const statusStats = useMemo(() => {
    const stats = [{ name: 'Kritis', value: 0 }, { name: 'Tertunda', value: 0 }, { name: 'Berjalan', value: 0 }];
    filteredData.forEach(p => {
      if (p.status === 'Kritis') stats[0].value++;
      else if (p.status === 'Tertunda') stats[1].value++;
      else if (p.status === 'Berjalan') stats[2].value++;
    });
    return stats;
  }, [filteredData]);

  /**
   * effect untuk melakukan filtering data project berdasarkan semua filter yang aktif
   * berjalan setiap kali ada perubahan pada state filters
   */
  useEffect(() => {
    const result = projectsData.filter((item) => {
      const matchSearch = item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      const matchPriority = filters.priority === '' || item.priority === filters.priority;
      const matchStatus = filters.status === '' || item.status === filters.status;
      const matchBudget = item.budgetUsed <= filters.maxBudget;

      return matchSearch && matchCategory && matchPriority && matchStatus && matchBudget;
    });
    setFilteredData(result);
  }, [filters]);

  /**
   * handler untuk reset semua filter ke nilai default
   */
  const handleReset = () => {
    setFilters({ search: '', categories: [], priority: '', status: '', maxBudget: 100 });
  };

  return (
    <div className="pb-6">
      <PageTitle marginTop={-25}>Project Posture</PageTitle>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1"><BudgetCard /></div>
            <div className="flex-1"><IssueCard /></div>
          </div>
        </Col>

        <Col xs={24} lg={6}>
          <div className="flex flex-col gap-6 h-full">
            <div className="flex-1"><PriorityCard data={priorityStats} /></div>
            <div className="flex-1"><StatusCard data={statusStats} /></div>
          </div>
        </Col>

        <Col xs={24} lg={6}>
          <div className="h-full">
            <FilterCard filters={filters} onFilterChange={setFilters} onReset={handleReset} />
          </div>
        </Col>
      </Row>

      <Row className="mt-6">
        <Col span={24}>
          {/* pass handler ke tabel */}
          <ProjectTable dataSource={filteredData} onRowClick={handleProjectClick} />
        </Col>
      </Row>

      {/* drawer component */}
      <ProjectDetailDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default Dashboard;