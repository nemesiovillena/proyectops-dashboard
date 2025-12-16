import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamService } from '@core/services';
import { TeamMember } from '@core/models';
import { LoadingSpinnerComponent, ErrorMessageComponent, ButtonComponent, ModalComponent } from '@shared/components';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    MemberCardComponent,
    ButtonComponent,
    ModalComponent,
    FormsModule
  ],
  template: `
    <div class="team-overview">
      <div class="header-actions">
        <h1>Resumen del Equipo</h1>
        <app-button (click)="openModal()">
          + Nuevo Miembro
        </app-button>
      </div>

      @if (loading()) {
        <app-loading-spinner message="Cargando equipo..."></app-loading-spinner>
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="onRetry()"></app-error-message>
      } @else {
        <div class="team-grid">
          @for (member of teamMembers(); track member.id) {
            <app-member-card 
              [member]="member"
              (edit)="openModal($event)"
            ></app-member-card>
          }
        </div>
      }

      <app-modal
        [isOpen]="isModalOpen()"
        [title]="newMember.id ? 'Editar Miembro' : 'Nuevo Miembro'"
        (close)="closeModal()"
      >
        <form (ngSubmit)="saveMember()">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              [(ngModel)]="newMember.name" 
              required
              class="form-control"
              placeholder="Nombre completo"
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="newMember.email" 
              required
              class="form-control"
              placeholder="correo@ejemplo.com"
            >
          </div>

          <div class="form-group">
            <label for="role">Rol</label>
            <input 
              type="text" 
              id="role" 
              name="role" 
              [(ngModel)]="newMember.role" 
              required
              class="form-control"
              placeholder="Ej. Desarrollador"
            >
          </div>

          <div class="form-actions" [class.has-delete]="newMember.id">
            @if (newMember.id) {
              @if (!isDeleteConfirmVisible()) {
                <button 
                  type="button" 
                  class="bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm hover:shadow-md px-4 py-2 text-base rounded-md"
                  (click)="initiateDelete()"
                >
                  Eliminar
                </button>
              } @else {
                <div class="delete-confirmation">
                  <span class="confirm-text">¿Seguro?</span>
                  <button 
                    type="button" 
                    class="bg-danger-600 text-white hover:bg-danger-700 px-3 py-1 text-sm rounded-md"
                    (click)="confirmDelete(newMember)"
                  >
                    Sí, eliminar
                  </button>
                  <button 
                    type="button" 
                    class="bg-neutral-200 text-neutral-700 hover:bg-neutral-300 px-3 py-1 text-sm rounded-md"
                    (click)="cancelDelete()"
                  >
                    Cancelar
                  </button>
                </div>
              }
            }

            <div class="right-actions">
              <app-button 
                variant="secondary" 
                (click)="closeModal()"
                type="button"
              >
                Cancelar
              </app-button>
              <app-button 
                type="submit"
                variant="primary"
              >
                Guardar
              </app-button>
            </div>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .team-overview { padding: 2rem; }
    .header-actions { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 2rem; 
    }
    .header-actions h1 { margin: 0; font-size: 2rem; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .form-actions.has-delete {
      justify-content: space-between;
    }
    .delete-confirmation {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .confirm-text {
      font-size: 0.875rem;
      font-weight: 500;
      color: #7f1d1d;
    }
    .right-actions {
      display: flex;
      gap: 1rem;
    }
  `]
})
export class TeamOverviewComponent implements OnInit {
  private teamService = inject(TeamService);

  teamMembers = this.teamService.teamMembers;
  loading = this.teamService.loading;
  error = this.teamService.error;

  isModalOpen = signal(false);
  isDeleteConfirmVisible = signal(false);
  newMember: Partial<TeamMember> = {
    name: '',
    email: '',
    role: '',
    availability: 'available'
  };

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await this.teamService.loadTeam();
  }

  onRetry(): void {
    this.loadData();
  }

  openModal(member?: TeamMember): void {
    if (member) {
      this.newMember = { ...member }; // Clone to avoid direct mutation
    } else {
      this.newMember = {
        name: '',
        email: '',
        role: '',
        availability: 'available'
      };
    }
    this.isDeleteConfirmVisible.set(false);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isDeleteConfirmVisible.set(false);
    this.newMember = { name: '', email: '', role: '', availability: 'available' }; // Reset
  }

  async saveMember(): Promise<void> {
    if (this.newMember.name && this.newMember.email && this.newMember.role) {
      if (this.newMember.id) {
        await this.teamService.updateMember(this.newMember.id, this.newMember);
      } else {
        await this.teamService.createMember(this.newMember);
      }
      this.closeModal();
    }
  }

  initiateDelete(): void {
    this.isDeleteConfirmVisible.set(true);
  }

  cancelDelete(): void {
    this.isDeleteConfirmVisible.set(false);
  }

  async confirmDelete(member: Partial<TeamMember>): Promise<void> {
    if (member.id) {
      const success = await this.teamService.deleteMember(member.id);
      if (success) {
        this.closeModal();
      } else {
        alert(this.teamService.error());
        this.teamService.error.set(null);
      }
    }
  }
}
