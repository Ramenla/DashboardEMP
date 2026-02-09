import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatusCard = ({ data }) => {
  // 1. Definisikan Warna
  const COLORS = {
    'Berjalan': '#52c41a',
    'Tertunda': '#faad14',
    'Kritis': '#ff4d4f',
  };

  // 2. Fallback Data
  const chartData = data || [
    { name: 'Kritis', value: 0 },
    { name: 'Tertunda', value: 0 },
    { name: 'Berjalan', value: 0 },
  ];

  // 3. Hitung Total
  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card title="Status Project" bordered={false} className="h-full rounded-lg">
      <div className="relative w-full h-[200px]">
        
        {/* Angka Total di Tengah */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <h2 className="m-0 text-[28px] font-bold text-gray-700">
            {total}
          </h2>
        </div>

        {/* Grafik */}
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

       {/* Custom Legend */}
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

export default StatusCard;