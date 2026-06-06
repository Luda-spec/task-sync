'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/ui/title';
import api from '@/api/axios';

interface LeaderUser {
  id: string;
  name: string;
  email: string;
  completedTasks: number;
}

const DAILY_QUOTES = [
  "Дисциплина — это мост между целями и достижениями.",
  "Начни с малого, но начни сейчас.",
  "Каждый день — это новая возможность изменить свою жизнь.",
  "Успех — это сумма небольших усилий, повторяемых изо дня в день.",
  "Не откладывай на завтра то, что можешь сделать сегодня.",
  "Твоё будущее создаётся тем, что ты делаешь сегодня.",
  "Маленькие шаги ведут к большим результатам.",
  "Фокус на процессе, а не только на результате.",
  "Ты способен на большее, чем думаешь.",
  "Порядок в делах — порядок в мыслях.",
  "Сделай шаг, и дорога появится сама."
];

const DAILY_TASKS = [
  "Сделать самую сложную задачу первой",
  "Выделить 15 минут на уборку рабочего стола",
  "Записать 3 главные задачи на завтра",
  "Сделать перерыв и прогуляться 10 минут",
  "Прочитать 10 страниц книги",
  "Ответить на отложенные сообщения",
  "Спланировать меню на завтра",
  "Сделать 20 минут зарядки",
  "Разбрать одну папку на компьютере или в почте)",
  "Поблагoдарить кого-то за помощь сегодня",
  "Закрыть лишние вкладки в браузере"
];
export default function LeaderboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<LeaderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  const dailyContent = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    return {
      quote: DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length],
      task: DAILY_TASKS[dayOfYear % DAILY_TASKS.length],
    };
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/user/rating');
        setUsers(data);
        
        const { data: profileData } = await api.get('/user/profile');
        setCurrentUser(profileData.user);
      } catch (error) {
        console.error("Ошибка загрузки", error);
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

  return (
    <div className="min-h-screen px-5 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-28">
      <div className="max-w-3xl mx-auto w-full">
        
        <div className="relative w-full flex items-center px-5 py-3 sm:py-5 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="absolute left-5 top-3 sm:top-5 cursor-pointer"
          >
            <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
          </Button>
          <Title 
            text="Топ недели" 
            size="md" 
            className="mx-auto font-semibold text-foreground" 
          />
          <div className="absolute right-5 top-3 sm:top-5 w-6 h-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">💡</span>
              <div>
                <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wide mb-1">Мысль дня</p>
                <p className="text-sm text-indigo-800 italic leading-snug">{dailyContent.quote}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">🎯</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-1">Задача-подсказка (добавь в свой список)</p>
                <p className="text-sm text-emerald-800 font-medium">{dailyContent.task}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => {
              const isMe = user.id === currentUser?.id;

              return (
                <div 
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-2xl shadow-sm border transition-transform ${
                    isMe 
                      ? 'bg-purple-50 border-purple-300 z-10 shadow-md'
                      : index === 0 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                        : index === 1 
                        ? 'bg-gray-50 border-gray-200'
                        : index === 2 
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className={`text-2xl font-bold w-8 text-center flex-shrink-0 ${
                      index === 0 ? 'text-yellow-600' : 
                      index === 1 ? 'text-gray-500' : 
                      index === 2 ? 'text-orange-600' : 'text-muted-foreground'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-lg truncate">
                          {user.name}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Это вы
                          </span>
                        )}
                      </div>
                      
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                      
                      {isMe && (
                        <span className="text-[11px] text-purple-700 font-medium mt-0.5 animate-pulse">
                          ✨ Вы супер!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end pl-3 flex-shrink-0">
                    <span className="text-xl font-bold text-primary">{user.completedTasks}</span>
                    <span className="text-xs text-muted-foreground">задач</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-4">🏁</p>
              <p className="text-muted-foreground text-lg">Пока нет активных участников</p>
              <p className="text-sm text-muted-foreground mt-2">Выполняй задачи, чтобы попасть в топ!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}