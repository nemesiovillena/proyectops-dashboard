import { Routes } from '@angular/router';

export const teamRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/team-overview/team-overview.component').then(m => m.TeamOverviewComponent) },
  { path: ':id', loadComponent: () => import('./components/member-detail/member-detail.component').then(m => m.MemberDetailComponent) }
];
