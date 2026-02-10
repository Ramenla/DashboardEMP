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
    case 'Terhenti': return 'error';
    default: return 'default';
  }
};

const columns = [
  {
    title: 'Kode Project',
    dataIndex: 'id',
    key: 'id',
    render: (text, record) => (
      <div>
        <div className="font-bold text-[13px]">{text}</div>
        <div className="text-[11px] text-gray-500 mb-1">{record.name}</div>
        <Tag color={getStatusColor(record.status)} className="rounded-[10px] text-[10px]">
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
      <Tag color={getPriorityColor(priority)} className="w-[53px] text-center">
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
        <div className="flex justify-between text-[10px] text-gray-400">
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
        <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          {dev > 0 ? '+' : ''}{dev}% <span className="text-[10px] font-normal text-gray-400">vs target</span>
        </span>
      );
    },
  },
  {
    title: 'Issue',
    dataIndex: 'issues',
    key: 'issues',
    width: 200,
    render: (issues) => (
      issues && issues.length > 0 ?
        <Text type="secondary" className="text-xs text-red-600">{issues[0]}</Text> :
        <Text type="secondary" className="text-xs">-</Text>
    ),
  },
  {
    title: 'Budget',
    dataIndex: 'budgetUsed',
    key: 'budget',
    render: (val) => (
      <div className="text-center">
        <Progress type="circle" percent={val} width={40} format={() => `${val}%`} status={val > 90 ? 'exception' : 'normal'} />
        <div className="text-[10px] text-gray-400">Used</div>
      </div>
    ),
  },
];

const ProjectTable = ({ dataSource = [], onRowClick }) => {
  return (
    <Card bordered={false} className="rounded-lg">
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            if (onRowClick) onRowClick(record);
          },
          className: 'cursor-pointer'
        })}
      />
    </Card>
  );
};

export default ProjectTable;