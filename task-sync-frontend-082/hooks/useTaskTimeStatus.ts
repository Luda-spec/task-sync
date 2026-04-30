import { useMemo, useState, useEffect } from 'react';

export type TaskTimeStatus = 'normal' | 'upcoming' | 'active' | 'overdue' | 'completed';

export const useTaskTimeStatus = (
  scheduledAt: Date | string | undefined,
  timeFrom: string | undefined,
  timeTo: string | undefined,
  isCompleted: boolean
) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const status = useMemo<TaskTimeStatus>(() => {
    if (isCompleted) return 'completed';
    if (!scheduledAt || !timeFrom) return 'normal';

    const taskDate = new Date(scheduledAt);
    const [startH, startM] = timeFrom.split(':').map(Number);
    const start = new Date(taskDate);
    start.setHours(startH, startM, 0, 0);

    let end: Date | null = null;
    if (timeTo) {
      const [endH, endM] = timeTo.split(':').map(Number);
      end = new Date(taskDate);
      end.setHours(endH, endM, 0, 0);
    }

    const diffMs = start.getTime() - now.getTime();
    const fifteenMinMs = 15 * 60 * 1000;

    if (end && now > end) return 'overdue';
    if (!end && now > start) return 'overdue';
    if (end && now >= start && now <= end) return 'active';
    if (diffMs > 0 && diffMs <= fifteenMinMs) return 'upcoming';

    return 'normal';
  }, [scheduledAt, timeFrom, timeTo, isCompleted, now]);

  const getContainerStyles = () => {
    switch (status) {
      case 'overdue':
        return 'bg-red-50 border-red-300 border-l-4 border-l-red-500';
      case 'upcoming':
      case 'active':
        return 'bg-yellow-50 border-yellow-300 border-l-4 border-l-yellow-500';
      case 'completed':
        return 'bg-gray-50 border-gray-200 opacity-60';
      default:
        return 'bg-white border-gray-100';
    }
  };

  return { status, getContainerStyles };
};