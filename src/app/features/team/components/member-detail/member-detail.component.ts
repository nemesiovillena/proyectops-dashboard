import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService } from '@core/services';
import { CardComponent, LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [RouterLink, CardComponent, LoadingSpinnerComponent],
  template: `
    <div class="member-detail">
      <a routerLink="/team" class="back-link">← Volver al Equipo</a>
      @if (loading()) {
        <app-loading-spinner></app-loading-spinner>
      } @else if (member()) {
        <app-card>
          <h1>{{ member()!.name }}</h1>
          <p>{{ member()!.email }}</p>
          <p><strong>Rol:</strong> {{ member()!.role }}</p>
          <p><strong>Disponibilidad:</strong> {{ member()!.availability }}</p>
        </app-card>
      }
    </div>
  `,
  styles: [`.member-detail { padding: 2rem; } .back-link { color: #3b82f6; text-decoration: none; }`]
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);

  member = this.teamService.selectedMember;
  loading = this.teamService.loading;

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) await this.teamService.getMemberById(id);
  }
}
