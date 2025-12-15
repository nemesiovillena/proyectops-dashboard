import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectsService, MockDataService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '@core/models';

@Component({
  selector: 'app-projects-board',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent, ErrorMessageComponent, ProjectCardComponent],
  templateUrl: './projects-board.component.html',
  styleUrl: './projects-board.component.scss'
})
export class ProjectsBoardComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private mockDataService = inject(MockDataService);

  projects = this.projectsService.projects;
  loading = this.projectsService.loading;
  error = this.projectsService.error;

  // Drag state
  draggedProjectId = signal<string | null>(null);
  dragOverColumnId = signal<string | null>(null);

  // Kanban columns
  kanbanColumns = [
    { id: 'planning', label: 'Planificación', color: '#6366f1' },
    { id: 'in-progress', label: 'En Progreso', color: '#3b82f6' },
    { id: 'on-hold', label: 'En Espera', color: '#f59e0b' },
    { id: 'completed', label: 'Completado', color: '#10b981' }
  ];

  // Group projects by status
  projectsByStatus = computed(() => {
    const allProjects = this.projects();
    const grouped: Record<string, Project[]> = {
      planning: allProjects.filter(p => p.status.label === 'Planificación'),
      'in-progress': allProjects.filter(p => p.status.label === 'En Progreso'),
      'on-hold': allProjects.filter(p => p.status.label === 'En Espera'),
      completed: allProjects.filter(p => p.status.label === 'Completado')
    };
    return grouped;
  });

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await this.projectsService.loadProjects();
  }

  onRetry(): void {
    this.loadData();
  }

  // Drag and Drop handlers
  onDragStart(event: DragEvent, projectId: string): void {
    this.draggedProjectId.set(projectId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', projectId);
    }
  }

  onDragEnd(): void {
    this.draggedProjectId.set(null);
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
    const projectId = this.draggedProjectId();

    if (!projectId) return;

    // Find the project
    const project = this.projects().find(p => p.id === projectId);
    if (!project) return;

    // Get the new status based on column
    const statusMap: Record<string, string> = {
      'planning': 'Planificación',
      'in-progress': 'En Progreso',
      'on-hold': 'En Espera',
      'completed': 'Completado'
    };

    const newStatusLabel = statusMap[targetColumnId];
    if (!newStatusLabel || project.status.label === newStatusLabel) {
      this.draggedProjectId.set(null);
      this.dragOverColumnId.set(null);
      return;
    }

    // Get the status object
    const statuses = this.mockDataService.getProjectStatuses();
    const newStatus = statuses.find(s => s.label === newStatusLabel);

    if (newStatus) {
      // Update project status
      await this.projectsService.updateProject(projectId, { status: newStatus });
    }

    this.draggedProjectId.set(null);
    this.dragOverColumnId.set(null);
  }
}
