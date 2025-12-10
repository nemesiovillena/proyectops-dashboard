import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@shared/components';
import { ProjectsService } from '@core/services/projects.service';
import { TasksService } from '@core/services/tasks.service';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-dashboard-summary',
  standalone: true,
  imports: [RouterLink, CardComponent],
  template: `
    <app-card title="Estadísticas Rápidas">
      <div class="summary-grid">
        <div class="summary-item">
          <h3>{{ projectsService.activeProjects().length }}</h3>
          <p>Proyectos Activos</p>
          <a routerLink="/projects">Ver todos →</a>
        </div>
        <div class="summary-item">
          <h3>{{ openTasksCount() }}</h3>
          <p>Tareas Abiertas</p>
          <a routerLink="/tasks">Ver todas →</a>
        </div>
        <div class="summary-item">
          <h3>{{ teamService.teamMembers().length }}</h3>
          <p>Miembros del Equipo</p>
          <a routerLink="/team">Ver todos →</a>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1.5rem; }
    .summary-item { text-align: center; }
    .summary-item h3 { margin: 0; font-size: 2rem; color: #3b82f6; }
    .summary-item p { margin: 0.5rem 0; color: #64748b; }
    .summary-item a { color: #3b82f6; text-decoration: none; font-size: 0.875rem; }
  `]
})
export class DashboardSummaryComponent {
  projectsService = inject(ProjectsService);
  tasksService = inject(TasksService);
  teamService = inject(TeamService);

  openTasksCount = computed(() =>
    this.tasksService.tasks().filter(t => t.status.label !== 'Completado').length
  );
}
