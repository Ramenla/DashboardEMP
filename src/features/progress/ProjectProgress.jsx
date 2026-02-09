import React, { useState, useEffect } from 'react';
import { Radio, Segmented, Badge } from 'antd';
import PageTitle from '../../components/layout/PageTitle';
import GanttChart from './components/GanttChart';
import ProjectDetailDrawer from '../../components/ui/ProjectDetailDrawer';
import { projectsData } from '../../shared/data/mockData';

const ProjectProgress = () => {
  const [priorityFilter, setPriorityFilter] = useState('Semua');

  // GANTI NAMA: default 'Monthly' (Inggris/Standar)
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
      <PageTitle>Project Progress</PageTitle>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>

          {/* FILTER KALENDER: Nama Baru */}
          <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>View Mode</div>
            <Segmented
              options={['Daily', 'Weekly', 'Monthly']} // Nama diganti sesuai request
              value={calendarView}
              onChange={setCalendarView}
            />
          </div>

          <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Filter Prioritas</div>
            <Radio.Group value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} buttonStyle="solid">
              <Radio.Button value="Semua">All</Radio.Button>
              <Radio.Button value="Rendah">Low</Radio.Button>
              <Radio.Button value="Sedang">Medium</Radio.Button>
              <Radio.Button value="Tinggi">High</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#fff', padding: '10px 20px', borderRadius: 8 }}>
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