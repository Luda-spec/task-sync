'use client';

import { Button } from '@/components/ui/button';

type PriorityFilter = 'Все' | 'Сложно' | 'Средне' | 'Легко';

type Props = {
  filter: PriorityFilter;
  setFilter: (filter: PriorityFilter) => void;
};

export const TaskFilters = ({ filter, setFilter }: Props) => {
  return (
    <div className="flex gap-2 sm:gap-3 px-0 sm:px-5 mb-6 overflow-x-auto no-scrollbar">
      {(['Все', 'Сложно', 'Средне', 'Легко'] as PriorityFilter[]).map(item => (
        <Button
          key={item}
          variant={filter === item ? 'filterActive' : 'filter'}
          size="sm"
          onClick={() => setFilter(item)}
          className="whitespace-nowrap"
        >
          {item}
        </Button>
      ))}
    </div>
  );
};