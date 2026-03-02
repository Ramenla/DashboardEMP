/**
 * @file ProjectTable.jsx
 * @description Komponen tabel proyek untuk halaman Project List.
 * Menampilkan kolom: kode proyek, prioritas, kategori, tanggal mulai/selesai,
 * deviasi progress, SPI, CPI, realisasi anggaran (circle progress), dan jumlah kendala.
 * Semua kolom dilengkapi tooltip premium dan dapat disortir.
 */

import React from 'react';
import { Card, Table, Tag, Progress, Typography, Space, Skeleton } from 'antd';
import PremiumTooltip, { ProjectTooltip } from '../../../components/ui/ProjectTooltip';
import { formatProjectDate } from '../../../utils/dateUtils';

const { Text } = Typography;

/**
 * Mengembalikan warna Ant Design Tag berdasarkan prioritas proyek.
 *
 * @param {string} priority - Level prioritas (Tinggi, Sedang, Rendah).
 * @returns {string} Nama warna Tag.
 */
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Tinggi': return 'red';
    case 'Sedang': return 'gold';
    case 'Rendah': return 'default';
    default: return 'default';
  }
};

/**
 * Mengembalikan warna Ant Design Tag berdasarkan status proyek.
 *
 * @param {string} status - Status proyek (Berjalan, Tertunda, Beresiko, Selesai).
 * @returns {string} Nama warna Tag.
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return 'success';
    case 'Tertunda': return 'warning';
    case 'Beresiko': return 'error';
    case 'Selesai': return 'processing';
    default: return 'default';
  }
};

/**
 * Tabel daftar proyek dengan sortir dan tooltip interaktif.
 *
 * @param {Object} props
 * @param {Array<Object>} props.dataSource - Array data proyek.
 * @param {Function} props.onRowClick - Callback saat baris tabel di-klik.
 * @param {Function} [props.onEdit] - Callback edit proyek (belum diimplementasi).
 * @param {Function} [props.onDelete] - Callback hapus proyek (belum diimplementasi).
 * @param {boolean} [props.loading=false]
 * @returns {JSX.Element} Tabel Ant Design dengan kolom proyek lengkap.
 */
