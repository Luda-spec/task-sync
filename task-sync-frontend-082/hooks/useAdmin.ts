'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/api/axios';

export type Stats = {
  users: { total: number; activeToday: number; activeWeek: number };
  tasks: { total: number; completed: number; completionRate: number };
  pomodoro: { totalSessions: number; completedRounds: number };
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  _count: { tasks: number; pomodoroSessions: number };
};

export const useAdmin = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [roleChange, setRoleChange] = useState<{ id: string; currentRole: string; newRole: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'ADMIN') {
        toast.error('Доступ запрещен');
        router.push('/protected/home');
      }
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get(`/admin/users?page=${currentPage}&limit=10&search=${search}`),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 403) {
        toast.error('Нет прав администратора');
        router.push('/protected/home');
      } else {
        toast.error('Ошибка загрузки данных');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete}`);
      toast.success('Пользователь удален');
      loadData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Ошибка при удалении');
    } finally {
      setUserToDelete(null);
    }
  };

  const handleRoleUpdate = async () => {
    if (!roleChange) return;
    try {
      await api.put(`/admin/users/${roleChange.id}/role`, { role: roleChange.newRole });
      toast.success('Роль обновлена');
      loadData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Ошибка при смене роли');
    } finally {
      setRoleChange(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return {
    loading,
    stats,
    users,
    search,
    currentPage,
    userToDelete,
    roleChange,
    setSearch,
    setCurrentPage,
    setUserToDelete,
    setRoleChange,
    handleDeleteUser,
    handleRoleUpdate,
    formatDate,
    goBack: () => router.back(),
  };
};