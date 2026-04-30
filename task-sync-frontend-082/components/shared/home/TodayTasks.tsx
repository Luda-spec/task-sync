'use client';

import { Title } from '@/components/ui';
import { TaskItem } from '@/components/shared/task';
import { Task } from '@/api/tasks.api';

type PriorityRU = 'Легко' | 'Средне' | 'Сложно';

const mapPriorityFromApi = (
  priority: 'low' | 'medium' | 'high'
): PriorityRU => {
  switch (priority) {
    case 'high':
      return 'Сложно';
    case 'medium':
      return 'Средне';
    case 'low':
      return 'Легко';
  }
};

interface Props {
  tasks: Task[];
  onToggleComplete: (taskId: string, currentStatus: boolean) => void;
  onTaskClick: (task: Task) => void;
}

export const TodayTasks = ({ tasks, onToggleComplete, onTaskClick }: Props) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center gap-2">
        <Title
          text="Задачи на сегодня"
          size="md"
          className="font-semibold"
        />

        <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent2 text-xs text-primary">
          {tasks.filter(t => !t.isCompleted).length}
        </span>
      </div>

      <div className="space-y-4 max-w-3xl">
        {sortedTasks.map(task => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="cursor-pointer"
          >
            <TaskItem
              title={task.name}
              timeFrom={task.timeFrom}
              timeTo={task.timeTo}
              priority={mapPriorityFromApi(task.priority)}
              checked={task.isCompleted}
              scheduledAt={task.scheduledAt} 
              onCheckedChange={() => onToggleComplete(task.id, task.isCompleted)}
            />
          </div>
        ))}
      </div>

      {sortedTasks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-sm">
            На сегодня задач нет 🎉
          </p>
        </div>
      )}
    </div>
  );
};