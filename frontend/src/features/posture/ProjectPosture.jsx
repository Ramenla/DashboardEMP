import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Select, Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// import data
import { projectsData } from '../../shared/data/mockData';

// import components
import PageTitle from '../../components/layout/PageTitle';
import BudgetCard from './components/BudgetCard';
import StatusCard from './components/StatusCard';
import IssueCard from './components/IssueCard';
import PriorityCard from './components/PriorityCard';

const { Option } = Select;

/**
 * komponen dashboard utama yang menampilkan ringkasan project dengan filtering horizontal
 * hanya menampilkan widget statistic (tanpa tabel detail)
 * @returns {JSX.Element} dashboard dengan filter bar dan widget statistic
 */
const ProjectPosture = () => {
  // state untuk filter
  const [filters, setFilters] = useState({
    year: 2026,
    month: null, // null means all months
    categories: [],
    status: null,
  });

  // state untuk data statistic
  const [filteredData, setFilteredData] = useState(projectsData);

  // constants for filters
  const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];
  const statuses = ['Berjalan', 'Kritis', 'Tertunda'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // filtering logic
  useEffect(() => {
    const result = projectsData.filter((item) => {
      // 1. Filter Year (parse from startDate '01 Jan 2026')
      const itemYear = item.startDate ? parseInt(item.startDate.split(' ')[2]) : 2026;
      const matchYear = itemYear === filters.year;

      // 2. Filter Month (Active in selected month)
      // item.startMonth is 0-based index. item.duration is months count.
      // Active if: startMonth <= selectedMonth < startMonth + duration
      let matchMonth = true;
      if (filters.month !== null) {
        const start = item.startMonth;
        const end = start + item.duration;
        matchMonth = filters.month >= start && filters.month < end;
      }

      // 3. Filter Category
      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);

      // 4. Filter Status
      const matchStatus = filters.status === null || item.status === filters.status;

      return matchYear && matchMonth && matchCategory && matchStatus;
    });
    setFilteredData(result);
  }, [filters]);

  const handleReset = () => {
    setFilters({ year: 2026, month: null, categories: [], status: null });
  };

  return (
    <div className="pb-6 ">
      <PageTitle marginTop={-30}>Project Posture</PageTitle>

      {/* HORIZONTAL FILTER BAR */}
      <Card className="rounded-lg mb-0 shadow-none border-b border-gray-100" bodyStyle={{ padding: '16px 24px' }}>
        <Space wrap size="large" className="w-full justify-between items-end">
            <Space wrap size="middle" align="end">
                {/* 1. Year Filter */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Tahun</span>
                    <Select
                        value={filters.year}
                        onChange={(val) => setFilters({ ...filters, year: val })}
                        style={{ width: 100 }}
                        size="large"
                        className="font-semibold"
                    >
                        <Option value={2025}>2025</Option>
                        <Option value={2026}>2026</Option>
                        <Option value={2027}>2027</Option>
                    </Select>
                </div>

                {/* 2. Month Filter */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Bulan</span>
                    <Select
                        value={filters.month}
                        onChange={(val) => setFilters({ ...filters, month: val })}
                        style={{ width: 140 }}
                        placeholder="Semua Bulan"
                        allowClear
                        size="large"
                    >
                        {months.map((m, i) => (
                            <Option key={i} value={i}>{m}</Option>
                        ))}
                    </Select>
                </div>

                {/* 3. Division/Category Filter */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Divisi / Kategori</span>
                    <Select
                        mode="multiple"
                        value={filters.categories}
                        onChange={(val) => setFilters({ ...filters, categories: val })}
                        style={{ minWidth: 220, maxWidth: 350 }}
                        placeholder="Semua Kategori"
                        allowClear
                        maxTagCount="responsive"
                        size="large"
                    >
                        {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                </div>

                {/* 4. Status Filter */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Status Project</span>
                    <Select
                        value={filters.status}
                        onChange={(val) => setFilters({ ...filters, status: val })}
                        style={{ width: 150 }}
                        placeholder="Semua Status"
                        allowClear
                        size="large"
                    >
                        {statuses.map(s => <Option key={s} value={s}>{s}</Option>)}
                    </Select>
                </div>
            </Space>

            {/* Reset Button */}
            <div className="pb-0.5">
                <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleReset}
                    size="middle"
                    type="text"
                    className="text-gray-500 hover:text-blue-600"
                >
                    Reset Filter
                </Button>
            </div>
        </Space>
      </Card>

      {/* Explicit Spacer */}
      <div className="h-8 w-full"></div>

      {/* charts row 1: Metrics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
            <BudgetCard data={filteredData} />
        </Col>
        <Col xs={24} md={12} lg={8}>
            <StatusCard data={filteredData} />
        </Col>
        <Col xs={24} md={12} lg={8}>
            <PriorityCard data={filteredData} />
        </Col>
      </Row>

      {/* charts row 2: Issues */}
      <Row gutter={[24, 24]} className="mt-6">
        <Col span={24}>
            <IssueCard data={filteredData} />
        </Col>
      </Row>
    </div>
  );
};

export default ProjectPosture;
