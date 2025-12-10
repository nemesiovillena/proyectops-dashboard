import { Component, OnInit, inject } from '@angular/core';
import { MetricsService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent } from '@shared/components';
import { StatCardComponent } from '../stat-card/stat-card.component';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CardComponent, LoadingSpinnerComponent, StatCardComponent],
  template: `
    <div class="metrics-dashboard">
      <h1>Metrics Dashboard</h1>
      @if (loading()) {
        <app-loading-spinner message="Loading metrics..."></app-loading-spinner>
      } @else if (metrics()) {
        <div class="metrics-grid">
          <app-stat-card title="Total Projects" [value]="metrics()!.totalProjects" icon="📊"></app-stat-card>
          <app-stat-card title="Active Projects" [value]="metrics()!.activeProjects" icon="🚀"></app-stat-card>
          <app-stat-card title="Completed Tasks" [value]="metrics()!.completedTasks" icon="✅"></app-stat-card>
          <app-stat-card title="Team Size" [value]="metrics()!.teamSize" icon="👥"></app-stat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .metrics-dashboard { padding: 2rem; }
    .metrics-dashboard h1 { margin: 0 0 2rem; font-size: 2rem; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
  `]
})
export class MetricsDashboardComponent implements OnInit {
  private metricsService = inject(MetricsService);

  metrics = this.metricsService.metrics;
  loading = this.metricsService.loading;

  ngOnInit(): void {
    this.metricsService.loadMetrics();
  }
}
