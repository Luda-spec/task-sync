'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TasksAPI, TaskPriority, Task as ApiTask } from '@/api/tasks.api';

export type PriorityFilter = 'Все' | 'Сложно' | 'Средне' | 'Легко';

export interface UITask {
  id: string;
  title: string;
  timeFrom?: string;
  timeTo?: string;
  priority: 'Сложно' | 'Средне' | 'Легко';
  isCompleted: boolean;
  description?: string;
}

const mapPriorityFromApi = (priority: TaskPriority): UITask['priority'] => {
  switch (priority) {
    case 'high': return 'Сложно';
    case 'medium': return 'Средне';
    case 'low': return 'Легко';
  }
};

export interface UseTasksReturn {
  tasks: UITask[];
  filteredTasks: UITask[];
  filter: PriorityFilter;
  selectedDate: Date;
  isCalendarOpen: boolean;
  isCreateTaskOpen: boolean;
  editingTask: ApiTask | null;
  isLoading: boolean;
  setFilter: (filter: PriorityFilter) => void;
  setSelectedDate: (date: Date) => void;
  setIsCalendarOpen: (open: boolean) => void;
  setIsCreateTaskOpen: (open: boolean) => void;
  setEditingTask: (task: ApiTask | null) => void;
  handleToggleComplete: (taskId: string, currentStatus: boolean) => Promise<void>;
  handleTaskClick: (task: UITask) => Promise<void>;
  handleTaskUpdated: () => Promise<void>;
  loadTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const [filter, setFilter] = useState<PriorityFilter>('Все');
  const [selectedDate, setSelectedDateState] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ApiTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const { data } = await TasksAPI.getAll(selectedDate);
      
      const sorted = data.sort((a, b) => {
        if (a.isCompleted === b.isCompleted) return 0;
        return a.isCompleted ? 1 : -1;
      });

      setTasks(
        sorted.map((t: ApiTask) => ({
          id: t.id,
          title: t.name,
          timeFrom: t.timeFrom,
          timeTo: t.timeTo,
          priority: mapPriorityFromApi(t.priority),
          isCompleted: t.isCompleted,
          description: t.description,
        }))
      );
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Ошибка загрузки задач:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const openModal = () => setIsCreateTaskOpen(true);
    window.addEventListener('open-create-task', openModal);
    return () => window.removeEventListener('open-create-task', openModal);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      await TasksAPI.toggleComplete(taskId, !currentStatus);
      await loadTasks();
    } catch (e) {
      console.error('Ошибка обновления статуса', e);
    }
  };

  const handleTaskClick = async (task: UITask) => {
    try {
      const { data } = await TasksAPI.getById(task.id);
      setEditingTask(data);
    } catch (e) {
      console.error('Ошибка загрузки задачи', e);
    }
  };

  const handleTaskUpdated = async () => {
    setEditingTask(null);
    await loadTasks();
  };

  const filteredTasks = useMemo(
    () => (filter === 'Все' ? tasks : tasks.filter(t => t.priority === filter)),
    [tasks, filter]
  );

  const setSelectedDate = (date: Date) => {
    setSelectedDateState(date);
  };

  return {
    tasks,
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
    loadTasks,
  };
};