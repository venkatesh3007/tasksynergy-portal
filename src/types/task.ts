
export interface Task {
  id: string;
  serialNumber: number;
  createDate: Date;
  task: string;
  responsiblePerson: string;
  targetDate: Date | null;
  remarks: string;
  status: 'pending' | 'completed' | 'irrelevant' | 'postponed';
  completeDate: Date | null;
}

export type TaskAction = 'complete' | 'irrelevant' | 'postpone';

export type TaskStatus = Task['status'];
