'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

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

export const DesktopNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent<boolean>) =>
      setIsPomodoroRunning(e.detail);

    window.addEventListener('pomodoro-status', handler as EventListener);
    return () => window.removeEventListener('pomodoro-status', handler as EventListener);
  }, []);

  const centerAction = useMemo(() => {
    if (pathname.startsWith('/protected/home')) {
      return {
        icon: '/add.svg',
        onClick: () => router.push('/protected/tasks'),
      };
    }

    if (pathname.startsWith('/protected/tasks')) {
      return {
        icon: '/add.svg',
        onClick: () => window.dispatchEvent(new CustomEvent('open-create-task')),
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
        onClick: () => window.dispatchEvent(new CustomEvent('toggle-pomodoro')),
      };
    }

    if (pathname.startsWith('/protected/settings')) {
      return {
        icon: '/check.svg',
        onClick: () => window.dispatchEvent(new CustomEvent('save-settings')),
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
    <div className="hidden lg:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-accent2/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map(item => {
            const isActive = pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-primary shadow-md' 
                    : 'hover:bg-white/50'
                  }
                `}
              >
                <Image
                  src={isActive ? item.activeIcon : item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className={isActive ? 'filter brightness-0 invert' : ''}
                />
              </button>
            );
          })}

          {/* ✅ ПЛЮСИК */}
          <button
            onClick={centerAction.onClick}
            className="ml-2 w-12 h-12 rounded-xl bg-primary shadow-md
                       flex items-center justify-center
                       hover:scale-105 transition-transform"
          >
            <Image
              src={centerAction.icon}
              alt="Action"
              width={24}
              height={24}
              className="filter brightness-0 invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
};