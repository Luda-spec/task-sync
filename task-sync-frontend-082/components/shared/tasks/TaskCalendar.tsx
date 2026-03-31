'use client';

import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  onClose: () => void;
};

export const TaskCalendar = ({ selectedDate, setSelectedDate, open, onClose }: Props) => {
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  const today = new Date();

  const [calendarMonth, setCalendarMonth] = React.useState(new Date());
  const [direction, setDirection] = React.useState(0); 

  const calendarDays = React.useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = (firstDay.getDay() + 6) % 7;

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [calendarMonth]);

  if (!open) return null;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onClose();
  };

  const changeMonth = (dir: number) => {
    setDirection(dir);
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + dir)
    );
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
            ‹
          </Button>

          <Title
            text={calendarMonth.toLocaleDateString('ru-RU', {
              month: 'long',
              year: 'numeric',
            })}
            size="sm"
            className="text-sm sm:text-base"
          />

          <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
            ›
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs sm:text-sm opacity-60">
          {weekDays.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>


        <AnimatePresence mode="wait">
          <motion.div
            key={calendarMonth.toISOString()}
            initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-7 gap-1 sm:gap-2"
          >
            {calendarDays.map((date, index) => {
              if (!date) return <div key={index} />;

              const isToday = isSameDay(date, today);
              const isSelected = isSameDay(date, selectedDate);

              return (
                <Button
                  key={date.toISOString()}
                  size="sm"
                  variant={
                    isSelected
                      ? 'calendarActive'
                      : isToday
                      ? 'outline'
                      : 'calendar'
                  }
                  className={isToday ? 'border-blue-500 text-blue-500' : ''}
                  onClick={() => handleDateSelect(date)}
                >
                  {date.getDate()}
                </Button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};