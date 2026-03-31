'use client';

import { useEffect, useState } from 'react';
import { HomeAPI, UserProfile } from '@/api/home.api';
import { Task } from '@/api/tasks.api';
import { TasksAPI } from '@/api/tasks.api';
import { toast } from 'sonner';

const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getWeekEnd = (date: Date) => {
  const weekStart = getWeekStart(date);
  const d = new Date(weekStart);
  return new Date(d.setDate(d.getDate() + 6));
};

const calculateStats = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);
  weekStart.setHours(0, 0, 0, 0);
  weekEnd.setHours(23, 59, 59, 999);

  const total = tasks.filter(task => {
    if (!task.scheduledAt) return false;
    const taskDate = new Date(task.scheduledAt);
    return taskDate >= today && taskDate < tomorrow;
  }).length;

  const completedToday = tasks.filter(task => {
    if (!task.scheduledAt || !task.isCompleted) return false;
    const taskDate = new Date(task.scheduledAt);
    return taskDate >= today && taskDate < tomorrow;
  }).length;

  const todayCount = tasks.filter(task => {
    if (!task.scheduledAt || task.isCompleted) return false;
    const taskDate = new Date(task.scheduledAt);
    return taskDate >= today && taskDate < tomorrow;
  }).length;

  const weekCount = tasks.filter(task => {
    if (!task.scheduledAt || task.isCompleted) return false;
    const taskDate = new Date(task.scheduledAt);
    return taskDate >= weekStart && taskDate <= weekEnd;
  }).length;

  return {
    total,
    completedToday,
    today: todayCount,
    week: weekCount,
  };
};

const getTodayTasks = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks.filter(task => {
    if (!task.scheduledAt) return false;
    const taskDate = new Date(task.scheduledAt);
    return taskDate >= today && taskDate < tomorrow;
  });
};

export interface HomeStats {
  total: number;
  completedToday: number;
  today: number;
  week: number;
}

export interface UseHomeReturn {
  user: UserProfile | null;
  allTasks: Task[];
  todayTasks: Task[];
  stats: HomeStats;
  loading: boolean;
  editingTask: Task | null;
  handleToggleComplete: (taskId: string, currentStatus: boolean) => Promise<void>;
  handleTaskClick: (task: Task) => void;
  handleTaskUpdated: () => Promise<void>;
  setEditingTask: (task: Task | null) => void;
}

export const useHome = (): UseHomeReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<HomeStats>({ total: 0, completedToday: 0, today: 0, week: 0 });

  const loadData = async () => {
    try {
      const [profileRes, tasksRes] = await Promise.all([
        HomeAPI.getProfile(),
        HomeAPI.getAllTasks(),
      ]);

      setUser(profileRes.data.user);
      setAllTasks(tasksRes.data);
      setStats(calculateStats(tasksRes.data));
      setTodayTasks(getTodayTasks(tasksRes.data));
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      await TasksAPI.toggleComplete(taskId, !currentStatus);
      
      const updatedTasks = allTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: !currentStatus } : task
      );
      setAllTasks(updatedTasks);
      setStats(calculateStats(updatedTasks));
      setTodayTasks(getTodayTasks(updatedTasks));
    } catch (e) {
      console.error('Ошибка обновления статуса', e);
      toast.error('Не удалось обновить задачу');
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskUpdated = async () => {
    setEditingTask(null);
    await loadData();
  };

  return {
    user,
    allTasks,
    todayTasks,
    stats,
    loading,
    editingTask,
    handleToggleComplete,
    handleTaskClick,
    handleTaskUpdated,
    setEditingTask,
  };
};