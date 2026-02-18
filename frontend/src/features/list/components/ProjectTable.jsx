import React from 'react';
import { Card, Table, Tag, Progress, Typography, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

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

/**
 * komponen tabel untuk menampilkan daftar project dengan informasi lengkap
 * menampilkan kode, prioritas, kategori, progress, budget, dan tanggal
 * mendukung klik row untuk membuka detail project
 * @param {Object} props - props komponen
 * @param {Array} props.dataSource - array of project objects untuk ditampilkan di tabel
 * @param {Function} props.onRowClick - callback ketika row diklik, menerima object project
 * @param {Function} props.onEdit - callback ketika tombol edit diklik
 * @param {Function} props.onDelete - callback ketika tombol delete diklik
 * @returns {JSX.Element} card dengan table project yang dapat diklik
 */
const ProjectTable = ({ dataSource, onRowClick, onEdit, onDelete }) => {
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
      title: 'Mulai Proyek',
      key: 'start',
      width: 130,
      render: (record) => (
        <div>
          <div className="flex justify-between text-[13px] text-black-400">
            <span>{record.startDate}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Estimasi Tanggal',
      key: 'estimasi',
      width: 120,
      render: (record) => (
        <div>
          <div className="flex justify-between text-[13px] text-black-400">
            <span>{record.endDate}</span>
          </div>
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
            {dev > 0 ? '+' : ''}{dev}%
            <br />
            <span className="text-[10px] font-normal text-gray-400">progress vs target</span>
          </span>
        );
      },
    },
    {
      title: 'Budget',
      dataIndex: 'budgetUsed',
      key: 'budget',
      render: (val) => (
        <div className="text-[13px] text-black-400">
          <Progress type="circle" percent={val} width={34} format={() => `${val}%`} status={val > 90 ? 'exception' : 'normal'} />
        </div>
      ),
    },
    {
      title: 'Isu',
      key: 'issue',
      render: (_, record) => {
        const issueCount = record.issues?.length || 0;
        return (
          <div>
            <span className={`font-bold ${issueCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
              {issueCount}
            </span>
            <br />
            <span className="text-[10px] font-normal text-gray-400">total isu aktif</span>
          </div>
        );
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(record);
            }}
          />
          <Popconfirm
            title="Hapus proyek?"
            description="Tindakan ini tidak bisa dibatalkan."
            onConfirm={(e) => {
              e.stopPropagation();
              onDelete(record.id);
            }}
            onCancel={(e) => e.stopPropagation()}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false} className="rounded-lg" bodyStyle={{ padding: 0 }}>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) => (
            <Text type="secondary" className="text-xs px-4 pb-2 block">
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
