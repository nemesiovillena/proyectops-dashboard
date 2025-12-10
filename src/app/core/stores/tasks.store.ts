import { signal, computed } from '@angular/core';
import { Task } from '@core/models';

export interface TaskFilters {
  status?: string;
  priority?: string;
  projectId?: string;
  assignedTo?: string;
  search?: string;
}

class TasksStore {
  tasks = signal<Task[]>([]);
  selectedTaskId = signal<string | null>(null);
  filters = signal<TaskFilters>({});
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  selectedTask = computed(() => {
    const id = this.selectedTaskId();
    return this.tasks().find(t => t.id === id) || null;
  });

  filteredTasks = computed(() => {
    const filters = this.filters();
    let result = this.tasks();

    if (filters.status) {
      result = result.filter(t => t.status.label === filters.status);
    }

    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }

    if (filters.projectId) {
      result = result.filter(t => t.projectId === filters.projectId);
    }

    if (filters.assignedTo) {
      result = result.filter(t => t.assignedTo.id === filters.assignedTo);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
      );
    }

    return result;
  });

  tasksByProject = computed(() => {
    const map = new Map<string, Task[]>();
    this.tasks().forEach(task => {
      const projectId = task.projectId;
      if (!map.has(projectId)) {
        map.set(projectId, []);
      }
      map.get(projectId)?.push(task);
    });
    return map;
  });

  tasksByStatus = computed(() => {
    const map = new Map<string, Task[]>();
    this.tasks().forEach(task => {
      const status = task.status.label;
      if (!map.has(status)) {
        map.set(status, []);
      }
      map.get(status)?.push(task);
    });
    return map;
  });

  tasksByPriority = computed(() => {
    const map = new Map<string, Task[]>();
    this.tasks().forEach(task => {
      const priority = task.priority;
      if (!map.has(priority)) {
        map.set(priority, []);
      }
      map.get(priority)?.push(task);
    });
    return map;
  });

  overdueTasks = computed(() => {
    const now = new Date();
    return this.tasks().filter(t =>
      new Date(t.dueDate) < now && t.status.label !== 'Completed'
    );
  });

  upcomingTasks = computed(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.tasks().filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= now && dueDate <= nextWeek;
    });
  });

  setTasks(tasks: Task[]): void {
    this.tasks.set(tasks);
  }

  addTask(task: Task): void {
    this.tasks.update(tasks => [...tasks, task]);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }

  removeTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  selectTask(id: string): void {
    this.selectedTaskId.set(id);
  }

  setFilters(filters: TaskFilters): void {
    this.filters.set(filters);
  }

  clearFilters(): void {
    this.filters.set({});
  }
}

export const tasksStore = new TasksStore();
