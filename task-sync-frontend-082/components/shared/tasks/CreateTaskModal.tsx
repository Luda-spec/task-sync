'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { TasksAPI, TaskPriority, RepeatType, CreateTaskInput } from '@/api/tasks.api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  selectedDate: Date;
}

const REPEAT_OPTIONS: { value: RepeatType; label: string; period: string }[] = [
  { value: 'never', label: 'Не повторять', period: '' },
  { value: 'daily_week', label: 'Каждый день', period: 'в течение 1 нед' },
  { value: 'every_2days', label: 'Через день', period: 'в течение 1 нед' },
  { value: 'every_2days_month', label: 'Формат 2/2', period: 'в течение 1 мес' },
  { value: 'weekly_month', label: 'Каждую неделю', period: 'в течение 1 мес' },
];

export const CreateTaskModal = ({ open, onClose, onCreated, selectedDate }: Props) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [repeat, setRepeat] = useState<RepeatType>('never');
  const [timeFrom, setTimeFrom] = useState('10:00');
  const [timeTo, setTimeTo] = useState('11:00');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  useEffect(() => {
    if (!open) {
      setName('');
      setPriority('medium');
      setRepeat('never');
      setTimeFrom('10:00');
      setTimeTo('11:00');
      setDescription('');
    }
  }, [open]);

  const validateTime = (): boolean => {
    if (!timeFrom || !timeTo) {
      toast.warning('Укажите время начала и окончания');
      return false;
    }

    const [fromHoursStr, fromMinutesStr] = timeFrom.split(':');
    const [toHoursStr, toMinutesStr] = timeTo.split(':');
    
    const fromHours: number = parseInt(fromHoursStr, 10);
    const fromMinutes: number = parseInt(fromMinutesStr, 10);
    const toHours: number = parseInt(toHoursStr, 10);
    const toMinutes: number = parseInt(toMinutesStr, 10);

    if (isNaN(fromHours) || isNaN(fromMinutes) || isNaN(toHours) || isNaN(toMinutes)) {
      toast.error('Некорректное время');
      return false;
    }

    const fromTotal: number = fromHours * 60 + fromMinutes;
    const toTotal: number = toHours * 60 + toMinutes;

    if (fromTotal >= toTotal) {
      toast.error('Время начала должно быть раньше времени окончания');
      return false;
    }

    const diff: number = toTotal - fromTotal;
    if (diff < 5) {
      toast.warning('Задача слишком короткая (минимум 5 минут)');
      return false;
    }

    if (diff > 1440) {
      toast.error('Задача не может быть длиннее 24 часов');
      return false;
    }

    return true;
  };

  const generateRecurringDates = (): Date[] => {
    const dates: Date[] = [];
    const startDate = new Date(selectedDate);
    
    switch (repeat) {
      case 'daily_week':
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          dates.push(date);
        }
        break;
        
      case 'every_2days':
        for (let i = 0; i < 7; i += 2) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          dates.push(date);
        }
        break;
        
      case 'every_2days_month':
        for (let i = 0; i < 30; i++) {
          const dayInCycle = i % 4;
          if (dayInCycle === 0 || dayInCycle === 1) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
          }
        }
        break;
        
      case 'weekly_month':
        for (let i = 0; i < 30; i += 7) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          dates.push(date);
        }
        break;
        
      default:
        dates.push(new Date(startDate));
    }
    
    return dates;
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Введите название задачи');
      return;
    }

    if (!validateTime()) {
      return;
    }

    try {
      setLoading(true);

      const taskDates = generateRecurringDates();
      
      const createPromises = taskDates.map(async (date) => {
        const [hours, minutes] = timeFrom.split(':');
        const scheduled = new Date(date);
        scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const payload: CreateTaskInput = {
          name,
          priority,
          description: description || undefined,
          timeFrom: timeFrom || undefined,
          timeTo: timeTo || undefined,
          repeat,
          scheduledAt: scheduled.toISOString(),
        };

        return await TasksAPI.create(payload);
      });

      await Promise.all(createPromises);

      const taskCount = taskDates.length;
      if (taskCount > 1) {
        toast.success(`Создано ${taskCount} задач`, {
          description: `С ${formatDateShort(taskDates[0])} по ${formatDateShort(taskDates[taskDates.length - 1])}`,
          duration: 3000,
        });
      } else {
        toast.success('Задача создана', {
          description: `${name} на ${formatDate(selectedDate)}`,
          duration: 2000,
        });
      }

      onCreated();
      onClose();
    } catch (e) {
      console.error('Ошибка создания задачи', e);
      toast.error('Не удалось создать задачу', {
        description: 'Попробуйте ещё раз',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTaskCount = () => {
    return generateRecurringDates().length;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="rounded-2xl px-5 pb-6 pt-5 max-w-lg"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            Новая задача
          </DialogTitle>
        </DialogHeader>

        <div className="bg-purple-50 rounded-xl p-3 mb-2">
          <p className="text-sm text-purple-900 font-medium">
            📅 {formatDate(selectedDate)}
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-secondary-foreground">
            Название *
          </label>
          <Input
            placeholder="Название задачи"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs text-secondary-foreground">
            Сложность
          </span>
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as TaskPriority[]).map(p => (
              <Button
                key={p}
                size="sm"
                variant={priority === p ? 'filterActive' : 'filter'}
                onClick={() => setPriority(p)}
                className="flex-1"
              >
                {p === 'high' ? 'Сложно' : p === 'medium' ? 'Средне' : 'Легко'}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-secondary-foreground">
            Повторять
          </label>
          <select
            value={repeat}
            onChange={e => setRepeat(e.target.value as RepeatType)}
            className="h-9 w-full rounded-[15px] border border-primary bg-transparent px-3 text-xs"
          >
            {REPEAT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.period && `(${option.period})`}
              </option>
            ))}
          </select>
          
          {repeat !== 'never' && (
            <p className="text-[12px] text-muted-foreground mt-1">
              Будет создано задач: <strong>{getTaskCount()}</strong>
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-secondary-foreground">
              С *
            </label>
            <Input
              type="time"
              value={timeFrom}
              onChange={e => setTimeFrom(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-secondary-foreground">
              До *
            </label>
            <Input
              type="time"
              value={timeTo}
              onChange={e => setTimeTo(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-secondary-foreground">
            Комментарий
          </label>
          <Textarea
            placeholder="Дополнительные заметки..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-center mt-4">
          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="w-32 h-10"
          >
            {loading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Image src="/check.svg" alt="Сохранить" width={20} height={20} />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};