import { Component, Input } from '@angular/core';
import { User } from '@core/Models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'profile-achievement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
      <div class="card-body">
        <h4 class="card-title mb-0" style="font-size: 1.25rem; font-weight: 600;">Achievements</h4>
        <p class="text-muted mt-2">Your accomplishments and milestones</p>
        
        <div class="text-center py-4">
          <i class="bx bx-medal fs-1 text-muted mb-2"></i>
          <p class="text-muted">No achievements yet</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class AchievementComponent {
  @Input() user: User | null = null;

  getInterestsCount(): number {
    if (!this.user?.interests) return 0;
    return this.user.interests.split(',').filter(i => i.trim().length > 0).length;
  }

  getFormattedDate(): string | null {
    if (!this.user?.createdAt) return null;
    return new Date(this.user.createdAt).toLocaleDateString();
  }
}