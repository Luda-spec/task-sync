'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface StreakInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StreakInfoDialog = ({ open, onOpenChange }: StreakInfoDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent 
      className="rounded-2xl max-w-sm" 
      aria-describedby="streak-info-description"
    >
      <DialogHeader>
        <DialogTitle className="text-primary">💜 Серия дней</DialogTitle>
        <DialogDescription id="streak-info-description" className="sr-only">
          Информация о серии дней: как считается и как не потерять
        </DialogDescription>
      </DialogHeader>
      <div className="text-sm text-secondary-foreground space-y-2">
        <p>
          <b>Серия дней</b> — это количество дней подряд, в которые ты выполнял хотя бы одну задачу.
        </p>
        <p>
          Серия помогает поддерживать мотивацию и формировать полезную привычку делать задачи регулярно.
        </p>
        <p><b>Как работает:</b></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Выполнил задачу сегодня — серия продолжается</li>
          <li>Пропустил день — серия сбрасывается на 0 </li>
          <li>Не выполнил задачу сегодня — серия = 0 </li>
        </ul>
        <p className="text-sm mt-2">
          <b>Совет:</b> Старайся выполнять хотя бы одну задачу каждый день, чтобы не терять серию!
        </p>
      </div>
    </DialogContent>
  </Dialog>
);

