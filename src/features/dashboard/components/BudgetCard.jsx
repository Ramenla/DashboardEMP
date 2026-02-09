import React from 'react';
import { Card } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'JAN', value: 1500 },
  { name: 'FEB', value: 2500 },
  { name: 'MAR', value: 2000 },
  { name: 'APR', value: 3000 },
  { name: 'MAY', value: 4500 },
  { name: 'JUN', value: 3200 },
  { name: 'JUL', value: 3800 },
  { name: 'AUG', value: 3500 },
  { name: 'SEP', value: 4200 },
  { name: 'OCT', value: 3800 },
  { name: 'NOV', value: 3000 },
  { name: 'DEC', value: 4800 },
];

const BudgetCard = () => {
  return (
    <Card title="Budget" bordered={false} className="h-full rounded-lg">
      <div className="w-full h-[260px]">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#999'}} 
              interval={0}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#999'}} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1890ff" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BudgetCard;