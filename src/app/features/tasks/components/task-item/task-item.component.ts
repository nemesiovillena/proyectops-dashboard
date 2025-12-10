import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '@core/models';
import { DateFormatPipe } from '@shared/pipes';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [RouterLink, DateFormatPipe],
  template: `
    <div class="task-item">
      <div class="task-priority" [class]="'priority-' + task.priority"></div>
      <div class="task-content">
        <h3><a [routerLink]="['/tareas', task.id]">{{ task.title }}</a></h3>
        <p>{{ task.description }}</p>
        <div class="task-meta">
          <span class="task-status" [style.background-color]="task.status.color">{{ task.status.label }}</span>
          <span>Vencimiento: {{ task.dueDate | dateFormat:'short' }}</span>
          <span>Asignado a: {{ task.assignedTo.name }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-item { display: flex; background: white; border-radius: 0.5rem; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .task-priority { width: 4px; border-radius: 4px; margin-right: 1rem; }
    .priority-low { background-color: #10b981; }
    .priority-medium { background-color: #f59e0b; }
    .priority-high { background-color: #ef4444; }
    .priority-critical { background-color: #7c3aed; }
    .task-content { flex: 1; }
    .task-content h3 { margin: 0 0 0.5rem; font-size: 1.125rem; }
    .task-content h3 a { color: #1e293b; text-decoration: none; }
    .task-content p { margin: 0 0 1rem; color: #64748b; }
    .task-meta { display: flex; gap: 1rem; font-size: 0.875rem; color: #64748b; }
    .task-status { padding: 0.25rem 0.75rem; border-radius: 1rem; color: white; font-weight: 600; }
  `]
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
}
