'use client';

import { useEffect, useState, useCallback } from 'react';
import { SettingsAPI, UserProfile, UserDto } from '@/api/settings.api';
import { toast } from 'sonner';

export interface UseSettingsReturn {
  user: UserProfile & { password?: string } | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserProfile & { password?: string } | null>>;
  handleSave: () => Promise<void>;
}

export const useSettings = (): UseSettingsReturn => {
  const [user, setUser] = useState<UserProfile & { password?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await SettingsAPI.getProfile();
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        toast.error('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!user) return;

    if (!user.email?.trim()) {
      toast.error('Email не может быть пустым');
      return;
    }
    
    if (!user.name?.trim()) {
      toast.error('Имя не может быть пустым');
      return;
    }

    if (user.password && user.password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    if (!user.workInterval || user.workInterval < 1) {
      toast.error('Рабочий интервал ≥ 1 мин');
      return;
    }

    if (!user.breakInterval || user.breakInterval < 1) {
      toast.error('Перерыв ≥ 1 мин');
      return;
    }

    if (!user.intervalsCount || user.intervalsCount < 1 || user.intervalsCount > 10) {
      toast.error('Интервалы 1-10');
      return;
    }

    const payload: UserDto = {
      email: user.email,
      name: user.name,
      workInterval: user.workInterval,
      breakInterval: user.breakInterval,
      intervalsCount: user.intervalsCount,
      ...(user.password && { password: user.password }),
    };

    try {
      await SettingsAPI.updateProfile(payload);
      toast.success('Профиль обновлён');
      setUser(prev => prev ? { ...prev, password: '' } : prev);
    } catch {
      toast.error('Ошибка сохранения');
    }
  }, [user]);

  useEffect(() => {
    const handler = () => handleSave();
    window.addEventListener('save-settings', handler);
    return () => window.removeEventListener('save-settings', handler);
  }, [handleSave]);

  return {
    user,
    loading,
    setUser,
    handleSave,
  };
};