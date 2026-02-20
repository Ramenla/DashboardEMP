import React, { useMemo, useState } from 'react';
import { Card, Empty, Modal, Tag, Progress } from 'antd';
import ProjectDetailDrawer from '../../../components/ui/ProjectDetailDrawer';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * warna dan label per status project
 */
const STATUS_CONFIG = {
  ON_TRACK: { color: '#52c41a', label: 'On Track' },
  AT_RISK: { color: '#ff4d4f', label: 'At Risk' },
  DELAYED: { color: '#faad14', label: 'Delayed' },
  COMPLETED: { color: '#1890ff', label: 'Completed' },
};

/**
 * custom tooltip untuk donut chart
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const d = payload[0];
    return (
      <div className="bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-100 text-xs">
        <span style={{ color: d.payload.fill }} className="font-semibold">{d.name}</span>
        <span className="text-gray-500 ml-2">{d.value} project ({d.payload.pct}%)</span>
      </div>
    );
  }
  return null;
};

/**
 * donut chart menampilkan distribusi status project
 * berjalan (hijau), kritis (merah), tertunda (kuning)
 * dengan angka total di tengah dan legend di bawah
 * klik segmen untuk melihat daftar project terdampak
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan donut chart
 */
const StatusDonut = ({ data = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const chartData = useMemo(() => {
    const counts = { ON_TRACK: 0, AT_RISK: 0, DELAYED: 0, COMPLETED: 0 };
    data.forEach((p) => { if (counts[p.status] !== undefined) counts[p.status]++; });
    const total = data.length || 1;
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / total) * 100),
      }));
  }, [data]);

  const total = data.length;

  // filter project berdasarkan status yang diklik
  const filteredProjects = useMemo(() => {
    if (!selectedStatus) return [];
    return data.filter((p) => p.status === selectedStatus);
  }, [data, selectedStatus]);

  // handler klik pada segmen pie
  const handlePieClick = (entry) => {
    setSelectedStatus(entry.name);
    setModalOpen(true);
  };

  return (
    <Card
      title="Ringkasan Status"
      bordered={false}
      className="h-full rounded-lg [&>.ant-card-head]:!px-5 [&>.ant-card-head]:!border-b-0 [&>.ant-card-head-title]:!text-[13px] [&>.ant-card-head-title]:!font-semibold [&>.ant-card-body]:!px-5 [&>.ant-card-body]:!pb-4 [&>.ant-card-body]:!pt-0"
    >
      {chartData.length === 0 ? (
        <Empty description="Tidak ada data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <div className="relative w-full h-[180px]">
            {/* center text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <p className="text-2xl font-bold text-gray-800 m-0 leading-none">{total}</p>
              <p className="text-[10px] text-gray-400 m-0">Total</p>
            </div>

            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  onClick={handlePieClick}
                  className="cursor-pointer"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_CONFIG[entry.name]?.color || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* legend – klikable */}
          <div className="flex justify-center gap-5 mt-1">
            {chartData.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => handlePieClick(d)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: STATUS_CONFIG[d.name]?.color }}
                />
                <span className="text-[11px] text-gray-600">{d.name}</span>
                <span className="text-[11px] font-bold text-gray-800">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* modal daftar project */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: STATUS_CONFIG[selectedStatus]?.color }}
            />
            <span>Proyek Status: <b>{selectedStatus}</b></span>
            <Tag color={STATUS_CONFIG[selectedStatus]?.color} className="ml-1">
              {filteredProjects.length} project
            </Tag>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={680}
      >
        <div className="flex flex-col gap-2 mt-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => { setSelectedProject(p); setDrawerOpen(true); }}
            >
              {/* id badge */}
              <span className="text-[10px] font-mono font-bold text-gray-400 shrink-0 w-[70px]">
                {p.id}
              </span>

              {/* info utama */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 m-0 truncate">{p.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <Tag color={STATUS_CONFIG[p.status]?.color} className="text-[9px] m-0 leading-none px-1.5 py-0 rounded border-none">
                      {STATUS_CONFIG[p.status]?.label}
                   </Tag>
                   <span className="text-[10px] text-gray-400">{p.category} · {p.location}</span>
                </div>
              </div>

              {/* progress */}
              <div className="shrink-0 w-[100px]">
                <Progress
                  percent={p.progress}
                  size="small"
                  strokeColor={p.progress >= p.target ? '#52c41a' : '#faad14'}
                  className="m-0"
                />
              </div>

              {/* budget */}
              <div className="text-right shrink-0 w-[60px]">
                <p className="text-xs font-bold m-0" style={{ color: p.budgetUsed >= 90 ? '#ff4d4f' : '#555' }}>
                  {p.budgetUsed ? p.budgetUsed.toLocaleString() : 0}%
                </p>
                <p className="text-[9px] text-gray-400 m-0">budget</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* sidebar detail project */}
      <ProjectDetailDrawer
        project={selectedProject}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Card>
  );
};

export default StatusDonut;
