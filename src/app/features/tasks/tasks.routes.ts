import { Routes } from '@angular/router';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

export const tasksRoutes: Routes = [
  {
    path: '',
    component: TasksListComponent
  },
  {
    path: 'nuevo',
    component: TaskFormComponent
  },
  {
    path: 'editar/:id',
    component: TaskFormComponent
  },
  {
    path: ':id',
    component: TaskDetailComponent
  }
];
