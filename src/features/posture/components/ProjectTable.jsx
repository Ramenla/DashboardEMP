import React from 'react';
import { Card, Table, Tag, Progress, Typography } from 'antd';

const { Text } = Typography;

/**
 * helper function untuk mendapatkan warna tag berdasarkan priority
 * @param {string} priority - level priority (Kritis, Tinggi, Sedang, Rendah)
 * @returns {string} nama color untuk Ant Design Tag
 */
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Kritis': return 'red';
    case 'Tinggi': return 'volcano';
    case 'Sedang': return 'gold';
    case 'Rendah': return 'default';
    default: return 'default';
  }
};

/**
 * helper function untuk mendapatkan warna tag berdasarkan status project
 * @param {string} status - status project (Berjalan, Tertunda, Kritis)
 * @returns {string} nama color untuk Ant Design Tag
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return 'success';
    case 'Tertunda': return 'warning';
    case 'Kritis': return 'error';
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

/**
 * komponen tabel untuk menampilkan daftar project dengan informasi lengkap
 * menampilkan kode, prioritas, kategori, progress, budget, dan tanggal
 * mendukung klik row untuk membuka detail project
 * @param {Object} props - props komponen
 * @param {Array} props.dataSource - array of project objects untuk ditampilkan di tabel
 * @param {Function} props.onRowClick - callback ketika row diklik, menerima object project
 * @returns {JSX.Element} card dengan table project yang dapat diklik
 */
const ProjectTable = ({ dataSource, onRowClick }) => {
  return (
    <Card bordered={false} className="rounded-lg">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) => (
            <Text type="secondary" className="text-xs">
              Menampilkan {range[0]}-{range[1]} dari {total} project
            </Text>
          ),
        }}
        rowClassName="cursor-pointer hover:bg-gray-50 transition"
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        size="small"
      />
    </Card>
  );
};

export default ProjectTable;