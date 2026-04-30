'use client';

import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Checkbox } from '../ui';

type Priority = 'Легко' | 'Средне' | 'Сложно';

interface TaskItemProps {
  title: string;
  timeFrom?: string;  
  timeTo?: string;    
  priority: Priority;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onClick?: () => void;  
  scheduledAt?: string | Date; 
}

const priorityStyles: Record<Priority, { badge: string; dot: string }> = {
  Сложно: { badge: 'bg-accent3 text-accent3-foreground', dot: 'bg-accent3 border-accent3' },
  Средне: { badge: 'bg-purple-100 text-accent2-foreground', dot: 'bg-purple-100 border-purple-100' },
  Легко:  { badge: 'bg-accent text-accent-foreground', dot: 'bg-accent border-accent' },
};

export function TaskItem({
  title,
  timeFrom,
  timeTo,
  priority,
  checked,
  onCheckedChange,
  onClick,
  scheduledAt,
}: TaskItemProps) {
  const styles = priorityStyles[priority];
  const displayTime = timeFrom && timeTo ? `${timeFrom} — ${timeTo}` : timeFrom || timeTo || '';

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCheckedChange) onCheckedChange(!checked);
  };

  const statusInfo = useMemo(() => {
    if (checked) return { bg: 'bg-gray-50', border: 'border-l-gray-200', label: null };
    if (!scheduledAt || !timeFrom) return { bg: 'bg-primary-foreground', border: 'border-l-transparent', label: null };

    const now = new Date();
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

    if ((end && now > end) || (!end && now > start)) {
      return { bg: 'bg-red-50', border: 'border-l-red-400', label: { text: '⚠️ Просрочено', cls: 'text-red-600 bg-red-100' } };
    }
    if (end && now >= start && now <= end) {
      return { bg: 'bg-yellow-50', border: 'border-l-yellow-400', label: { text: '▶️ Сейчас', cls: 'text-yellow-700 bg-yellow-100' } };
    }
    if (diffMs > 0 && diffMs <= fifteenMinMs) {
      return { bg: 'bg-yellow-50', border: 'border-l-yellow-400', label: { text: '⏰ Скоро', cls: 'text-yellow-700 bg-yellow-100' } };
    }
    
    return { bg: 'bg-primary-foreground', border: 'border-l-transparent', label: null };
  }, [scheduledAt, timeFrom, timeTo, checked, tick]); 

  return (
    <div 
      onClick={onClick}  
      className={cn(
        "flex items-center justify-between rounded-2xl p-3 sm:p-4 shadow-sm mb-2 sm:mb-3 cursor-pointer transition-all hover:shadow-md border-l-4",
        statusInfo.bg,
        statusInfo.border,
        checked && "opacity-70" 
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="min-w-0 flex-1">
          <p className={cn(
            "text-[14px] sm:text-base font-normal text-foreground truncate",
            checked && "line-through text-muted-foreground"  
          )}>
            {title}
          </p>

          {displayTime && (
            <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-normal text-muted-foreground">
              <Image src="/clock.svg" alt="time" width={12} height={12} className="sm:w-3.5 sm:h-3.5" />
              <span>{displayTime}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 sm:gap-2 ml-2 sm:ml-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          onClick={handleCheckboxClick} 
          className={cn('h-5 w-5 sm:h-6 sm:w-6 rounded-sm mt-0.5 sm:mt-1', styles.dot)}
        />

        <span className={cn('rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[11px] font-normal', styles.badge)}>
          {priority}
        </span>

        {statusInfo.label && (
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', statusInfo.label.cls)}>
            {statusInfo.label.text}
          </span>
        )}
      </div>
    </div>
  );
}