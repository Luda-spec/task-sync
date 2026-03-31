'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TasksAPI, TaskPriority, Task as ApiTask, RepeatType } from '@/api/tasks.api';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  onDeleted?: () => void;
  task: ApiTask | null;
}

const getRepeatLabel = (repeat?: RepeatType): string => {
  switch (repeat) {
    case 'daily_week': return 'Каждый день (1 неделя)';
    case 'every_2days': return 'Через день (1 неделя)';
    case 'every_2days_month': return 'Каждые 2 дня (1 месяц)';
    case 'weekly_month': return 'Каждую неделю (1 месяц)';
    default: return 'Не повторять';
  }
};

export const EditTaskModal = ({ open, onClose, onUpdated, onDeleted, task }: Props) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [timeFrom, setTimeFrom] = useState('10:00');
  const [timeTo, setTimeTo] = useState('11:00');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const validateTime = (): boolean => {
    if (!timeFrom || !timeTo) {
      toast.warning('Укажите время начала и окончания');
      return false;
    }

    const [fromHours, fromMinutes] = timeFrom.split(':').map(Number);
    const [toHours, toMinutes] = timeTo.split(':').map(Number);

    const fromTotal = fromHours * 60 + fromMinutes;
    const toTotal = toHours * 60 + toMinutes;

    if (fromTotal >= toTotal) {
      toast.error('Время начала должно быть раньше времени окончания');
      return false;
    }

    const diff = toTotal - fromTotal;
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

  useEffect(() => {
    if (task && open) {
      setName(task.name);
      setPriority(task.priority);
      setTimeFrom(task.timeFrom || '10:00');
      setTimeTo(task.timeTo || '11:00');
      setDescription(task.description || '');
    }
  }, [task, open]);

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
    }
  }, [open]);

  const handleUpdate = async () => {
    if (!task || !name.trim()) {
      toast.error('Введите название задачи');
      return;
    }

    if (!validateTime()) {
      return;
    }

    try {
      setLoading(true);
      
      await TasksAPI.update(task.id, {
        name,
        priority,
        description: description || undefined,
        timeFrom: timeFrom || undefined,
        timeTo: timeTo || undefined,
      });
      
      toast.success('Задача обновлена', {
        description: name,
        duration: 2000,
      });
      
      onUpdated();
      onClose();
    } catch (e) {
      console.error('Ошибка обновления задачи', e);
      toast.error('Не удалось сохранить изменения', {
        description: 'Попробуйте ещё раз',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!task) return;

    try {
      setDeleting(true);
      await TasksAPI.delete(task.id);
      
      toast.success('Задача удалена', {
        description: task.name,
        duration: 2000,
      });
      
      if (onDeleted) {
        onDeleted();
      } else {
        onUpdated();
      }
      onClose();
      setShowDeleteDialog(false);
    } catch (e) {
      console.error('Ошибка удаления задачи', e);
      toast.error('Не удалось удалить задачу', {
        description: 'Попробуйте ещё раз',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent 
          className="rounded-2xl px-5 pb-6 pt-5 max-w-lg"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              Редактировать задачу
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-1">
            <label className="text-xs text-secondary-foreground">Название *</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-secondary-foreground">Сложность</span>
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
            <label className="text-xs text-secondary-foreground">Повторять</label>
            <div className="h-9 w-full rounded-[15px] border border-muted bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex items-center">
              {getRepeatLabel(task?.repeat)}
            </div>
            <p className="text-[12px] text-muted-foreground mt-1">
              *Повторяемость нельзя изменить после создания
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-secondary-foreground">С</label>
              <Input 
                type="time" 
                value={timeFrom} 
                onChange={e => setTimeFrom(e.target.value)} 
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs text-secondary-foreground">До</label>
              <Input 
                type="time" 
                value={timeTo} 
                onChange={e => setTimeTo(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-secondary-foreground">Комментарий</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              disabled={deleting || !task}
              className="w-28"
            >
              Удалить
            </Button>

            <Button
              onClick={handleUpdate}
              disabled={loading || !name.trim()}
              className="w-28"
            >
              {loading ? <span className="animate-spin">⏳</span> : 'Сохранить'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление задачи</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить задачу? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {deleting ? <span className="animate-spin">⏳</span> : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};