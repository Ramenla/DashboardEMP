import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/**
 * komponen card untuk menampilkan distribusi priority project dalam donut chart
 * @param {Object} props - props komponen
 * @param {Array} props.data - array dengan count untuk tiap level priority (Rendah, Sedang, Tinggi)
 * @returns {JSX.Element} card dengan donut chart dan legend distribusi priority
 */
const PriorityCard = ({ data }) => {
  // mapping warna untuk setiap level priority
  const COLORS = {
    'Rendah': '#d9d9d9',
    'Sedang': '#faad14',
    'Tinggi': '#ff4d4f',
  };

  // data default jika tidak ada data yang diberikan
  const chartData = data || [
    { name: 'Rendah', value: 0 },
    { name: 'Sedang', value: 0 },
    { name: 'Tinggi', value: 0 },
  ];

  // hitung total
  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card title="Prioritas Project" bordered={false} className="h-full rounded-lg">
      <div className="relative w-full h-[200px]">
        
        {/* angka total di tengah */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <h2 className="m-0 text-[28px] font-bold text-gray-700">
            {total}
          </h2>
        </div>

        {/* grafik */}
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ccc'} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* custom legend di bawah */}
      <div className="flex justify-center gap-4 mt-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[item.name] || '#ccc' }}
            />
            <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm">{item.value}</span>
                <span className="text-gray-400 text-[11px]">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PriorityCard;