import React from 'react';
import { Drawer, Tag, Typography, Progress, Divider, Steps, List, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;

// Helper Warna
const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return 'success';
    case 'Tertunda': return 'warning';
    case 'Kritis': return 'error';
    default: return 'default';
  }
};

const ProjectDetailDrawer = ({ project, open, onClose }) => {
  if (!project) return null;

  // Hitung Deviasi
  const deviation = project.progress - project.target;
  const isNegative = deviation < 0;

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: '#888' }}>{project.id}</div>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>{project.name}</div>
          </div>
          <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
        </div>
      }
      width={600} // Lebar Drawer
      onClose={onClose}
      open={open}
      styles={{ body: { paddingBottom: 80 } }}
    >
      {/* 1. GENERAL INFO */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 16 }}>Informasi Umum</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Kategori</Text>
            <div><Tag color="blue">{project.category}</Tag></div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Prioritas</Text>
            <div><Tag color={project.priority === 'Tinggi' ? 'red' : 'gold'}>{project.priority}</Tag></div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Project Manager</Text>
            <div style={{ fontWeight: 500 }}><UserOutlined /> {project.manager}</div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Sponsor</Text>
            <div style={{ fontWeight: 500 }}>{project.sponsor}</div>
          </Col>
          <Col span={24}>
             <Text type="secondary" style={{ fontSize: 12 }}>Strategi Project</Text>
             <div style={{ fontWeight: 500 }}>{project.strategy}</div>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 2. PERFORMANCE METRICS */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Performa & Budget</Title>
        
        {/* Progress Bars */}
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>Actual Progress</span>
                <strong>{project.progress}%</strong>
            </div>
            <Progress percent={project.progress} status="active" strokeColor="#1890ff" />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
                <span>Deviation (vs Target {project.target}%)</span>
                <span style={{ color: isNegative ? 'red' : 'green' }}>
                    {deviation > 0 ? '+' : ''}{deviation}%
                </span>
            </div>
            <Progress 
                percent={Math.abs(deviation)} 
                status={isNegative ? 'exception' : 'success'} 
                showInfo={false} 
                size="small"
            />
        </div>

        {/* Budget Card */}
        <Card size="small" style={{ background: '#f9f9f9', borderRadius: 8 }}>
            <Row>
                <Col span={12}>
                    <Statistic 
                        title="Budget Terpakai" 
                        value={project.budgetUsed} 
                        suffix="%" 
                        valueStyle={{ color: project.budgetUsed > 80 ? '#cf1322' : '#3f8600', fontSize: 18 }}
                        prefix={<DollarOutlined />}
                    />
                </Col>
                <Col span={12}>
                     <Statistic 
                        title="Total Budget (IDR)" 
                        value={project.budgetTotal} 
                        valueStyle={{ fontSize: 16 }}
                        formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                    />
                </Col>
            </Row>
        </Card>
      </div>

      <Divider />

      {/* 3. ISSUES LIST */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5} style={{ color: '#ff4d4f' }}><WarningOutlined /> Kendala & Isu</Title>
        {project.issues && project.issues.length > 0 ? (
            <List
                size="small"
                dataSource={project.issues}
                renderItem={(item, index) => (
                    <List.Item>
                        <Text style={{ fontSize: 13 }}>{index + 1}. {item}</Text>
                    </List.Item>
                )}
            />
        ) : (
            <Text type="secondary" italic>Tidak ada isu tercatat.</Text>
        )}
      </div>

      <Divider />

      {/* 4. TIMELINE */}
      <div>
        <Title level={5} style={{ marginBottom: 16 }}><CalendarOutlined /> Timeline Utama</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 16 }}>
             <span>Start: {project.startDate}</span>
             <span>End: {project.endDate}</span>
        </div>
        
        <Steps direction="vertical" size="small" current={1}>
            {project.timelineEvents && project.timelineEvents.map((evt, idx) => (
                <Step 
                    key={idx} 
                    title={evt.title} 
                    description={evt.date} 
                    status={evt.status} 
                />
            ))}
        </Steps>
      </div>

    </Drawer>
  );
};

export default ProjectDetailDrawer;