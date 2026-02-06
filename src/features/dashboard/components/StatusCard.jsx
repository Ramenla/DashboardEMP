import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Kritis', value: 8 },
  { name: 'Tertunda', value: 8 },
  { name: 'Berjalan', value: 8 },
];

// Merah, Kuning, Hijau
const COLORS = ['#ff4d4f', '#ffec3d', '#52c41a'];

const StatusCard = () => {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card title="Status Project" bordered={false} style={{ height: '100%', borderRadius: 8 }}>
      <div style={{ position: 'relative', width: '100%', height: 200 }}>
        <div style={{ 
            position: 'absolute', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', textAlign: 'center' 
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{total}</h2>
        </div>

        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none"/>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

       {/* Legend Custom */}
       <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 10 }}>
        {data.map((item, index) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS[index] }}></span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                <span style={{ color: '#999', fontSize: 10 }}>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatusCard;