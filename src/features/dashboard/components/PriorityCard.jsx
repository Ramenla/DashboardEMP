import React from 'react';
import { Card } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const PriorityCard = ({ data }) => {
  // 1. Definisikan Warna untuk Setiap Kategori
  // Urutan data biasanya: Rendah, Sedang, Tinggi (sesuai logic di Dashboard)
  const COLORS = {
    'Rendah': '#d9d9d9', // Abu-abu
    'Sedang': '#faad14', // Kuning (Antd Warning)
    'Tinggi': '#ff4d4f', // Merah (Antd Error)
  };

  // 2. Fallback Data (Jika props data belum masuk/error)
  const chartData = data || [
    { name: 'Rendah', value: 0 },
    { name: 'Sedang', value: 0 },
    { name: 'Tinggi', value: 0 },
  ];

  // 3. Hitung Total untuk Angka di Tengah
  const total = chartData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Card title="Prioritas Project" bordered={false} style={{ height: '100%', borderRadius: 8 }}>
      <div style={{ position: 'relative', width: '100%', height: 200 }}>
        
        {/* Angka Total di Tengah */}
        <div style={{ 
            position: 'absolute', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', textAlign: 'center',
            zIndex: 10
        }}>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
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

      {/* Custom Legend di Bawah */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
        {chartData.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ 
                width: 10, height: 10, borderRadius: '50%', 
                backgroundColor: COLORS[item.name] || '#ccc' 
            }}></span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontWeight: 'bold', fontSize: 14 }}>{item.value}</span>
                <span style={{ color: '#8c8c8c', fontSize: 11 }}>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PriorityCard;