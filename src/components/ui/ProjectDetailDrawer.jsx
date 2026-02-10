import React, { useMemo } from 'react';
import { Drawer, Tag, Typography, Progress, Divider, Steps, List, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, DollarOutlined, WarningOutlined, LineChartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const { Title, Text } = Typography;
const { Step } = Steps;

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


  return (
    <Drawer
      title={
        <div className="flex justify-between items-center pr-6">
          <div className="ml-4">
            <div className="text-xs text-gray-400">{project.id}</div>
            <div className="text-base font-bold">{project.name}</div>
          </div>
          <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
        </div>
      }
      width={700}
      onClose={onClose}
      open={open}
      styles={{ body: { paddingBottom: 80, paddingTop: 0 } }}
    >
      {/* 1. informasi umum */}
      <div className="mb-6">
        <Title level={5} className="mb-4 mt-4">Informasi Umum</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text type="secondary" className="text-xs">Kategori</Text>
            <div><Tag color="blue">{project.category}</Tag></div>
          </Col>
          <Col span={12}>
            <Text type="secondary" className="text-xs">Prioritas</Text>
            <div><Tag color={project.priority === 'Tinggi' ? 'red' : 'gold'}>{project.priority}</Tag></div>
          </Col>
          <Col span={12}>
            <Text type="secondary" className="text-xs">Project Manager</Text>
            <div className="font-medium"><UserOutlined /> {project.manager || 'Manager Name'}</div>
          </Col>
          <Col span={12}>
            <Text type="secondary" className="text-xs">Sponsor</Text>
            <div className="font-medium">{project.sponsor || 'Sponsor Name'}</div>
          </Col>
          <Col span={24}>
            <Text type="secondary" className="text-xs">Strategi Project</Text>
            <div className="font-medium">{project.strategy || 'Standard Execution'}</div>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 2. performa & grafik s-curve */}
      <div className="mb-6">
        <Title level={5}>Performa & Analisis S-Curve</Title>

        {/* progress bars summary */}
        <div className="mb-6">
          <div className="flex justify-between text-xs">
            <span>Actual Progress (EV)</span>
            <strong>{project.progress}%</strong>
          </div>
          <Progress percent={project.progress} status="active" strokeColor="#52c41a" />

          <div className="flex justify-between text-xs mt-2">
            <span>Deviation (EV vs PV {project.target}%)</span>
            <span className={`font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
              {currentDeviation > 0 ? '+' : ''}{currentDeviation}%
            </span>
          </div>
          <Progress
            percent={Math.abs(currentDeviation)}
            status={isNegative ? 'exception' : 'success'}
            showInfo={false}
            size="small"
          />
        </div>

        {/* multi-line chart (s-curve) */}
        <Card size="small" className="bg-white rounded-lg border border-gray-100">
          <div className="flex items-center mb-4 gap-2">
            <LineChartOutlined className="text-blue-500" />
            <span className="font-semibold text-[13px]">Grafik S-Curve (PV vs EV vs AC)</span>
          </div>

          <div className="w-full h-[250px]">
            <ResponsiveContainer>
              <LineChart data={sCurveData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 'auto']} label={{ value: 'Nilai (%)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: 12, fontWeight: 'bold' }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />

                <Line
                  type="monotone"
                  dataKey="pv"
                  name="Planned Value (PV)"
                  stroke="#1890ff"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#1890ff', strokeWidth: 0 }}
                />

                <Line
                  type="monotone"
                  dataKey="ev"
                  name="Earned Value (EV)"
                  stroke="#52c41a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#52c41a', strokeWidth: 0, shape: 'square' }}
                />

                <Line
                  type="monotone"
                  dataKey="ac"
                  name="Actual Cost (AC)"
                  stroke="#ff4d4f"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ff4d4f', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* budget & cost stats */}
        <Row gutter={16} className="mt-4">
          <Col span={8}>
            <Card size="small" className="bg-gray-50 rounded-lg border-none text-center">
              <Statistic
                title="Planned (PV)"
                value={project.target}
                suffix="%"
                valueStyle={{ color: '#1890ff', fontSize: 16 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" className="bg-gray-50 rounded-lg border-none text-center">
              <Statistic
                title="Earned (EV)"
                value={project.progress}
                suffix="%"
                valueStyle={{ color: '#52c41a', fontSize: 16, fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" className="bg-gray-50 rounded-lg border-none text-center">
              <Statistic
                title="Actual Cost (AC)"
                value={project.budgetUsed}
                suffix="%"
                valueStyle={{ color: project.budgetUsed > project.progress ? '#cf1322' : '#52c41a', fontSize: 16 }}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 3. issue list */}
      <div className="mb-6">
        <Title level={5} className="text-red-500"><WarningOutlined /> Kendala & Isu</Title>
        {project.issues && project.issues.length > 0 ? (
          <List
            size="small"
            dataSource={project.issues}
            renderItem={(item, index) => (
              <List.Item>
                <Text className="text-[13px]">{index + 1}. {item}</Text>
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary" italic>Tidak ada isu tercatat.</Text>
        )}
      </div>

      <Divider />

      {/* 4. timeline */}
      <div>
        <Title level={5} className="mb-3"><CalendarOutlined /> Timeline Project</Title>
        
        {/* timeline events - horizontal list */}
        <div className="bg-gray-50 rounded-lg p-4">
          {/* calculate timeline events based on project dates */}
          {(() => {
            const today = new Date();
            const startDate = new Date(project.startDate);
            const endDate = new Date(project.endDate);
            
            // calculate milestone dates
            const quarterDate = new Date(startDate.getTime() + (endDate - startDate) * 0.25);
            const midDate = new Date(startDate.getTime() + (endDate - startDate) * 0.5);
            const threeQuarterDate = new Date(startDate.getTime() + (endDate - startDate) * 0.75);
            
            const events = [
              {
                date: project.startDate,
                time: '08:00',
                title: 'Project Kick Off',
                description: 'Project initiation meeting dan team mobilization telah dilakukan.',
                status: 'completed',
                completed: startDate < today
              },
              {
                date: quarterDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                time: '14:30',
                title: 'Design Phase Completed',
                description: 'Engineering design dan approval selesai. Dokumen siap untuk eksekusi.',
                status: 'completed',
                completed: quarterDate < today
              },
              {
                date: midDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                time: '10:15',
                title: 'Construction in Progress',
                description: 'Main construction dan installation sedang berlangsung.',
                status: 'process',
                completed: false
              },
              {
                date: threeQuarterDate.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                time: '16:00',
                title: 'Testing & Commissioning',
                description: 'System testing dan commissioning akan dilakukan.',
                status: 'pending',
                completed: false
              },
              {
                date: project.endDate,
                time: '18:00',
                title: 'Project Handover',
                description: 'Final inspection dan project handover ke client.',
                status: 'pending',
                completed: false
              }
            ];
            
            return (
              <div className="relative">
                {events.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 mb-4 last:mb-0">
                    {/* left: icon & line */}
                    <div className="flex flex-col items-center">
                      {/* icon */}
                      {event.completed ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0"></div>
                      )}
                      {/* vertical line to next item */}
                      {index < events.length - 1 && (
                        <div className="w-px h-12 bg-gray-300 my-1"></div>
                      )}
                    </div>
                    
                    {/* right: content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-[10px] text-gray-500 font-mono">{event.date} {event.time}</span>
                        <span className={`text-xs font-semibold ${event.completed ? 'text-green-600' : 'text-gray-700'}`}>
                          {event.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* progress info */}
        <div className="mt-3 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] text-gray-500 mb-0.5">Overall Progress</div>
              <div className="text-lg font-bold text-blue-600">{project.progress}%</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-gray-500 mb-0.5">Status</div>
              <Tag color={project.status === 'Berjalan' ? 'success' : project.status === 'Tertunda' ? 'warning' : 'error'}>
                {project.status}
              </Tag>
            </div>
          </div>
        </div>
      </div>

    </Drawer>
  );
};

export default ProjectDetailDrawer;