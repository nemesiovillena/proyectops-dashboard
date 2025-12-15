import { Injectable, inject, signal, computed } from '@angular/core';
import { Project } from '@core/models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private supabaseService = inject(SupabaseService);

  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  filteredProjects = computed(() => this.projects());
  activeProjects = computed(() =>
    this.projects().filter(p => p.status.label !== 'Completado')
  );

  async loadProjects(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: projectsData, error: projectsError } = await this.supabaseService.client
        .from('projects')
        .select(`
          *,
          status:project_statuses(*),
          project_team_members(
            team_member:team_members(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const mappedProjects: Project[] = (projectsData || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: {
          label: p.status.label,
          value: p.status.value,
          color: p.status.color
        },
        startDate: new Date(p.start_date),
        endDate: new Date(p.end_date),
        progress: p.progress,
        budget: p.budget,
        teamMembers: (p.project_team_members || []).map((ptm: any) => ({
          id: ptm.team_member.id,
          name: ptm.team_member.name,
          email: ptm.team_member.email,
          role: ptm.team_member.role,
          availability: ptm.team_member.availability
        })),
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));

      this.projects.set(mappedProjects);
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      this.error.set('Error al cargar los proyectos');
      this.loading.set(false);
    }
  }

  async getProjectById(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: projectData, error: projectError } = await this.supabaseService.client
        .from('projects')
        .select(`
          *,
          status:project_statuses(*),
          project_team_members(
            team_member:team_members(*)
          )
        `)
        .eq('id', id)
        .single();

      if (projectError) throw projectError;

      if (projectData) {
        const project: Project = {
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          status: {
            label: projectData.status.label,
            value: projectData.status.value,
            color: projectData.status.color
          },
          startDate: new Date(projectData.start_date),
          endDate: new Date(projectData.end_date),
          progress: projectData.progress,
          budget: projectData.budget,
          teamMembers: (projectData.project_team_members || []).map((ptm: any) => ({
            id: ptm.team_member.id,
            name: ptm.team_member.name,
            email: ptm.team_member.email,
            role: ptm.team_member.role,
            availability: ptm.team_member.availability
          })),
          createdAt: new Date(projectData.created_at),
          updatedAt: new Date(projectData.updated_at)
        };

        this.selectedProject.set(project);
      }

      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading project:', err);
      this.error.set('Proyecto no encontrado');
      this.loading.set(false);
    }
  }

  async createProject(project: Partial<Project>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Obtener el ID del estado por defecto
      const { data: statusData } = await this.supabaseService.client
        .from('project_statuses')
        .select('id')
        .eq('value', 'planning')
        .single();

      const { data: newProject, error: insertError } = await this.supabaseService.client
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          status_id: project.status?.value
            ? (await this.supabaseService.client
                .from('project_statuses')
                .select('id')
                .eq('value', project.status.value)
                .single()).data?.id
            : statusData?.id,
          start_date: project.startDate,
          end_date: project.endDate,
          progress: project.progress || 0,
          budget: project.budget || 0
        })
        .select(`
          *,
          status:project_statuses(*)
        `)
        .single();

      if (insertError) throw insertError;

      // Insertar relaciones con team members si existen
      if (project.teamMembers && project.teamMembers.length > 0 && newProject) {
        const teamMemberRelations = project.teamMembers.map(member => ({
          project_id: newProject.id,
          team_member_id: member.id
        }));

        await this.supabaseService.client
          .from('project_team_members')
          .insert(teamMemberRelations);
      }

      // Recargar proyectos
      await this.loadProjects();
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error creating project:', err);
      this.error.set('Error al crear el proyecto');
      this.loading.set(false);
    }
  }

  async updateProject(id: string, project: Partial<Project>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const updateData: any = {
        name: project.name,
        description: project.description,
        start_date: project.startDate,
        end_date: project.endDate,
        progress: project.progress,
        budget: project.budget
      };

      // Si hay cambio de estado, obtener el ID del estado
      if (project.status?.value) {
        const { data: statusData } = await this.supabaseService.client
          .from('project_statuses')
          .select('id')
          .eq('value', project.status.value)
          .single();

        if (statusData) {
          updateData.status_id = statusData.id;
        }
      }

      const { error: updateError } = await this.supabaseService.client
        .from('projects')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Actualizar team members si están presentes
      if (project.teamMembers) {
        // Eliminar relaciones existentes
        await this.supabaseService.client
          .from('project_team_members')
          .delete()
          .eq('project_id', id);

        // Insertar nuevas relaciones
        if (project.teamMembers.length > 0) {
          const teamMemberRelations = project.teamMembers.map(member => ({
            project_id: id,
            team_member_id: member.id
          }));

          await this.supabaseService.client
            .from('project_team_members')
            .insert(teamMemberRelations);
        }
      }

      // Recargar proyectos
      await this.loadProjects();
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error updating project:', err);
      this.error.set('Error al actualizar el proyecto');
      this.loading.set(false);
    }
  }

  async deleteProject(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error: deleteError } = await this.supabaseService.client
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      this.projects.update(projects => projects.filter(p => p.id !== id));
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error deleting project:', err);
      this.error.set('Error al eliminar el proyecto');
      this.loading.set(false);
    }
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

  async getProjectStatuses() {
    const { data, error } = await this.supabaseService.client
      .from('project_statuses')
      .select('*')
      .order('label');

    if (error) {
      console.error('Error loading project statuses:', error);
      return [];
    }

    return (data || []).map(s => ({
      label: s.label,
      value: s.value,
      color: s.color
    }));
  }
}
