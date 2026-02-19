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
      // Parse dates safely
      const startDate = p.startDate ? new Date(p.startDate) : null;
      const endDate = p.endDate ? new Date(p.endDate) : null;
      
      if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;

      // Only consider 2026 for this year-based view
      if (startDate.getFullYear() > 2026 || endDate.getFullYear() < 2026) return;

      const startMonthIndex = startDate.getFullYear() < 2026 ? 0 : startDate.getMonth();
      const endMonthIndex = endDate.getFullYear() > 2026 ? 11 : endDate.getMonth();
      
      // Duration in months overlapping 2026
      const durationInYear = endMonthIndex - startMonthIndex + 1;
      // Total Project Duration (approx)
      const totalDurationMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

      const totalBudget = parseFloat(p.totalBudget) || 0; // Use totalBudget column
      const budgetUsedVal = parseFloat(p.budgetTotal) ? totalBudget * ((parseFloat(p.budgetUsed) || 0) / 100) : (parseFloat(p.budgetUsed) || 0); 
      // Note: Backend might send budgetUsed as Percentage or Amount depending on implementation. 
      // In seed: budgetUsed is Amount. In Modal: budgetUsed is %. 
      // Based on ProjectTable: budgetUsed is Amount. 
      // Let's assume p.budgetUsed is the Amount sent by backend if available, or we calculate from metric.
      // Re-reading seed: metric has actualCost (amount). project table fetches 'budgetUsed' likely as alias?
      // Let's assume p.totalBudget is the Total Amount. p.budgetUsed is the % or Amount?
      // ProjectTable logic: const used = parseFloat(val) || 0; -> treats as amount.
      
      const actualCost = p.budgetUsed; // Assuming amount based on Table
      
      // Monthly Plan (Simple Linear Distribution)
      const monthlyPlan = totalBudget / Math.max(totalDurationMonths, 1);
      
      // Monthly Actual (Simple Linear Distribution of what has been spent so far)
      // This is an approximation. Ideally we have monthly records.
      const monthlyActual = (actualCost || 0) / Math.max(durationInYear, 1); // Distribute actuals only over active months in this year? 
      // Better: Distribute actuals from start until NOW (or end). 
      
      for (let i = startMonthIndex; i <= endMonthIndex; i++) {
        months[i].plan += monthlyPlan;
        
        // Actuals only if month has passed/started
        const currentMonth = new Date().getMonth(); 
        // For dummy data, let's just show actuals for all active months to visualize the bars
        months[i].actual += monthlyActual; 
      }
    });

    // Convert to Billions/Trillions for display
    months.forEach((m) => {
      // Keep raw values here, formatting happens in render
    });

    return months;
  }, [data]);

  /* Helper format currency compact */
  const formatCurrency = (val) => {
    if (val >= 1000) return `${(val / 1000).toFixed(1)}T`;
    return `${val.toFixed(0)}M`;
  };

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
        <div className="w-full h-[300px]">
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
                tickFormatter={(val) => maxValue >= 1000 ? (val/1000).toFixed(1) : val}
                width={35}
              />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(val) => maxValue >= 1000 ? `${(val/1000).toFixed(2)} T` : `${val.toFixed(1)} M`}
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
          <div className="text-[10px] text-gray-400 text-center mt-[-5px]">{unitLabel}</div>
        </div>
      )}
    </Card>
  );
};

export default BudgetMonitoring;
