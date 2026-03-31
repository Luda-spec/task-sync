'use client';

import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { Title } from '@/components/ui';

interface PriorityData {
  name: string;
  value: number;
  color: string;
}

const RenderCustomizedLabel = ({ total }: { total: number }) => (
  <g>
    <text
      x="50%"
      y="42%"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#5F33E1"
      style={{ 
        fontSize: '28px', 
        fontWeight: 'bold',
      }}
    >
      {total}
    </text>
  </g>
);

interface PriorityPieChartProps {
  byPriority: { high: number; medium: number; low: number };
}

export const PriorityPieChart = ({ byPriority }: PriorityPieChartProps) => {
  const priorityData: PriorityData[] = [
    { name: 'Сложно', value: byPriority.high, color: '#5F33E1' },
    { name: 'Средне', value: byPriority.medium, color: '#AB94FF' },
    { name: 'Легко', value: byPriority.low, color: '#EEE9FF' },
  ].filter(item => item.value > 0);

  const total = priorityData.reduce((sum, item) => sum + item.value, 0);

  if (priorityData.length === 0) {
    return (
      <div className="mb-6 px-0 sm:px-5">
        <Title text="По приоритету" size="sm" className="mb-4 font-semibold text-black" />
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-secondary">
          <div className="h-40 sm:h-48 flex items-center justify-center text-muted-foreground text-sm">
            Нет данных за выбранный период
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 px-0 sm:px-5">
      <Title text="По приоритету" size="sm" className="mb-4 font-semibold text-black" />
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-secondary flex flex-col items-center">
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={false}
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RenderCustomizedLabel total={total} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => {
                const item = priorityData.find(d => d.name === value);
                return (
                  <span className="text-xs text-secondary-foreground">
                    {value}: {item?.value}
                  </span>
                );
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};