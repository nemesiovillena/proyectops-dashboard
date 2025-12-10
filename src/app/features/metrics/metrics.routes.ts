import { Routes } from '@angular/router';

export const metricsRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/metrics-dashboard/metrics-dashboard.component').then(m => m.MetricsDashboardComponent) }
];
