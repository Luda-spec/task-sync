'use client';

import { Stats } from '@/hooks/useAdmin';

interface StatsCardsProps {
  stats: Stats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Всего пользователей</p>
        <p className="text-3xl font-bold">{stats.users.total}</p>
        <p className="text-xs text-gray-400 mt-2">
          {stats.users.activeToday} активных сегодня
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Задачи</p>
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold">{stats.tasks.completed}</p>
          <p className="text-gray-400 font-medium text-sm">из {stats.tasks.total}</p>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Прогресс: {stats.tasks.completionRate}%
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Pomodoro Сессий</p>
        <p className="text-3xl font-bold">{stats.pomodoro.totalSessions}</p>
        <p className="text-xs text-gray-400 mt-2">
          Завершено раундов: {stats.pomodoro.completedRounds}
        </p>
      </div>
    </div>
  );
};