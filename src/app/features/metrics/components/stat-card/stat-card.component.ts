import { Component, Input } from '@angular/core';
import { CardComponent } from '@shared/components';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  template: `
    <div class="group bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 border border-neutral-100 hover:border-primary-200">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-neutral-600 uppercase tracking-wide mb-2">{{ title }}</p>
          <p class="text-3xl font-bold text-neutral-900 mb-1">{{ value }}</p>
          @if (change) {
            <div class="flex items-center space-x-1">
              <span [class]="change > 0 ? 'text-success-600' : 'text-danger-600'" class="text-sm font-medium">
                {{ change > 0 ? '+' : '' }}{{ change }}%
              </span>
              <span class="text-xs text-neutral-500">vs last month</span>
            </div>
          }
        </div>
        <div [class]="iconBgColor" class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <span [innerHTML]="icon" class="text-2xl"></span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StatCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number | string;
  @Input() icon = '<svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>';
  @Input() iconBgColor = 'bg-primary-50';
  @Input() change?: number;
}
