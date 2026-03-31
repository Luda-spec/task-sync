'use client';

import { Title } from '@/components/ui';
import { StatCard } from './StatCard';

interface Stats {
  total: number;
  completedToday: number;
  today: number;
  week: number;
}

export const HomeStatistics = ({ stats }: { stats: Stats }) => {
  return (
    <div className="mb-6">
      <Title text="Статистика" size="md" className="mb-4 font-semibold" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Всего на сегодня" 
          value={stats.total} 
        />

        <StatCard
          title="Выполнено сегодня"
          value={stats.completedToday}
          primary
        />

        <StatCard
          title="Осталось на сегодня"
          value={stats.today}
          primary
        />

        <StatCard 
          title="Осталось на неделю" 
          value={stats.week} 
        />
      </div>
    </div>
  );
};