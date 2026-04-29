'use client';

import { Button } from '@/components/ui/button';

export type Period = 'week' | 'month' | '3months';

interface PeriodSelectorProps {
  period: Period;
  onPeriodChange: (period: Period) => void;
}

const periodLabels: Record<Period, string> = {
  week: 'Неделя',
  month: 'Месяц',
  '3months': '3 месяца',
};

export const PeriodSelector = ({ period, onPeriodChange }: PeriodSelectorProps) => (
  <div className="flex gap-2 sm:gap-3 mb-6 px-0 sm:px-5">
    {(Object.keys(periodLabels) as Period[]).map((p) => (
      <Button
        key={p}
        onClick={() => onPeriodChange(p)}
        variant={period === p ? 'default' : 'outline'}
        className={`flex-1 cursor-pointer text-xs sm:text-sm py-2 sm:py-3 ${
          period === p 
            ? 'bg-primary text-white border-0' 
            : 'bg-white text-foreground border-0 hover:bg-secondary/50'
        }`}
      >
        {periodLabels[p]}
      </Button>
    ))}
  </div>
);