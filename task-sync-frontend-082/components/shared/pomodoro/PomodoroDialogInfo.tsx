'use client';

import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface PomodoroDialogInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PomodoroDialogInfo: FC<PomodoroDialogInfoProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="rounded-2xl" aria-describedby="pomodoro-dialog-description">
      <DialogHeader>
        <DialogTitle className="text-center text-primary">Pomodoro</DialogTitle>
        <DialogDescription id="pomodoro-dialog-description" className="sr-only">
          Информация о технике Pomodoro
        </DialogDescription>
      </DialogHeader>
      <div className="text-sm  text-secondary-foreground text-left space-y-2">
        <p>
          Pomodoro — это техника управления временем. Ты работаешь{' '}
          <b>заданное время</b> без отвлечений, затем делаешь{' '}
          <b>короткий перерыв</b>. И так несколько раундов.
        </p>
        <p>
          <b>Работа → перерыв → повтор</b> (интервалы берутся из настроек профиля)
        </p>
        <p>Это помогает:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>лучше концентрироваться</li>
          <li>не выгорать</li>
          <li>реально доводить задачи до конца</li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);