import React, { useMemo } from 'react';
import { Card, Empty } from 'antd';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * custom tooltip
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
 * budget monitoring bulanan (jan-des)
 * - bar: pengeluaran actual (miliar)
 * - line: rencana budget / limit (miliar)
 * jika bar > line, indikasi overbudget pada bulan tersebut
 * @param {Array} data - array project data yang sudah difilter
 * @returns {JSX.Element} card dengan combo chart
 */
const BudgetMonitoring = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const months = MONTHS.map((name) => ({ name, plan: 0, actual: 0 }));

    data.forEach((p) => {
      const start = p.startMonth ?? 0;
      const dur = p.duration ?? 1;
      
      const totalBudget = p.budgetTotal || 0;
      const budgetUsedVal = totalBudget * ((p.budgetUsed || 0) / 100);

      // Asumsi distribusi rata
      const monthlyPlan = totalBudget / dur;
      const monthlyActual = budgetUsedVal / dur;

      for (let i = 0; i < dur && (start + i) < 12; i++) {
        months[start + i].plan += monthlyPlan;
        months[start + i].actual += monthlyActual;
      }
    });

    // konversi ke miliar
    months.forEach((m) => {
      m.plan = parseFloat((m.plan / 1e9).toFixed(1));
      m.actual = parseFloat((m.actual / 1e9).toFixed(1));
    });

    return months;
  }, [data]);

  return (
    <Card
      title="Pemantauan Anggaran"
      bordered={false}
      className="h-full rounded-lg [&>.ant-card-head]:!px-5 [&>.ant-card-head]:!border-b-0 [&>.ant-card-head-title]:!text-[13px] [&>.ant-card-head-title]:!font-semibold [&>.ant-card-body]:!px-2 [&>.ant-card-body]:!pb-3 [&>.ant-card-body]:!pt-0"
    >
      {data.length === 0 ? (
        <Empty description="Tidak ada data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div className="w-full h-[300px]">
          <ResponsiveContainer>
            <ComposedChart data={chartData} margin={{ top: 5, right: 15, bottom: 5, left: -5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#555', fontWeight: 500 }}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fill: '#bbb' }}
                label={{ value: 'Miliar (Rp)', angle: -90, position: 'insideLeft', offset: 15, style: { fontSize: 10, fill: '#999' } }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />

              {/* bar: actual spending */}
              <Bar
                dataKey="actual"
                name="Pengeluaran (Actual)"
                fill="#1890ff"
                radius={[3, 3, 0, 0]}
                barSize={18}
              />

              {/* line: planned budget */}
              <Line
                type="basis"
                dataKey="plan"
                name="Rencana (Plan)"
                stroke="#ff4d4f"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default BudgetMonitoring;
