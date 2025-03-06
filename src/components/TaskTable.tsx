
import React, { useState, useRef, KeyboardEvent } from 'react';
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
import { Input } from '@/components/ui/input';
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  Pencil, 
  Trash,
  Table2,
  Plus
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
  const { tasks, performAction, deleteTask, addTask } = useTaskContext();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<string>('');
  const [newResponsible, setNewResponsible] = useState<string>('');
  const [newRemarks, setNewRemarks] = useState<string>('');
  const taskInputRef = useRef<HTMLInputElement>(null);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim()) {
      addTask({
        task: newTask.trim(),
        responsiblePerson: newResponsible.trim(),
        targetDate: null,
        remarks: newRemarks.trim()
      });
      setNewTask('');
      setNewResponsible('');
      setNewRemarks('');
      setTimeout(() => {
        if (taskInputRef.current) {
          taskInputRef.current.focus();
        }
      }, 0);
    }
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
          
          {/* Excel-like editable row for adding new tasks */}
          <TableRow className="hover:bg-blue-50 bg-blue-50/30 border-t">
            <TableCell className="font-medium text-center sticky left-0 bg-blue-50/30 shadow-sm z-10">
              <Plus className="mx-auto h-4 w-4 text-blue-500" />
            </TableCell>
            <TableCell className="text-center text-muted-foreground text-sm italic">
              {format(new Date(), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="p-0">
              <Input
                ref={taskInputRef}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a task and press Enter..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
                autoFocus
              />
            </TableCell>
            <TableCell className="p-0">
              <Input
                value={newResponsible}
                onChange={(e) => setNewResponsible(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Responsible person"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
              />
            </TableCell>
            <TableCell className="text-center text-muted-foreground text-sm">
              —
            </TableCell>
            <TableCell className="p-0">
              <Input
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add remarks (optional)"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full"
              />
            </TableCell>
            <TableCell className="text-center text-muted-foreground text-sm">
              Pending
            </TableCell>
            <TableCell className="text-center text-muted-foreground text-sm">
              —
            </TableCell>
            <TableCell className="text-center sticky right-0 bg-blue-50/30 shadow-sm z-10">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  if (newTask.trim()) {
                    addTask({
                      task: newTask.trim(),
                      responsiblePerson: newResponsible.trim(),
                      targetDate: null,
                      remarks: newRemarks.trim()
                    });
                    setNewTask('');
                    setNewResponsible('');
                    setNewRemarks('');
                    setTimeout(() => {
                      if (taskInputRef.current) {
                        taskInputRef.current.focus();
                      }
                    }, 0);
                  }
                }}
                disabled={!newTask.trim()}
                className="h-8 w-8 text-blue-500"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
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
