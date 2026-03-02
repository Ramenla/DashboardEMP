/**
 * @file ProjectPosture.jsx
 * @description Halaman dashboard "Postur Proyek" yang menampilkan ringkasan status
 * seluruh proyek. Terdiri dari:
 * - Baris KPI (total proyek, SPI, CPI, jumlah beresiko)
 * - Donut chart status dan prioritas
 * - Bar chart breakdown per kategori
 * - Monitoring anggaran dan tabel isu teratas
 *
 * Data di-fetch dari backend API dengan filter server-side
 * (tahun, bulan, kategori, status, lokasi).
 */

import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Button, Empty, Popover, Badge, Tag, Skeleton, message } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';

import KpiRow from './components/KpiRow';
import StatusDonut from './components/StatusDonut';
import PriorityDonut from './components/PriorityDonut';
import StatusCategoryBar from './components/StatusCategoryBar';
import BudgetMonitoring from './components/BudgetMonitoring';
import TopIssuesTable from './components/TopIssuesTable';

import projectService from '../../shared/services/projectService';
import { parseProjectDate, normalizeProjectData } from '../../utils/dateUtils';

const { Option } = Select;

/**
 * Error boundary untuk menangkap error rendering pada komponen child.
 * Menampilkan pesan error dan stack trace saat terjadi crash.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600 bg-red-50 border border-red-200 rounded m-5">
          <h2 className="font-bold text-lg mb-2">Something went wrong.</h2>
          <details className="whitespace-pre-wrap text-sm font-mono text-gray-800">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * @returns {JSX.Element} Dashboard postur proyek dengan KPI, chart, dan filter.
 */
const ProjectPosture = () => {
  const [filters, setFilters] = useState({
    year: null,
    month: null,
    location: null,
    categories: [],
    status: null,
  });

  const [projectsData, setProjectsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [stats, setStats] = useState(null);
  const [topIssues, setTopIssues] = useState([]);
  const [metadata, setMetadata] = useState({ categories: [], statuses: [], locations: [] });

  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch metadata on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const data = await projectService.getMetadata();
        setMetadata(data);
      } catch (error) {
        // Error already handled by apiClient interceptor
        console.error('Error fetching metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch data projects dari backend
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const result = await projectService.getAll({
          year: filters.year,
          month: filters.month,
          status: filters.status,
          location: filters.location,
          category: filters.categories
        });

        const projects = Array.isArray(result) ? result : (result.projects || []);
        const serverStats = Array.isArray(result) ? null : result.stats;
        const serverTopIssues = Array.isArray(result) ? [] : (result.topIssues || []);

        const normalized = projects.map(normalizeProjectData);
        setProjectsData(normalized);
        setFilteredData(normalized);
        setStats(serverStats);
        setTopIssues(serverTopIssues);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [filters.year, filters.month, filters.categories, filters.status, filters.location]);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handleReset = () => {
    setFilters({ year: null, month: null, categories: [], status: null, location: null });
    setFilterOpen(false);
  };

  const activeFilterCount =
    (filters.year !== null ? 1 : 0) +
    (filters.month !== null ? 1 : 0) +
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.status !== null ? 1 : 0) +
    (filters.location !== null ? 1 : 0);

  const filterContent = (
    <div style={{ width: 260 }}>
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Tahun</span>
          <Select value={filters.year} onChange={(val) => setFilters({ ...filters, year: val ?? null })} style={{ width: '100%' }} placeholder="Semua Tahun" allowClear size="small">
            <Option value={2024}>2024</Option>
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
            {metadata.categories.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Status</span>
          <Select value={filters.status} onChange={(val) => setFilters({ ...filters, status: val ?? null })} style={{ width: '100%' }} placeholder="Semua" allowClear size="small">
            {metadata.statuses.map(s => <Option key={s} value={s}>{s.replace('_', ' ')}</Option>)}
          </Select>
        </div>
        <div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Lokasi</span>
          <Select
            showSearch
            value={filters.location}
            onChange={(val) => setFilters({ ...filters, location: val ?? null })}
            style={{ width: '100%' }}
            placeholder="Semua Lokasi"
            allowClear
            size="small"
            filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
          >
            {metadata.locations.map(loc => <Option key={loc} value={loc}>{loc}</Option>)}
          </Select>
        </div>
        <Button icon={<ReloadOutlined />} onClick={handleReset} size="small" block className="mt-1">Reset Filter</Button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="pb-4 -mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-[#001529] m-0">Postur Proyek</h2>

          <div className="flex items-center gap-2">
            {filters.year !== null && (
              <Tag closable onClose={() => setFilters({ ...filters, year: null })} className="text-xs m-0">{filters.year}</Tag>
            )}
            {filters.month !== null && (
              <Tag closable onClose={() => setFilters({ ...filters, month: null })} className="text-xs m-0">{months[filters.month]}</Tag>
            )}
            {filters.categories.map(c => (
              <Tag key={c} closable onClose={() => setFilters({ ...filters, categories: filters.categories.filter(x => x !== c) })} className="text-xs m-0">{c}</Tag>
            ))}
            {filters.status && (
              <Tag closable onClose={() => setFilters({ ...filters, status: null })} className="text-xs m-0">{filters.status}</Tag>
            )}
            {filters.location && (
              <Tag closable onClose={() => setFilters({ ...filters, location: null })} className="text-xs m-0">{filters.location}</Tag>
            )}
            <Popover content={filterContent} title={<span className="text-sm font-semibold">Filter Project</span>} trigger="click" open={filterOpen} onOpenChange={setFilterOpen} placement="bottomRight">
              <Badge count={activeFilterCount} size="small" offset={[-4, 4]}>
                <Button icon={<FilterOutlined />} type={activeFilterCount > 0 ? 'primary' : 'default'} ghost={activeFilterCount > 0}>Filter</Button>
              </Badge>
            </Popover>
          </div>
        </div>

        <Skeleton active loading={loading} paragraph={{ rows: 14 }}>
          {filteredData.length === 0 ? (
            <div className="mt-10 mb-10">
              <Empty description="Tidak ada project yang cocok dengan filter" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <>
              <KpiRow data={filteredData} stats={stats} />

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

              <Row gutter={[12, 12]} className="mt-3">
                <Col xs={24} lg={12}>
                  <BudgetMonitoring data={filteredData} yearFilter={filters.year} />
                </Col>
                <Col xs={24} lg={12}>
                  <TopIssuesTable data={filteredData} topIssues={topIssues} />
                </Col>
              </Row>
            </>
          )}
        </Skeleton>
      </div>
    </ErrorBoundary>
  );
};

export default ProjectPosture;
