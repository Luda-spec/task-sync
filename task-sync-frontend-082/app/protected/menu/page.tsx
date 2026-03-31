'use client';

import { MenuHeader } from "@/components/shared/menu/MenuHeader";
import { MenuGrid } from "@/components/shared/menu/MenuGrid";

const menuItems = [
  { label: "Настройки", icon: "/settings.svg", href: "/protected/settings" },
  { label: "Задачи", icon: "/tasks.svg", href: "/protected/tasks" },
  { label: "Помодоро", icon: "/pomodoro.svg", href: "/protected/pomodoro" },
  { label: "Аналитика", icon: "/analytics.svg", href: "/protected/analytics" },
];

export default function Menu() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-6">
      <div className="max-w-5xl mx-auto w-full">
        <MenuHeader />

        <div className="flex justify-center mt-55 lg:mt-16">
          <MenuGrid items={menuItems} />
        </div>
      </div>
    </div>
  );
}