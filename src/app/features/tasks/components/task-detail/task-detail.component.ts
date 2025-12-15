import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TasksService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent } from '@shared/components';
import { DateFormatPipe } from '@shared/pipes';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [RouterLink, CardComponent, LoadingSpinnerComponent, DateFormatPipe],
  template: `
    <div class="task-detail">
      <a routerLink="/tareas" class="back-link">← Volver a Tareas</a>
      @if (loading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (task()) {
        <app-card>
          <h1>{{ task()!.title }}</h1>
          <p>{{ task()!.description }}</p>
          <div class="task-info">
            <p><strong>Estado:</strong> {{ task()!.status.label }}</p>
            <p><strong>Prioridad:</strong> {{ task()!.priority }}</p>
            <p><strong>Asignado a:</strong> {{ task()!.assignedTo.name }}</p>
            <p><strong>Fecha de vencimiento:</strong> {{ task()!.dueDate | dateFormat:'medium' }}</p>
          </div>
        </app-card>
      }
    </div>
  `,
  styles: [`.task-detail { padding: 2rem; } .back-link { color: #3b82f6; text-decoration: none; } .task-info p { margin: 0.5rem 0; }`]
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tasksService = inject(TasksService);

  task = this.tasksService.selectedTask;
  loading = this.tasksService.loading;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.tasksService.getTaskById(id);
  }
}
