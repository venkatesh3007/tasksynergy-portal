import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const fetchResponsiblePersons = async (): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    "John Doe",
    "Jane Smith",
    "Alex Johnson",
    "Taylor Williams",
    "Sam Brown",
    "Jordan Miller",
    "Casey Davis"
  ];
};

interface TaskEditDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({ task, open, onOpenChange }) => {
  const { updateTask } = useTaskContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    task: task.task,
    responsiblePerson: task.responsiblePerson,
    targetDate: task.targetDate,
    remarks: task.remarks,
  });

  const { data: responsiblePersons = [], isLoading: isLoadingPersons } = useQuery({
    queryKey: ['responsiblePersons'],
    queryFn: fetchResponsiblePersons,
    initialData: [],
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateTask(task.id, formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of your task and click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-task">Task</Label>
            <Input
              id="edit-task"
              name="task"
              value={formData.task}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-responsible">Responsible Person</Label>
            <Select 
              value={formData.responsiblePerson} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, responsiblePerson: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select person">
                  {formData.responsiblePerson || <span className="flex items-center text-muted-foreground"><User className="h-4 w-4 mr-2" /> Assign to</span>}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {isLoadingPersons ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : (
                  responsiblePersons.map((person) => (
                    <SelectItem key={person} value={person}>
                      {person}
                    </SelectItem>
                  ))
                )}
                <SelectItem value="other">Other...</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-target-date">Target Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.targetDate 
                    ? format(formData.targetDate, "PPP") 
                    : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.targetDate || undefined}
                  onSelect={(date) => setFormData(prev => ({ ...prev, targetDate: date }))}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-remarks">Remarks</Label>
            <Textarea
              id="edit-remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
