import React from 'react';
import { Typography, Radio, Segmented, Space, Badge } from 'antd';
import GanttChart from '../features/progress/components/GanttChart';

const { Title } = Typography;

const ProjectProgress = () => {
  return (
    <div>
      {/* JUDUL HALAMAN */}
      <Title level={3} style={{ marginBottom: 24, color: '#001529' }}>Project Progress</Title>

      {/* FILTER BAR & LEGEND */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        gap: 16,
        marginBottom: 24 
      }}>
        
        {/* BAGIAN KIRI: Filter Cards */}
        <div style={{ display: 'flex', gap: 16 }}>
          
          {/* Filter Kalender */}
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
             <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>Filter Kalender</div>
             <Segmented options={['Hari', 'Minggu', 'Bulan']} defaultValue="Bulan" />
          </div>

          {/* Filter Prioritas */}
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
             <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#666' }}>Filter Prioritas</div>
             <Radio.Group defaultValue="Tinggi" buttonStyle="solid">
                <Radio.Button value="Rendah">Rendah</Radio.Button>
                <Radio.Button value="Sedang">Sedang</Radio.Button>
                <Radio.Button value="Tinggi">Tinggi</Radio.Button>
             </Radio.Group>
          </div>

        </div>

        {/* BAGIAN KANAN: Legend */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#fff', padding: '10px 20px', borderRadius: 8 }}>
            <Badge color="#52c41a" text="Sedang berjalan" />
            <Badge color="#ff4d4f" text="Terhenti" />
            <Badge color="#fadb14" text="Tertunda" />
        </div>

      </div>

      {/* CHART AREA */}
      <GanttChart />
      
    </div>
  );
};

export default ProjectProgress;