/**
 * @file ProjectProgress.jsx
 * @description Halaman utama untuk navigasi "Project Progress".
 * Menampilkan baris aksi berisi Mode Tampilan, Prioritas Filter, Urutan Sorting.
 * Menggabungkan dan merender child component GanttChart dengan data proyek terfilter.
 */

import React, { useState, useEffect } from 'react';
import { Radio, Segmented, Badge, Card, Divider, Typography, Spin, message, Select } from 'antd';
import GanttChart from './components/GanttChart';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import projectService from '../../shared/services/projectService';
import { normalizeProjectData, parseProjectDate } from '../../utils/dateUtils';


/**
 * @returns {JSX.Element} Halaman penuh project progress dengan manipulasi view dan GanttChart.
 */
const ProjectProgress = () => {
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [calendarView, setCalendarView] = useState('Monthly');
  const [groupedData, setGroupedData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('START_DATE_ASC');


  useEffect(() => {
    fetchProjects();
  }, []);

  /**
   * Mengambil data backend (spesifik 2026 sebagai default year),
   * untuk diteruskan ke GanttChart sebagai data source utaman.
   */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const result = await projectService.getAll({ year: 2026 });

      const projectsArray = Array.isArray(result) ? result : (result.projects || []);
      const normalized = projectsArray.map(normalizeProjectData);
      setProjects(normalized);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = projects.filter(p =>
      priorityFilter === 'ALL' ? true : p.priority === priorityFilter
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'START_DATE_ASC':
          return parseProjectDate(a.startDate) - parseProjectDate(b.startDate);
        case 'START_DATE_DESC':
          return parseProjectDate(b.startDate) - parseProjectDate(a.startDate);
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        case 'PROGRESS_DESC':
          return b.progress - a.progress;
        case 'PROGRESS_ASC':
          return a.progress - b.progress;
        default:
          return 0;
      }
    });

    const categories = ['EXPLORATION', 'DRILLING', 'FACILITY', 'OPERATION'];
    const result = categories.map(catName => ({
      title: catName,
      projects: filtered.filter(p => p.category === catName)
    })).filter(group => group.projects.length > 0);

    setGroupedData(result);
  }, [priorityFilter, projects, sortBy]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  const labelClass = 'text-[11px] text-gray-400 mb-1 block font-semibold';

  return (
    <div className="pb-4 -mt-10">
      <h2 className="text-lg font-bold text-[#001529] m-0 mb-3">Progres Proyek</h2>

      <Card bordered={false} className="rounded-lg mb-4" bodyStyle={{ padding: '10px 16px' }}>
        <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 items-end">

          <div>
            <span className={labelClass}>Mode Tampilan</span>
            <Segmented
              size="small"
              options={[
                { label: 'Harian', value: 'Daily' },
                { label: 'Mingguan', value: 'Weekly' },
                { label: 'Bulanan', value: 'Monthly' }
              ]}
              value={calendarView}
              onChange={setCalendarView}
            />
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          <div>
            <span className={labelClass}>Prioritas</span>
            <Radio.Group value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} buttonStyle="solid" size="small">
              <Radio.Button value="ALL" className="text-[11px] px-2">Semua</Radio.Button>
              <Radio.Button value="Rendah" className="text-[11px] px-2">Rendah</Radio.Button>
              <Radio.Button value="Sedang" className="text-[11px] px-2">Sedang</Radio.Button>
              <Radio.Button value="Tinggi" className="text-[11px] px-2">Tinggi</Radio.Button>
            </Radio.Group>
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          <div>
            <span className={labelClass}>Urutkan</span>
            <Select
              size="small"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 140 }}
              options={[
                { label: 'Mulai Terawal', value: 'START_DATE_ASC' },
                { label: 'Mulai Terakhir', value: 'START_DATE_DESC' },
                { label: 'Nama (A-Z)', value: 'NAME_ASC' },
                { label: 'Progress Tertinggi', value: 'PROGRESS_DESC' },
                { label: 'Progress Terendah', value: 'PROGRESS_ASC' },
              ]}
            />
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          <div>
            <span className={labelClass}>Keterangan Warna</span>
            <div className="flex gap-3 items-center text-xs">
              <Badge color="#52c41a" text="Berjalan" />
              <Badge color="#ff4d4f" text="Kritis" />
              <Badge color="#faad14" text="Tertunda" />
              <Badge color="#1890ff" text="Selesai" />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <GanttChart
          data={groupedData}
          viewMode={calendarView}
          onProjectClick={handleProjectClick}
          loading={loading}
        />
      </div>

      <ProjectDetailDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default ProjectProgress;