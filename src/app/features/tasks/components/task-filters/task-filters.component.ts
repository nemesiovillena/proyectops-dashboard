import { Component } from '@angular/core';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  template: `<div class="task-filters"><input type="text" placeholder="Search tasks..."></div>`,
  styles: [`.task-filters { margin-bottom: 1rem; } input { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.375rem; }`]
})
export class TaskFiltersComponent {}
