import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@shared/components';
import { ProjectsService } from '@core/services/projects.service';
import { MockDataService } from '@core/services/mock-data.service';

@Component({
    selector: 'app-project-status-stats',
    standalone: true,
    imports: [CommonModule, CardComponent],
    templateUrl: './project-status-stats.component.html',
    styleUrl: './project-status-stats.component.scss'
})
export class ProjectStatusStatsComponent {
    private projectsService = inject(ProjectsService);
    private mockDataService = inject(MockDataService);

    statusCounts = computed(() => {
        const projects = this.projectsService.projects();
        const statuses = this.mockDataService.getProjectStatuses();

        return statuses.map(status => ({
            status,
            count: projects.filter(p => p.status.label === status.label).length
        }));
    });
}
