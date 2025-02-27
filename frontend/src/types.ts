export type Task = {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'high' | 'medium' | 'low';
  due_time: string;
  duration: string;
};

export type ScheduledTask = {
  task_id: number;
  start_time: string; // e.g., '10:00 AM'
  end_time: string; // e.g., '11:00 AM'
  priority: string; // e.g., 'high', 'medium', 'low'
};

export type DailyPlan = {
  date: string; // e.g., '2023-12-25'
  schedule: ScheduledTask[];
};
