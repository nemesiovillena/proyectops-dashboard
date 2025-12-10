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
    { id: 'planning', label: 'Planning', color: '#6366f1' },
    { id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
    { id: 'on-hold', label: 'On Hold', color: '#f59e0b' },
    { id: 'completed', label: 'Completed', color: '#10b981' }
  ];

  // Group projects by status
  projectsByStatus = computed(() => {
    const allProjects = this.projects();
    const grouped: Record<string, Project[]> = {
      planning: allProjects.filter(p => p.status.label === 'Planning'),
      'in-progress': allProjects.filter(p => p.status.label === 'In Progress'),
      'on-hold': allProjects.filter(p => p.status.label === 'On Hold'),
      completed: allProjects.filter(p => p.status.label === 'Completed')
    };
    return grouped;
  });

  ngOnInit(): void {
    this.projectsService.loadProjects();
  }

  onRetry(): void {
    this.projectsService.loadProjects();
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

  onDrop(event: DragEvent, targetColumnId: string): void {
    event.preventDefault();
    const projectId = this.draggedProjectId();

    if (!projectId) return;

    // Find the project
    const project = this.projects().find(p => p.id === projectId);
    if (!project) return;

    // Get the new status based on column
    const statusMap: Record<string, string> = {
      'planning': 'Planning',
      'in-progress': 'In Progress',
      'on-hold': 'On Hold',
      'completed': 'Completed'
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
      this.projectsService.updateProject(projectId, { status: newStatus });
    }

    this.draggedProjectId.set(null);
    this.dragOverColumnId.set(null);
  }
}
