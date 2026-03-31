import api from './axios';

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

export interface UserDto extends Partial<UserProfile> {
  password?: string;
}

export const SettingsAPI = {
  getProfile() {
    return api.get<UserProfileResponse>('/user/profile');
  },

  updateProfile(data: UserDto) {
    return api.put<UserProfile>('/user/profile', data);
  },
};
