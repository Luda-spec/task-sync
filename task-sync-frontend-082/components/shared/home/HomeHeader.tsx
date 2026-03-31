'use client';

import { Title } from '@/components/ui';
import { UserProfile } from '@/api/home.api';

export const HomeHeader = ({ user }: { user: UserProfile }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-foreground flex items-center justify-center text-primary-foreground font-semibold text-lg sm:text-xl">
          {user.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>

        <div>
          <p className="text-sm text-foreground/70 leading-none">
            Привет!
          </p>

          <Title
            text={user.name ?? user.email}
            size="md"
            className="mt-2 font-semibold"
          />
        </div>
      </div>
    </div>
  );
};