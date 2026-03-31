import api from './axios';
import { Task } from './tasks.api'; 

export interface StatisticItem {
  label: 'Total' | 'Completed tasks' | 'Today tasks' | 'Week tasks';
  value: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  workInterval?: number;
  breakInterval?: number;
  intervalsCount?: number;
}

export interface UserProfileResponse {
  user: UserProfile;
  statistics: StatisticItem[];
}


export const HomeAPI = {
  getProfile() {
    return api.get<UserProfileResponse>('/user/profile');
  },

  getAllTasks() {
    return api.get<Task[]>('/user/tasks');
  },
};