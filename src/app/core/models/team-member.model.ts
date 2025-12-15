export type MemberAvailability = 'available' | 'busy' | 'away';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  projects: string[];
  availability: MemberAvailability;
  skills?: string[];
  joinedAt?: Date;
}
