'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Title } from '@/components/ui';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { label: string; value: number } }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-secondary">
        <p className="text-xs sm:text-sm font-medium text-primary">{payload[0].value} задач</p>
      </div>
    );
  }
  return null;
};

interface TasksBarChartProps {
  title: string;
  data: { label: string; value: number }[];
}

export const TasksBarChart = ({ title, data }: TasksBarChartProps) => (
  <div className="mb-6 px-0 sm:px-5">
    <Title text={title} size="sm" className="mb-4 font-semibold text-black" />
    <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-secondary">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ left: 0, right: 20, top: 10, bottom: 0 }}>
          <XAxis 
            dataKey="label" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#AB94FF' }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#AB94FF' }}
            allowDecimals={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f3ff' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#5F33E1" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);