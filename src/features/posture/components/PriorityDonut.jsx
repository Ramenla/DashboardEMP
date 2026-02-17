import React, { useMemo } from 'react';
import { Card, Empty } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PRIORITY_CONFIG = {
  Tinggi: { color: '#ff4d4f', label: 'Tinggi' },
  Sedang: { color: '#faad14', label: 'Sedang' },
  Rendah: { color: '#bfbfbf', label: 'Rendah' },
};

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
 * donut chart menampilkan distribusi prioritas project
 * tinggi (merah), sedang (kuning), rendah (hijau)
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan donut chart prioritas
 */
const PriorityDonut = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const counts = { Tinggi: 0, Sedang: 0, Rendah: 0 };
    data.forEach((p) => { if (counts[p.priority] !== undefined) counts[p.priority]++; });
    const total = data.length || 1;
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        pct: Math.round((value / total) * 100),
      }));
  }, [data]);

  const highCount = chartData.find(d => d.name === 'Tinggi')?.value || 0;

  return (
    <Card
      title="Prioritas Project"
      bordered={false}
      className="h-full rounded-lg [&>.ant-card-head]:!px-5 [&>.ant-card-head]:!border-b-0 [&>.ant-card-head-title]:!text-[13px] [&>.ant-card-head-title]:!font-semibold [&>.ant-card-body]:!px-5 [&>.ant-card-body]:!pb-4 [&>.ant-card-body]:!pt-0"
    >
      {chartData.length === 0 ? (
        <Empty description="Tidak ada data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <>
          <div className="relative w-full h-[180px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <p className="text-2xl font-bold m-0 leading-none" style={{ color: highCount > 0 ? '#ff4d4f' : '#52c41a' }}>
                {highCount}
              </p>
              <p className="text-[10px] text-gray-400 m-0">Tinggi</p>
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
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={PRIORITY_CONFIG[entry.name]?.color || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-5 mt-1">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: PRIORITY_CONFIG[d.name]?.color }}
                />
                <span className="text-[11px] text-gray-600">{d.name}</span>
                <span className="text-[11px] font-bold text-gray-800">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default PriorityDonut;
