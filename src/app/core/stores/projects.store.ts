import { signal, computed } from '@angular/core';
import { Project } from '@core/models';

export interface ProjectFilters {
  status?: string;
  search?: string;
  teamMember?: string;
}

class ProjectsStore {
  projects = signal<Project[]>([]);
  selectedProjectId = signal<string | null>(null);
  filters = signal<ProjectFilters>({});
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  selectedProject = computed(() => {
    const id = this.selectedProjectId();
    return this.projects().find(p => p.id === id) || null;
  });

  filteredProjects = computed(() => {
    const filters = this.filters();
    let result = this.projects();

    if (filters.status) {
      result = result.filter(p => p.status.label === filters.status);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    if (filters.teamMember) {
      result = result.filter(p =>
        p.teamMembers.some(m => m.id === filters.teamMember)
      );
    }

    return result;
  });

  projectsByStatus = computed(() => {
    const map = new Map<string, Project[]>();
    this.projects().forEach(project => {
      const status = project.status.label;
      if (!map.has(status)) {
        map.set(status, []);
      }
      map.get(status)?.push(project);
    });
    return map;
  });

  totalProjects = computed(() => this.projects().length);

  activeProjects = computed(() =>
    this.projects().filter(p => p.status.label !== 'Completed')
  );

  setProjects(projects: Project[]): void {
    this.projects.set(projects);
  }

  addProject(project: Project): void {
    this.projects.update(projects => [...projects, project]);
  }

  updateProject(id: string, updates: Partial<Project>): void {
    this.projects.update(projects =>
      projects.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  }

  removeProject(id: string): void {
    this.projects.update(projects => projects.filter(p => p.id !== id));
  }

  selectProject(id: string): void {
    this.selectedProjectId.set(id);
  }

  setFilters(filters: ProjectFilters): void {
    this.filters.set(filters);
  }

  clearFilters(): void {
    this.filters.set({});
  }
}

export const projectsStore = new ProjectsStore();
