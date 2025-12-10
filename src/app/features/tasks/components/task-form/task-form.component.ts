import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TasksService } from '@core/services/tasks.service';
import { ProjectsService } from '@core/services/projects.service';
import { CardComponent, ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CardComponent, ButtonComponent],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private tasksService = inject(TasksService);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  projects = this.projectsService.projects;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    projectId: ['', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.projectsService.loadProjects();
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.tasksService.createTask(this.taskForm.value as any);
      this.router.navigate(['/tareas']);
    }
  }
}
