'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/title';

interface AdminHeaderProps {
  onBack: () => void;
}

export const AdminHeader = ({ onBack }: AdminHeaderProps) => {
  return (
    <div className="relative w-full flex items-center px-5 py-3 sm:py-5 mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="absolute left-5 top-3 sm:top-5 cursor-pointer"
      >
        <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
      </Button>

      <Title 
        text="Панель администратора" 
        size="md" 
        className="mx-auto font-semibold text-foreground" 
      />
      
      <div className="absolute right-5 top-3 sm:top-5 w-6 h-6" />
    </div>
  );
};