import React, { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';

import BudgetCard from '../features/dashboard/components/BudgetCard';
import IssueCard from '../features/dashboard/components/IssueCard';
import PriorityCard from '../features/dashboard/components/PriorityCard';
import StatusCard from '../features/dashboard/components/StatusCard';
import FilterCard from '../features/dashboard/components/FilterCard';
import ProjectTable from '../features/dashboard/components/ProjectTable';

const { Title } = Typography;

// 1. DATA MASTER (Pindah ke sini)
const initialData = [
  { key: '1', code: 'ABP-100', status: 'Kritis', priority: 'Kritis', category: 'Exploration', progress: 45, target: 79, issue: 'Aplikasinya seperti ada yang kurang', budgetUsed: 70 },
  { key: '2', code: 'ABP-101', status: 'Kritis', priority: 'Sedang', category: 'Drilling', progress: 25, target: 79, issue: 'Aplikasinya terlalu kaku', budgetUsed: 50 },
  { key: '3', code: 'ABP-102', status: 'Berjalan', priority: 'Tinggi', category: 'Operation', progress: 81, target: 79, issue: 'Aplikasinya terlalu kompleks untuk pemula', budgetUsed: 30 },
  { key: '4', code: 'ABP-103', status: 'Berjalan', priority: 'Tinggi', category: 'Facility', progress: 37, target: 79, issue: 'Aplikasinya terlalu cerah sehingga mata sakit', budgetUsed: 75 },
  { key: '5', code: 'ABP-104', status: 'Tertunda', priority: 'Sedang', category: 'Exploration', progress: 90, target: 79, issue: 'Aplikasinya terlihat agak membingungkan', budgetUsed: 55 },
  { key: '6', code: 'DRL-005', status: 'Berjalan', priority: 'Rendah', category: 'Drilling', progress: 60, target: 60, issue: '-', budgetUsed: 40 },
  { key: '7', code: 'OPS-202', status: 'Tertunda', priority: 'Tinggi', category: 'Operation', progress: 10, target: 50, issue: 'Menunggu Sparepart', budgetUsed: 20 },
];

const Dashboard = () => {
  // 2. STATE UNTUK MENYIMPAN FILTER & DATA
  const [filters, setFilters] = useState({
    search: '',
    categories: [], // Kosong = Pilih Semua
    priority: '',   // Kosong = Semua
    status: '',     // Kosong = Semua
    maxBudget: 100, // Default 100%
  });

  const [filteredData, setFilteredData] = useState(initialData);

  // 3. LOGIC FILTERING (Jalan setiap kali 'filters' berubah)
  useEffect(() => {
    const result = initialData.filter((item) => {
      // Filter Search (Case Insensitive)
      const matchSearch = item.code.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filter Category
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      
      // Filter Priority
      const matchPriority = filters.priority === '' || item.priority === filters.priority;
      
      // Filter Status
      const matchStatus = filters.status === '' || item.status === filters.status;

      // Filter Budget (Slider)
      const matchBudget = item.budgetUsed <= filters.maxBudget;

      return matchSearch && matchCategory && matchPriority && matchStatus && matchBudget;
    });

    setFilteredData(result);
  }, [filters]);

  // Fungsi Reset
  const handleReset = () => {
    setFilters({
      search: '',
      categories: [],
      priority: '',
      status: '',
      maxBudget: 100,
    });
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <Title level={3} style={{ marginBottom: 24, color: '#001529' }}>Project Posture</Title>

      <Row gutter={[24, 24]}>
        
        {/* KOLOM KIRI */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
            <div style={{ flex: 1 }}><BudgetCard /></div>
            <div style={{ flex: 1 }}><IssueCard /></div>
          </div>
        </Col>

        {/* KOLOM TENGAH */}
        <Col xs={24} lg={6}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
             <div style={{ flex: 1 }}><PriorityCard /></div>
             <div style={{ flex: 1 }}><StatusCard /></div>
           </div>
        </Col>

        {/* KOLOM KANAN (FILTER) */}
        <Col xs={24} lg={6}>
          <div style={{ height: '100%' }}>
            {/* Kirim State dan Fungsi Pengubah ke FilterCard */}
            <FilterCard 
              filters={filters} 
              onFilterChange={setFilters} 
              onReset={handleReset}
            />
          </div>
        </Col>

      </Row>

      {/* GRID BAWAH (TABEL) */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
           {/* Kirim Data yang sudah difilter ke ProjectTable */}
           <ProjectTable dataSource={filteredData} />
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;