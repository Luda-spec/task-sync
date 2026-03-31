'use client';

import { useState, useEffect } from 'react';
import { TasksAPI } from '@/api/tasks.api';
import { toast } from 'sonner';

export type Period = 'week' | 'month' | '3months';

export interface AnalyticsData {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  byPriority: { high: number; medium: number; low: number };
  dailyStats: { label: string; value: number }[];
  streakDays: number;
  periodLabel: string;
  chartTitle: string;
}

const formatDateStr = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

const formatPeriodLabel = (period: Period, now: Date) => {
  if (period === 'week') {
    const weekStart = getWeekStart(now);
    const weekEnd = getWeekEnd(now);
    return `${weekStart.getDate()} ${weekStart.toLocaleDateString('ru-RU', { month: 'short' })} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('ru-RU', { month: 'short' })}`;
  }
  if (period === 'month') {
    return now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  }
  if (period === '3months') {
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return `${threeMonthsAgo.toLocaleDateString('ru-RU', { month: 'short' })} - ${currentMonthEnd.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' })}`;
  }
  return '';
};

const getChartTitle = (period: Period) => {
  switch (period) {
    case 'week': return 'Задачи по дням';
    case 'month': return 'Задачи по неделям';
    case '3months': return 'Задачи по месяцам';
  }
};

export const useAnalytics = (period: Period) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        
        const { data: tasks } = await TasksAPI.getAll();
        const now = new Date();
        
        let startDate = new Date();
        let endDate = new Date();
        
        if (period === 'week') {
          startDate = getWeekStart(now);
          endDate = getWeekEnd(now);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
        } else if (period === 'month') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        } else if (period === '3months') {
          startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
        }
        
        const filteredTasks = tasks.filter(task => {
          if (!task.scheduledAt) return false;
          const taskDate = new Date(task.scheduledAt);
          return taskDate >= startDate && taskDate <= endDate;
        });

        const completedTasks = filteredTasks.filter(t => t.isCompleted).length;
        const totalTasks = filteredTasks.length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const byPriority = {
          high: filteredTasks.filter(t => t.priority === 'high').length,
          medium: filteredTasks.filter(t => t.priority === 'medium').length,
          low: filteredTasks.filter(t => t.priority === 'low').length,
        };

        const dailyStats: { label: string; value: number }[] = [];
        
        if (period === 'week') {
          for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            const dayLabel = dayDate.toLocaleDateString('ru-RU', { weekday: 'short' });
            const dayTasks = filteredTasks.filter(task => {
              if (!task.scheduledAt) return false;
              const taskDate = new Date(task.scheduledAt);
              return taskDate.toDateString() === dayDate.toDateString();
            });
            const value = dayTasks.filter(t => t.isCompleted).length;
            dailyStats.push({ label: dayLabel, value });
          }
        } else if (period === 'month') {
          const weekStart = getWeekStart(startDate);
          let weekNum = 1;
          for (let d = new Date(weekStart); d <= endDate; d.setDate(d.getDate() + 7)) {
            const weekEnd = new Date(d);
            weekEnd.setDate(weekEnd.getDate() + 6);
            if (weekEnd > endDate) weekEnd.setTime(endDate.getTime());
            const weekTasks = filteredTasks.filter(task => {
              if (!task.scheduledAt) return false;
              const taskDate = new Date(task.scheduledAt);
              return taskDate >= d && taskDate <= weekEnd;
            });
            const value = weekTasks.filter(t => t.isCompleted).length;
            dailyStats.push({ label: `${weekNum}`, value });
            weekNum++;
          }
        } else if (period === '3months') {
          for (let i = 0; i < 3; i++) {
            const monthDate = new Date(startDate);
            monthDate.setMonth(startDate.getMonth() + i);
            const monthLabel = monthDate.toLocaleDateString('ru-RU', { month: 'short' });
            const monthTasks = filteredTasks.filter(task => {
              if (!task.scheduledAt) return false;
              const taskDate = new Date(task.scheduledAt);
              return taskDate.getMonth() === monthDate.getMonth() && taskDate.getFullYear() === monthDate.getFullYear();
            });
            const value = monthTasks.filter(t => t.isCompleted).length;
            dailyStats.push({ label: monthLabel, value });
          }
        }

        let streakDays = 0;
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date();
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = formatDateStr(checkDate);
          const hasCompletedTask = tasks.some(task => {
            if (!task.scheduledAt || !task.isCompleted) return false;
            const taskDate = new Date(task.scheduledAt);
            const taskDateStr = formatDateStr(taskDate);
            return taskDateStr === dateStr;
          });
          if (hasCompletedTask) {
            streakDays++;
          } else {
            break;
          }
        }

        setData({
          completedTasks,
          totalTasks,
          completionRate,
          byPriority,
          dailyStats,
          streakDays,
          periodLabel: formatPeriodLabel(period, now),
          chartTitle: getChartTitle(period),
        });
      } catch (error) {
        console.error('Ошибка загрузки аналитики:', error);
        toast.error('Не удалось загрузить аналитику');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [period]);

  return { data, loading };
};