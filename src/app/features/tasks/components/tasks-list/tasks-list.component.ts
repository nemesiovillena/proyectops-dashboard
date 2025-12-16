import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TasksService, MockDataService, ProjectsService } from '@core/services';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '@core/models';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, TaskCardComponent],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent implements OnInit {
  private tasksService = inject(TasksService);
  private mockDataService = inject(MockDataService);
  private projectsService = inject(ProjectsService);

  tasks = this.tasksService.tasks;
  loading = this.tasksService.loading;
  error = this.tasksService.error;

  // Drag state
  draggedTaskId = signal<string | null>(null);
  dragOverColumnId = signal<string | null>(null);

  // Kanban columns
  kanbanColumns = [
    { id: 'todo', label: 'Pendiente', color: '#6366f1' },
    { id: 'in-progress', label: 'En Progreso', color: '#3b82f6' },
    { id: 'review', label: 'Revisión', color: '#f59e0b' },
    { id: 'completed', label: 'Completado', color: '#10b981' }
  ];

  // Group tasks by status
  tasksByStatus = computed(() => {
    const allTasks = this.tasks();
    const grouped: Record<string, Task[]> = {
      todo: allTasks.filter(t => t.status.label === 'Pendiente'),
      'in-progress': allTasks.filter(t => t.status.label === 'En Progreso'),
      review: allTasks.filter(t => t.status.label === 'Revisión'),
      completed: allTasks.filter(t => t.status.label === 'Completado')
    };
    return grouped;
  });

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await this.tasksService.loadTasks();
  }

  onRetry(): void {
    this.loadData();
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, taskId: string): void {
    this.draggedTaskId.set(taskId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', taskId);
    }
  }

  onDragEnd(): void {
    this.draggedTaskId.set(null);
    this.dragOverColumnId.set(null);
  }

  onDragOver(event: DragEvent, columnId: string): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverColumnId.set(columnId);
  }

  onDragLeave(columnId: string): void {
    if (this.dragOverColumnId() === columnId) {
      this.dragOverColumnId.set(null);
    }
  }

  async onDrop(event: DragEvent, targetColumnId: string): Promise<void> {
    event.preventDefault();
    const taskId = this.draggedTaskId();

    if (!taskId) return;

    // Find the task
    const task = this.tasks().find(t => t.id === taskId);
    if (!task) return;

    // Get the new status based on column
    const statusMap: Record<string, string> = {
      'todo': 'Pendiente',
      'in-progress': 'En Progreso',
      'review': 'Revisión',
      'completed': 'Completado'
    };

    const newStatusLabel = statusMap[targetColumnId];
    if (!newStatusLabel || task.status.label === newStatusLabel) {
      this.draggedTaskId.set(null);
      this.dragOverColumnId.set(null);
      return;
    }

    // Get the status object
    const statuses = this.mockDataService.getTaskStatuses();
    const newStatus = statuses.find(s => s.label === newStatusLabel);

    if (newStatus) {
      // Update task status
      await this.tasksService.updateTask(taskId, { status: newStatus });

      // Recargar proyectos para actualizar el progreso
      await this.projectsService.loadProjects();
    }

    this.draggedTaskId.set(null);
    this.dragOverColumnId.set(null);
  }

  async onDeleteTask(taskId: string): Promise<void> {
    await this.tasksService.deleteTask(taskId);
    // Recargar proyectos para actualizar el progreso
    await this.projectsService.loadProjects();
  }
}
