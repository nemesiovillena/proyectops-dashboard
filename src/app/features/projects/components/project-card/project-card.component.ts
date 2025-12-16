import { Component, Input, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Project } from '@core/models';
import { CardComponent } from '@shared/components';
import { DateFormatPipe, TruncatePipe } from '@shared/pipes';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, DateFormatPipe, TruncatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  private router = inject(Router);
  @Input({ required: true }) project!: Project;

  navigateToProject(): void {
    this.router.navigate(['/proyectos', this.project.id]);
  }
}
