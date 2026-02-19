import React from 'react';
import { Card, Table, Tag, Progress, Typography, Button, Space, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PremiumTooltip, { ProjectTooltip } from '../../../components/ui/ProjectTooltip';

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

          {/* project dengan tooltip detail */}
          <ProjectTooltip project={record}>
            <Tag color={getStatusColor(record.status)} className="rounded-[10px] text-[10px]">
              {record.status}
            </Tag>
          </ProjectTooltip>
        </div>
      ),
    },
    {
      title: 'Prioritas',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <PremiumTooltip title={`Tingkat prioritas proyek: ${priority}`}>
          <Tag color={getPriorityColor(priority)} className="w-[53px] text-center">
            {priority}
          </Tag>
        </PremiumTooltip>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => (
        <PremiumTooltip title={`Kategori proyek: ${cat}`}>
          <Tag color="blue">{cat}</Tag>
        </PremiumTooltip>
      ),
    },
    {
      title: 'Mulai Proyek',
      key: 'start',
      width: 130,
      render: (record) => (
        <PremiumTooltip title={`Proyek dimulai pada: ${record.startDate}`}>
          <div>
            <div className="flex justify-between text-[13px] text-black-400">
              <span>{record.startDate}</span>
            </div>
          </div>
        </PremiumTooltip>
      ),
    },
    {
      title: 'Estimasi Tanggal',
      key: 'estimasi',
      width: 120,
      render: (record) => (
        <PremiumTooltip title={`Target selesai proyek: ${record.endDate}`}>
          <div>
            <div className="flex justify-between text-[13px] text-black-400">
              <span>{record.endDate}</span>
            </div>
          </div>
        </PremiumTooltip>
      ),
    },
    {
      title: 'Deviasi',
      key: 'deviation',
      render: (_, record) => {
        const dev = record.progress - record.target;
        const isNegative = dev < 0;
        return (
          <PremiumTooltip title={`Selisih progress (${record.progress}%) dengan target (${record.target}%)`}>
            <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
              {dev > 0 ? '+' : ''}{dev}%
            </span>
          </PremiumTooltip>
        );
      },
    },
    {
      title: 'Budget',
      dataIndex: 'budgetUsed',
      key: 'budget',
      render: (val) => (
        <PremiumTooltip title={`Budget terpakai: ${val}% dari total alokasi`}>
          <div className="text-[13px] text-black-400">
            <Progress type="circle" percent={val} width={34} format={() => `${val}%`} status={val > 90 ? 'exception' : 'normal'} />
          </div>
        </PremiumTooltip>
      ),
    },
    {
      title: 'Total Isu',
      key: 'issue',
      render: (_, record) => {
        const issueCount = record.issues?.length || 0;
        const issuesList = record.issues?.length > 0 ? record.issues.join(', ') : 'Tidak ada isu aktif';
        return (
          <PremiumTooltip title={`Daftar Isu: ${issuesList}`}>
            <div>
              <span className={`font-bold ${issueCount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {issueCount}
              </span>
            </div>
          </PremiumTooltip>
        );
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <PremiumTooltip title="Edit Proyek">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(record);
              }}
            />
          </PremiumTooltip>
          <PremiumTooltip title="Hapus Proyek">
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
          </PremiumTooltip>
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
