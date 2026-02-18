import React, { useState, useMemo } from 'react';
import { Card, Empty, Segmented } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

/**
 * warna per status
 */
const STATUS_COLORS = {
  Berjalan: '#52c41a',
  Kritis: '#ff4d4f',
  Tertunda: '#faad14',
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
 * bisa menampilkan distribusi status atau prioritas per kategori
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan stacked bar chart + toggle
 */
const StatusCategoryBar = ({ data = [] }) => {
  const [mode, setMode] = useState('Status');

  const chartData = useMemo(() => {
    const map = {};
    data.forEach((p) => {
      if (!map[p.category]) {
        map[p.category] = {
          name: p.category,
          // status
          Berjalan: 0, Kritis: 0, Tertunda: 0,
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
  const keys = isStatus ? ['Berjalan', 'Kritis', 'Tertunda'] : ['Tinggi', 'Sedang', 'Rendah'];

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
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
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
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default StatusCategoryBar;
