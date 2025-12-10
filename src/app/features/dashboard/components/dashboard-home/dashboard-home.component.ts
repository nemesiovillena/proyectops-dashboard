import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@shared/components';
import { DashboardSummaryComponent } from '../dashboard-summary/dashboard-summary.component';
import { RecentActivityComponent } from '../recent-activity/recent-activity.component';
import { ProjectStatusStatsComponent } from '../project-status-stats/project-status-stats.component';
import { ProjectsService } from '@core/services/projects.service';
import { TasksService } from '@core/services/tasks.service';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, CardComponent, DashboardSummaryComponent, RecentActivityComponent, ProjectStatusStatsComponent],
  template: `
    <div class="space-y-8">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p class="text-primary-100 text-lg">Here's what's happening with your projects today</p>
          </div>
          <div class="hidden md:block">
            <svg class="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <app-dashboard-summary></app-dashboard-summary>

      <!-- Project Status Stats -->
      <app-project-status-stats></app-project-status-stats>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <app-recent-activity></app-recent-activity>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-2xl shadow-soft p-6 border border-neutral-100">
          <h3 class="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <a routerLink="/projects/new"
               class="flex items-center p-3 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all duration-200 group">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="font-medium">New Project</span>
              <svg class="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a routerLink="/tasks/new"
               class="flex items-center p-3 rounded-xl bg-secondary-50 text-secondary-700 hover:bg-secondary-100 transition-all duration-200 group">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span class="font-medium">New Task</span>
              <svg class="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <a routerLink="/team"
               class="flex items-center p-3 rounded-xl bg-success-50 text-success-700 hover:bg-success-100 transition-all duration-200 group">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span class="font-medium">View Team</span>
              <svg class="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardHomeComponent {
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);
  private teamService = inject(TeamService);

  ngOnInit() {
    this.projectsService.loadProjects();
    this.tasksService.loadTasks();
    this.teamService.loadTeam();
  }
}
