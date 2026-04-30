'use client';

import { useLayoutEffect, useState } from 'react';
import { MenuHeader } from "@/components/shared/menu/MenuHeader";
import { MenuGrid } from "@/components/shared/menu/MenuGrid";

const checkIsAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
};

export default function Menu() {
  const [isAdmin, setIsAdmin] = useState(false);

  useLayoutEffect(() => {
    setIsAdmin(checkIsAdmin());
  }, []);

  const menuItems = [
    { label: "Настройки", icon: "/settings.svg", href: "/protected/settings" },
    { label: "Задачи", icon: "/tasks.svg", href: "/protected/tasks" },
    { label: "Помодоро", icon: "/pomodoro.svg", href: "/protected/pomodoro" },
    { label: "Аналитика", icon: "/analytics.svg", href: "/protected/analytics" },
    { label: "Рейтинг", icon: "/trophy.svg", href: "/protected/leaderboard" }, 
    ...(isAdmin ? [{ label: "Админ панель", icon: "/admin.svg", href: "/protected/admin" }] : []),
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-6">
      <div className="max-w-5xl mx-auto w-full">
        <MenuHeader />
        
        <div className="flex justify-center mt-10 lg:mt-16">
          <MenuGrid items={menuItems} />
        </div>
      </div>
    </div>
  );
}