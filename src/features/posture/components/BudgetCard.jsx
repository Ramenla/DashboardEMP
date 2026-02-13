import React, { useMemo } from 'react';
import { Card } from 'antd';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * format angka budget ke format rupiah triliun/miliar
 * @param {number} value - nilai budget dalam rupiah
 * @returns {string} string terformat, contoh: "Rp 1.2 T"
 */
const formatBudget = (value) => {
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toFixed(1)} T`;
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
};

/**
 * komponen card yang menampilkan ringkasan budget: total, terpakai, sisa, dan trend bulanan
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card budget dengan detail lengkap
 */
const BudgetCard = ({ data = [] }) => {
  // hitung summary statis dan trend dari data yang diberikan
  const { total, used, remaining, trendData } = useMemo(() => {
    let totalBudget = 0;
    let totalUsed = 0;

    const planned = Array(12).fill(0);
    const actual = Array(12).fill(0);
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    data.forEach(p => {
      // summary
      totalBudget += p.budgetTotal;
      totalUsed += (p.budgetUsed / 100) * p.budgetTotal;

      // trend (simplifikasi: budget dialokasikan di startMonth)
      // pastikan startMonth valid (0-11)
      if (p.startMonth >= 0 && p.startMonth < 12) {
        planned[p.startMonth] += p.budgetTotal;
        actual[p.startMonth] += (p.budgetUsed / 100) * p.budgetTotal;
      }
    });

    const trend = monthNames.map((name, i) => ({
      name,
      planned: parseFloat((planned[i] / 1_000_000_000).toFixed(1)),
      actual: parseFloat((actual[i] / 1_000_000_000).toFixed(1)),
    }));

    return {
      total: totalBudget,
      used: totalUsed,
      remaining: totalBudget - totalUsed,
      trendData: trend
    };
  }, [data]);

  return (
    <Card title="Budget Overview" bordered={false} className="h-full rounded-lg">
      {/* total budget + terpakai & sisa */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-xs">Total Budget</p>
          <p className="text-2xl font-bold text-blue-600">{formatBudget(total)}</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
            <p className="text-gray-500 text-[10px]">Terpakai</p>
            <p className="text-xs font-semibold text-blue-600">{formatBudget(used)}</p>
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
            <p className="text-gray-500 text-[10px]">Sisa</p>
            <p className="text-xs font-semibold text-green-600">{formatBudget(remaining)}</p>
          </div>
        </div>
      </div>

      {/* combo chart: bar (actual) + line (planned) */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-2">Planned vs Actual Budget (Miliar)</p>
        <div className="w-full h-[180px]">
          <ResponsiveContainer>
            <ComposedChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#999' }}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: '#999' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 12 }}
                formatter={(value, name) => [
                  `${value} Miliar`,
                  name === 'actual' ? 'Actual Cost' : 'Planned Budget'
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 10 }}
                formatter={(value) => value === 'actual' ? 'Actual Cost' : 'Planned Budget'}
              />
              <Bar
                dataKey="actual"
                fill="#fa8c16"
                radius={[3, 3, 0, 0]}
                barSize={18}
              />
              <Line
                type="monotone"
                dataKey="planned"
                stroke="#1890ff"
                strokeWidth={2}
                dot={{ r: 3, fill: '#1890ff' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default BudgetCard;