'use client';

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
}

const priorityStyles: Record<Priority, { badge: string; dot: string }> = {
  Сложно: {
    badge: 'bg-accent3 text-accent3-foreground',
    dot: 'bg-accent3 border-accent3',
  },
  Средне: {
    badge: 'bg-purple-100 text-accent2-foreground',
    dot: 'bg-purple-100 border-purple-100',
  },
  Легко: {
    badge: 'bg-accent text-accent-foreground',
    dot: 'bg-accent border-accent',
  },
};

export function TaskItem({
  title,
  timeFrom,
  timeTo,
  priority,
  checked,
  onCheckedChange,
  onClick,
}: TaskItemProps) {
  const styles = priorityStyles[priority];

  const displayTime = timeFrom && timeTo 
    ? `${timeFrom} — ${timeTo}` 
    : timeFrom || timeTo || '';

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div 
      onClick={onClick}  
      className={cn(
        "flex items-center justify-between rounded-2xl bg-primary-foreground p-3 sm:p-4 shadow-sm mb-2 sm:mb-3 cursor-pointer transition-all hover:shadow-md",
        checked && "opacity-70 bg-gray-50" 
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
      </div>
    </div>
  );
}