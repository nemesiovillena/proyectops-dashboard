import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, TeamMember } from '@core/models';
import { DateFormatPipe, TruncatePipe } from '@shared/pipes';
import { TasksService } from '@core/services';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, DateFormatPipe, TruncatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  @Output() delete = new EventEmitter<string>();

  private tasksService = inject(TasksService);

  // Obtener miembros del equipo que tienen tareas asignadas en este proyecto
  activeMembers = computed(() => {
    const allTasks = this.tasksService.tasks();
    const projectTasks = allTasks.filter(t => t.projectId === this.project.id);

    if (projectTasks.length === 0) return [];

    const memberIds = new Set<string>();
    const membersMap = new Map<string, TeamMember>();

    // Crear mapa de todos los miembros posibles del proyecto
    this.project.teamMembers.forEach(member => membersMap.set(member.id, member));

    // Recolectar IDs de miembros con tareas
    projectTasks.forEach(task => {
      task.assignedTo.forEach(member => {
        // Asegurarnos de tener la info del miembro (del task o del proyecto)
        if (!membersMap.has(member.id)) {
          membersMap.set(member.id, member);
        }
        memberIds.add(member.id);
      });
    });

    return Array.from(memberIds).map(id => membersMap.get(id)!);
  });

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit(this.project.id);
  }
}

