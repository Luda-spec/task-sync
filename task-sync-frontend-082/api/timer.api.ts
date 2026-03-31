import api from '@/api/axios';

export type PomodoroRound = {
  id: string;
  totalSeconds: number;
  isCompleted: boolean;
};

export type PomodoroSession = {
  id: string;
  isCompleted: boolean;
  rounds: PomodoroRound[];
};

export type UserProfile = {
  workInterval: number;
  breakInterval: number;
  intervalsCount: number;
};

export const TimerAPI = {
  async getUserSettings(): Promise<UserProfile> {
    const { data } = await api.get('/user/profile');
    return data.user;
  },

  async getTodaySession(): Promise<PomodoroSession | null> {
    const { data } = await api.get('/user/timer/today');
    return data;
  },

  async createSession(): Promise<PomodoroSession> {
    const { data } = await api.post('/user/timer');
    return data;
  },

  async createSessionWithRounds(rounds: PomodoroRound[]): Promise<PomodoroSession> {
    const { data } = await api.post('/user/timer', { rounds });
    return data;
  },

  async updateRound(
    roundId: string,
    payload: { totalSeconds: number; isCompleted?: boolean }
  ): Promise<PomodoroRound> {
    const { data } = await api.put(`/user/timer/round/${roundId}`, payload);
    return data;
  },

  async finishSession(sessionId: string) {
    await api.put(`/user/timer/${sessionId}`, { isCompleted: true });
  },

  async deleteSession(sessionId: string) {
    await api.delete(`/user/timer/${sessionId}`);
  },
};