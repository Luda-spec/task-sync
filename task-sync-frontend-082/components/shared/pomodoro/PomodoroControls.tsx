'use client';

import { FC } from 'react';
import Image from 'next/image';

interface PomodoroControlsProps {
  onReset: () => void;
}

export const PomodoroControls: FC<PomodoroControlsProps> = ({ onReset }) => (
  <button 
    onClick={onReset} 
    className="mt-6 sm:mt-8 p-3 hover:bg-secondary/50 rounded-full transition-colors cursor-pointer"
  >
    <Image 
      src="/replay.svg" 
      alt="Сброс таймера" 
      width={24} 
      height={24} 
      className="sm:w-7 sm:h-7"
    />
  </button>
);