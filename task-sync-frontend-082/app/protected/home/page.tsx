'use client';

import { HomeHeader } from '@/components/shared/home/HomeHeader';
import { HomeStatistics } from '@/components/shared/home/HomeStatistics';
import { TodayTasks } from '@/components/shared/home/TodayTasks';
import { EditTaskModal } from '@/components/shared/tasks/EditTaskModal';
import { useHome } from '@/hooks/useHome';

export default function HomePage() {
  const {
    user,
    todayTasks,
    stats,
    loading,
    editingTask,
    handleToggleComplete,
    handleTaskClick,
    handleTaskUpdated,
    setEditingTask,
  } = useHome();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Не удалось загрузить данные пользователя
      </div>
    );

  return (
    <>
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 xl:px-12 py-6 pb-24 lg:pt-24">
        <div className="max-w-7xl mx-auto">
          <HomeHeader user={user} />

          <HomeStatistics stats={stats} />

          <div className="max-w-3xl mx-auto">
            <TodayTasks 
              tasks={todayTasks} 
              onToggleComplete={handleToggleComplete}
              onTaskClick={handleTaskClick}
            />
          </div>
        </div>
      </div>

      <EditTaskModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskUpdated}
        task={editingTask}
      />
    </>
  );
}