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
export const createTask = async (
  description: string,
  status: string = 'pending',
) => {
  const response = await api.post('/tasks', {description, status});
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const updateTask = async (
  id: number,
  description: string,
  status: string,
) => {
  const response = await api.put(`/tasks/${id}`, {description, status});
  return response.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};

// Daily plan API call
export const getDailyPlan = async () => {
  const response = await api.get('/plan');
  return response.data;
};
