'use client';

interface StatsCardsProps {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export const StatsCards = ({ completedTasks, totalTasks, completionRate }: StatsCardsProps) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 px-0 sm:px-5">
    <div className="bg-linear-to-br from-primary to-accent2 rounded-2xl p-3 sm:p-4 text-white">
      <div className="text-xs sm:text-sm opacity-90 mb-1">Выполнено</div>
      <div className="text-2xl sm:text-3xl font-bold">{completedTasks}</div>
      <div className="text-[10px] sm:text-xs opacity-75 mt-1">из {totalTasks} задач</div>
    </div>

    <div className="bg-linear-to-br from-secondary to-muted rounded-2xl p-3 sm:p-4 text-primary">
      <div className="text-xs sm:text-sm opacity-90 mb-1">Успешность</div>
      <div className="text-2xl sm:text-3xl font-bold">{completionRate}%</div>
      <div className="text-[10px] sm:text-xs opacity-75 mt-1">выполнено</div>
    </div>
  </div>
);