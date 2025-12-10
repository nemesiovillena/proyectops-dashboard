import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'panel',
        pathMatch: 'full'
      },
      {
        path: 'panel',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'proyectos',
        loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes)
      },
      {
        path: 'tareas',
        loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.tasksRoutes)
      },
      {
        path: 'equipo',
        loadChildren: () => import('./features/team/team.routes').then(m => m.teamRoutes)
      },
      {
        path: 'metricas',
        loadChildren: () => import('./features/metrics/metrics.routes').then(m => m.metricsRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'panel'
  }
];
