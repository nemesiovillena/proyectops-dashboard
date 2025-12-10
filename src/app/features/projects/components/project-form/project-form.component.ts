import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProjectsService } from '@core/services/projects.service';
import { CardComponent, ButtonComponent } from '@shared/components';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CardComponent, ButtonComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    budget: [0, [Validators.required, Validators.min(0)]]
  });

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.projectsService.createProject(this.projectForm.value as any);
      this.router.navigate(['/projects']);
    }
  }
}
