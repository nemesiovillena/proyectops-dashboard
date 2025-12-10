import { signal, computed } from '@angular/core';
import { TeamMember } from '@core/models';

class TeamStore {
  members = signal<TeamMember[]>([]);
  selectedMemberId = signal<string | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  selectedMember = computed(() => {
    const id = this.selectedMemberId();
    return this.members().find(m => m.id === id) || null;
  });

  availableMembers = computed(() =>
    this.members().filter(m => m.availability === 'available')
  );

  membersByProject = computed(() => {
    const map = new Map<string, TeamMember[]>();
    this.members().forEach(member => {
      member.projects.forEach(projectId => {
        if (!map.has(projectId)) {
          map.set(projectId, []);
        }
        map.get(projectId)?.push(member);
      });
    });
    return map;
  });

  memberWorkload = computed(() => {
    const map = new Map<string, number>();
    this.members().forEach(member => {
      map.set(member.id, member.projects.length);
    });
    return map;
  });

  totalMembers = computed(() => this.members().length);

  setMembers(members: TeamMember[]): void {
    this.members.set(members);
  }

  addMember(member: TeamMember): void {
    this.members.update(members => [...members, member]);
  }

  updateMember(id: string, updates: Partial<TeamMember>): void {
    this.members.update(members =>
      members.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  }

  removeMember(id: string): void {
    this.members.update(members => members.filter(m => m.id !== id));
  }

  selectMember(id: string): void {
    this.selectedMemberId.set(id);
  }
}

export const teamStore = new TeamStore();
