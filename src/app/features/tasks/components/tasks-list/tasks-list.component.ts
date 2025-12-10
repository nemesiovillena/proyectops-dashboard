import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TasksService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [RouterLink, CardComponent, LoadingSpinnerComponent, ErrorMessageComponent, TaskItemComponent],
  template: `
    <div class="tasks-list">
      <div class="tasks-list-header">
        <h1>Tareas</h1>
        <a routerLink="/tareas/nuevo" class="btn-new-task">+ Nueva Tarea</a>
      </div>

      @if (loading()) {
        <app-loading-spinner message="Cargando tareas..."></app-loading-spinner>
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="onRetry()"></app-error-message>
      } @else {
        <div class="tasks-container">
          @for (task of tasks(); track task.id) {
            <app-task-item [task]="task"></app-task-item>
          } @empty {
            <p class="no-tasks">No se encontraron tareas</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tasks-list { padding: 2rem; }
    .tasks-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .tasks-list-header h1 { margin: 0; font-size: 2rem; }
    .btn-new-task { padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 0.375rem; }
    .tasks-container { display: flex; flex-direction: column; gap: 1rem; }
    .no-tasks { text-align: center; color: #64748b; padding: 3rem; }
  `]
})
export class TasksListComponent implements OnInit {
  private tasksService = inject(TasksService);

  tasks = this.tasksService.tasks;
  loading = this.tasksService.loading;
  error = this.tasksService.error;

  ngOnInit(): void {
    this.tasksService.loadTasks();
  }

  onRetry(): void {
    this.tasksService.loadTasks();
  }
}
