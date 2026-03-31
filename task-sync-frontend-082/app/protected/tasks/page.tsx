'use client';

import { useRouter } from 'next/navigation';
import { CreateTaskModal } from '@/components/shared/tasks/CreateTaskModal';
import { TasksHeader } from '@/components/shared/tasks/TasksHeader';
import { TaskFilters } from '@/components/shared/tasks/TaskFilters';
import { TaskList } from '@/components/shared/tasks/TaskList';
import { TaskCalendar } from '@/components/shared/tasks/TaskCalendar';
import { EditTaskModal } from '@/components/shared/tasks/EditTaskModal';
import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const router = useRouter();
  
  const {
    filteredTasks,
    filter,
    selectedDate,
    isCalendarOpen,
    isCreateTaskOpen,
    editingTask,
    isLoading,
    setFilter,
    setSelectedDate,
    setIsCalendarOpen,
    setIsCreateTaskOpen,
    setEditingTask,
    handleToggleComplete,
    handleTaskClick,
    handleTaskUpdated,
  } = useTasks();

  if (isLoading && filteredTasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-2 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-28">
      <div className="max-w-5xl mx-auto w-full">
        <TasksHeader
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          router={router}
        />

        <TaskFilters filter={filter} setFilter={setFilter} />

        <TaskList 
          tasks={filteredTasks} 
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onTaskClick={handleTaskClick}
        />
      </div>

      <CreateTaskModal
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreated={handleTaskUpdated}
        selectedDate={selectedDate}
      />

      <EditTaskModal
        open={!!editingTask}
        onClose={() => setEditingTask(null)}
        onUpdated={handleTaskUpdated}
        onDeleted={handleTaskUpdated}
        task={editingTask}
      />

      <TaskCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </div>
  );
}