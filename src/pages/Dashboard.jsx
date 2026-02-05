import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import FilterCard from '../features/dashboard/components/FilterCard';

// Placeholder Component untuk Card lain (Biar tidak error)
const PlaceholderCard = ({ title, height = 200 }) => (
  <Card title={title} bordered={false} style={{ height: '100%', borderRadius: 8 }}>
    <div style={{ 
      height: height - 60, 
      background: '#f5f5f5', 
      borderRadius: 4, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#999'
    }}>
      Chart Area
    </div>
  </Card>
);

const Dashboard = () => {
  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 24 }}>
        Project Posture
      </Typography.Title>

      {/* Grid Utama */}
      <Row gutter={[16, 16]}>
        
        {/* KOLOM KIRI (Budget & Issue) - Mengambil 50% Lebar (12/24) */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
            {/* Atas: Budget */}
            <div style={{ flex: 1 }}>
              <PlaceholderCard title="Budget" height={300} />
            </div>
            {/* Bawah: Top Issues */}
            <div style={{ flex: 1 }}>
              <PlaceholderCard title="Top 5 Issue" height={300} />
            </div>
          </div>
        </Col>

        {/* KOLOM TENGAH (Donuts) - Mengambil 25% Lebar (6/24) */}
        <Col xs={24} lg={6}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
             <div style={{ flex: 1 }}>
                <PlaceholderCard title="Prioritas Project" height={300} />
             </div>
             <div style={{ flex: 1 }}>
                <PlaceholderCard title="Status Project" height={300} />
             </div>
           </div>
        </Col>

        {/* KOLOM KANAN (Filter) - Mengambil 25% Lebar (6/24) */}
        <Col xs={24} lg={6}>
          {/* Component FilterCard Asli */}
          <FilterCard />
        </Col>

      </Row>

      {/* Row Tambahan untuk Tabel Detail di Bawah */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
           <PlaceholderCard title="Project Detail List" height={200} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;