import React, { useState, useEffect } from 'react';
import { Radio, Segmented, Badge } from 'antd';
import PageTitle from '../../components/layout/PageTitle';
import GanttChart from './components/GanttChart';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import { projectsData } from '../../shared/data/mockData';

/**
 * komponen halaman project progress dengan gantt chart
 * menampilkan timeline project dengan filter priority dan view mode (Daily/Weekly/Monthly)
 * @returns {JSX.Element} halaman dengan gantt chart, filter, dan drawer detail project
 */
const ProjectProgress = () => {
  const [priorityFilter, setPriorityFilter] = useState('Semua');
  const [calendarView, setCalendarView] = useState('Monthly');
  const [groupedData, setGroupedData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * effect untuk memfilter dan mengelompokkan project berdasarkan priority dan category
   * jalankan setiap kali priority filter berubah
   */
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

  /**
   * handler ketika project bar di gantt chart diklik
   * @param {Object} project - data project yang diklik
   */
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsDrawerOpen(true);
  };

  return (
    <div>
      <PageTitle marginTop={-25}>Project Progress</PageTitle>

      <div className="flex justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap">

          {/* filter kalender */}
          <div className="bg-white p-4 rounded-lg">
            <div className="text-xs font-semibold mb-2">Mode Tampilan</div>
            <Segmented
              options={[
                { label: 'Harian', value: 'Daily' },
                { label: 'Mingguan', value: 'Weekly' },
                { label: 'Bulanan', value: 'Monthly' }
              ]}
              value={calendarView}
              onChange={setCalendarView}
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="text-xs font-semibold mb-2">Filter Prioritas</div>
            <Radio.Group value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} buttonStyle="solid">
              <Radio.Button value="Semua">Semua</Radio.Button>
              <Radio.Button value="Rendah">Rendah</Radio.Button>
              <Radio.Button value="Sedang">Sedang</Radio.Button>
              <Radio.Button value="Tinggi">Tinggi</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-white py-2.5 px-5 rounded-lg">
          <Badge color="#52c41a" text="Berjalan Lancar" />
          <Badge color="#ff4d4f" text="Kritis/Berhenti" />
          <Badge color="#faad14" text="Tertunda" />
        </div>
      </div>

      <GanttChart
        data={groupedData}
        viewMode={calendarView}
        onProjectClick={handleProjectClick}
      />

      <ProjectDetailDrawer
        project={selectedProject}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default ProjectProgress;