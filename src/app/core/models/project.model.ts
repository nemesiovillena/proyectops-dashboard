import { TeamMember } from './team-member.model';
import { Status } from './status.model';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: Status;
  startDate: Date;
  endDate: Date;
  teamMembers: TeamMember[];
  progress: number;
  budget: number;
  createdAt: Date;
  updatedAt: Date;
}
