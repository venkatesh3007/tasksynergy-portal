
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskAction } from '@/types/task';
import { format } from 'date-fns';
import { toast } from "sonner";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'serialNumber' | 'createDate' | 'status' | 'completeDate'>) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  performAction: (id: string, action: TaskAction) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'taskSyncTasks';

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedTasks) {
      try {
        // Parse JSON and convert date strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          createDate: new Date(task.createDate),
          targetDate: task.targetDate ? new Date(task.targetDate) : null,
          completeDate: task.completeDate ? new Date(task.completeDate) : null
        }));
      } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
        return [];
      }
    }
    
    return [];
  });

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'serialNumber' | 'createDate' | 'status' | 'completeDate'>) => {
    const newTask: Task = {
      id: uuidv4(),
      serialNumber: tasks.length + 1,
      createDate: new Date(),
      status: 'pending',
      completeDate: null,
      ...task
    };

    setTasks(prev => [...prev, newTask]);
    toast.success("Task added successfully");
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
    toast.success("Task updated successfully");
  };

  const deleteTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.filter(task => task.id !== id);
      // Update serial numbers
      return newTasks.map((task, index) => ({
        ...task,
        serialNumber: index + 1
      }));
    });
    toast.success("Task deleted successfully");
  };

  const performAction = (id: string, action: TaskAction) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    
    if (!taskToUpdate) {
      toast.error("Task not found");
      return;
    }
    
    let updatedStatus: Task['status'] = 'pending';
    let completeDate: Date | null = null;
    let message = "";
    
    switch (action) {
      case 'complete':
        updatedStatus = 'completed';
        completeDate = new Date();
        message = "Task marked as completed";
        break;
      case 'irrelevant':
        updatedStatus = 'irrelevant';
        message = "Task marked as irrelevant";
        break;
      case 'postpone':
        updatedStatus = 'postponed';
        message = "Task postponed";
        break;
    }
    
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, status: updatedStatus, completeDate } 
          : task
      )
    );
    
    toast.success(message);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, performAction }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
