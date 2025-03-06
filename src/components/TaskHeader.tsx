
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertCircle } from 'lucide-react';

export const TaskHeader: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const postponedTasks = tasks.filter(task => task.status === 'postponed').length;
  const irrelevantTasks = tasks.filter(task => task.status === 'irrelevant').length;
  
  return (
    <div className="flex flex-col space-y-4 animate-fade-in">
      <h1 className="text-3xl font-semibold tracking-tight">Task Management</h1>
      <p className="text-muted-foreground">
        Keep track of your tasks, deadlines, and responsibilities in one place.
      </p>
      
      <div className="flex flex-wrap gap-3 my-4">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
          <span className="text-sm font-medium">All Tasks:</span>
          <Badge variant="secondary" className="ml-1">{tasks.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-950/30 px-3 py-1">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Pending:</span>
          <Badge variant="secondary" className="bg-blue-500">{pendingTasks}</Badge>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-950/30 px-3 py-1">
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">Completed:</span>
          <Badge variant="secondary" className="bg-green-500">{completedTasks}</Badge>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-950/30 px-3 py-1">
          <Clock className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Postponed:</span>
          <Badge variant="secondary" className="bg-amber-500">{postponedTasks}</Badge>
        </div>
        
        <div className="flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
          <AlertCircle className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Irrelevant:</span>
          <Badge variant="secondary" className="bg-gray-500">{irrelevantTasks}</Badge>
        </div>
      </div>
    </div>
  );
};
