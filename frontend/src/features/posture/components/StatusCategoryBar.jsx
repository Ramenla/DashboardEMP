import React, { useState, useMemo } from 'react';
import { Card, Empty, Segmented, Modal, Tag, Progress } from 'antd';
import ProjectDetailDrawer from '../../../components/ui/ProjectDetailDrawer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

/**
 * warna per status
 */
const STATUS_COLORS = {
  Berjalan: '#52c41a',
  Beresiko: '#ff4d4f',
  Tertunda: '#faad14',
  Selesai: '#1890ff',
};

/**
 * warna per prioritas
 */
const PRIORITY_COLORS = {
  Tinggi: '#ff4d4f',
  Sedang: '#faad14',
  Rendah: '#bfbfbf',
};

/**
 * stacked horizontal bar chart dengan toggle status / prioritas
 * klik bar segment untuk melihat daftar project terdampak
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan stacked bar chart + toggle
 */
const StatusCategoryBar = ({ data = [] }) => {
  const [mode, setMode] = useState('Status');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({ category: null, key: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const chartData = useMemo(() => {
    const map = {};
    data.forEach((p) => {
      if (!map[p.category]) {
        map[p.category] = {
          name: p.category,
          // status
          Berjalan: 0, Beresiko: 0, Tertunda: 0, Selesai: 0,
          // prioritas
          Tinggi: 0, Sedang: 0, Rendah: 0,
          total: 0,
        };
      }
      if (map[p.category][p.status] !== undefined) map[p.category][p.status]++;
      if (map[p.category][p.priority] !== undefined) map[p.category][p.priority]++;
      map[p.category].total++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [data]);

  const isStatus = mode === 'Status';
  const colors = isStatus ? STATUS_COLORS : PRIORITY_COLORS;
  const keys = isStatus ? ['Berjalan', 'Beresiko', 'Tertunda', 'Selesai'] : ['Tinggi', 'Sedang', 'Rendah'];

  // filter project berdasarkan kategori + status/prioritas yang diklik
  const filteredProjects = useMemo(() => {
    if (!selectedFilter.category || !selectedFilter.key) return [];
    return data.filter((p) => {
      const matchCategory = p.category === selectedFilter.category;
      const matchKey = isStatus
        ? p.status === selectedFilter.key
        : p.priority === selectedFilter.key;
      return matchCategory && matchKey;
    });
  }, [data, selectedFilter, isStatus]);

  // handler klik pada bar segment
  const handleBarClick = (chartEntry, dataKey) => {
    if (chartEntry && dataKey) {
      setSelectedFilter({ category: chartEntry.name, key: dataKey });
      setModalOpen(true);
    }
  };

  const selectedColor = colors[selectedFilter.key] || '#1890ff';

  return (
    <Card
      title="Per Kategori"
      extra={
        <Segmented
          size="small"
          options={['Status', 'Prioritas']}
          value={mode}
          onChange={setMode}
          className="text-[11px]"
        />
      }
      bordered={false}
      className="h-full rounded-lg [&>.ant-card-head]:!px-5 [&>.ant-card-head]:!border-b-0 [&>.ant-card-head-title]:!text-[13px] [&>.ant-card-head-title]:!font-semibold [&>.ant-card-body]:!px-3 [&>.ant-card-body]:!pb-3 [&>.ant-card-body]:!pt-0"
    >
      {chartData.length === 0 ? (
        <Empty description="Tidak ada data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="w-full h-[220px]">
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f5f5f5" />
              <XAxis
                type="number" axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: '#bbb' }} allowDecimals={false}
              />
              <YAxis
                type="category" dataKey="name" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#555', fontWeight: 500 }} width={80}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(value, name) => [`${value} project`, name]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
              {keys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="s"
                  fill={colors[key]}
                  radius={i === keys.length - 1 ? [0, 4, 4, 0] : [0, 0, 0, 0]}
                  barSize={18}
                  className="cursor-pointer"
                  onClick={(entry) => handleBarClick(entry, key)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* modal daftar project */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: selectedColor }}
            />
            <span>
              {selectedFilter.category} — {isStatus ? 'Status' : 'Prioritas'}: <b>{selectedFilter.key}</b>
            </span>
            <Tag color={selectedColor} className="ml-1">
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
          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-400 text-xs py-6">Tidak ada project</div>
          ) : (
            filteredProjects.map((p) => (
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
                    <Tag
                      color={
                        p.status === 'Berjalan' || p.status === 'Selesai' ? 'green' :
                        p.status === 'Beresiko' ? 'red' : 'orange'
                      }
                      className="text-[9px] m-0 leading-none px-1.5 py-0 rounded"
                    >
                      {p.status}
                    </Tag>
                    <Tag
                      className="text-[9px] m-0 leading-none px-1.5 py-0 rounded border-0 bg-gray-200 text-gray-600"
                    >
                      {p.priority}
                    </Tag>
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
                  <p className="text-xs font-bold m-0" style={{ color: (p.budgetUsed / (p.totalBudget || 1) * 100) >= 90 ? '#ff4d4f' : '#555' }}>
                    {Math.round((parseInt(p.budgetUsed) / (parseInt(p.totalBudget) || 1)) * 100)}%
                  </p>
                  <p className="text-[9px] text-gray-400 m-0">budget</p>
                </div>
              </div>
            ))
          )}
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

export default StatusCategoryBar;
