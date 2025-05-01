import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeUntil',
  standalone: true
})
export class TimeUntilPipe implements PipeTransform {
  transform(dateString: string | Date): string {
    if (!dateString) return 'unknown time';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Get the difference in milliseconds
    const diff = date.getTime() - now.getTime();
    
    // Return if date is in the past
    if (diff <= 0) {
      return 'already started';
    }
    
    // Convert to days/hours
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}${hours > 0 ? `, ${hours} hour${hours > 1 ? 's' : ''}` : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }
}
