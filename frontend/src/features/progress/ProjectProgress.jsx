import React, { useState, useEffect } from 'react';
import { Radio, Segmented, Badge, Card, Divider, Typography, Spin, message, Select } from 'antd';
import GanttChart from './components/GanttChart';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import { normalizeProjectData, parseProjectDate } from '../../utils/dateUtils';
import { MOCK_PROJECTS } from '../../data/mockData';

/**
 * halaman progres proyek dengan gantt chart
 * menampilkan timeline project dengan filter prioritas dan mode tampilan
 * @returns {JSX.Element} halaman dengan gantt chart, filter, dan drawer detail
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

  // Fetch data
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const normalized = MOCK_PROJECTS.map(normalizeProjectData);
      setProjects(normalized);
    } catch (error) {
      console.error(error);
      message.error('Gagal mengambil data proyek');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = projects.filter(p =>
      priorityFilter === 'ALL' ? true : p.priority === priorityFilter
    );

    // Apply sorting
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
      {/* title */}
      <h2 className="text-lg font-bold text-[#001529] m-0 mb-3">Progres Proyek</h2>

      {/* filter card */}
      <Card bordered={false} className="rounded-lg mb-4" bodyStyle={{ padding: '10px 16px' }}>
        <div className="flex flex-row flex-wrap gap-x-5 gap-y-2 items-end">

          {/* 1. mode tampilan */}
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

          {/* 2. filter prioritas */}
          <div>
            <span className={labelClass}>Prioritas</span>
            <Radio.Group value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} buttonStyle="solid" size="small">
              <Radio.Button value="ALL" className="text-[11px] px-2">Semua</Radio.Button>
              <Radio.Button value="LOW" className="text-[11px] px-2">Low</Radio.Button>
              <Radio.Button value="MEDIUM" className="text-[11px] px-2">Medium</Radio.Button>
              <Radio.Button value="HIGH" className="text-[11px] px-2">High</Radio.Button>
            </Radio.Group>
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          {/* 3. Sort Order */}
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

          {/* 4. keterangan warna */}
          <div>
            <span className={labelClass}>Keterangan Warna</span>
            <div className="flex gap-3 items-center text-xs">
              <Badge color="#52c41a" text="On Track" />
              <Badge color="#ff4d4f" text="At Risk" />
              <Badge color="#faad14" text="Delayed" />
              <Badge color="#1890ff" text="Completed" />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-10"><Spin size="large" /></div>
        ) : (
          <GanttChart
            data={groupedData}
            viewMode={calendarView}
            onProjectClick={handleProjectClick}
          />
        )}
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