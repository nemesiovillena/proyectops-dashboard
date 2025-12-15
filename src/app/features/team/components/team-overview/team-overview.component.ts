import { Component, OnInit, inject } from '@angular/core';
import { TeamService } from '@core/services';
import { LoadingSpinnerComponent, ErrorMessageComponent } from '@shared/components';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [LoadingSpinnerComponent, ErrorMessageComponent, MemberCardComponent],
  template: `
    <div class="team-overview">
      <h1>Resumen del Equipo</h1>
      @if (loading()) {
        <app-loading-spinner message="Cargando equipo..."></app-loading-spinner>
      } @else if (error()) {
        <app-error-message [message]="error()!" (retry)="onRetry()"></app-error-message>
      } @else {
        <div class="team-grid">
          @for (member of teamMembers(); track member.id) {
            <app-member-card [member]="member"></app-member-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .team-overview { padding: 2rem; }
    .team-overview h1 { margin: 0 0 2rem; font-size: 2rem; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
  `]
})
export class TeamOverviewComponent implements OnInit {
  private teamService = inject(TeamService);

  teamMembers = this.teamService.teamMembers;
  loading = this.teamService.loading;
  error = this.teamService.error;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    await this.teamService.loadTeam();
  }

  onRetry(): void {
    this.loadData();
  }
}
