import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// import data
import { projectsData } from '../../shared/data/mockData';

// import components
import PageTitle from '../../components/layout/PageTitle';
import FilterCard from './components/FilterCard';
import ProjectTable from './components/ProjectTable';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';

/**
 * komponen dashboard utama yang menampilkan ringkasan project dengan filtering
 * menampilkan chart budget, top issues, distribusi priority & status, filter, dan tabel project
 * @returns {JSX.Element} dashboard dengan berbagai widget statistic dan tabel project yang dapat difilter
 */
const ProjectList = () => {
  // state untuk semua filter yang tersedia
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    location: '',
    priority: '',
    status: '',
    maxBudget: 100,
    manager: '',
    sponsor: '',
    performance: '',
    issuesOnly: false,
    budgetValue: '',
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
   * effect untuk melakukan filtering data project berdasarkan semua filter yang aktif
   * berjalan setiap kali ada perubahan pada state filters
   */
  useEffect(() => {
    const result = projectsData.filter((item) => {
      // 1. Search (ID, Name, or Manager)
      const matchSearch = item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.manager.toLowerCase().includes(filters.search.toLowerCase());

      // 2. Multi-Categories
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);

      // 3. Simple Selects
      const matchLocation = filters.location === '' || item.location === filters.location;
      const matchPriority = filters.priority === '' || item.priority === filters.priority;
      const matchStatus = filters.status === '' || item.status === filters.status;
      const matchManager = filters.manager === '' || item.manager === filters.manager;
      const matchSponsor = filters.sponsor === '' || item.sponsor === filters.sponsor;

      // 4. Budget (%)
      const matchBudget = item.budgetUsed <= filters.maxBudget;

      // 5. Performance (Deviation)
      let matchPerformance = true;
      const deviation = item.progress - item.target;
      if (filters.performance === 'Behind Target') {
        matchPerformance = deviation < 0;
      } else if (filters.performance === 'On Track') {
        matchPerformance = deviation >= 0;
      }

      // 6. Issues Only
      const matchIssues = !filters.issuesOnly || (item.issues && item.issues.length > 0);

      // 7. Budget Value Range
      let matchBudgetValue = true;
      if (filters.budgetValue === 'Small') {
        matchBudgetValue = item.budgetTotal < 1000000000;
      } else if (filters.budgetValue === 'Medium') {
        matchBudgetValue = item.budgetTotal >= 1000000000 && item.budgetTotal <= 5000000000;
      } else if (filters.budgetValue === 'Large') {
        matchBudgetValue = item.budgetTotal > 5000000000;
      }

      return matchSearch && matchCategory && matchLocation && matchPriority &&
        matchStatus && matchManager && matchSponsor && matchBudget &&
        matchPerformance && matchIssues && matchBudgetValue;
    });
    setFilteredData(result);
  }, [filters]);

  /**
   * handler untuk reset semua filter ke nilai default
   */
  const handleReset = () => {
    setFilters({
      search: '',
      categories: [],
      location: '',
      priority: '',
      status: '',
      maxBudget: 100,
      manager: '',
      sponsor: '',
      performance: '',
      issuesOnly: false,
      budgetValue: '',
    });
  };

  return (
    <div className="pb-6 ">
      <PageTitle marginTop={-30}>Project List</PageTitle>

      {/* search bar card */}
      <Card className="rounded-lg mb-4">
        <Input
          placeholder="Cari berdasarkan kode atau nama project..."
          prefix={<SearchOutlined className="text-gray-400" />}
          size="large"
          allowClear
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="rounded-lg"
        />
      </Card>

      {/* filter bar */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <FilterCard filters={filters} onFilterChange={setFilters} onReset={handleReset} />
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

export default ProjectList;