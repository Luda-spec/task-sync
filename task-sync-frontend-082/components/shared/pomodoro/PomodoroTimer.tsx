'use client';

import { FC } from 'react';

interface PomodoroTimerProps {
  secondsLeft: number;
  mode: 'work' | 'break';
  workSec: number;
  breakSec: number;
}

export const PomodoroTimer: FC<PomodoroTimerProps> = ({ secondsLeft, mode, workSec, breakSec }) => {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const totalSeconds = mode === 'work' ? workSec : breakSec;
  const progress = secondsLeft / totalSeconds;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative mt-6 sm:mt-10">
      <div className="transform scale-75 sm:scale-100">
        <svg width="280" height="280" className="mx-auto">
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="#F5D6E6"
            strokeWidth="16"
            fill="none"
          />
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke={mode === 'work' ? '#F472B6' : '#60A5FA'}
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 140 140)"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl font-semibold text-foreground">
          {minutes}:{seconds}
        </div>
      </div>
    </div>
  );
};