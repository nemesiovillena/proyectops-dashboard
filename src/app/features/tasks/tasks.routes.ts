import { Routes } from '@angular/router';

export const tasksRoutes: Routes = [
  { path: '', loadComponent: () => import('./components/tasks-list/tasks-list.component').then(m => m.TasksListComponent) },
  { path: 'nuevo', loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent) },
  { path: ':id', loadComponent: () => import('./components/task-detail/task-detail.component').then(m => m.TaskDetailComponent) }
];
