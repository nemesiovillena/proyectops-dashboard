import { Injectable, inject, signal, computed } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { TeamMember } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private mockDataService = inject(MockDataService);

  teamMembers = signal<TeamMember[]>([]);
  selectedMember = signal<TeamMember | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  availableMembers = computed(() =>
    this.teamMembers().filter(m => m.availability === 'available')
  );

  totalMembers = computed(() => this.teamMembers().length);

  loadTeam(): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const data = this.mockDataService.getTeamMembers();
      this.teamMembers.set(data);
      this.loading.set(false);
    }, 500);
  }

  getMemberById(id: string): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      const data = this.mockDataService.getTeamMemberById(id);
      if (data) {
        this.selectedMember.set(data);
        this.loading.set(false);
      } else {
        this.error.set('Team member not found');
        this.loading.set(false);
      }
    }, 300);
  }

  getMembersByProject(projectId: string) {
    return computed(() =>
      this.teamMembers().filter(m => m.projects.includes(projectId))
    );
  }

  updateMember(id: string, member: Partial<TeamMember>): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.teamMembers.update(members =>
        members.map(m => m.id === id ? { ...m, ...member } : m)
      );
      this.loading.set(false);
    }, 500);
  }

  searchMembers(query: string) {
    return computed(() =>
      this.teamMembers().filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase()) ||
        m.role.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  getAvailableMembers() {
    return computed(() =>
      this.teamMembers().filter(m => m.availability === 'available')
    );
  }
}
