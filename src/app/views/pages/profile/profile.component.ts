import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component'
import { AboutComponent } from './components/about/about.component'
import { ReviewsComponent } from './components/reviews/reviews.component'
import { AchievementComponent } from './components/achivement/achivement.component'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [PersonalInfoComponent,AboutComponent,ReviewsComponent,AchievementComponent,NgbDropdownModule],
  templateUrl: './profile.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileComponent {
  title = 'Profile';
}
