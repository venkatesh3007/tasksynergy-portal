
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Task } from '@/types/task';

type FormData = {
  task: string;
  responsiblePerson: string;
  targetDate: Date | null;
  remarks: string;
};

export const TaskForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const [date, setDate] = React.useState<Date | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      task: '',
      responsiblePerson: '',
      targetDate: null,
      remarks: '',
    }
  });

  const onSubmit = (data: FormData) => {
    addTask({
      ...data,
      targetDate: date,
    });
    reset();
    setDate(null);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-6 bg-card rounded-lg border shadow-sm animate-fade-in"
    >
      <div className="space-y-2">
        <Label htmlFor="task">Task</Label>
        <Input
          id="task"
          placeholder="Enter task description"
          {...register('task', { required: 'Task is required' })}
          className={cn(errors.task && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.task && (
          <p className="text-destructive text-sm">{errors.task.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="responsiblePerson">Responsible Person</Label>
        <Input
          id="responsiblePerson"
          placeholder="Enter responsible person's name"
          {...register('responsiblePerson', { required: 'Responsible person is required' })}
          className={cn(errors.responsiblePerson && "border-destructive focus-visible:ring-destructive")}
        />
        {errors.responsiblePerson && (
          <p className="text-destructive text-sm">{errors.responsiblePerson.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetDate">Target Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          placeholder="Add any additional notes or remarks"
          {...register('remarks')}
          className="min-h-[100px] resize-none"
        />
      </div>
      
      <Button type="submit" className="w-full transition-all">
        Add Task
      </Button>
    </form>
  );
};
