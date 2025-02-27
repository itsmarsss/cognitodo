import axios from 'axios';

// Base URL for the Go backend
const API_URL = 'http://localhost:8080'; // Adjust if your backend runs on a different host/port

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task-related API calls

// Updated to include priority and dueDate
export const createTask = async (
  name: string,
  description: string,
  status: 'pending' | 'completed' | 'cancelled' | 'rescheduled' = 'pending',
  priority: 'high' | 'medium' | 'low',
  duration: string,
) => {
  const response = await api.post('/tasks', {
    name,
    description,
    status,
    priority,
    duration,
  });
  return response.data;
};

// No changes needed; retrieves all tasks with new fields
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Updated to include priority and dueDate
export const updateTask = async (
  id: number,
  name: string,
  description: string,
  status: 'pending' | 'completed' | 'cancelled' | 'rescheduled',
  priority: 'high' | 'medium' | 'low',
  duration: string,
) => {
  const response = await api.put(`/tasks/${id}`, {
    name,
    description,
    status,
    priority,
    duration,
  });
  return response.data;
};

// No changes needed; deletes task by ID
export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

// Updated to accept a date parameter
export const getDailyPlan = async (date: string) => {
  const response = await api.get(`/plan?date=${date}`);
  return response.data;
};
