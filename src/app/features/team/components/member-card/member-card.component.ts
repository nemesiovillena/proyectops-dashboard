import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TeamMember } from '@core/models';
import { CardComponent } from '@shared/components';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card class="clickable-card" (click)="onEdit()">
      <div class="card-content">
        <div class="member-info">
          <div class="member-avatar">{{ member.name.charAt(0) }}</div>
          <h3>{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
          <span class="member-availability" [class]="'status-' + member.availability">{{ getAvailabilityLabel(member.availability) }}</span>
          <div class="member-projects">{{ member.projects.length }} proyectos</div>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .clickable-card { cursor: pointer; display: block; height: 100%; transition: transform 0.2s; }
    .clickable-card:hover { transform: translateY(-2px); }
    .card-content { position: relative; height: 100%; }
    .member-info { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; padding: 1rem; }
    .member-avatar { width: 4rem; height: 4rem; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; }
    .member-info h3 { margin: 0 0 0.25rem; font-size: 1.125rem; }
    .member-role { margin: 0 0 0.75rem; color: #64748b; font-size: 0.875rem; }
    .member-availability { padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600; }
    .status-available { background: #dcfce7; color: #166534; }
    .status-busy { background: #fef3c7; color: #92400e; }
    .status-away { background: #fee2e2; color: #991b1b; }
    .member-projects { margin-top: 0.75rem; font-size: 0.875rem; color: #64748b; }
  `]
})
export class MemberCardComponent {
  @Input({ required: true }) member!: TeamMember;
  @Output() edit = new EventEmitter<TeamMember>();

  getAvailabilityLabel(availability: string): string {
    const labels: Record<string, string> = {
      'available': 'Disponible',
      'busy': 'Ocupado',
      'away': 'Ausente'
    };
    return labels[availability] || availability;
  }

  onEdit(): void {
    this.edit.emit(this.member);
  }
}
