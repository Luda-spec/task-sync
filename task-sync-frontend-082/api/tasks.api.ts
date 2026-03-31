import api from './axios';

export type TaskPriority = 'low' | 'medium' | 'high';

export type RepeatType = 
  | 'never' 
  | 'daily_week'        
  | 'every_2days'       
  | 'every_2days_month' 
  | 'weekly_month';

type BackendRepeatType = 
  | 'NEVER' 
  | 'DAILY_WEEK'        
  | 'EVERY_2DAYS'       
  | 'EVERY_2DAYS_MONTH' 
  | 'WEEKLY_MONTH';

export interface Task {
  id: string;
  name: string;
  description?: string;           
  priority: TaskPriority;
  isCompleted: boolean;
  timeFrom?: string;              
  timeTo?: string;               
  repeat?: RepeatType;                            
  scheduledAt?: string;           
  createdAt?: string;             
  updatedAt: string;
  userId: string;
}

export interface CreateTaskInput {
  name: string;
  priority?: TaskPriority;
  description?: string;
  timeFrom?: string;
  timeTo?: string;
  repeat?: RepeatType;                
  scheduledAt?: string;
}

const toBackendRepeat = (value: RepeatType): BackendRepeatType => {
  switch (value) {
    case 'never': return 'NEVER';
    case 'daily_week': return 'DAILY_WEEK';
    case 'every_2days': return 'EVERY_2DAYS';
    case 'every_2days_month': return 'EVERY_2DAYS_MONTH';
    case 'weekly_month': return 'WEEKLY_MONTH';
    default: return 'NEVER';
  }
};

export const TasksAPI = {
  getAll(selectedDate?: Date) {
    if (!selectedDate) {
      return api.get<Task[]>('/user/tasks');
    }
    
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return api.get<Task[]>(`/user/tasks?date=${dateStr}`);
  },

  getById(id: string) {
    return api.get<Task>(`/user/tasks/${id}`);
  },

  create(data: CreateTaskInput) {
    return api.post<Task>('/user/tasks', {
      ...data,
      repeat: data.repeat ? toBackendRepeat(data.repeat) : undefined
    });
  },

  update(id: string, data: Partial<CreateTaskInput>) {
    const { scheduledAt, ...rest } = data;
    
    return api.put<Task>(`/user/tasks/${id}`, {
      ...rest,
      scheduledAt: scheduledAt || undefined
    });
  },

  delete(id: string) {
    return api.delete(`/user/tasks/${id}`);
  },

  toggleComplete(id: string, isCompleted: boolean) {
    return api.put<Task>(`/user/tasks/${id}`, { isCompleted });
  },
};