import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@shared/components';
import { ProjectsService } from '@core/services/projects.service';
import { TasksService } from '@core/services/tasks.service';
import { DateFormatPipe } from '@shared/pipes';

interface ActivityItem {
  type: 'project' | 'task';
  id: string;
  title: string;
  action: string;
  date: Date;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, DateFormatPipe],
  template: `
    <div class="bg-white rounded-2xl shadow-soft p-6 border border-neutral-100">
      <h3 class="text-lg font-bold text-neutral-900 mb-4">Actividad Reciente</h3>
      <div class="space-y-3">
        @if (recentActivity().length === 0) {
          <p class="text-neutral-500 text-sm py-4 text-center">No hay actividad reciente</p>
        } @else {
          @for (activity of recentActivity(); track activity.id) {
            <a [routerLink]="activity.type === 'project' ? ['/proyectos', activity.id] : ['/tareas', activity.id]"
               class="flex items-start p-3 rounded-xl hover:bg-neutral-50 transition-colors group">
              <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                   [style.background-color]="activity.color + '20'">
                <svg class="w-5 h-5" [style.color]="activity.color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="activity.icon" />
                </svg>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                  {{ activity.title }}
                </p>
                <p class="text-xs text-neutral-500 mt-0.5">
                  {{ activity.action }} • {{ activity.date | dateFormat:'short' }}
                </p>
              </div>
              <svg class="w-4 h-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          }
        }
      </div>
    </div>
  `,
  styles: []
})
export class RecentActivityComponent {
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);

  recentActivity = computed(() => {
    const projects = this.projectsService.projects();
    const tasks = this.tasksService.tasks();

    const activities: ActivityItem[] = [];

    // Agregar proyectos actualizados recientemente
    projects.forEach(project => {
      activities.push({
        type: 'project',
        id: project.id,
        title: project.name,
        action: 'Proyecto actualizado',
        date: project.updatedAt,
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
        color: project.status.color
      });
    });

    // Agregar tareas actualizadas recientemente
    tasks.forEach(task => {
      activities.push({
        type: 'task',
        id: task.id,
        title: task.title,
        action: 'Tarea actualizada',
        date: task.updatedAt || task.createdAt,
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        color: task.status.color
      });
    });

    // Ordenar por fecha más reciente y tomar las últimas 3
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);
  });
}
