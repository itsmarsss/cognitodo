import React, {createContext, useState, useEffect} from 'react';
import {getTasks} from '../services/api';
import {Task} from '../types';

type TasksContextType = {
  tasks: Task[];
  refreshTasks: () => void;
  updateTaskLocal: (updatedTask: Task) => void;
  deleteTaskLocal: (id: number) => void;
};

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  refreshTasks: () => {},
  updateTaskLocal: () => {},
  deleteTaskLocal: () => {},
});

export const TasksProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  const updateTaskLocal = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const deleteTaskLocal = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        refreshTasks: fetchTasks,
        updateTaskLocal,
        deleteTaskLocal,
      }}>
      {children}
    </TasksContext.Provider>
  );
};
