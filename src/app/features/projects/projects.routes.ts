import { Routes } from '@angular/router';
import { ProjectsBoardComponent } from './components/projects-board/projects-board.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';

export const projectsRoutes: Routes = [
  {
    path: '',
    component: ProjectsBoardComponent
  },
  {
    path: 'nuevo',
    component: ProjectFormComponent
  },
  {
    path: ':id',
    component: ProjectDetailComponent
  }
];
