import { Injectable, inject, signal, computed } from '@angular/core';
import { TeamMember } from '@core/models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private supabaseService = inject(SupabaseService);

  teamMembers = signal<TeamMember[]>([]);
  selectedMember = signal<TeamMember | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  availableMembers = computed(() =>
    this.teamMembers().filter(m => m.availability === 'available')
  );

  totalMembers = computed(() => this.teamMembers().length);

  async loadTeam(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: membersData, error: membersError } = await this.supabaseService.client
        .from('team_members')
        .select(`
          *,
          project_team_members(project_id)
        `)
        .order('name');

      if (membersError) throw membersError;

      const mappedMembers: TeamMember[] = (membersData || []).map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        availability: m.availability,
        projects: (m.project_team_members || []).map((ptm: any) => ptm.project_id)
      }));

      this.teamMembers.set(mappedMembers);
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading team members:', err);
      this.error.set('Error al cargar los miembros del equipo');
      this.loading.set(false);
    }
  }

  async getMemberById(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: memberData, error: memberError } = await this.supabaseService.client
        .from('team_members')
        .select(`
          *,
          project_team_members(project_id)
        `)
        .eq('id', id)
        .single();

      if (memberError) throw memberError;

      if (memberData) {
        const member: TeamMember = {
          id: memberData.id,
          name: memberData.name,
          email: memberData.email,
          role: memberData.role,
          availability: memberData.availability,
          projects: (memberData.project_team_members || []).map((ptm: any) => ptm.project_id)
        };

        this.selectedMember.set(member);
      }

      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading team member:', err);
      this.error.set('Miembro del equipo no encontrado');
      this.loading.set(false);
    }
  }

  getMembersByProject(projectId: string) {
    return computed(() =>
      this.teamMembers().filter(m => m.projects.includes(projectId))
    );
  }

  async createMember(member: Partial<TeamMember>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error: insertError } = await this.supabaseService.client
        .from('team_members')
        .insert({
          name: member.name,
          email: member.email,
          role: member.role,
          availability: member.availability || 'available'
        });

      if (insertError) throw insertError;

      // Recargar miembros
      await this.loadTeam();
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error creating team member:', err);
      this.error.set('Error al crear el miembro del equipo');
      this.loading.set(false);
    }
  }

  async updateMember(id: string, member: Partial<TeamMember>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const updateData: any = {
        name: member.name,
        email: member.email,
        role: member.role,
        availability: member.availability
      };

      const { error: updateError } = await this.supabaseService.client
        .from('team_members')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Recargar miembros
      await this.loadTeam();
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error updating team member:', err);
      this.error.set('Error al actualizar el miembro del equipo');
      this.loading.set(false);
    }
  }

  async deleteMember(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error: deleteError } = await this.supabaseService.client
        .from('team_members')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      this.teamMembers.update(members => members.filter(m => m.id !== id));
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error deleting team member:', err);
      this.error.set('Error al eliminar el miembro del equipo');
      this.loading.set(false);
    }
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
