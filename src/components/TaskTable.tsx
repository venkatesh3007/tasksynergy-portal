
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
  Check, 
  X, 
  SkipForward,
  Pencil, 
  Trash, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock 
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
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">S.No</TableHead>
            <TableHead className="w-[120px]">Create Date</TableHead>
            <TableHead className="min-w-[300px]">Task</TableHead>
            <TableHead className="w-[150px]">Responsible</TableHead>
            <TableHead className="w-[120px]">Target Date</TableHead>
            <TableHead className="min-w-[200px]">Remarks</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Complete Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No tasks found. Create your first task to get started.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow 
                key={task.id}
                className={task.status === 'completed' ? 'task-row-complete' : ''}
              >
                <TableCell className="font-medium">{task.serialNumber}</TableCell>
                <TableCell>{formatDate(task.createDate)}</TableCell>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.responsiblePerson}</TableCell>
                <TableCell>{formatDate(task.targetDate)}</TableCell>
                <TableCell>{task.remarks || '—'}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{formatDate(task.completeDate)}</TableCell>
                <TableCell>
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
