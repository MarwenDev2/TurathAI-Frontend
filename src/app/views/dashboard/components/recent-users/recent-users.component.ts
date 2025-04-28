import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '@core/Models/user';
import { UserStatisticsService } from '@core/services/user-statistics';

@Component({
  selector: 'dashboard-recent-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-users.component.html',
  styleUrls: ['./recent-users.component.scss']
})
export class RecentUsersComponent implements OnInit {
  recentUsers: User[] = [];

  constructor(private statsService: UserStatisticsService) {}

  ngOnInit(): void {
    this.statsService.getRecentUsers().subscribe(users => {
      this.recentUsers = users;
    });
  }

  getInitials(user: User): String {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  getUserImage(imagePath: String): String {
    if (!imagePath) return 'assets/images/default-avatar.png';
    
    // Check if it's already a full URL (for external images)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For local images served by your backend
    return `http://localhost:9090/assets/images/users/${imagePath}`;
  }
}