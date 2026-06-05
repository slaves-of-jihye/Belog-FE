import { BoardType } from '../../post/model/types';

export type DeadlinePriority = 'high' | 'medium' | 'low';

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  category: BoardType;
  priority: DeadlinePriority;
  completed: boolean;
  createdAt?: string;
}

export type CreateDeadlineRequest = Omit<Deadline, 'id' | 'completed' | 'createdAt'>;
