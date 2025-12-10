import { TeamMember } from './team-member.model';
import { Status } from './status.model';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  assignedTo: TeamMember;
  priority: TaskPriority;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
