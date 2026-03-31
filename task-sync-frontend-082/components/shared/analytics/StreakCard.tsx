'use client';

import Image from 'next/image';

interface StreakCardProps {
  streakDays: number;
  onInfoClick: () => void;
}

export const StreakCard = ({ streakDays, onInfoClick }: StreakCardProps) => (
  <div className="bg-linear-to-br from-primary to-secondary rounded-2xl p-4 sm:p-5 mb-6 mx-0 sm:mx-5 relative">
    <div className="flex items-center gap-2 sm:gap-3">
      <button 
        onClick={onInfoClick}
        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
      >
        <Image src="/question.svg" alt="Информация" width={20} height={20} className="filter brightness-0 invert" />
      </button>
      <div className="flex-1">
        <div className="text-base sm:text-xl font-bold text-white opacity-90">Серия дней</div>
      </div>
      <div className="text-3xl sm:text-4xl font-bold text-white">{streakDays} 💜</div>
    </div>
  </div>
);