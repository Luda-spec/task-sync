'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui';
import { useRouter } from 'next/navigation';

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onOpenCalendar: () => void;
  router: ReturnType<typeof useRouter>;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export const TasksHeader = ({ selectedDate, setSelectedDate, onOpenCalendar, router }: Props) => {
  const days = Array.from({ length: 9 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 4 + i);
    return date;
  });

  return (
    <div className="px-0 sm:px-5 py-3 sm:py-5 relative mb-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="absolute left-5 top-3 sm:top-5 cursor-pointer"
      >
        <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
      </Button>

      <div className="flex justify-center">
        <Title
          size="md"
          text={isSameDay(selectedDate, new Date()) ? 'Задачи на сегодня' : selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
          className="font-semibold mb-4"
        />
      </div>

      <div className="flex justify-center mt-4">
        <div className="flex gap-2 lg:hidden overflow-x-auto no-scrollbar">
          {days.slice(2, 7).map((date) => (
            <Button
              key={date.toISOString()}
              variant={isSameDay(date, selectedDate) ? 'calendarActive' : 'calendar'}
              className="min-w-14 h-auto py-3 px-2 flex flex-col gap-1 shrink-0"
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-[10px] whitespace-nowrap">
                {date.toLocaleDateString('ru-RU', { month: 'short' })}
              </span>
              <span className="text-base font-semibold">
                {date.getDate()}
              </span>
              <span className="text-[10px] whitespace-nowrap">
                {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
              </span>
            </Button>
          ))}
          
          <Button
            variant="calendar"
            className="min-w-14 h-auto py-3 px-2 flex flex-col items-center justify-center gap-1 shrink-0"
            onClick={onOpenCalendar}
          >
            <span className="text-[10px]">&nbsp;</span> 
            <span className="text-base font-semibold">+</span>
            <span className="text-[10px]">&nbsp;</span> 
          </Button>
        </div>

        <div className="hidden lg:flex gap-3 overflow-x-auto no-scrollbar">
          {days.map((date) => (
            <Button
              key={date.toISOString()}
              variant={isSameDay(date, selectedDate) ? 'calendarActive' : 'calendar'}
              className="min-w-16 h-auto py-4 px-3 flex flex-col gap-1 shrink-0 cursor-pointer"
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-xs whitespace-nowrap">
                {date.toLocaleDateString('ru-RU', { month: 'short' })}
              </span>
              <span className="text-lg font-semibold">
                {date.getDate()}
              </span>
              <span className="text-xs whitespace-nowrap">
                {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
              </span>
            </Button>
          ))}
          
          <Button
            variant="calendar"
            className="min-w-16 h-auto py-4 px-3 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer"
            onClick={onOpenCalendar}
          >
            <span className="text-xs">&nbsp;</span> 
            <span className="text-lg font-semibold">+</span>
            <span className="text-xs">&nbsp;</span> 
          </Button>
        </div>
      </div>
    </div>
  );
};