const ProjectTable = ({ dataSource, onRowClick, loading = false }) => {
  const columns = [
    {
      title: 'Kode Project',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      render: (text, record) => (
        <div>
          <div className="font-bold text-[13px]">{text}</div>
          <div className="text-[11px] text-gray-500 mb-1">{record.name}</div>
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
      sorter: (a, b) => {
        const map = { 'Tinggi': 3, 'Sedang': 2, 'Rendah': 1 };
        return (map[a.priority] || 0) - (map[b.priority] || 0);
      },
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
      sorter: (a, b) => a.category.localeCompare(b.category),
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
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      render: (record) => {
        const dateStr = formatProjectDate(record.startDate);
        return (
          <PremiumTooltip title={`Proyek dimulai pada: ${dateStr}`}>
            <div>
              <div className="flex justify-between text-[13px] text-black-400">
                <span>{dateStr}</span>
              </div>
            </div>
          </PremiumTooltip>
        );
      },
    },
    {
      title: 'Estimasi Tanggal',
      key: 'estimasi',
      width: 120,
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      render: (record) => {
        const dateStr = formatProjectDate(record.endDate);
        return (
          <PremiumTooltip title={`Target selesai proyek: ${dateStr}`}>
            <div>
              <div className="flex justify-between text-[13px] text-black-400">
                <span>{dateStr}</span>
              </div>
            </div>
          </PremiumTooltip>
        );
      },
    },
    {
      title: 'Deviasi',
      key: 'deviation',
      sorter: (a, b) => {
        const devA = (a.progress || 0) - (a.target || 0);
        const devB = (b.progress || 0) - (b.target || 0);
        return devA - devB;
      },
      render: (_, record) => {
        const progress = record.progress || 0;
        const target = record.target || 0;
        const dev = (progress - target).toFixed(1);
        const isNegative = dev < 0;
        return (
          <PremiumTooltip title={`Selisih progress (${progress.toFixed(1)}%) dengan target (${target.toFixed(1)}%)`}>
            <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
              {dev > 0 ? '+' : ''}{dev}%
            </span>
          </PremiumTooltip>
        );
      },
    },
    {
      title: 'SPI',
      dataIndex: 'spi',
      key: 'spi',
      width: 80,
      sorter: (a, b) => (a.spi || 0) - (b.spi || 0),
      render: (val) => (
        <PremiumTooltip title="Schedule Performance Index (Target >= 1.0)">
          <Tag color={val >= 1 ? 'success' : val >= 0.8 ? 'warning' : 'error'}>{parseFloat(val).toFixed(2)}</Tag>
        </PremiumTooltip>
      ),
    },
    {
      title: 'CPI',
      dataIndex: 'cpi',
      key: 'cpi',
      width: 80,
      sorter: (a, b) => (a.cpi || 0) - (b.cpi || 0),
      render: (val) => (
        <PremiumTooltip title="Cost Performance Index (Target >= 1.0)">
          <Tag color={val >= 1 ? 'success' : val >= 0.8 ? 'warning' : 'error'}>{parseFloat(val).toFixed(2)}</Tag>
        </PremiumTooltip>
      ),
    },
    {
      title: 'Realisasi Anggaran',
      dataIndex: 'budgetUsed',
      key: 'budget',
      align: 'center',
      sorter: (a, b) => {
        const pctA = (parseFloat(a.budgetUsed) || 0) / (parseFloat(a.totalBudget) || 1);
        const pctB = (parseFloat(b.budgetUsed) || 0) / (parseFloat(b.totalBudget) || 1);
        return pctA - pctB;
      },
      render: (val, record) => {
        const total = parseFloat(record.totalBudget) || 1;
        const used = parseFloat(val) || 0;
        const pct = Math.min(Math.round((used / total) * 100), 100);
        return (
          <PremiumTooltip title={`Terpakai: Rp ${used.toLocaleString()} (${pct}%) dari Rp ${total.toLocaleString()}`}>
            <div className="text-[13px] text-black-400">
              <Progress type="circle" percent={pct} width={34} format={() => `${pct}%`} status={pct > 90 ? 'exception' : 'normal'} />
            </div>
          </PremiumTooltip>
        );
      },
    },
    {
      title: 'Total Kendala',
      key: 'issue',
      align: 'center',
      sorter: (a, b) => (a.issues?.length || 0) - (b.issues?.length || 0),
      render: (_, record) => {
        const issueCount = record.issues?.length || 0;
        const issueTitles = record.issues?.map(i => (typeof i === 'object' ? i.title : i)) || [];
        const issuesList = issueTitles.length > 0 ? issueTitles.join(', ') : 'Tidak ada isu aktif';
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
  ];

  return (
    <Card bordered={false} className="rounded-lg" bodyStyle={{ padding: 0 }}>
      {loading ? (
        <div className="w-full flex flex-col">
          {/* Table Header Skeleton */}
          <div className="flex bg-gray-50 px-4 py-3 border-b border-gray-100 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Skeleton.Button key={`h-${i}`} active size="small" className="h-4 w-16 mx-auto flex-1" />
            ))}
          </div>
          {/* Table Rows Skeleton */}
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={`r-${row}`} className="flex px-4 py-3 border-b border-gray-50 items-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => (
                <div key={`c-${col}`} className="flex-1 px-2 flex justify-center">
                  {col === 1 ? (
                    <div className="flex flex-col items-center gap-1 w-full">
                      <Skeleton.Button active size="small" className="h-4 w-3/4" />
                      <Skeleton.Button active size="small" className="h-3 w-1/2" />
                    </div>
                  ) : col === 9 ? (
                     <Skeleton.Avatar active shape="circle" size={34} />
                  ) : (
                    <Skeleton.Button active size="small" className="h-5 w-12 rounded" />
                  )}
                </div>
              ))}
            </div>
          ))}
          {/* Pagination Skeleton */}
          <div className="flex justify-end px-4 py-3">
             <Skeleton.Button active size="small" className="h-6 w-48" />
          </div>
        </div>
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{ pageSize: 5, showSizeChanger: false }}
          rowClassName="cursor-pointer"
          onRow={(record) => ({ onClick: () => onRowClick(record) })}
          size="small"
        />
      )}
    </Card>
  );
};

export default ProjectTable;
