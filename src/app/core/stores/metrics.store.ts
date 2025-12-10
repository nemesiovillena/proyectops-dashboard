import { signal, computed } from '@angular/core';

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

class MetricsStore {
  metrics = signal<MetricsData>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    teamSize: 0,
    averageProjectDuration: 0,
    budgetUtilization: 0
  });
  selectedPeriod = signal<string>('month');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  projectCompletionRate = computed(() => {
    const data = this.metrics();
    return data.totalProjects > 0
      ? (data.completedProjects / data.totalProjects) * 100
      : 0;
  });

  taskCompletionRate = computed(() => {
    const data = this.metrics();
    return data.totalTasks > 0
      ? (data.completedTasks / data.totalTasks) * 100
      : 0;
  });

  averageTaskDuration = computed(() => {
    const data = this.metrics();
    return data.averageProjectDuration;
  });

  teamProductivity = computed(() => {
    const data = this.metrics();
    return data.teamSize > 0
      ? data.completedTasks / data.teamSize
      : 0;
  });

  budgetUtilization = computed(() => {
    const data = this.metrics();
    return data.budgetUtilization;
  });

  trendsData = computed(() => ({
    projectCompletion: this.projectCompletionRate(),
    taskCompletion: this.taskCompletionRate(),
    productivity: this.teamProductivity()
  }));

  setMetrics(metrics: MetricsData): void {
    this.metrics.set(metrics);
  }

  updateMetrics(updates: Partial<MetricsData>): void {
    this.metrics.update(current => ({ ...current, ...updates }));
  }

  setPeriod(period: string): void {
    this.selectedPeriod.set(period);
  }
}

export const metricsStore = new MetricsStore();
