
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { format } from 'date-fns';
import { Task, TaskAction } from '@/types/task';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  Pencil, 
  Trash,
  Table2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskEditDialog } from './TaskEditDialog';

export const TaskTable: React.FC = () => {
  const { tasks, performAction, deleteTask } = useTaskContext();
  const [editTask, setEditTask] = useState<Task | null>(null);

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-500 hover:bg-blue-600 transition-colors">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600 transition-colors">Completed</Badge>;
      case 'irrelevant':
        return <Badge className="bg-gray-500 hover:bg-gray-600 transition-colors">Irrelevant</Badge>;
      case 'postponed':
        return <Badge className="bg-amber-500 hover:bg-amber-600 transition-colors">Postponed</Badge>;
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="w-full overflow-auto rounded-md border animate-fade-in">
      <Table className="task-table">
        <TableHeader className="bg-gray-100">
          <TableRow className="hover:bg-gray-200 border-t">
            <TableHead className="w-[50px] text-center font-bold sticky left-0 bg-gray-100 shadow-sm z-10">S.No</TableHead>
            <TableHead className="w-[120px] text-center font-bold">Create Date</TableHead>
            <TableHead className="min-w-[300px] text-left font-bold">Task</TableHead>
            <TableHead className="w-[150px] text-left font-bold">Responsible</TableHead>
            <TableHead className="w-[120px] text-center font-bold">Target Date</TableHead>
            <TableHead className="min-w-[200px] text-left font-bold">Remarks</TableHead>
            <TableHead className="w-[120px] text-center font-bold">Status</TableHead>
            <TableHead className="w-[120px] text-center font-bold">Complete Date</TableHead>
            <TableHead className="w-[80px] text-center font-bold sticky right-0 bg-gray-100 shadow-sm z-10">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Table2 className="h-10 w-10 mb-2" />
                  <p>No tasks found. Create your first task to get started.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task, index) => (
              <TableRow 
                key={task.id}
                className={`hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-gray-50/80' : 'bg-white'} ${task.status === 'completed' ? 'text-gray-500' : ''}`}
              >
                <TableCell className="font-medium text-center sticky left-0 bg-inherit shadow-sm z-10">{task.serialNumber}</TableCell>
                <TableCell className="text-center">{formatDate(task.createDate)}</TableCell>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.responsiblePerson || '—'}</TableCell>
                <TableCell className="text-center">{formatDate(task.targetDate)}</TableCell>
                <TableCell>{task.remarks || '—'}</TableCell>
                <TableCell className="text-center">{getStatusBadge(task.status)}</TableCell>
                <TableCell className="text-center">{formatDate(task.completeDate)}</TableCell>
                <TableCell className="text-center sticky right-0 bg-inherit shadow-sm z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] animate-scale-in">
                      <DropdownMenuItem onClick={() => setEditTask(task)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {task.status !== 'completed' && (
                        <DropdownMenuItem onClick={() => performAction(task.id, 'complete')}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Complete
                        </DropdownMenuItem>
                      )}
                      {task.status !== 'irrelevant' && (
                        <DropdownMenuItem onClick={() => performAction(task.id, 'irrelevant')}>
                          <XCircle className="mr-2 h-4 w-4 text-gray-500" /> Irrelevant
                        </DropdownMenuItem>
                      )}
                      {task.status !== 'postponed' && (
                        <DropdownMenuItem onClick={() => performAction(task.id, 'postpone')}>
                          <Clock className="mr-2 h-4 w-4 text-amber-500" /> Postpone
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteTask(task.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {editTask && (
        <TaskEditDialog 
          task={editTask} 
          open={!!editTask} 
          onOpenChange={(open) => !open && setEditTask(null)} 
        />
      )}
    </div>
  );
};
