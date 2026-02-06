import React from 'react';
import { Card, Table, Tag, Progress, Typography } from 'antd';

const { Text } = Typography;

// Helper Warna
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Kritis': return 'red';
    case 'Tinggi': return 'volcano';
    case 'Sedang': return 'gold';
    case 'Rendah': return 'default';
    default: return 'default';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return 'success';
    case 'Tertunda': return 'warning';
    case 'Kritis': return 'error';
    case 'Terhenti': return 'error'; // Tambahan untuk status Terhenti
    default: return 'default';
  }
};

const columns = [
  {
    title: 'Kode Project',
    dataIndex: 'id', // Sesuaikan dengan key di mockData ('id')
    key: 'id',
    render: (text, record) => (
      <div>
        <div style={{ fontWeight: 'bold', fontSize: 13 }}>{text}</div>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{record.name}</div>
        <Tag color={getStatusColor(record.status)} style={{ borderRadius: 10, fontSize: 10 }}>
          {record.status}
        </Tag>
      </div>
    ),
  },
  {
    title: 'Prioritas',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority) => (
      <Tag color={getPriorityColor(priority)} style={{ width: 60, textAlign: 'center' }}>
        {priority}
      </Tag>
    ),
  },
  {
    title: 'Kategori',
    dataIndex: 'category',
    key: 'category',
    render: (cat) => <Tag color="blue">{cat}</Tag>,
  },
  {
    title: 'Progress ke Target',
    key: 'progress',
    width: 250,
    render: (_, record) => (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888' }}>
           <span>{record.progress}%</span>
           <span>Target {record.target}%</span>
        </div>
        <Progress 
          percent={record.progress} 
          success={{ percent: record.target, strokeColor: '#52c41a' }} 
          showInfo={false} 
          size="small" 
          strokeColor="#1890ff"
        />
      </div>
    ),
  },
  {
    title: 'Deviasi',
    key: 'deviation',
    render: (_, record) => {
      const dev = record.progress - record.target;
      const isNegative = dev < 0;
      return (
        <span style={{ color: isNegative ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
          {dev > 0 ? '+' : ''}{dev}% <span style={{fontSize: 10, fontWeight: 'normal', color: '#999'}}>vs target</span>
        </span>
      );
    },
  },
  {
    title: 'Issue',
    dataIndex: 'issues', // Mengambil array issues
    key: 'issues',
    width: 200,
    render: (issues) => (
        issues && issues.length > 0 ? 
        <Text type="secondary" style={{ fontSize: 12, color: '#cf1322' }}>{issues[0]}</Text> : 
        <Text type="secondary" style={{ fontSize: 12 }}>-</Text>
    ),
  },
  {
    title: 'Budget',
    dataIndex: 'budgetUsed',
    key: 'budget',
    render: (val) => (
      <div style={{ textAlign: 'center' }}>
         <Progress type="circle" percent={val} width={40} format={() => `${val}%`} status={val > 90 ? 'exception' : 'normal'} />
         <div style={{ fontSize: 10, color: '#999' }}>Used</div>
      </div>
    ),
  },
];

// Menerima props onRowClick
const ProjectTable = ({ dataSource = [], onRowClick }) => {
  return (
    <Card bordered={false} style={{ borderRadius: 8 }}>
       <div style={{ display: 'flex', gap: 24, marginBottom: 16, fontSize: 12, color: '#666', fontWeight: 500 }}>
          <span>Kode Project</span>
          <span>Prioritas</span>
          <span>Kategori</span>
          <span>Progress ke Target</span>
          <span>Deviasi</span>
          <span>Issue Utama</span>
          <span>Budget</span>
       </div>
       
       <Table 
         columns={columns} 
         dataSource={dataSource} 
         pagination={{ pageSize: 10 }} // Pagination karena datanya 50
         rowKey="id" // Penting: ID unik
         showHeader={false}
         // FITUR KLIK BARIS:
         onRow={(record) => ({
           onClick: () => {
             if (onRowClick) onRowClick(record);
           },
           style: { cursor: 'pointer' }
         })}
       />
    </Card>
  );
};

export default ProjectTable;