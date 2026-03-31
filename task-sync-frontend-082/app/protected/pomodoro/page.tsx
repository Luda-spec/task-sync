'use client';

import { useState } from 'react';
import { PomodoroHeader } from '@/components/shared/pomodoro/PomodoroHeader';
import { PomodoroTimer } from '@/components/shared/pomodoro/PomodoroTimer';
import { PomodoroControls } from '@/components/shared/pomodoro/PomodoroControls';
import { PomodoroDialogInfo } from '@/components/shared/pomodoro/PomodoroDialogInfo';
import { usePomodoro } from '@/hooks/usePomodoro';

export default function PomodoroPage() {
  const [infoOpen, setInfoOpen] = useState(false);

  const {
    loading,
    mode,
    secondsLeft,
    workSec,
    breakSec,
    roundIndex,
    workRoundsCount,
    reset,
  } = usePomodoro();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-28">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
        <PomodoroHeader onInfoClick={() => setInfoOpen(true)} />

        <span className="text-xs sm:text-sm mt-2 sm:mt-4 text-muted-foreground">
          {mode === 'work'
            ? `Работа · ${roundIndex + 1}/${workRoundsCount}`
            : `Перерыв · ${roundIndex + 1}/${workRoundsCount}`}
        </span>

        <PomodoroTimer
          secondsLeft={secondsLeft}
          mode={mode}
          workSec={workSec}
          breakSec={breakSec}
        />

        <PomodoroControls onReset={reset} />
        <PomodoroDialogInfo
          open={infoOpen}
          onOpenChange={setInfoOpen}
        />
      </div>
    </div>
  );
}