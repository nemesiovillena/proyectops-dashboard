import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockDataService } from './mock-data.service';
import { Project } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private mockDataService = inject(MockDataService);

  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  filteredProjects = computed(() => this.projects());
  activeProjects = computed(() =>
    this.projects().filter(p => p.status.label !== 'Completed')
  );

  loadProjects(): void {
    this.loading.set(true);
    this.http.get<{ projects: any[] }>('assets/data/projects.json').subscribe({
      next: (data) => {
        const mappedProjects: Project[] = data.projects.map(p => ({
          ...p,
          startDate: new Date(p.startDate),
          endDate: new Date(p.endDate),
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          teamMembers: (p.teamMembers as string[])
            .map(id => this.mockDataService.getTeamMemberById(id))
            .filter((m): m is NonNullable<typeof m> => !!m)
        }));
        this.projects.set(mappedProjects);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error.set('Failed to load projects');
        this.loading.set(false);
      }
    });
  }

  getProjectById(id: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const data = this.mockDataService.getProjectById(id);
      if (data) {
        this.selectedProject.set(data);
        this.loading.set(false);
      } else {
        this.error.set('Project not found');
        this.loading.set(false);
      }
    }, 300);
  }

  createProject(project: Partial<Project>): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: project.name || '',
        description: project.description || '',
        status: project.status || this.mockDataService.getProjectStatuses()[0],
        startDate: project.startDate || new Date(),
        endDate: project.endDate || new Date(),
        teamMembers: project.teamMembers || [],
        progress: project.progress || 0,
        budget: project.budget || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.projects.update(projects => [...projects, newProject]);
      this.loading.set(false);
    }, 500);
  }

  updateProject(id: string, project: Partial<Project>): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.projects.update(projects =>
        projects.map(p => p.id === id ? { ...p, ...project, updatedAt: new Date() } : p)
      );
      this.loading.set(false);
    }, 500);
  }

  deleteProject(id: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.projects.update(projects => projects.filter(p => p.id !== id));
      this.loading.set(false);
    }, 500);
  }

  searchProjects(query: string) {
    return computed(() =>
      this.projects().filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  filterByStatus(status: string) {
    return computed(() =>
      this.projects().filter(p => p.status.label === status)
    );
  }
}
