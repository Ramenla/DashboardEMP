/**
 * @file ProjectDetailDrawer.jsx
 * @description Komponen drawer slide-in untuk menampilkan detail lengkap proyek.
 * Drawer memiliki 5 tab:
 * - Ringkasan: info umum, SPI/CPI, progress bar, grafik S-Curve (PV/EV/AC), dan daftar isu.
 * - Timeline: jadwal dan milestone proyek.
 * - Tim Proyek: daftar anggota tim beserta peran.
 * - Dokumen: daftar dokumen proyek yang dapat diunduh.
 * - Galeri: foto-foto progres proyek.
 */

import React, { useMemo } from 'react';
import { Drawer, Tag, Typography, Progress, Divider, Steps, List, Card, Row, Col, Statistic, Tabs, Avatar, Descriptions, Image, Button, Timeline } from 'antd';
import {
  UserOutlined, CalendarOutlined, DollarOutlined, WarningOutlined,
  LineChartOutlined, TeamOutlined, SafetyCertificateOutlined,
  FileTextOutlined, PictureOutlined, DownloadOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { formatProjectDate } from '../../utils/dateUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const { Title, Text } = Typography;

/**
 * Mengembalikan nama warna Ant Design Tag berdasarkan status proyek.
 *
 * @param {string} status - Status proyek (Berjalan, Tertunda, Beresiko, Selesai).
 * @returns {string} Nama warna untuk komponen Tag.
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
 * Format angka ke mata uang IDR (tanpa desimal).
 *
 * @param {number} value - Nilai yang akan diformat.
 * @returns {string} String dalam format mata uang Indonesia (contoh: "Rp 1.500.000").
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Komponen placeholder untuk state kosong (data belum tersedia).
 *
 * @param {Object} props
 * @param {string} props.text - Teks yang ditampilkan.
 * @returns {JSX.Element}
 */
const EmptyState = ({ text }) => (
  <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded border border-gray-100 border-dashed">
    {text}
  </div>
);

/**
 * Drawer detail proyek yang menampilkan informasi lengkap dalam format multi-tab.
 *
 * @param {Object} props
 * @param {Object} props.project - Data proyek yang akan ditampilkan.
 * @param {boolean} props.open - Status visibility drawer.
 * @param {Function} props.onClose - Callback untuk menutup drawer.
 * @returns {JSX.Element|null} Drawer dengan detail proyek, atau null jika project tidak tersedia.
 */
const ProjectDetailDrawer = ({ project, open, onClose }) => {
  if (!project) return null;

  const currentDeviation = project.progress - project.target;
  const isNegative = currentDeviation < 0;

  const totalBudget = parseFloat(project.totalBudget) || 0;
  const budgetUsedVal = parseFloat(project.budgetUsed) || 0;
  const budgetUsedPct = totalBudget > 0 ? (budgetUsedVal / totalBudget) * 100 : 0;

  /**
   * Data S-Curve (PV, EV, AC) yang di-generate berdasarkan data proyek.
   * Digunakan untuk chart Recharts LineChart pada tab Ringkasan.
   *
   * @type {Array<{name: string, pv: number, ev: number, ac: number}>}
   */
  const sCurveData = useMemo(() => {
    const data = [];
    const start = project.startDate ? new Date(project.startDate) : new Date();
    const end = project.endDate ? new Date(project.endDate) : new Date(start.getTime() + (project.duration || 6) * 30 * 24 * 60 * 60 * 1000);

    let numPeriods = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    if (numPeriods <= 0) numPeriods = 1;
    if (numPeriods > 36) numPeriods = 36;

    const periods = [];
    const formatter = new Intl.DateTimeFormat('id-ID', { month: 'short', year: '2-digit' });

    for (let i = 0; i < numPeriods; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      periods.push(formatter.format(d));
    }

    const finalPV = project.target || 0;
    const finalEV = project.progress || 0;
    const finalAC = totalBudget > 0 ? (budgetUsedVal / totalBudget) * 100 : 0;

    for (let i = 0; i < numPeriods; i++) {
      const progressRatio = (i + 1) / numPeriods;

      const pvFactor = Math.pow(progressRatio, 1.2);
      const evFactor = Math.pow(progressRatio, project.status === 'Beresiko' || project.status === 'Tertunda' ? 1.5 : 1.2);
      const acFactor = Math.pow(progressRatio, finalAC > finalEV ? 1.1 : 1.3);

      data.push({
        name: periods[i],
        pv: parseFloat((finalPV * pvFactor).toFixed(1)),
        ev: parseFloat((finalEV * evFactor).toFixed(1)),
        ac: parseFloat((finalAC * acFactor).toFixed(1)),
      });
    }
    return data;
  }, [project, budgetUsedVal, totalBudget]);

  /** @type {import('antd').TabsProps['items']} */
  const tabItems = [
    {
      key: '1',
      label: <span className="flex items-center gap-2"><LineChartOutlined /> Ringkasan</span>,
      children: (
        <>
          <Card size="small" className="mb-4 bg-gray-50 border-gray-200">
            <Descriptions column={2} size="small" labelStyle={{ color: '#8c8c8c' }} contentStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="Kategori"><Tag color="blue">{project.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="Prioritas">
                <Tag color={project.priority === 'Tinggi' ? 'red' : project.priority === 'Sedang' ? 'gold' : 'default'}>{project.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Manajer Proyek">{project.manager || '-'}</Descriptions.Item>
              <Descriptions.Item label="Lokasi">{project.location || '-'}</Descriptions.Item>
              <Descriptions.Item label="Durasi">{project.duration} Bulan</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={getStatusColor(project.status)}>{project.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="Total Anggaran" span={2}>
                <span className="text-blue-600">{formatCurrency(totalBudget)}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Realisasi Biaya" span={2}>
                <span className={budgetUsedPct > 90 ? "text-red-500" : "text-green-600"}>{formatCurrency(budgetUsedVal)} ({budgetUsedPct.toFixed(1)}%)</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <div className="mb-6">
            <Title level={5}>Performa Proyek</Title>

            <Row gutter={16} className="mb-4">
              <Col span={12}>
                <Card size="small" className="bg-blue-50 border-blue-100">
                  <Statistic
                    title={<span className="text-xs text-blue-600 font-semibold">Jadwal (SPI)</span>}
                    value={project.spi || 1.15}
                    precision={2}
                    valueStyle={{ color: (project.spi || 1.15) >= 1 ? '#3f8600' : '#cf1322', fontSize: 20, fontWeight: 'bold' }}
                    suffix={<span className="text-xs text-gray-500 font-normal">Target ≥ 1.0</span>}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" className="bg-green-50 border-green-100">
                  <Statistic
                    title={<span className="text-xs text-green-600 font-semibold">Biaya (CPI)</span>}
                    value={project.cpi || 0.98}
                    precision={2}
                    valueStyle={{ color: (project.cpi || 0.98) >= 1 ? '#3f8600' : '#cf1322', fontSize: 20, fontWeight: 'bold' }}
                    suffix={<span className="text-xs text-gray-500 font-normal">Target ≥ 1.0</span>}
                  />
                </Card>
              </Col>
            </Row>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Actual Progress (EV)</span>
                <span className="font-bold">{project.progress}%</span>
              </div>
              <Progress percent={project.progress} strokeColor={getStatusColor(project.status) === 'error' ? '#ff4d4f' : '#52c41a'} />

              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Target Plan (PV): {project.target}%</span>
                <span className={isNegative ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}>
                  Deviasi: {currentDeviation > 0 ? '+' : ''}{currentDeviation.toFixed(1)}%
                </span>
              </div>
            </div>

            <Card size="small" className="bg-white rounded-lg border border-gray-100 mb-4">
              <div className="w-full h-[250px] mt-2">
                <ResponsiveContainer>
                  <LineChart data={sCurveData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontSize: 12, fontWeight: 'bold' }}
                      formatter={(value, name, props) => {
                        if (name === 'Planned Value (PV)') return [`${value}%`, name];
                        if (name === 'Earned Value (EV)') {
                          const pv = props.payload.pv;
                          const dev = (value - pv).toFixed(1);
                          return [`${value}% (Dev: ${dev > 0 ? '+' : ''}${dev}%)`, name];
                        }
                        if (name === 'Actual Cost (AC)') return [`${value}%`, name];
                        return [`${value}%`, name];
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="pv" name="Planned Value (PV)" stroke="#1890ff" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ev" name="Earned Value (EV)" stroke="#52c41a" strokeWidth={3} dot={{ r: 4, shape: 'square' }} />
                    <Line type="monotone" dataKey="ac" name="Actual Cost (AC)" stroke="#ff4d4f" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Row gutter={[12, 12]}>
              <Col span={8}>
                <Card size="small" bordered={false} className="shadow-sm bg-blue-50 text-center">
                  <Statistic
                    title={<span className="text-xs font-semibold text-blue-600">Plan (PV)</span>}
                    value={project.target}
                    suffix="%"
                    valueStyle={{ fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" bordered={false} className="shadow-sm bg-green-50 text-center">
                  <Statistic
                    title={<span className="text-xs font-semibold text-green-600">Earned (EV)</span>}
                    value={project.progress}
                    suffix="%"
                    valueStyle={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" bordered={false} className="shadow-sm bg-red-50 text-center">
                  <Statistic
                    title={<span className="text-xs font-semibold text-red-600">Cost (AC)</span>}
                    value={budgetUsedPct}
                    precision={1}
                    suffix="%"
                    valueStyle={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <Divider />

          <div className="mb-6">
            <Title level={5} className={project.issues && project.issues.length > 0 ? "text-red-500" : ""}>
              <WarningOutlined /> Kendala & Isu ({project.issues ? project.issues.length : 0})
            </Title>
            {project.issues && project.issues.length > 0 ? (
              <List
                size="small"
                dataSource={project.issues}
                renderItem={(item, index) => {
                  const title = typeof item === 'object' ? item.title : item;
                  const division = typeof item === 'object' ? item.division : null;
                  return (
                    <List.Item className="flex items-center justify-between border-none py-1">
                      <Text className="text-sm">• {title}</Text>
                      {division && <Tag color="default" className="text-[10px] m-0 bg-gray-100 border-none">{division}</Tag>}
                    </List.Item>
                  );
                }}
              />
            ) : (
              <EmptyState text="Tidak ada isu tercatat." />
            )}
          </div>
        </>
      ),
    },
    {
      key: '5',
      label: <span className="flex items-center gap-2"><ClockCircleOutlined /> Timeline</span>,
      children: (
        <div className="mt-2">
          <Title level={5} className="mb-6">Jadwal & Milestone</Title>
          <Timeline
            mode="left"
            items={project.timelineEvents ? project.timelineEvents.map(event => ({
              color: 'blue',
              children: (
                <>
                  <Text strong>{event.eventName || event.title}</Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {event.startDate ? formatProjectDate(event.startDate) : event.date}
                    -
                    {event.endDate ? formatProjectDate(event.endDate) : ''}
                  </Text>
                  <p className="text-xs text-gray-500 mt-1 m-0">{event.description || 'Tahapan proyek sesuai jadwal.'}</p>
                </>
              ),
            })) : []}
          />
          {(!project.timelineEvents || project.timelineEvents.length === 0) && <EmptyState text="Timeline belum tersedia" />}
        </div>
      ),
    },
    {
      key: '2',
      label: <span className="flex items-center gap-2"><TeamOutlined /> Tim Proyek</span>,
      children: (
        <>
          <div className="mb-6">
            <Title level={5}><TeamOutlined /> Tim Proyek</Title>
            <List
              itemLayout="horizontal"
              dataSource={project.team || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar style={{ backgroundColor: '#1890ff' }}>{item.name[0]}</Avatar>}
                    title={<span className="font-medium">{item.name}</span>}
                    description={item.role}
                  />
                </List.Item>
              )}
            />
            {(!project.team || project.team.length === 0) && <EmptyState text="Data tim belum tersedia" />}
          </div>

        </>
      ),
    },
    {
      key: '3',
      label: <span className="flex items-center gap-2"><FileTextOutlined /> Dokumen</span>,
      children: (
        <div>
          <Title level={5} className="mb-4">Dokumen Proyek</Title>
          <List
            dataSource={project.documents || []}
            renderItem={(item) => (
              <List.Item
                actions={[<Button type="link" size="small" icon={<DownloadOutlined />}>Unduh</Button>]}
              >
                <List.Item.Meta
                  avatar={<div className="bg-blue-50 p-2 rounded text-blue-500"><FileTextOutlined /></div>}
                  title={<span className="text-sm font-medium">{item.name}</span>}
                  description={<span className="text-xs text-gray-400">{item.type} • {item.date} • {item.size}</span>}
                />
              </List.Item>
            )}
          />
          {(!project.documents || project.documents.length === 0) && <EmptyState text="Tidak ada dokumen" />}
        </div>
      ),
    },
    {
      key: '4',
      label: <span className="flex items-center gap-2"><PictureOutlined /> Galeri</span>,
      children: (
        <div>
          <Title level={5} className="mb-4">Foto Progres ({project.gallery ? project.gallery.length : 0})</Title>
          <div className="grid grid-cols-2 gap-4">
            {project.gallery && project.gallery.map((photo, idx) => (
              <div key={idx} className="flex flex-col">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  className="rounded-lg object-cover w-full h-32"
                  fallback="https://placehold.co/600x400/ececec/999999?text=No+Image"
                />
                <span className="text-[10px] text-gray-500 mt-1 truncate">{photo.caption}</span>
                <span className="text-[9px] text-gray-400">{photo.date}</span>
              </div>
            ))}
          </div>
          {(!project.gallery || project.gallery.length === 0) && <EmptyState text="Belum ada foto progres" />}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start pr-6">
            <div>
              <span className="text-xs text-gray-400 block mb-0.5">{project.id}</span>
              <span className="text-lg font-bold leading-tight block">{project.name}</span>
            </div>
            <Tag color={getStatusColor(project.status)} className="mt-1">{project.status}</Tag>
          </div>
        </div>
      }
      width={700}
      onClose={onClose}
      open={open}
      styles={{ body: { paddingBottom: 80, paddingTop: 10 } }}
    >
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Drawer>
  );
};

export default ProjectDetailDrawer;