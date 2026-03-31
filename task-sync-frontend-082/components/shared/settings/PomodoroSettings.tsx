'use client';

import { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Title } from '@/components/ui/title';
import { UserProfile } from '@/api/settings.api';

type Props = {
  user: UserProfile & { password?: string } | null;
  setUser: Dispatch<SetStateAction<UserProfile & { password?: string } | null>>;
};

export const PomodoroSettings = ({ user, setUser }: Props) => {
  if (!user) return null;

  return (
    <div className="mb-8 px-0 sm:px-5">
      <Title text="Помодоро" size="md" className="mb-4 sm:mb-6 font-semibold" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">Рабочий интервал (мин)</p>
          <Input
            type="number"
            value={user.workInterval || ''}
            onChange={e =>
              setUser(prev => prev ? { ...prev, workInterval: Number(e.target.value) } : prev)
            }
            className="h-10 sm:h-11"
          />
        </div>

        <div>
          <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">Кол-во интервалов</p>
          <Input
            type="number"
            value={user.intervalsCount || ''}
            onChange={e =>
              setUser(prev => prev ? { ...prev, intervalsCount: Number(e.target.value) } : prev)
            }
            className="h-10 sm:h-11"
          />
        </div>

        <div className="col-span-2">
          <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">Перерыв (мин)</p>
          <Input
            type="number"
            value={user.breakInterval || ''}
            onChange={e =>
              setUser(prev => prev ? { ...prev, breakInterval: Number(e.target.value) } : prev)
            }
            className="h-10 sm:h-11"
          />
        </div>
      </div>
    </div>
  );
};