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

interface WeeklyRatingResponse {
  startDate: string;
  endDate: string;
  users: LeaderUser[];
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
  "Разбрать одну папку на компьютере или в почте",
  "Поблагодарить кого-то за помощь сегодня",
  "Закрыть лишние вкладки в браузере"
];

export default function LeaderboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<LeaderUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekRange, setWeekRange] = useState<{
    startDate: string;
    endDate: string;
  } | null>(null);

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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('ru-RU');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get<WeeklyRatingResponse>('/user/rating');

        setUsers(data.users);
        setWeekRange({
          startDate: data.startDate,
          endDate: data.endDate,
        });

        const { data: profileData } = await api.get('/user/profile');
        setCurrentUser(profileData.user);
      } catch (e) {
        console.error('Ошибка загрузки рейтинга', e);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-28">
      <div className="max-w-3xl mx-auto w-full">

        {/* HEADER */}
        <div className="relative w-full px-5 py-3 sm:py-5 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="absolute left-5 top-3 sm:top-5"
          >
            <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
          </Button>

          <div className="text-center">
            <Title text="Топ недели" size="md" className="font-semibold" />

            {weekRange && (
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(weekRange.startDate)} — {formatDate(weekRange.endDate)}
              </p>
            )}
          </div>
        </div>

        {/* DAILY BLOCKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-900 mb-1">
              Мысль дня
            </p>
            <p className="text-sm text-indigo-800 italic">
              {dailyContent.quote}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-900 mb-1">
              Задача дня
            </p>
            <p className="text-sm text-emerald-800 font-medium">
              {dailyContent.task}
            </p>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => {
              const isMe = user.id === currentUser?.id;

              return (
                <div
                  key={user.id}
                  className={`flex justify-between items-center p-4 rounded-2xl border ${
                    isMe
                      ? 'bg-purple-50 border-purple-300'
                      : index === 0
                      ? 'bg-yellow-50 border-yellow-300'
                      : index === 1
                      ? 'bg-gray-50 border-gray-200'
                      : index === 2
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-xl font-bold w-8 text-center">
                      {index === 0
                        ? '🥇'
                        : index === 1
                        ? '🥈'
                        : index === 2
                        ? '🥉'
                        : `#${index + 1}`}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">
                          {user.name}
                        </span>

                        {isMe && (
                          <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                            Вы
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">
                      {user.completedTasks}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      задач
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-2">🏁</p>
              <p className="text-muted-foreground">
                Пока нет данных за эту неделю
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}