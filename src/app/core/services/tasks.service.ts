import { Injectable, inject, signal, computed } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { Task } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private mockDataService = inject(MockDataService);

  tasks = signal<Task[]>([]);
  selectedTask = signal<Task | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  overdueTasks = computed(() => {
    const now = new Date();
    return this.tasks().filter(t => new Date(t.dueDate) < now && t.status.label !== 'Completed');
  });

  upcomingTasks = computed(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.tasks().filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= now && dueDate <= nextWeek;
    });
  });

  loadTasks(): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const data = this.mockDataService.getTasks();
      this.tasks.set(data);
      this.loading.set(false);
    }, 500);
  }

  getTaskById(id: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const data = this.mockDataService.getTaskById(id);
      if (data) {
        this.selectedTask.set(data);
        this.loading.set(false);
      } else {
        this.error.set('Task not found');
        this.loading.set(false);
      }
    }, 300);
  }

  getTasksByProject(projectId: string) {
    return computed(() =>
      this.tasks().filter(t => t.projectId === projectId)
    );
  }

  getTasksByMember(memberId: string) {
    return computed(() =>
      this.tasks().filter(t => t.assignedTo.id === memberId)
    );
  }

  createTask(task: Partial<Task>): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const newTask: Task = {
        id: Date.now().toString(),
        projectId: task.projectId || '',
        title: task.title || '',
        description: task.description || '',
        status: task.status || this.mockDataService.getTaskStatuses()[0],
        assignedTo: task.assignedTo || this.mockDataService.getTeamMembers()[0],
        priority: task.priority || 'medium',
        dueDate: task.dueDate || new Date(),
        estimatedHours: task.estimatedHours || 0,
        actualHours: task.actualHours || 0,
        tags: task.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.tasks.update(tasks => [...tasks, newTask]);
      this.loading.set(false);
    }, 500);
  }

  updateTask(id: string, task: Partial<Task>): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.tasks.update(tasks =>
        tasks.map(t => t.id === id ? { ...t, ...task, updatedAt: new Date() } : t)
      );
      this.loading.set(false);
    }, 500);
  }

  deleteTask(id: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      this.loading.set(false);
    }, 500);
  }

  filterByStatus(status: string) {
    return computed(() =>
      this.tasks().filter(t => t.status.label === status)
    );
  }

  filterByPriority(priority: string) {
    return computed(() =>
      this.tasks().filter(t => t.priority === priority)
    );
  }
}
