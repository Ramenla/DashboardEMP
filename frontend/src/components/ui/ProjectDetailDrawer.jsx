import React, { useMemo } from 'react';
import { Drawer, Tag, Typography, Progress, Divider, Steps, List, Card, Row, Col, Statistic, Tabs, Avatar, Descriptions, Image, Button, Timeline } from 'antd';
import { 
  UserOutlined, CalendarOutlined, DollarOutlined, WarningOutlined, 
  LineChartOutlined, TeamOutlined, SafetyCertificateOutlined, 
  FileTextOutlined, PictureOutlined, DownloadOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const { Title, Text } = Typography;

/**
 * helper function untuk mendapatkan warna tag berdasarkan status project
 * @param {string} status - status project (Berjalan, Tertunda, Kritis, dll)
 * @returns {string} nama color untuk Ant Design Tag component
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'Berjalan': return 'success';
    case 'Tertunda': return 'warning';
    case 'Kritis': return 'error';
    default: return 'default';
  }
};

// Helper internal untuk state kosong
const EmptyState = ({ text }) => (
  <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded border border-gray-100 border-dashed">
    {text}
  </div>
);

/**
 * komponen drawer untuk menampilkan detail lengkap suatu project
 * menampilkan info umum, progress, budget, chart s-curve, dan timeline
 * @param {Object} props - props komponen
 * @param {Object} props.project - data project yang akan ditampilkan
 * @param {boolean} props.open - state apakah drawer visible
 * @param {Function} props.onClose - callback untuk menutup drawer
 * @returns {JSX.Element|null} drawer dengan detail project, atau null jika project tidak tersedia
 */
const ProjectDetailDrawer = ({ project, open, onClose }) => {
  if (!project) return null;

  // hitung deviasi saat ini
  const currentDeviation = project.progress - project.target;
  const isNegative = currentDeviation < 0;

  /**
   * generate dummy s-curve data untuk chart PV (planned value), EV (earned value), AC (actual cost)
   * data di-generate berdasarkan target, progress, dan budget project
   * @returns {Array} array of objects dengan data PV, EV, AC per bulan
   */
  const sCurveData = useMemo(() => {
    const data = [];
    const periods = ['Bulan 1', 'Bulan 2', 'Bulan 3', 'Bulan 4', 'Bulan 5', 'Bulan 6'];
    const numPeriods = periods.length;

    const finalPV = project.target;
    const finalEV = project.progress;
    const finalAC = project.budgetUsed;

    for (let i = 0; i < numPeriods; i++) {
      const progressRatio = (i + 1) / numPeriods;

      const pvFactor = Math.pow(progressRatio, 1.2);
      const evFactor = Math.pow(progressRatio, project.status === 'Kritis' || project.status === 'Tertunda' ? 1.5 : 1.2);
      const acFactor = Math.pow(progressRatio, finalAC > finalEV ? 1.1 : 1.3);

      data.push({
        name: periods[i],
        pv: parseFloat((finalPV * pvFactor).toFixed(1)),
        ev: parseFloat((finalEV * evFactor).toFixed(1)),
        ac: parseFloat((finalAC * acFactor).toFixed(1)),
      });
    }
    return data;
  }, [project]);

  // Items untuk Tabs
  const tabItems = [
    {
      key: '1',
      label: <span className="flex items-center gap-2"><LineChartOutlined /> Ringkasan</span>,
      children: (
        <>
           {/* 1. Informasi Umum */}
           <Card size="small" className="mb-4 bg-gray-50 border-gray-200">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Kategori"><Tag color="blue">{project.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="Prioritas">
                <Tag color={project.priority === 'Tinggi' ? 'red' : 'gold'}>{project.priority}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Manajer Proyek">{project.manager || '-'}</Descriptions.Item>
              <Descriptions.Item label="Sponsor">{project.sponsor || '-'}</Descriptions.Item>
              <Descriptions.Item label="Lokasi">{project.location || '-'}</Descriptions.Item>
              <Descriptions.Item label="Durasi">{project.duration} Bulan</Descriptions.Item>
            </Descriptions>
           </Card>

          {/* 2. Performa & Grafik S-Curve */}
          <div className="mb-6">
            <Title level={5}>Performa Proyek</Title>
            
            {/* Progress Bar Utama */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Actual Progress (EV)</span>
                <span className="font-bold">{project.progress}%</span>
              </div>
              <Progress percent={project.progress} strokeColor={getStatusColor(project.status) === 'error' ? '#ff4d4f' : '#52c41a'} />
              
              <div className="flex justify-between text-xs mt-2 text-gray-500">
                <span>Target Plan (PV): {project.target}%</span>
                <span className={isNegative ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'}>
                  Deviasi: {currentDeviation > 0 ? '+' : ''}{currentDeviation}%
                </span>
              </div>
            </div>

            {/* Chart S-Curve */}
            <Card size="small" className="bg-white rounded-lg border border-gray-100 mb-4">
              <div className="w-full h-[250px] mt-2">
                <ResponsiveContainer>
                  <LineChart data={sCurveData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontSize: 12, fontWeight: 'bold' }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="pv" name="Planned Value (PV)" stroke="#1890ff" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ev" name="Earned Value (EV)" stroke="#52c41a" strokeWidth={3} dot={{ r: 4, shape: 'square' }} />
                    <Line type="monotone" dataKey="ac" name="Actual Cost (AC)" stroke="#ff4d4f" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Budget Stats */}
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
                      value={project.budgetUsed} 
                      suffix="%" 
                      valueStyle={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }} 
                   />
                 </Card>
               </Col>
            </Row>
          </div>

          <Divider />

          {/* 3. Issue List */}
          <div className="mb-6">
            <Title level={5} className={project.issues && project.issues.length > 0 ? "text-red-500" : ""}>
              <WarningOutlined /> Kendala & Isu ({project.issues ? project.issues.length : 0})
            </Title>
            {project.issues && project.issues.length > 0 ? (
              <List
                size="small"
                dataSource={project.issues}
                renderItem={(item, index) => (
                  <List.Item>
                    <Text className="text-sm">• {typeof item === 'object' ? item.title : item}</Text>
                  </List.Item>
                )}
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
              color: 'blue', // Simplified color logic as status might not be in event
              children: (
                <>
                  <Text strong>{event.eventName || event.title}</Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {event.startDate ? new Date(event.startDate).toLocaleDateString('id-ID') : event.date}
                     - 
                    {event.endDate ? new Date(event.endDate).toLocaleDateString('id-ID') : ''}
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
      label: <span className="flex items-center gap-2"><TeamOutlined /> Tim & HSE</span>,
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

          <Divider />

          <div className="mb-6">
            <Title level={5}><SafetyCertificateOutlined /> Statistik HSE (K3)</Title>
            {project.hse ? (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic title="Total Man Hours" value={project.hse.manHours} groupSeparator="." />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Safe Man Hours" 
                    value={project.hse.safeHours} 
                    groupSeparator="." 
                    valueStyle={{ color: '#52c41a' }} 
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Incidents" 
                    value={project.hse.incidents} 
                    valueStyle={{ color: project.hse.incidents > 0 ? '#ff4d4f' : '#52c41a' }} 
                  />
                </Col>
                <Col span={12}>
                  <Statistic title="Fatality" value={project.hse.fatality} />
                </Col>
              </Row>
            ) : (
              <EmptyState text="Data HSE belum tersedia" />
            )}
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