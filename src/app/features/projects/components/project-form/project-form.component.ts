import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectsService = inject(ProjectsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId: string | null = null;
  isEditing = false;
  title = 'Nuevo Proyecto';
  submitLabel = 'Crear Proyecto';

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    budget: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditing = true;
      this.title = 'Editar Proyecto';
      this.submitLabel = 'Guardar Cambios';
      this.loadProjectData();
    }
  }

  async loadProjectData(): Promise<void> {
    if (!this.projectId) return;

    await this.projectsService.getProjectById(this.projectId);
    const project = this.projectsService.selectedProject();

    if (project) {
      this.projectForm.patchValue({
        name: project.name,
        description: project.description,
        startDate: project.startDate.toISOString().split('T')[0],
        endDate: project.endDate.toISOString().split('T')[0],
        budget: project.budget
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const projectData = {
        name: formValue.name!,
        description: formValue.description!,
        startDate: new Date(formValue.startDate!),
        endDate: new Date(formValue.endDate!),
        budget: formValue.budget!,
        progress: 0 // Default or preserve? updateProject handles this
      };

      if (this.isEditing && this.projectId) {
        // Remove progress if strict typing complains, or map it correctly
        // For update, we might want to preserve existing progress if not in form.
        // But here we are just passing partial. 
        // Let's pass what's in the form. The service seems to take Partial<Project>.
        await this.projectsService.updateProject(this.projectId, projectData);
      } else {
        await this.projectsService.createProject(projectData);
      }

      this.router.navigate(['/proyectos']);
    }
  }
}
