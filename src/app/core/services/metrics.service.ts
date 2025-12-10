import { Injectable, inject, signal, computed } from '@angular/core';
import { MockDataService } from './mock-data.service';

export interface MetricsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  teamSize: number;
  averageProjectDuration: number;
  budgetUtilization: number;
}

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private mockDataService = inject(MockDataService);

  metrics = signal<MetricsData | null>(null);
  projectMetrics = signal<any>(null);
  teamMetrics = signal<any>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  projectCompletionRate = computed(() => {
    const data = this.metrics();
    if (!data) return 0;
    return data.totalProjects > 0
      ? (data.completedProjects / data.totalProjects) * 100
      : 0;
  });

  taskCompletionRate = computed(() => {
    const data = this.metrics();
    if (!data) return 0;
    return data.totalTasks > 0
      ? (data.completedTasks / data.totalTasks) * 100
      : 0;
  });

  loadMetrics(): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const data = this.mockDataService.getMetrics();
      this.metrics.set(data);
      this.loading.set(false);
    }, 500);
  }

  getProjectMetrics(projectId?: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const mockProjectMetrics = {
        projectId: projectId || 'all',
        tasksCompleted: 15,
        totalTasks: 20,
        progress: 75,
        velocity: 2.5
      };
      this.projectMetrics.set(mockProjectMetrics);
      this.loading.set(false);
    }, 500);
  }

  getTeamMetrics(memberId?: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const mockTeamMetrics = {
        memberId: memberId || 'all',
        tasksAssigned: 8,
        tasksCompleted: 5,
        efficiency: 85,
        availability: 'available'
      };
      this.teamMetrics.set(mockTeamMetrics);
      this.loading.set(false);
    }, 500);
  }

  getProgressMetrics() {
    return computed(() => ({
      projectCompletion: this.projectCompletionRate(),
      taskCompletion: this.taskCompletionRate()
    }));
  }

  getPerformanceMetrics() {
    return computed(() => {
      const data = this.metrics();
      if (!data) return null;
      return {
        averageDuration: data.averageProjectDuration,
        budgetUtilization: data.budgetUtilization,
        teamSize: data.teamSize
      };
    });
  }
}
