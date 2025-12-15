import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TasksService } from '@core/services/tasks.service';
import { ProjectsService } from '@core/services/projects.service';
import { TeamService } from '@core/services/team.service';
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
  private teamService = inject(TeamService);
  private router = inject(Router);

  projects = this.projectsService.projects;
  teamMembers = this.teamService.teamMembers;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    projectId: ['', Validators.required],
    assignedToId: ['', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await Promise.all([
      this.projectsService.loadProjects(),
      this.teamService.loadTeam()
    ]);
  }

  async onSubmit(): Promise<void> {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const assignedToId = formValue.assignedToId;

      await this.tasksService.createTask({
        title: formValue.title || '',
        description: formValue.description || '',
        projectId: formValue.projectId || '',
        priority: formValue.priority as any,
        dueDate: new Date(formValue.dueDate!),
        assignedTo: assignedToId ? { id: assignedToId } as any : undefined
      });

      this.router.navigate(['/tareas']);
    }
  }
}
