/**
 * @file BudgetMonitoring.jsx
 * @description Komponen ComposedChart Recharts untuk memantau pengeluaran anggaran
 * bulanan vs rencana anggaran dalam tahun berjalan (default 2026).
 * Kombinasi Bar (Pengeluaran Aktual) dan Line (Rencana).
 */

import React, { useMemo } from 'react';
import { Card, Empty } from 'antd';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

/** @constant {Array<string>} Daftar bulan label X-Axis. */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Custom Tooltip untuk ComposedChart.
 * @param {Object} props
 * @returns {JSX.Element|null}
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg px-3 py-2.5 border border-gray-100 text-xs leading-relaxed">
        <p className="font-bold text-gray-800 m-0 mb-1">{label} 2026</p>
        {payload.map((p, i) => (
          <p key={i} className="m-0" style={{ color: p.color }}>
            {p.name}: <b>{p.value} M</b>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * @param {Object} props
 * @param {Array<Object>} [props.data=[]] - Dataset data proyek hasil filter
 * @returns {JSX.Element} Card berisikan ComposedChart
 */
const BudgetMonitoring = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const months = MONTHS.map((name) => ({ name, plan: 0, actual: 0 }));

    data.forEach((p) => {
      const startDate = p.startDate ? new Date(p.startDate) : null;
      const endDate = p.endDate ? new Date(p.endDate) : null;

      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;
      if (startDate.getFullYear() > 2026 || endDate.getFullYear() < 2026) return;

      const startMonthIndex = startDate.getFullYear() < 2026 ? 0 : startDate.getMonth();
      const endMonthIndex = endDate.getFullYear() > 2026 ? 11 : endDate.getMonth();

      const durationInYear = endMonthIndex - startMonthIndex + 1;
      const totalDurationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

      const totalBudget = parseFloat(p.totalBudget) || 0;
      
      const actualCost = p.budgetUsed;

      const monthlyPlan = totalBudget / Math.max(totalDurationMonths, 1);
      const monthlyActual = (parseFloat(actualCost) || 0) / Math.max(durationInYear, 1);

      for (let i = startMonthIndex; i <= endMonthIndex; i++) {
        months[i].plan += monthlyPlan;
        months[i].actual += monthlyActual;
      }
    });

    const displayData = months.map(m => ({
      ...m,
      plan: m.plan / 1000000000,
      actual: m.actual / 1000000000
    }));

    return displayData;
  }, [data]);

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(d => Math.max(d.plan, d.actual)));
  }, [chartData]);

  const unitLabel = maxValue >= 1000 ? 'Triliun (Rp)' : 'Miliar (Rp)';

  return (
    <Card
      title="Pemantauan Anggaran"
      bordered={false}
      className="h-full rounded-lg [&>.ant-card-head]:!px-5 [&>.ant-card-head]:!border-b-0 [&>.ant-card-head-title]:!text-[13px] [&>.ant-card-head-title]:!font-semibold [&>.ant-card-body]:!px-2 [&>.ant-card-body]:!pb-3 [&>.ant-card-body]:!pt-0"
    >
      {data.length === 0 ? (
        <Empty description="Tidak ada data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="w-full h-[340px]">
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: '#888' }}
                dy={5}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: '#888' }}
                tickFormatter={(val) => {
                  if (val >= 1000) return `${(val / 1000).toFixed(1)}T`;
                  return `${val}M`;
                }}
                width={35}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(val) => {
                  if (val >= 1000) return [`Rp ${(val / 1000).toFixed(2)} Triliun`, undefined];
                  return [`Rp ${val.toFixed(2)} Miliar`, undefined];
                }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />

              <Bar
                dataKey="actual"
                name="Pengeluaran (Actual)"
                fill="#1890ff"
                radius={[4, 4, 0, 0]}
                barSize={20}
                fillOpacity={0.9}
              />
              <Line
                type="monotone"
                dataKey="plan"
                name="Rencana (Plan)"
                stroke="#ff4d4f"
                strokeWidth={2.5}
                dot={{ r: 0 }}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="text-[10px] text-gray-400 text-center mt-[3px]">{unitLabel}</div>
        </div>
      )}
    </Card>
  );
};

export default BudgetMonitoring;
