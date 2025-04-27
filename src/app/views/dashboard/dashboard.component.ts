import { Component } from '@angular/core';
import { UserDistributionComponent } from './components/user-distribution/user-distribution.component';
import { RecentUsersComponent } from './components/recent-users/recent-users.component';
import { LocalInsightDistributionComponent } from './components/local-insight-distribution/local-insight-distribution.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    UserDistributionComponent,
    RecentUsersComponent,
    LocalInsightDistributionComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'User Statistics Dashboard';
}