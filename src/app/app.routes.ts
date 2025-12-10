import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes)
      },
      {
        path: 'team',
        loadChildren: () => import('./features/team/team.routes').then(m => m.teamRoutes)
      },
      {
        path: 'metrics',
        loadChildren: () => import('./features/metrics/metrics.routes').then(m => m.metricsRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
