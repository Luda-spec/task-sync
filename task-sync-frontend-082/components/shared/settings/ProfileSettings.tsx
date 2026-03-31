'use client';

import { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Title } from '@/components/ui/title';
import { UserProfile } from '@/api/settings.api';

type Props = {
  user: UserProfile & { password?: string } | null;
  setUser: Dispatch<SetStateAction<UserProfile & { password?: string } | null>>;
};

export const ProfileSettings = ({ user, setUser }: Props) => {
  if (!user) return null;

  return (
    <div className="mb-8 px-0 sm:px-5">
      <Title text="Профиль" size="md" className="mb-4 sm:mb-6 font-semibold" />

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="col-span-2 sm:col-span-1">
          <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">Имя</p>
          <Input
            value={user.name || ''}
            onChange={e => setUser(prev => prev ? { ...prev, name: e.target.value } : prev)}
            className="h-10 sm:h-11"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">Email</p>
          <Input
            value={user.email}
            onChange={e => setUser(prev => prev ? { ...prev, email: e.target.value } : prev)}
            className="h-10 sm:h-11"
          />
        </div>

        <div className="col-span-2">
          <p className="mb-1 text-xs sm:text-sm font-medium text-muted-foreground">Пароль</p>
          <Input
            type="password"
            value={user.password || ''}
            onChange={e => setUser(prev => prev ? { ...prev, password: e.target.value } : prev)}
            placeholder="••••••••"
            className="h-10 sm:h-11"
          />
        </div>
      </div>
    </div>
  );
};