'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { TimerAPI, PomodoroSession, PomodoroRound } from '@/api/timer.api';

export const usePomodoro = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState<PomodoroSession | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [workSec, setWorkSec] = useState(0);
  const [breakSec, setBreakSec] = useState(0);
  const [workRoundsCount, setWorkRoundsCount] = useState(0);


  useEffect(() => {
    audioRef.current = new Audio('/ding.mp3');
  }, []);

  const playSound = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, []);


  const startTimer = useCallback(
    (seconds: number, nextMode: 'work' | 'break', nextRound: number) => {
      const endTime = Date.now() + seconds * 1000;

      endTimeRef.current = endTime;

      localStorage.setItem(
        'pomodoro-timer',
        JSON.stringify({
          endTime,
          mode: nextMode,
          roundIndex: nextRound,
        })
      );

      setIsRunning(true);
    },
    []
  );


  const handleIntervalEnd = useCallback(async () => {
    if (!session) return;

    playSound();

    if (mode === 'work') {
      const round = session.rounds[roundIndex];
      if (!round) return;

      await TimerAPI.updateRound(round.id, {
        totalSeconds: workSec,
        isCompleted: true,
      });

      setMode('break');
      setSecondsLeft(breakSec);

      startTimer(breakSec, 'break', roundIndex);
    } else {
      if (roundIndex + 1 >= workRoundsCount) {
        await TimerAPI.finishSession(session.id);

        setIsRunning(false);
        localStorage.removeItem('pomodoro-timer');
        return;
      }

      const nextIndex = Math.min(roundIndex + 1, workRoundsCount - 1);

      setRoundIndex(nextIndex);
      setMode('work');
      setSecondsLeft(workSec);

      startTimer(workSec, 'work', nextIndex);
    }
  }, [
    session,
    roundIndex,
    mode,
    workSec,
    breakSec,
    workRoundsCount,
    startTimer,
    playSound,
  ]);


  useEffect(() => {
    const init = async () => {
      const settings = await TimerAPI.getUserSettings();

      const workSeconds = settings.workInterval * 60;
      const breakSeconds = settings.breakInterval * 60;

      setWorkSec(workSeconds);
      setBreakSec(breakSeconds);
      setWorkRoundsCount(settings.intervalsCount);

      let today = await TimerAPI.getTodaySession();

      if (!today) {
        const rounds: PomodoroRound[] = Array.from(
          { length: settings.intervalsCount },
          (_, i) => ({
            id: `${i}-${Date.now()}`,
            totalSeconds: 0,
            isCompleted: false,
          })
        );

        today = await TimerAPI.createSessionWithRounds(rounds);
      }

      setSession(today);

      const saved = localStorage.getItem('pomodoro-timer');

      if (saved) {
        const data = JSON.parse(saved);

        const diff = Math.floor((data.endTime - Date.now()) / 1000);

        if (diff > 0) {
          endTimeRef.current = data.endTime;

          setMode(data.mode);
          setRoundIndex(data.roundIndex);
          setSecondsLeft(diff);
          setIsRunning(true);

          setLoading(false);
          return;
        }

        localStorage.removeItem('pomodoro-timer');
      }

      setSecondsLeft(workSeconds);

      setLoading(false);
    };

    init();
  }, []);


  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      if (!endTimeRef.current) return;

      const diff = Math.floor((endTimeRef.current - Date.now()) / 1000);

      if (diff <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);

        setSecondsLeft(0);
        handleIntervalEnd();
      } else {
        setSecondsLeft(diff);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleIntervalEnd]);


  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('pomodoro-status', { detail: isRunning })
    );
  }, [isRunning]);


  const reset = useCallback(async () => {
    if (!session) return;

    await TimerAPI.deleteSession(session.id);

    localStorage.removeItem('pomodoro-timer');

    window.location.reload();
  }, [session]);


  useEffect(() => {
    const handler = () => {
      if (isRunning) {
        setIsRunning(false);
      } else {
        startTimer(secondsLeft, mode, roundIndex);
      }
    };

    window.addEventListener('toggle-pomodoro', handler);

    return () => {
      window.removeEventListener('toggle-pomodoro', handler);
    };
  }, [isRunning, secondsLeft, mode, roundIndex, startTimer]);

  return {
    loading,
    mode,
    secondsLeft,
    workSec,
    breakSec,
    roundIndex,
    workRoundsCount,
    isRunning,
    reset,
  };
};