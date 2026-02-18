import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Button, Empty, Popover, Badge, Tag } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';

// data
import { projectsData } from '../../shared/data/mockData';


import KpiRow from './components/KpiRow';
import StatusDonut from './components/StatusDonut';
import PriorityDonut from './components/PriorityDonut';
import StatusCategoryBar from './components/StatusCategoryBar';
import BudgetMonitoring from './components/BudgetMonitoring';
import TopIssuesTable from './components/TopIssuesTable';

const { Option } = Select;

/**
 * halaman project posture - visual overview kesehatan project
 * menampilkan kpi, chart analitik, dan top issues
 * list project detail ada di halaman terpisah
 * @returns {JSX.Element} dashboard posture
 */
const ProjectPosture = () => {
  const [filters, setFilters] = useState({
    year: 2026,
    month: null,
    categories: [],
    status: null,
  });

  const [filteredData, setFilteredData] = useState(projectsData);
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = ['Exploration', 'Drilling', 'Operation', 'Facility'];
  const statuses = ['Berjalan', 'Kritis', 'Tertunda'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    const result = projectsData.filter((item) => {
      const itemYear = item.startDate ? parseInt(item.startDate.split(' ')[2]) : 2026;
      const matchYear = itemYear === filters.year;

      let matchMonth = true;
      if (filters.month !== null) {
        const start = item.startMonth;
        const end = start + item.duration;
        matchMonth = filters.month >= start && filters.month < end;
      }

      const matchCategory = filters.categories.length === 0 || filters.categories.includes(item.category);
      const matchStatus = filters.status === null || item.status === filters.status;

      return matchYear && matchMonth && matchCategory && matchStatus;
    });
    setFilteredData(result);
  }, [filters]);

  const handleReset = () => {
    setFilters({ year: 2026, month: null, categories: [], status: null });
  };

  const activeFilterCount =
    (filters.year !== 2026 ? 1 : 0) +
    (filters.month !== null ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.status !== null ? 1 : 0);

  const filterContent = (
    <div style={{ width: 260 }}>
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tahun</span>
          <Select value={filters.year} onChange={(val) => setFilters({ ...filters, year: val })} style={{ width: '100%' }} size="small">
            <Option value={2025}>2025</Option>
            <Option value={2026}>2026</Option>
            <Option value={2027}>2027</Option>
          </Select>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Bulan</span>
          <Select value={filters.month} onChange={(val) => setFilters({ ...filters, month: val ?? null })} style={{ width: '100%' }} placeholder="Semua Bulan" allowClear size="small">
            {months.map((m, i) => <Option key={i} value={i}>{m}</Option>)}
          </Select>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Kategori</span>
          <Select mode="multiple" value={filters.categories} onChange={(val) => setFilters({ ...filters, categories: val })} style={{ width: '100%' }} placeholder="Semua" allowClear maxTagCount={2} size="small">
            {categories.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Status</span>
          <Select value={filters.status} onChange={(val) => setFilters({ ...filters, status: val ?? null })} style={{ width: '100%' }} placeholder="Semua" allowClear size="small">
            {statuses.map(s => <Option key={s} value={s}>{s}</Option>)}
          </Select>
        </div>
        <Button icon={<ReloadOutlined />} onClick={handleReset} size="small" block className="mt-1">Reset Filter</Button>
      </div>
    </div>
  );

  return (
    <div className="pb-4 -mt-10">
      {/* header — plain title + filter */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#001529] m-0">Postur Proyek</h2>

        <div className="flex items-center gap-2">
          {filters.month !== null && (
            <Tag closable onClose={() => setFilters({ ...filters, month: null })} className="text-xs m-0">{months[filters.month]}</Tag>
          )}
          {filters.categories.map(c => (
            <Tag key={c} closable onClose={() => setFilters({ ...filters, categories: filters.categories.filter(x => x !== c) })} className="text-xs m-0">{c}</Tag>
          ))}
          {filters.status && (
            <Tag closable onClose={() => setFilters({ ...filters, status: null })} className="text-xs m-0">{filters.status}</Tag>
          )}
          <Popover content={filterContent} title={<span className="text-sm font-semibold">Filter Project</span>} trigger="click" open={filterOpen} onOpenChange={setFilterOpen} placement="bottomRight">
            <Badge count={activeFilterCount} size="small" offset={[-4, 4]}>
              <Button icon={<FilterOutlined />} type={activeFilterCount > 0 ? 'primary' : 'default'} ghost={activeFilterCount > 0}>Filter</Button>
            </Badge>
          </Popover>
        </div>
      </div>

      {/* content */}
      {filteredData.length === 0 ? (
        <div className="mt-10 mb-10">
          <Empty description="Tidak ada project yang cocok dengan filter" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      ) : (
        <>
          {/* row 1: kpi */}
          <KpiRow data={filteredData} />

          {/* row 2: donuts + stacked bar */}
          <Row gutter={[12, 12]} className="mt-3">
            <Col xs={24} lg={6}>
              <StatusDonut data={filteredData} />
            </Col>
            <Col xs={24} lg={6}>
              <PriorityDonut data={filteredData} />
            </Col>
            <Col xs={24} lg={12}>
              <StatusCategoryBar data={filteredData} />
            </Col>
          </Row>

          {/* row 3: budget + issues */}
          <Row gutter={[12, 12]} className="mt-3">
            <Col xs={24} lg={12}>
              <BudgetMonitoring data={filteredData} />
            </Col>
            <Col xs={24} lg={12}>
              <TopIssuesTable data={filteredData} />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProjectPosture;
