import React, { useState, useEffect } from 'react';
import { Radio, Segmented, Badge } from 'antd';
import PageTitle from '../../components/layout/PageTitle';
import GanttChart from './components/GanttChart';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import { projectsData } from '../../shared/data/mockData';

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

  return (
    <div>
      <PageTitle marginTop={-25}>Project Progress</PageTitle>

      <div className="flex justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-4 flex-wrap">

          {/* FILTER KALENDER */}
          <div className="bg-white p-4 rounded-lg">
            <div className="text-xs font-semibold mb-2">View Mode</div>
            <Segmented
              options={['Daily', 'Weekly', 'Monthly']}
              value={calendarView}
              onChange={setCalendarView}
            />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="text-xs font-semibold mb-2">Filter Prioritas</div>
            <Radio.Group value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} buttonStyle="solid">
              <Radio.Button value="Semua">All</Radio.Button>
              <Radio.Button value="Rendah">Low</Radio.Button>
              <Radio.Button value="Sedang">Medium</Radio.Button>
              <Radio.Button value="Tinggi">High</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-white py-2.5 px-5 rounded-lg">
          <Badge color="#52c41a" text="On Track" />
          <Badge color="#ff4d4f" text="Critical/Stop" />
          <Badge color="#faad14" text="Delayed" />
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