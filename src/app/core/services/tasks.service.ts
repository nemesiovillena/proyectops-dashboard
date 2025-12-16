import { Injectable, inject, signal, computed } from '@angular/core';
import { Task } from '@core/models';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private supabaseService = inject(SupabaseService);

  tasks = signal<Task[]>([]);
  selectedTask = signal<Task | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  overdueTasks = computed(() => {
    const now = new Date();
    return this.tasks().filter(t => new Date(t.dueDate) < now && t.status.label !== 'Completado');
  });

  upcomingTasks = computed(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return this.tasks().filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate >= now && dueDate <= nextWeek;
    });
  });

  async loadTasks(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: tasksData, error: tasksError } = await this.supabaseService.client
        .from('tasks')
        .select(`
          *,
          status:task_statuses(*),
          task_assignments!task_assignments_task_id_fkey(
            team_member:team_members(*)
          ),
          project:projects(*)
        `)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      const mappedTasks: Task[] = (tasksData || [])
        .filter(t => t.status) // Solo verificar que tenga estado
        .map(t => ({
          id: t.id,
          projectId: t.project_id,
          title: t.title,
          description: t.description,
          status: {
            label: t.status.label,
            value: t.status.value,
            color: t.status.color
          },
          assignedTo: t.task_assignments ? t.task_assignments.map((ta: any) => ({
            id: ta.team_member.id,
            name: ta.team_member.name,
            email: ta.team_member.email,
            role: ta.team_member.role,
            availability: ta.team_member.availability,
            projects: []
          })) : [],
          priority: t.priority,
          dueDate: new Date(t.due_date),
          estimatedHours: 0,
          actualHours: 0,
          tags: [],
          createdAt: new Date(t.created_at),
          updatedAt: new Date(t.updated_at)
        }));

      this.tasks.set(mappedTasks);
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      const errorMessage = err?.message || 'Error al cargar las tareas';
      this.error.set(`Error al cargar las tareas: ${errorMessage}`);
      this.loading.set(false);
    }
  }

  async getTaskById(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data: taskData, error: taskError } = await this.supabaseService.client
        .from('tasks')
        .select(`
          *,
          status:task_statuses(*),
          task_assignments!task_assignments_task_id_fkey(
            team_member:team_members(*)
          ),
          project:projects(*)
        `)
        .eq('id', id)
        .single();

      if (taskError) throw taskError;

      if (taskData) {
        const task: Task = {
          id: taskData.id,
          projectId: taskData.project_id,
          title: taskData.title,
          description: taskData.description,
          status: {
            label: taskData.status.label,
            value: taskData.status.value,
            color: taskData.status.color
          },
          assignedTo: taskData.task_assignments ? taskData.task_assignments.map((ta: any) => ({
            id: ta.team_member.id,
            name: ta.team_member.name,
            email: ta.team_member.email,
            role: ta.team_member.role,
            availability: ta.team_member.availability,
            projects: []
          })) : [],
          priority: taskData.priority,
          dueDate: new Date(taskData.due_date),
          estimatedHours: 0,
          actualHours: 0,
          tags: [],
          createdAt: new Date(taskData.created_at),
          updatedAt: new Date(taskData.updated_at)
        };

        this.selectedTask.set(task);
      }

      this.loading.set(false);
    } catch (err: any) {
      console.error('Error loading task:', err);
      this.error.set('Tarea no encontrada');
      this.loading.set(false);
    }
  }

  getTasksByProject(projectId: string) {
    return computed(() =>
      this.tasks().filter(t => t.projectId === projectId)
    );
  }

  getTasksByMember(memberId: string) {
    return computed(() =>
      this.tasks().filter(t => t.assignedTo.some(m => m.id === memberId))
    );
  }

  async createTask(task: Partial<Task>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Obtener el ID del estado por defecto
      const { data: statusData } = await this.supabaseService.client
        .from('task_statuses')
        .select('id')
        .eq('value', 'todo')
        .single();

      const { data: newTask, error: insertError } = await this.supabaseService.client
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          status_id: task.status?.value
            ? (await this.supabaseService.client
              .from('task_statuses')
              .select('id')
              .eq('value', task.status.value)
              .single()).data?.id
            : statusData?.id,
          priority: task.priority || 'medium',
          due_date: task.dueDate,
          project_id: task.projectId
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Insertar asignaciones
      if (task.assignedTo && task.assignedTo.length > 0 && newTask) {
        const assignments = task.assignedTo.map(member => ({
          task_id: newTask.id,
          team_member_id: member.id
        }));

        await this.supabaseService.client
          .from('task_assignments')
          .insert(assignments);
      }

      // Recargar tareas
      await this.loadTasks();
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error creating task:', err);
      this.error.set('Error al crear la tarea');
      this.loading.set(false);
    }
  }

  async updateTask(id: string, task: Partial<Task>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const updateData: any = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.dueDate,
        project_id: task.projectId
      };

      // Si hay cambio de estado, obtener el ID del estado
      if (task.status?.value) {
        const { data: statusData } = await this.supabaseService.client
          .from('task_statuses')
          .select('id')
          .eq('value', task.status.value)
          .single();

        if (statusData) {
          updateData.status_id = statusData.id;
        }
      }

      const { error: updateError } = await this.supabaseService.client
        .from('tasks')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Actualizar asignaciones si están presentes
      if (task.assignedTo) {
        // Eliminar existentes
        await this.supabaseService.client
          .from('task_assignments')
          .delete()
          .eq('task_id', id);

        // Insertar nuevas
        if (task.assignedTo.length > 0) {
          const assignments = task.assignedTo.map(member => ({
            task_id: id,
            team_member_id: member.id
          }));

          await this.supabaseService.client
            .from('task_assignments')
            .insert(assignments);
        }
      }

      // Recargar tareas
      await this.loadTasks();
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error updating task:', err);
      this.error.set('Error al actualizar la tarea');
      this.loading.set(false);
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error: deleteError } = await this.supabaseService.client
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      this.loading.set(false);
    } catch (err: any) {
      console.error('Error deleting task:', err);
      this.error.set('Error al eliminar la tarea');
      this.loading.set(false);
    }
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

  async getTaskStatuses() {
    const { data, error } = await this.supabaseService.client
      .from('task_statuses')
      .select('*')
      .order('label');

    if (error) {
      console.error('Error loading task statuses:', error);
      return [];
    }

    return (data || []).map(s => ({
      label: s.label,
      value: s.value,
      color: s.color
    }));
  }
}
