import { Component } from '@angular/core';
import { CardComponent } from '@shared/components';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card title="Actividad Reciente">
      <div class="activity-list">
        <p>No hay actividad reciente</p>
      </div>
    </app-card>
  `,
  styles: [`.activity-list { padding: 1rem 0; color: #64748b; }`]
})
export class RecentActivityComponent {}
