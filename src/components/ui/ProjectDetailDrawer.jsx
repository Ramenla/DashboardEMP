import React, { useMemo } from 'react';
import { Drawer, Tag, Typography, Progress, Divider, Steps, List, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, DollarOutlined, WarningOutlined, LineChartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const { Title, Text } = Typography;
const { Step } = Steps;

// Helper Warna Status
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

  // Hitung Deviasi Saat Ini
  const currentDeviation = project.progress - project.target;
  const isNegative = currentDeviation < 0;

  // --- LOGIC: GENERATE DATA S-CURVE DUMMY ---
  // Kita membuat data simulasi 6 periode (misal: bulan)
  const sCurveData = useMemo(() => {
    const data = [];
    const periods = ['Bulan 1', 'Bulan 2', 'Bulan 3', 'Bulan 4', 'Bulan 5', 'Bulan 6'];
    const numPeriods = periods.length;

    // Nilai akhir yang harus dicapai pada Bulan ke-6
    const finalPV = project.target;      // Planned Value (Target)
    const finalEV = project.progress;    // Earned Value (Actual Progress)
    const finalAC = project.budgetUsed;  // Actual Cost (Budget Used)

    for (let i = 0; i < numPeriods; i++) {
      const progressRatio = (i + 1) / numPeriods; // 0.16, 0.33, ..., 1.0

      // Faktor kurva S sederhana untuk membuat garis melengkung
      // Semakin kecil pangkatnya, semakin linear garisnya
      const pvFactor = Math.pow(progressRatio, 1.2);
      const evFactor = Math.pow(progressRatio, project.status === 'Kritis' || project.status === 'Tertunda' ? 1.5 : 1.2); // Kalau kritis, progress awal lebih lambat
      const acFactor = Math.pow(progressRatio, finalAC > finalEV ? 1.1 : 1.3); // Kalau boros, biaya naik lebih cepat di awal

      data.push({
        name: periods[i],
        // PV (Planned): Target Ideal (Biru Putus-putus)
        pv: parseFloat((finalPV * pvFactor).toFixed(1)),

        // EV (Earned): Realisasi Progress (Hijau Solid)
        ev: parseFloat((finalEV * evFactor).toFixed(1)),

        // AC (Cost): Realisasi Biaya (Merah Solid)
        ac: parseFloat((finalAC * acFactor).toFixed(1)),
      });
    }
    return data;
  }, [project]);


  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <div style={{ marginLeft: 16 }}>
            <div style={{ fontSize: 12, color: '#888' }}>{project.id}</div>
            <div style={{ fontSize: 16, fontWeight: 'bold' }}>{project.name}</div>
          </div>
          <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
        </div>
      }
      width={700} // Lebar drawer diperbesar sedikit untuk grafik
      onClose={onClose}
      open={open}
      styles={{ body: { paddingBottom: 80, paddingTop: 0 } }} // AntD v5
      bodyStyle={{ paddingBottom: 80, paddingTop: 0 }} // AntD v4 (just in case)
    >
      {/* 1. INFORMASI UMUM */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>Informasi Umum</Title>
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
            <div style={{ fontWeight: 500 }}><UserOutlined /> {project.manager || 'Manager Name'}</div>
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Sponsor</Text>
            <div style={{ fontWeight: 500 }}>{project.sponsor || 'Sponsor Name'}</div>
          </Col>
          <Col span={24}>
            <Text type="secondary" style={{ fontSize: 12 }}>Strategi Project</Text>
            <div style={{ fontWeight: 500 }}>{project.strategy || 'Standard Execution'}</div>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* 2. PERFORMA & GRAFIK S-CURVE */}
      <div style={{ marginBottom: 24 }}>
        <Title level={5}>Performa & Analisis S-Curve</Title>

        {/* Progress Bars Summary */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span>Actual Progress (EV)</span>
            <strong>{project.progress}%</strong>
          </div>
          <Progress percent={project.progress} status="active" strokeColor="#52c41a" />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}>
            <span>Deviation (EV vs PV {project.target}%)</span>
            <span style={{ color: isNegative ? 'red' : 'green', fontWeight: 'bold' }}>
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

        {/* --- MULTI-LINE CHART (S-CURVE) --- */}
        <Card size="small" style={{ background: '#fff', borderRadius: 8, border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, gap: 8 }}>
            <LineChartOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: 600, fontSize: 13 }}>Grafik S-Curve (PV vs EV vs AC)</span>
          </div>

          <div style={{ width: '100%', height: 250 }}>
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

                {/* GARIS 1: Planned Value (PV) - Biru Putus-putus */}
                <Line
                  type="monotone"
                  dataKey="pv"
                  name="Planned Value (PV)"
                  stroke="#1890ff"
                  strokeWidth={2}
                  strokeDasharray="5 5" // Membuat garis putus-putus
                  dot={{ r: 3, fill: '#1890ff', strokeWidth: 0 }}
                />

                {/* GARIS 2: Earned Value (EV) - Hijau Solid */}
                <Line
                  type="monotone"
                  dataKey="ev"
                  name="Earned Value (EV)"
                  stroke="#52c41a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#52c41a', strokeWidth: 0, shape: 'square' }} // Marker kotak
                />

                {/* GARIS 3: Actual Cost (AC) - Merah Solid */}
                <Line
                  type="monotone"
                  dataKey="ac"
                  name="Actual Cost (AC)"
                  stroke="#ff4d4f"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#ff4d4f', strokeWidth: 0 }} // Marker lingkaran
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Budget & Cost Stats */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={8}>
            <Card size="small" style={{ background: '#f9f9f9', borderRadius: 8, border: 'none', textAlign: 'center' }}>
              <Statistic
                title="Planned (PV)"
                value={project.target}
                suffix="%"
                valueStyle={{ color: '#1890ff', fontSize: 16 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#f9f9f9', borderRadius: 8, border: 'none', textAlign: 'center' }}>
              <Statistic
                title="Earned (EV)"
                value={project.progress}
                suffix="%"
                valueStyle={{ color: '#52c41a', fontSize: 16, fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" style={{ background: '#f9f9f9', borderRadius: 8, border: 'none', textAlign: 'center' }}>
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

      {/* 3. ISSUE LIST */}
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
        <Steps direction="vertical" size="small" current={1}>
          {project.timelineEvents && project.timelineEvents.map((evt, idx) => (
            <Step
              key={idx}
              title={evt.title}
              description={evt.date}
              status={evt.status}
            />
          ))}
          {/* Fallback jika data timelineEvents kosong */}
          {(!project.timelineEvents || project.timelineEvents.length === 0) && (
            <>
              <Step title="Start Project" description={project.startDate} status="finish" />
              <Step title="Execution" description="On Progress" status="process" />
              <Step title="Closing" description={project.endDate} status="wait" />
            </>
          )}
        </Steps>
      </div>

    </Drawer>
  );
};

export default ProjectDetailDrawer;