import React, { useMemo } from 'react';
import { Card, Empty } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * warna dan label per status project
 */
const STATUS_CONFIG = {
  Berjalan: { color: '#52c41a', label: 'Berjalan' },
  Kritis: { color: '#ff4d4f', label: 'Kritis' },
  Tertunda: { color: '#faad14', label: 'Tertunda' },
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
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan donut chart
 */
const StatusDonut = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const counts = { Berjalan: 0, Kritis: 0, Tertunda: 0 };
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
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_CONFIG[entry.name]?.color || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* legend */}
          <div className="flex justify-center gap-5 mt-1">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
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
    </Card>
  );
};

export default StatusDonut;
