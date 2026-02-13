import React, { useMemo } from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

/**
 * komponen card untuk menampilkan distribusi status project dalam horizontal bar chart
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan horizontal bar chart distribusi status
 */
const StatusCard = ({ data = [] }) => {
  // mapping warna untuk setiap status
  const COLORS = {
    'Berjalan': '#52c41a',
    'Tertunda': '#faad14',
    'Kritis': '#ff4d4f',
  };

  const chartData = useMemo(() => {
    const counts = {
      'Kritis': 0,
      'Tertunda': 0,
      'Berjalan': 0
    };

    data.forEach(p => {
      if (counts[p.status] !== undefined) {
        counts[p.status]++;
      }
    });

    return [
      { name: 'Kritis', value: counts['Kritis'] },
      { name: 'Tertunda', value: counts['Tertunda'] },
      { name: 'Berjalan', value: counts['Berjalan'] },
    ];
  }, [data]);

  // hitung total
  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card title="Status Project" bordered={false} className="h-full rounded-lg">
      {/* total project */}
      <div className="mb-3">
        <span className="text-gray-400 text-xs">Total Project: </span>
        <span className="font-bold text-gray-700 text-sm">{total}</span>
      </div>

      {/* horizontal bar chart */}
      <div className="w-full h-[200px]">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
          >
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#999' }}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#555', fontWeight: 500 }}
              width={70}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 12 }}
              formatter={(value, name) => [`${value} Project`, 'Jumlah']}
            />
            <Bar
              dataKey="value"
              radius={[0, 6, 6, 0]}
              barSize={24}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                style={{ fontSize: 12, fontWeight: 600, fill: '#555' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StatusCard;