'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui';

interface PomodoroHeaderProps {
  onInfoClick: () => void;
}

export const PomodoroHeader: FC<PomodoroHeaderProps> = ({ onInfoClick }) => {
  const router = useRouter();

  return (
    <div className="relative w-full flex items-center px-5 py-3 sm:py-5 mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="absolute left-5 top-3 sm:top-5"
      >
        <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
      </Button>

      <Title 
        text="Помодоро таймер" 
        size="md" 
        className="mx-auto font-semibold text-foreground" 
      />

      <button onClick={onInfoClick} className="absolute right-5 top-3 sm:top-5 w-6 h-6">
        <Image src="/question.svg" alt="Информация" width={24} height={24} />
      </button>
    </div>
  );
};