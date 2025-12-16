import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  taskId: string | null = null;
  isEditing = false;

  projects = this.projectsService.projects;
  teamMembers = this.teamService.teamMembers;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    projectId: ['', Validators.required],
    assignedToIds: [[] as string[], Validators.required],
    priority: ['medium', Validators.required],
    dueDate: ['', Validators.required],
    description: ['']
  });

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.taskId;
    this.loadData();
  }

  async loadData(): Promise<void> {
    await Promise.all([
      this.projectsService.loadProjects(),
      this.teamService.loadTeam()
    ]);

    if (this.isEditing && this.taskId) {
      await this.tasksService.getTaskById(this.taskId);
      const task = this.tasksService.selectedTask();

      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          projectId: task.projectId,
          assignedToIds: task.assignedTo.map(m => m.id),
          priority: task.priority,
          dueDate: new Date(task.dueDate).toISOString().split('T')[0],
          description: task.description
        });
      }
    }
  }

  toggleMember(memberId: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const currentIds = this.taskForm.value.assignedToIds || [];

    if (checkbox.checked) {
      this.taskForm.patchValue({
        assignedToIds: [...currentIds, memberId]
      });
    } else {
      this.taskForm.patchValue({
        assignedToIds: currentIds.filter(id => id !== memberId)
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const assignedToIds = formValue.assignedToIds as string[];

      const taskData = {
        title: formValue.title || '',
        description: formValue.description || '',
        projectId: formValue.projectId || '',
        priority: formValue.priority as any,
        dueDate: new Date(formValue.dueDate!),
        assignedTo: assignedToIds.map(id => ({ id })) as any
      };

      if (this.isEditing && this.taskId) {
        await this.tasksService.updateTask(this.taskId, taskData);
      } else {
        await this.tasksService.createTask(taskData);
      }

      this.router.navigate(['/tareas']);
    }
  }
}
