import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  @Input({ required: true }) project!: Project;
}
