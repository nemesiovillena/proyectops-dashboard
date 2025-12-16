import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '@core/models';
import { DateFormatPipe, TruncatePipe } from '@shared/pipes';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, TruncatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() delete = new EventEmitter<string>();

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit(this.task.id);
  }
}
