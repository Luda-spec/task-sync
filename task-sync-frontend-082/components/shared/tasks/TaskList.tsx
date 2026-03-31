'use client';

import { TaskItem } from '@/components/shared/task';

interface UITask {
  id: string;
  title: string;
  timeFrom?: string;  
  timeTo?: string;    
  priority: 'Сложно' | 'Средне' | 'Легко';
  isCompleted: boolean;
}

type Props = {
  tasks: UITask[];
  isLoading: boolean;
  onToggleComplete: (id: string, currentStatus: boolean) => void;  
  onTaskClick: (task: UITask) => void;  
};

export const TaskList = ({ 
  tasks, 
  isLoading, 
  onToggleComplete,    
  onTaskClick         
}: Props) => {
  return (
    <div className="space-y-3 sm:space-y-4 px-0 sm:px-5">
      {isLoading && <p className="text-center text-muted-foreground py-4">Загрузка…</p>}
      
      {!isLoading && tasks.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          Нет задач. Создайте первую! 🎉
        </p>
      )}
      
      {!isLoading && tasks.map(task => (
        <TaskItem
          key={task.id}
          title={task.title}
          timeFrom={task.timeFrom}   
          timeTo={task.timeTo}      
          priority={task.priority}
          checked={task.isCompleted}
          onCheckedChange={() => onToggleComplete(task.id, task.isCompleted)}  
          onClick={() => onTaskClick(task)}  
        />
      ))}
    </div>
  );
};