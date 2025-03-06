
import { createClient } from '@supabase/supabase-js';
import { Task } from '@/types/task';

// Initialize Supabase client
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Type for our tasks table
export type TaskRow = Omit<Task, 'createDate' | 'targetDate' | 'completeDate'> & {
  createDate: string;
  targetDate: string | null;
  completeDate: string | null;
};

// Convert Date objects to ISO strings for storage
export const taskToRow = (task: Task): TaskRow => ({
  ...task,
  createDate: task.createDate.toISOString(),
  targetDate: task.targetDate ? task.targetDate.toISOString() : null,
  completeDate: task.completeDate ? task.completeDate.toISOString() : null,
});

// Convert ISO strings back to Date objects
export const rowToTask = (row: TaskRow): Task => ({
  ...row,
  createDate: new Date(row.createDate),
  targetDate: row.targetDate ? new Date(row.targetDate) : null,
  completeDate: row.completeDate ? new Date(row.completeDate) : null,
});

// Fetch all tasks from Supabase
export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('serialNumber', { ascending: true });
    
  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  
  return (data as TaskRow[]).map(rowToTask);
};

// Add a new task to Supabase
export const addTask = async (task: Task): Promise<Task> => {
  const taskRow = taskToRow(task);
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskRow)
    .select()
    .single();
    
  if (error) {
    console.error('Error adding task:', error);
    throw error;
  }
  
  return rowToTask(data as TaskRow);
};

// Update an existing task in Supabase
export const updateTask = async (id: string, updatedTask: Partial<Task>): Promise<Task> => {
  // Create a separate object for updates to avoid modifying the input
  const updates: Partial<TaskRow> = {};
  
  // Copy non-date properties directly
  if ('id' in updatedTask) updates.id = updatedTask.id;
  if ('serialNumber' in updatedTask) updates.serialNumber = updatedTask.serialNumber;
  if ('task' in updatedTask) updates.task = updatedTask.task;
  if ('responsiblePerson' in updatedTask) updates.responsiblePerson = updatedTask.responsiblePerson;
  if ('remarks' in updatedTask) updates.remarks = updatedTask.remarks;
  if ('status' in updatedTask) updates.status = updatedTask.status;
  
  // Handle date properties separately with proper conversion
  if ('createDate' in updatedTask && updatedTask.createDate) {
    updates.createDate = updatedTask.createDate.toISOString();
  }
  
  if ('targetDate' in updatedTask) {
    updates.targetDate = updatedTask.targetDate ? updatedTask.targetDate.toISOString() : null;
  }
  
  if ('completeDate' in updatedTask) {
    updates.completeDate = updatedTask.completeDate ? updatedTask.completeDate.toISOString() : null;
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  
  return rowToTask(data as TaskRow);
};

// Delete a task from Supabase
export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Fetch responsible persons from Supabase (or any API)
export const fetchResponsiblePersons = async (): Promise<string[]> => {
  // Replace this with a real API call if you have a separate table
  const { data, error } = await supabase
    .from('responsible_persons')
    .select('name');
    
  if (error) {
    console.error('Error fetching responsible persons:', error);
    // Return mock data as fallback
    return [
      "John Doe",
      "Jane Smith",
      "Alex Johnson",
      "Taylor Williams",
      "Sam Brown",
      "Jordan Miller",
      "Casey Davis"
    ];
  }
  
  return data.map(person => person.name);
};

// Perform action on a task (complete, irrelevant, postpone)
export const performTaskAction = async (id: string, action: 'complete' | 'irrelevant' | 'postpone'): Promise<Task> => {
  let updates: Partial<TaskRow> = {
    status: action === 'complete' ? 'completed' : action === 'irrelevant' ? 'irrelevant' : 'postponed',
  };
  
  if (action === 'complete') {
    updates.completeDate = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error performing action ${action} on task:`, error);
    throw error;
  }
  
  return rowToTask(data as TaskRow);
};
