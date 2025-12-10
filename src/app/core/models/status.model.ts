export type StatusType = 'project' | 'task';

export interface Status {
  id: string;
  label: string;
  color: string;
  type: StatusType;
  order: number;
}
