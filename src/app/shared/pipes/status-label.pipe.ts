import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
  standalone: true
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'on-hold': 'On Hold',
      'cancelled': 'Cancelled'
    };

    return statusMap[status.toLowerCase()] || status;
  }
}
