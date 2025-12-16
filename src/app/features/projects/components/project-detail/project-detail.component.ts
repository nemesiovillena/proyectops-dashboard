import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ProjectsService, TasksService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';
import { DateFormatPipe } from '@shared/pipes';
import { TeamMember } from '@core/models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, NgClass, CardComponent, LoadingSpinnerComponent, ErrorMessageComponent, DateFormatPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);

  project = this.projectsService.selectedProject;
  loading = computed(() => this.projectsService.loading() || this.tasksService.loading());
  error = computed(() => this.projectsService.error() || this.tasksService.error());

  // Obtener las tareas del proyecto actual usando el servicio
  projectTasks = computed(() => {
    const currentProject = this.project();
    if (!currentProject) return [];
    return this.tasksService.tasks().filter(t => t.projectId === currentProject.id);
  });

  // Obtener miembros del equipo que tienen tareas asignadas
  teamMembersWithTasks = computed(() => {
    const tasks = this.projectTasks();
    const currentProject = this.project();
    if (!currentProject || tasks.length === 0) return [];

    const memberIds = new Set<string>();
    const membersMap = new Map<string, TeamMember>();

    // Crear un mapa de miembros del proyecto
    currentProject.teamMembers.forEach(member => {
      membersMap.set(member.id, member);
    });

    // Obtener miembros que tienen tareas asignadas
    tasks.forEach(task => {
      task.assignedTo.forEach(member => {
        if (membersMap.has(member.id)) {
          memberIds.add(member.id);
        }
      });
    });

    // Convertir a array de miembros
    return Array.from(memberIds).map(id => membersMap.get(id)!);
  });

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Cargar proyecto y tareas en paralelo
      await Promise.all([
        this.projectsService.getProjectById(id),
        this.tasksService.loadTasks()
      ]);
    }
  }

  onRetry(): void {
    this.loadData();
  }
}

