import React, { useState, useEffect } from 'react';
import { Radio, Segmented, Badge, Card, Divider, Typography } from 'antd';
import GanttChart from './components/GanttChart';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import { projectsData } from '../../shared/data/mockData';

/**
 * halaman progres proyek dengan gantt chart
 * menampilkan timeline project dengan filter prioritas dan mode tampilan
 * @returns {JSX.Element} halaman dengan gantt chart, filter, dan drawer detail
 */
const ProjectProgress = () => {
  const [priorityFilter, setPriorityFilter] = useState('Semua');
  const [calendarView, setCalendarView] = useState('Monthly');
  const [groupedData, setGroupedData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const filtered = projectsData.filter(p =>
      priorityFilter === 'Semua' ? true : p.priority === priorityFilter
    );

    const categories = ['Exploration', 'Drilling', 'Facility', 'Operation'];
    const result = categories.map(catName => ({
      title: catName,
      projects: filtered.filter(p => p.category === catName)
    })).filter(group => group.projects.length > 0);

    setGroupedData(result);
  }, [priorityFilter]);

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
              <Radio.Button value="Semua" className="text-[11px] px-2">Semua</Radio.Button>
              <Radio.Button value="Rendah" className="text-[11px] px-2">Rendah</Radio.Button>
              <Radio.Button value="Sedang" className="text-[11px] px-2">Sedang</Radio.Button>
              <Radio.Button value="Tinggi" className="text-[11px] px-2">Tinggi</Radio.Button>
            </Radio.Group>
          </div>

          <Divider type="vertical" className="h-8 mx-0 mb-1" />

          {/* 3. keterangan warna */}
          <div>
            <span className={labelClass}>Keterangan Warna</span>
            <div className="flex gap-3 items-center text-xs">
              <Badge color="#52c41a" text="Berjalan" />
              <Badge color="#ff4d4f" text="Kritis" />
              <Badge color="#faad14" text="Tertunda" />
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <GanttChart
          data={groupedData}
          viewMode={calendarView}
          onProjectClick={handleProjectClick}
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