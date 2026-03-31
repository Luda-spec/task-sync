'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

type CenterAction = {
  icon: string;
  onClick: () => void;
};

const NAV_ITEMS = [
  {
    label: 'Home',
    path: '/protected/home',
    icon: '/home.svg',
    activeIcon: '/home_active.svg',
  },
  {
    label: 'Calendar',
    path: '/protected/tasks',
    icon: '/calendar.svg',
    activeIcon: '/calendar_active.svg',
  },
  {
    label: 'List',
    path: '/protected/analytics',
    icon: '/document-text.svg',
    activeIcon: '/document-text-active.svg',
  },
  {
    label: 'Menu',
    path: '/protected/menu',
    icon: '/profile-2user.svg',
    activeIcon: '/profile-2user-active.svg',
  },
];

export const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent<boolean>) =>
      setIsPomodoroRunning(e.detail);

    window.addEventListener('pomodoro-status', handler as EventListener);

    return () =>
      window.removeEventListener('pomodoro-status', handler as EventListener);
  }, []);

  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  const centerAction = useMemo<CenterAction>(() => {
    if (pathname.startsWith('/protected/home')) {
      return {
        icon: '/add.svg',
        onClick: () => router.push('/protected/tasks'),
      };
    }

    if (pathname.startsWith('/protected/tasks')) {
      return {
        icon: '/add.svg',
        onClick: () =>
          window.dispatchEvent(new CustomEvent('open-create-task')),
      };
    }

    if (pathname.startsWith('/protected/analytics')) {
      return {
        icon: '/add.svg',
        onClick: () => router.push('/protected/tasks'),
      };
    }

    if (pathname.startsWith('/protected/pomodoro')) {
      return {
        icon: isPomodoroRunning ? '/pause.svg' : '/play.svg',
        onClick: () =>
          window.dispatchEvent(new CustomEvent('toggle-pomodoro')),
      };
    }

    if (pathname.startsWith('/protected/settings')) {
      return {
        icon: '/check.svg',
        onClick: () =>
          window.dispatchEvent(new CustomEvent('save-settings')),
      };
    }

    if (pathname.startsWith('/protected/menu')) {
      return {
        icon: '/close.svg',
        onClick: () => router.back(),
      };
    }

    return { icon: '/add.svg', onClick: () => {} };
  }, [pathname, isPomodoroRunning, router]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="relative h-14 bg-accent2 rounded-t-3xl flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {leftItems.map(item => {
            const isActive = pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14"
              >
                <Image
                  src={isActive ? item.activeIcon : item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {rightItems.map(item => {
            const isActive = pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14"
              >
                <Image
                  src={isActive ? item.activeIcon : item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={centerAction.onClick}
          className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2
                     w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary
                     flex items-center justify-center
                     shadow-[0px_10px_20px_0px_#5F33E159]"
        >
          <Image
            src={centerAction.icon}
            alt="Center action"
            width={20}
            height={20}
            className="sm:w-6 sm:h-6"
          />
        </button>
      </div>
    </div>
  );
};