export class DateUtils {
  static isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }

  static daysDiff(date1: Date, date2: Date): number {
    const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  static formatRelative(date: Date): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = targetDate.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 0 && diffInDays <= 7) return `In ${diffInDays} days`;
    if (diffInDays < 0 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`;

    return targetDate.toLocaleDateString();
  }
}
