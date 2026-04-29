'use client';

import { useState } from 'react';
import Image from "next/image";
import { Title } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import { PeriodSelector } from '@/components/shared/analytics/PeriodSelector';
import { StatsCards } from '@/components/shared/analytics/StatsCards';
import { StreakCard } from '@/components/shared/analytics/StreakCard';
import { TasksBarChart } from '@/components/shared/analytics/TasksBarChart';
import { PriorityPieChart } from '@/components/shared/analytics/PriorityPieChart';
import { StreakInfoDialog } from '@/components/shared/analytics/StreakInfoDialog';
import { Period, useAnalytics } from '@/hooks/useanalytics';

export default function Analytics() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('week');
  const [isStreakInfoOpen, setIsStreakInfoOpen] = useState(false);
  
  const { data, loading } = useAnalytics(period);

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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Ошибка загрузки
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pt-29">
      <div className="max-w-5xl mx-auto w-full">
        <div className="relative flex items-center px-5 py-3 sm:py-5 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="absolute left-5 top-3 sm:top-5 cursor-pointer"
          >
            <Image src="/arrow_back.svg" alt="Назад" width={24} height={24} />
          </Button>
          <Title text="Аналитика" size="md" className="mx-auto font-semibold text-center" />
          <div className="w-10" />
        </div>

        <PeriodSelector period={period} onPeriodChange={setPeriod} />

        <div className="text-center mb-4">
          <span className="text-sm text-muted-foreground">{data.periodLabel}</span>
        </div>

        <StatsCards 
          completedTasks={data.completedTasks}
          totalTasks={data.totalTasks}
          completionRate={data.completionRate}
        />

        <StreakCard 
          streakDays={data.streakDays}
          onInfoClick={() => setIsStreakInfoOpen(true)}
        />

        <TasksBarChart title={data.chartTitle} data={data.dailyStats} />

        <PriorityPieChart byPriority={data.byPriority} />

        <StreakInfoDialog 
          open={isStreakInfoOpen} 
          onOpenChange={setIsStreakInfoOpen} 
        />
      </div>
    </div>
  );
}