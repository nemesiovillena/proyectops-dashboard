import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectsService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';
import { DateFormatPipe } from '@shared/pipes';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, CardComponent, LoadingSpinnerComponent, ErrorMessageComponent, DateFormatPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectsService = inject(ProjectsService);

  project = this.projectsService.selectedProject;
  loading = this.projectsService.loading;
  error = this.projectsService.error;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectsService.getProjectById(id);
    }
  }

  onRetry(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectsService.getProjectById(id);
    }
  }
}
