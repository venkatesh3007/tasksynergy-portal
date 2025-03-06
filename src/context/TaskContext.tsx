
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskAction } from '@/types/task';
import { toast } from "sonner";
import { 
  fetchTasks as fetchTasksFromSupabase,
  addTask as addTaskToSupabase,
  updateTask as updateTaskInSupabase,
  deleteTask as deleteTaskInSupabase,
  performTaskAction as performTaskActionInSupabase
} from '@/utils/supabaseUtils';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  addTask: (task: Omit<Task, 'id' | 'serialNumber' | 'createDate' | 'status' | 'completeDate'>) => Promise<void>;
  updateTask: (id: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  performAction: (id: string, action: TaskAction) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load tasks from Supabase on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await fetchTasksFromSupabase();
        setTasks(tasksData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const addTask = async (task: Omit<Task, 'id' | 'serialNumber' | 'createDate' | 'status' | 'completeDate'>) => {
    try {
      const newTask: Task = {
        id: uuidv4(),
        serialNumber: tasks.length + 1,
        createDate: new Date(),
        status: 'pending',
        completeDate: null,
        ...task
      };

      // Add to Supabase and wait for response
      const savedTask = await addTaskToSupabase(newTask);
      
      // Update local state with the saved task
      setTasks(prev => [...prev, savedTask]);
      toast.success("Task added successfully");
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add task'));
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      // Update in Supabase
      const updated = await updateTaskInSupabase(id, updatedTask);
      
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, ...updated } : task
        )
      );
      toast.success("Task updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update task'));
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      // Delete from Supabase
      await deleteTaskInSupabase(id);
      
      // Update local state
      setTasks(prev => {
        const newTasks = prev.filter(task => task.id !== id);
        // Update serial numbers
        return newTasks.map((task, index) => ({
          ...task,
          serialNumber: index + 1
        }));
      });
      toast.success("Task deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete task'));
      toast.error("Failed to delete task");
    }
  };

  const performAction = async (id: string, action: TaskAction) => {
    try {
      // Perform action in Supabase
      const updatedTask = await performTaskActionInSupabase(id, action);
      
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? updatedTask : task
        )
      );
      
      let message = "";
      switch (action) {
        case 'complete':
          message = "Task marked as completed";
          break;
        case 'irrelevant':
          message = "Task marked as irrelevant";
          break;
        case 'postpone':
          message = "Task postponed";
          break;
      }
      
      toast.success(message);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to perform action ${action}`));
      toast.error(`Failed to perform action: ${action}`);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, updateTask, deleteTask, performAction }}>
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
