'use client';

import { useSettings } from '@/hooks/useSettings';
import { SettingsHeader } from '@/components/shared/settings/SettingsHeader';
import { ProfileSettings } from '@/components/shared/settings/ProfileSettings';
import { PomodoroSettings } from '@/components/shared/settings/PomodoroSettings';

export default function SettingsPage() {
  const { user, loading, setUser } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Ошибка загрузки
      </div>
    );

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-28">
      <div className="max-w-5xl mx-auto w-full">
        <SettingsHeader />

        <ProfileSettings user={user} setUser={setUser} />
        <PomodoroSettings user={user} setUser={setUser} />
      </div>
    </div>
  );
}